// Portfolio Intelligence System - WhatsApp Service (Twilio)

const { computePortfolioSummary, ALERTS, INDIAN_STOCKS, US_STOCKS, CRYPTO_HOLDINGS } = require('../data/portfolio');

let twilioClient = null;

function initTwilio() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (sid && token && sid !== 'your_account_sid') {
    try {
      const twilio = require('twilio');
      twilioClient = twilio(sid, token);
      console.log('[WhatsApp] Twilio initialized');
      return true;
    } catch (e) {
      console.log('[WhatsApp] Twilio init failed:', e.message);
      return false;
    }
  }
  console.log('[WhatsApp] Twilio not configured - alerts will be logged only');
  return false;
}

async function sendWhatsApp(message) {
  const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
  const to = process.env.WHATSAPP_TO || 'whatsapp:+918639464952';

  if (twilioClient) {
    try {
      const result = await twilioClient.messages.create({ body: message, from, to });
      console.log(`[WhatsApp] Sent: ${result.sid}`);
      return { success: true, sid: result.sid };
    } catch (e) {
      console.error(`[WhatsApp] Send failed: ${e.message}`);
      return { success: false, error: e.message };
    }
  }

  // Log-only mode
  console.log(`[WhatsApp] Message (log-only):\n${message}\n`);
  return { success: true, mode: 'log-only' };
}

function formatMorningAlert() {
  const summary = computePortfolioSummary();
  const critical = ALERTS.filter(a => a.type === 'critical');
  const warnings = ALERTS.filter(a => a.type === 'warning');
  const opportunities = ALERTS.filter(a => a.type === 'opportunity');

  const topGainers = [...INDIAN_STOCKS].sort((a, b) => b.pnl - a.pnl).slice(0, 3);
  const topLosers = [...INDIAN_STOCKS].sort((a, b) => a.pnl - b.pnl).slice(0, 3);

  let msg = `📊 *PORTFOLIO PULSE* | ${new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `💰 *Total: ${summary.totalValueFormatted}*\n`;
  msg += `📈 YTD: ${summary.ytdReturn > 0 ? '+' : ''}${summary.ytdReturn}% | 1D: ${summary.oneDayChange > 0 ? '+' : ''}${summary.oneDayChange}%\n\n`;

  msg += `🗂 *Allocation*\n`;
  msg += `🇮🇳 India: ${summary.allocation.india.pct}% (target ${summary.allocation.india.target}%)\n`;
  msg += `🇺🇸 US: ${summary.allocation.us.pct}% (target ${summary.allocation.us.target}%)\n`;
  msg += `₿ Crypto: ${summary.allocation.crypto.pct}% (target ${summary.allocation.crypto.target}%)\n\n`;

  if (critical.length > 0) {
    msg += `🔴 *CRITICAL ALERTS (${critical.length})*\n`;
    critical.forEach(a => {
      msg += `• *${a.symbol}*: ${a.title}\n  → ${a.action}\n`;
    });
    msg += `\n`;
  }

  if (warnings.length > 0) {
    msg += `🟡 *WARNINGS (${warnings.length})*\n`;
    warnings.slice(0, 3).forEach(a => {
      msg += `• *${a.symbol}*: ${a.title}\n`;
    });
    msg += `\n`;
  }

  if (opportunities.length > 0) {
    msg += `🟢 *OPPORTUNITIES (${opportunities.length})*\n`;
    opportunities.slice(0, 2).forEach(a => {
      msg += `• *${a.symbol}*: ${a.title}\n  → ${a.action}\n`;
    });
    msg += `\n`;
  }

  msg += `📊 *TOP INDIA*\n`;
  msg += `🟢 ${topGainers.map(s => `${s.symbol} +${s.pnl}%`).join(' | ')}\n`;
  msg += `🔴 ${topLosers.map(s => `${s.symbol} ${s.pnl}%`).join(' | ')}\n\n`;
  msg += `_Powered by PortfolioIQ | by HVM_`;

  return msg;
}

function formatEveningAlert() {
  const usGainers = [...US_STOCKS].sort((a, b) => b.pnl - a.pnl).slice(0, 3);
  const usLosers = [...US_STOCKS].sort((a, b) => a.pnl - b.pnl).slice(0, 3);
  const critical = ALERTS.filter(a => a.market === 'us' && (a.type === 'critical' || a.type === 'warning'));

  let msg = `🌙 *US MARKET UPDATE* | ${new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━\n\n`;

  const usTotal = US_STOCKS.reduce((sum, s) => sum + s.currentValue, 0);
  msg += `💵 *US Portfolio: $${(usTotal / 1000).toFixed(1)}K*\n\n`;

  msg += `📊 *TOP US HOLDINGS*\n`;
  msg += `🟢 ${usGainers.map(s => `${s.symbol} +${s.pnl}%`).join(' | ')}\n`;
  msg += `🔴 ${usLosers.map(s => `${s.symbol} ${s.pnl}%`).join(' | ')}\n\n`;

  if (critical.length > 0) {
    msg += `⚠️ *US ALERTS*\n`;
    critical.forEach(a => {
      msg += `• *${a.symbol}*: ${a.message.substring(0, 80)}\n`;
    });
    msg += `\n`;
  }

  msg += `_Powered by PortfolioIQ | by HVM_`;
  return msg;
}

function formatCryptoAlert() {
  const cryptoTotal = CRYPTO_HOLDINGS.reduce((sum, c) => sum + c.currentValue, 0);

  let msg = `₿ *CRYPTO DAILY* | ${new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `💰 *Crypto Portfolio: ₹${(cryptoTotal / 1000).toFixed(1)}K*\n\n`;

  CRYPTO_HOLDINGS.forEach(c => {
    const emoji = c.pnl > 0 ? '🟢' : c.pnl > -30 ? '🟡' : '🔴';
    msg += `${emoji} *${c.symbol}*: ${c.pnl > 0 ? '+' : ''}${c.pnl}% | ₹${(c.currentValue / 1000).toFixed(1)}K\n`;
  });

  const criticalCrypto = ALERTS.filter(a => a.market === 'crypto' && a.type === 'critical');
  if (criticalCrypto.length > 0) {
    msg += `\n🔴 *ACTION*\n`;
    criticalCrypto.forEach(a => {
      msg += `• ${a.symbol}: ${a.action}\n`;
    });
  }

  msg += `\n_Powered by PortfolioIQ | by HVM_`;
  return msg;
}

module.exports = {
  initTwilio,
  sendWhatsApp,
  formatMorningAlert,
  formatEveningAlert,
  formatCryptoAlert,
};
