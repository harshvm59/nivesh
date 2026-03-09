// Portfolio Intelligence System - Alerts Service

const { INDIAN_STOCKS, US_STOCKS, CRYPTO_HOLDINGS, ALERTS } = require('../data/portfolio');
const { getFundamentals } = require('./analysis');

function getAlerts(filter = 'all') {
  let alerts = [...ALERTS];

  if (filter === 'critical') alerts = alerts.filter(a => a.type === 'critical');
  else if (filter === 'warning') alerts = alerts.filter(a => a.type === 'warning');
  else if (filter === 'opportunity') alerts = alerts.filter(a => a.type === 'opportunity');

  return alerts.sort((a, b) => a.priority - b.priority);
}

function getAlertsByMarket(market) {
  return ALERTS.filter(a => a.market === market).sort((a, b) => a.priority - b.priority);
}

function checkFundamentalDeterioration() {
  const deteriorating = [];
  const symbols = ['KPITTECH', 'ETERNAL', 'PAYTM', 'NIO'];

  symbols.forEach(symbol => {
    const fund = getFundamentals(symbol);
    if (fund && fund.overall === 'deteriorating') {
      deteriorating.push({
        symbol,
        signal: fund.signal,
        summary: fund.summary,
        trends: fund.trends,
      });
    }
  });

  return deteriorating;
}

function checkPriceDrops() {
  const drops = [];

  INDIAN_STOCKS.forEach(s => {
    if (s.pnl <= -15) {
      drops.push({ symbol: s.symbol, market: 'india', drop: s.pnl, name: s.name });
    }
  });

  US_STOCKS.forEach(s => {
    if (s.pnl <= -15) {
      drops.push({ symbol: s.symbol, market: 'us', drop: s.pnl, name: s.name });
    }
  });

  CRYPTO_HOLDINGS.forEach(s => {
    if (s.pnl <= -30) {
      drops.push({ symbol: s.symbol, market: 'crypto', drop: s.pnl, name: s.name });
    }
  });

  return drops.sort((a, b) => a.drop - b.drop);
}

function generateAlertSummary() {
  const critical = ALERTS.filter(a => a.type === 'critical');
  const warnings = ALERTS.filter(a => a.type === 'warning');
  const opportunities = ALERTS.filter(a => a.type === 'opportunity');

  return {
    total: ALERTS.length,
    critical: critical.length,
    warnings: warnings.length,
    opportunities: opportunities.length,
    topAction: critical.length > 0
      ? `${critical[0].symbol}: ${critical[0].action}`
      : 'No critical actions needed',
    summary: `${critical.length} critical, ${warnings.length} warnings, ${opportunities.length} opportunities`,
  };
}

module.exports = {
  getAlerts,
  getAlertsByMarket,
  checkFundamentalDeterioration,
  checkPriceDrops,
  generateAlertSummary,
};
