// Portfolio Intelligence System - LIVE Market Data Service
// Fetches real-time prices from Yahoo Finance (stocks) + CoinGecko (crypto)

const axios = require('axios');
const { INDIAN_STOCKS, US_STOCKS, CRYPTO_HOLDINGS, PORTFOLIO_META } = require('../data/portfolio');

// ═══════════════════════════════════════════════════════════
// PRICE CACHE
// ═══════════════════════════════════════════════════════════
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes
let priceCache = {};
let lastFetchTime = 0;
let fetchStatus = { live: false, lastSuccess: null, errors: [] };

// ═══════════════════════════════════════════════════════════
// YAHOO FINANCE - Free, no API key needed
// Works for NSE (.NS), BSE (.BO), US stocks, etc.
// ═══════════════════════════════════════════════════════════
async function fetchYahooQuotes(symbols, exchange = '') {
  const results = {};
  // Batch into groups of 5 to avoid rate limits
  const batches = [];
  for (let i = 0; i < symbols.length; i += 5) {
    batches.push(symbols.slice(i, i + 5));
  }

  for (const batch of batches) {
    const promises = batch.map(async (symbol) => {
      try {
        const ticker = exchange ? `${symbol}.${exchange}` : symbol;
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=1d&interval=1d`;
        const res = await axios.get(url, {
          timeout: 8000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          },
        });
        const meta = res.data?.chart?.result?.[0]?.meta;
        if (meta?.regularMarketPrice) {
          results[symbol] = {
            price: meta.regularMarketPrice,
            previousClose: meta.chartPreviousClose || meta.regularMarketPrice,
            dayChange: meta.chartPreviousClose
              ? (((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100).toFixed(2)
              : '0.00',
            currency: meta.currency || (exchange === 'NS' ? 'INR' : 'USD'),
            marketState: meta.marketState || 'UNKNOWN',
            timestamp: Date.now(),
            source: 'yahoo',
          };
        }
      } catch (e) {
        // Silently skip failed symbols
      }
    });
    await Promise.allSettled(promises);
    // Small delay between batches to be nice to Yahoo
    if (batches.indexOf(batch) < batches.length - 1) {
      await new Promise(r => setTimeout(r, 300));
    }
  }
  return results;
}

// ═══════════════════════════════════════════════════════════
// COINGECKO - Free, no API key needed
// ═══════════════════════════════════════════════════════════
const COIN_MAP = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  SHIB: 'shiba-inu',
  AVAX: 'avalanche-2',
  ADA: 'cardano',
};

async function fetchCryptoPrices() {
  const results = {};
  try {
    const ids = Object.values(COIN_MAP).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr,usd&include_24hr_change=true`;
    const res = await axios.get(url, { timeout: 8000 });
    const data = res.data;

    for (const [symbol, coinId] of Object.entries(COIN_MAP)) {
      const coinData = data[coinId];
      if (coinData) {
        results[symbol] = {
          priceINR: coinData.inr,
          priceUSD: coinData.usd,
          dayChange: coinData.inr_24h_change?.toFixed(2) || '0.00',
          timestamp: Date.now(),
          source: 'coingecko',
        };
      }
    }
  } catch (e) {
    fetchStatus.errors.push({ time: Date.now(), source: 'coingecko', error: e.message });
  }
  return results;
}

// ═══════════════════════════════════════════════════════════
// MASTER REFRESH - Fetches ALL prices
// ═══════════════════════════════════════════════════════════
async function refreshAllPrices() {
  // Don't hammer APIs - respect cache TTL
  if (Date.now() - lastFetchTime < CACHE_TTL) {
    return { cached: true, prices: priceCache, status: fetchStatus };
  }

  console.log('[MarketData] Fetching live prices...');
  const startTime = Date.now();
  fetchStatus.errors = [];

  // Fetch Indian stocks (NSE)
  const indianSymbols = INDIAN_STOCKS.map(s => s.symbol);
  const indianPrices = await fetchYahooQuotes(indianSymbols, 'NS');

  // Fetch US stocks
  const usSymbols = US_STOCKS.map(s => s.symbol);
  const usPrices = await fetchYahooQuotes(usSymbols);

  // Fetch crypto
  const cryptoPrices = await fetchCryptoPrices();

  // Merge into cache
  const newCache = { ...indianPrices };
  for (const [sym, data] of Object.entries(usPrices)) {
    newCache[sym] = data;
  }
  for (const [sym, data] of Object.entries(cryptoPrices)) {
    newCache[sym] = data;
  }

  const fetchedCount = Object.keys(newCache).length;
  const elapsed = Date.now() - startTime;

  if (fetchedCount > 0) {
    priceCache = { ...priceCache, ...newCache };
    fetchStatus.live = true;
    fetchStatus.lastSuccess = Date.now();
    lastFetchTime = Date.now();
    console.log(`[MarketData] Fetched ${fetchedCount} live prices in ${elapsed}ms`);
  } else {
    console.log(`[MarketData] No prices fetched (API may be down)`);
    fetchStatus.live = false;
  }

  return { cached: false, prices: priceCache, status: fetchStatus, count: fetchedCount, elapsed };
}

// ═══════════════════════════════════════════════════════════
// APPLY LIVE PRICES TO HOLDINGS
// ═══════════════════════════════════════════════════════════
function getUpdatedHoldings(market) {
  let holdings;
  switch (market) {
    case 'india': holdings = INDIAN_STOCKS; break;
    case 'us': holdings = US_STOCKS; break;
    case 'crypto': holdings = CRYPTO_HOLDINGS; break;
    default: return [];
  }

  return holdings.map(h => {
    const cached = priceCache[h.symbol];
    if (!cached) return h; // No live price, return static data

    let livePrice, livePnl, liveValue;

    if (market === 'crypto') {
      livePrice = cached.priceINR || h.currentPrice;
      liveValue = h.qty * livePrice;
      livePnl = ((livePrice - h.buyPrice) / h.buyPrice * 100).toFixed(1);
    } else {
      livePrice = cached.price || h.currentPrice;
      liveValue = h.qty * livePrice;
      livePnl = ((livePrice - h.buyPrice) / h.buyPrice * 100).toFixed(1);
    }

    return {
      ...h,
      currentPrice: livePrice,
      currentValue: Math.round(liveValue),
      pnl: parseFloat(livePnl),
      dayChange: cached.dayChange || '0.00',
      priceSource: cached.source || 'static',
      priceAge: cached.timestamp ? Math.round((Date.now() - cached.timestamp) / 1000) : null,
    };
  });
}

function getPortfolioWithLivePrices() {
  const india = getUpdatedHoldings('india');
  const us = getUpdatedHoldings('us');
  const crypto = getUpdatedHoldings('crypto');

  const indiaTotal = india.reduce((sum, s) => sum + s.currentValue, 0);
  const usTotalUSD = us.reduce((sum, s) => sum + s.currentValue, 0);
  const usINR = usTotalUSD * PORTFOLIO_META.currency.inr;
  const cryptoTotal = crypto.reduce((sum, s) => sum + s.currentValue, 0);
  const totalINR = indiaTotal + usINR + cryptoTotal;

  return {
    totalValue: totalINR,
    totalValueFormatted: `₹${(totalINR / 100000).toFixed(2)}L`,
    totalValueUSD: `$${(usTotalUSD / 1000).toFixed(1)}K`,
    allocation: {
      india: { value: indiaTotal, pct: ((indiaTotal / totalINR) * 100).toFixed(1), target: 60 },
      us: { value: usINR, valueUSD: usTotalUSD, pct: ((usINR / totalINR) * 100).toFixed(1), target: 30 },
      crypto: { value: cryptoTotal, pct: ((cryptoTotal / totalINR) * 100).toFixed(1), target: 10 },
    },
    ytdReturn: PORTFOLIO_META.ytdReturn,
    oneDayChange: PORTFOLIO_META.oneDayChange,
    holdingsCount: {
      india: india.length, us: us.length, crypto: crypto.length,
      total: india.length + us.length + crypto.length,
    },
    priceStatus: {
      live: fetchStatus.live,
      lastUpdate: fetchStatus.lastSuccess ? new Date(fetchStatus.lastSuccess).toISOString() : null,
      cachedSymbols: Object.keys(priceCache).length,
    },
  };
}

module.exports = {
  refreshAllPrices,
  getUpdatedHoldings,
  getPortfolioWithLivePrices,
  fetchStatus,
  priceCache,
};
