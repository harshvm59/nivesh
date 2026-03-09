// Portfolio Intelligence System - Scheduler (node-cron)
// Sends WhatsApp alerts at configured times (IST)

const cron = require('node-cron');
const { sendWhatsApp, formatMorningAlert, formatEveningAlert, formatCryptoAlert } = require('./services/whatsapp');
const { refreshPrices } = require('./services/marketData');

function startScheduler() {
  console.log('[Scheduler] Starting cron jobs (IST timezone)...');

  // 7:00 AM IST - Crypto daily update
  cron.schedule('0 7 * * *', async () => {
    console.log('[Scheduler] 7:00 AM IST - Sending crypto alert');
    const message = formatCryptoAlert();
    await sendWhatsApp(message);
  }, { timezone: 'Asia/Kolkata' });

  // 9:00 AM IST - India market open (Morning pulse)
  cron.schedule('0 9 * * 1-6', async () => {
    console.log('[Scheduler] 9:00 AM IST - Sending morning alert');
    await refreshPrices();
    const message = formatMorningAlert();
    await sendWhatsApp(message);
  }, { timezone: 'Asia/Kolkata' });

  // 8:00 PM IST - US market open (Evening update)
  cron.schedule('0 20 * * 1-5', async () => {
    console.log('[Scheduler] 8:00 PM IST - Sending US market alert');
    await refreshPrices();
    const message = formatEveningAlert();
    await sendWhatsApp(message);
  }, { timezone: 'Asia/Kolkata' });

  // Price refresh every 30 minutes during market hours
  cron.schedule('*/30 9-16 * * 1-5', async () => {
    console.log('[Scheduler] Refreshing prices...');
    await refreshPrices();
  }, { timezone: 'Asia/Kolkata' });

  console.log('[Scheduler] Cron jobs scheduled:');
  console.log('  - 07:00 IST: Crypto daily update');
  console.log('  - 09:00 IST: India market open (Mon-Sat)');
  console.log('  - 20:00 IST: US market open (Mon-Fri)');
  console.log('  - Every 30min: Price refresh (market hours)');
}

module.exports = { startScheduler };
