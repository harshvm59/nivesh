// Portfolio Intelligence System - API Routes (with LIVE data)

const express = require('express');
const router = express.Router();
const { INDIAN_STOCKS, US_STOCKS, CRYPTO_HOLDINGS, PORTFOLIO_META, ALERTS } = require('../data/portfolio');
const { getFullAnalysis, getFundamentals } = require('../services/analysis');
const { getAlerts, getAlertsByMarket, generateAlertSummary } = require('../services/alerts');
const { refreshAllPrices, getUpdatedHoldings, getPortfolioWithLivePrices } = require('../services/marketData');
const { sendWhatsApp, formatMorningAlert, formatEveningAlert, formatCryptoAlert } = require('../services/whatsapp');

// Auto-refresh prices before serving data
async function ensureFreshPrices(req, res, next) {
  try { await refreshAllPrices(); } catch (e) { /* continue with cached/static */ }
  next();
}
router.use(ensureFreshPrices);

// GET /api/portfolio - Full portfolio summary (LIVE prices)
router.get('/portfolio', (req, res) => {
  const summary = getPortfolioWithLivePrices();
  const criticalAlerts = ALERTS.filter(a => a.type === 'critical').length;
  const warningAlerts = ALERTS.filter(a => a.type === 'warning').length;
  const opportunityAlerts = ALERTS.filter(a => a.type === 'opportunity').length;

  res.json({
    success: true,
    data: {
      ...summary,
      criticalAlerts,
      warningAlerts,
      opportunityAlerts,
      meta: PORTFOLIO_META,
      lastUpdated: new Date().toISOString(),
    },
  });
});

// GET /api/holdings/:market - Holdings with LIVE prices
router.get('/holdings/:market', (req, res) => {
  const { market } = req.params;
  if (!['india', 'us', 'crypto'].includes(market)) {
    return res.status(400).json({ success: false, error: 'Invalid market. Use: india, us, crypto' });
  }

  const sort = req.query.sort || 'value';
  const order = req.query.order || 'desc';
  let holdings = getUpdatedHoldings(market);

  holdings.sort((a, b) => {
    let valA, valB;
    switch (sort) {
      case 'pnl': valA = a.pnl; valB = b.pnl; break;
      case 'name': return order === 'asc' ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
      default: valA = a.currentValue; valB = b.currentValue;
    }
    return order === 'asc' ? valA - valB : valB - valA;
  });

  res.json({
    success: true,
    data: {
      market,
      count: holdings.length,
      totalValue: holdings.reduce((sum, h) => sum + h.currentValue, 0),
      holdings,
    },
  });
});

// GET /api/stock/:symbol - Individual stock with full analysis + LIVE price
router.get('/stock/:symbol', (req, res) => {
  const sym = req.params.symbol.toUpperCase();

  // Find in live-updated holdings
  let stock = getUpdatedHoldings('india').find(s => s.symbol === sym);
  let market = 'india';
  if (!stock) { stock = getUpdatedHoldings('us').find(s => s.symbol === sym); market = 'us'; }
  if (!stock) { stock = getUpdatedHoldings('crypto').find(s => s.symbol === sym); market = 'crypto'; }
  if (!stock) return res.status(404).json({ success: false, error: `Stock ${sym} not found` });

  const analysis = getFullAnalysis(sym);
  const alerts = ALERTS.filter(a => a.symbol === sym);

  res.json({
    success: true,
    data: { ...stock, market, analysis, alerts, lastUpdated: new Date().toISOString() },
  });
});

// GET /api/alerts
router.get('/alerts', (req, res) => {
  const filter = req.query.type || 'all';
  const market = req.query.market;
  let alerts = market ? getAlertsByMarket(market) : getAlerts(filter);
  res.json({ success: true, data: { summary: generateAlertSummary(), alerts } });
});

// GET /api/fundamentals/:symbol
router.get('/fundamentals/:symbol', (req, res) => {
  const data = getFundamentals(req.params.symbol.toUpperCase());
  if (!data) return res.status(404).json({ success: false, error: 'No fundamental data' });
  res.json({ success: true, data });
});

// GET /api/analysis/:symbol
router.get('/analysis/:symbol', (req, res) => {
  const analysis = getFullAnalysis(req.params.symbol.toUpperCase());
  if (!analysis.fundamentals) return res.status(404).json({ success: false, error: 'No analysis data' });
  res.json({ success: true, data: analysis });
});

// GET /api/prices/refresh - Force refresh
router.get('/prices/refresh', async (req, res) => {
  try {
    const result = await refreshAllPrices();
    res.json({ success: true, data: result });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

// POST /api/alert/test - Send test WhatsApp alert
router.post('/alert/test', async (req, res) => {
  const type = req.body?.type || 'morning';
  let message;
  switch (type) {
    case 'evening': message = formatEveningAlert(); break;
    case 'crypto': message = formatCryptoAlert(); break;
    default: message = formatMorningAlert();
  }
  const result = await sendWhatsApp(message);
  res.json({ success: true, data: { type, result, preview: message.substring(0, 200) + '...' } });
});

// GET /api/health
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'running',
      uptime: Math.floor(process.uptime()),
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = router;
