#!/usr/bin/env node
/**
 * Automated price updater for Nivesh portfolio
 * Fetches live prices from Yahoo Finance + CoinGecko
 * Updates docs/index.html and src/data/portfolio.js
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// ═══════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════
const INDIAN_SYMBOLS = [
  'KPITTECH.NS', 'BEL.NS', 'SHRIRAMFIN.NS', 'ETERNAL.NS', 'HDFCBANK.NS',
  'RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'TMCV.NS', 'BAJFINANCE.NS',
  'SBIN.NS', 'LT.NS', 'SUNPHARMA.NS', 'TITAN.NS', 'MARUTI.NS',
  'ASIANPAINT.NS', 'WIPRO.NS', 'ICICIBANK.NS', 'HCLTECH.NS', 'COALINDIA.NS',
  'ADANIENT.NS', 'TATAPOWER.NS', 'IRCTC.NS', 'DMART.NS', 'PERSISTENT.NS',
  'DIXON.NS', 'HAL.NS', 'INDHOTEL.NS', 'JIOFIN.NS', 'PAYTM.NS'
];

const US_SYMBOLS = [
  'NVDA', 'TSLA', 'META', 'MSFT', 'AAPL', 'GOOGL', 'AMZN', 'AMD',
  'NFLX', 'CRM', 'AVGO', 'PLTR', 'SNOW', 'COIN', 'SOFI', 'NIO'
];

const CRYPTO_IDS = 'bitcoin,ethereum,solana,shiba-inu,avalanche-2,cardano';
const CRYPTO_MAP = {
  bitcoin: 'BTC', ethereum: 'ETH', solana: 'SOL',
  'shiba-inu': 'SHIB', 'avalanche-2': 'AVAX', cardano: 'ADA'
};

// ═══════════════════════════════════════════════════════
// HTTP HELPERS
// ═══════════════════════════════════════════════════════
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error for ${url}`)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ═══════════════════════════════════════════════════════
// FETCH PRICES
// ═══════════════════════════════════════════════════════
async function fetchYahooPrice(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
    const data = await fetchJSON(url);
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
    if (price) return { symbol: symbol.replace('.NS', ''), price };
  } catch (e) {
    console.warn(`  Failed: ${symbol} - ${e.message}`);
  }
  return null;
}

async function fetchAllStockPrices() {
  const prices = {};
  const allSymbols = [...INDIAN_SYMBOLS, ...US_SYMBOLS];

  console.log(`Fetching ${allSymbols.length} stock prices from Yahoo Finance...`);

  // Batch in groups of 5 with delay
  for (let i = 0; i < allSymbols.length; i += 5) {
    const batch = allSymbols.slice(i, i + 5);
    const results = await Promise.all(batch.map(s => fetchYahooPrice(s)));
    results.forEach(r => {
      if (r) {
        prices[r.symbol] = r.price;
        console.log(`  ${r.symbol}: ${r.price}`);
      }
    });
    if (i + 5 < allSymbols.length) await sleep(500);
  }

  return prices;
}

async function fetchCryptoPrices() {
  console.log('Fetching crypto prices from CoinGecko...');
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${CRYPTO_IDS}&vs_currencies=inr`;
    const data = await fetchJSON(url);
    const prices = {};
    for (const [cgId, sym] of Object.entries(CRYPTO_MAP)) {
      if (data[cgId]?.inr) {
        prices[sym] = data[cgId].inr;
        console.log(`  ${sym}: ₹${data[cgId].inr}`);
      }
    }
    return prices;
  } catch (e) {
    console.warn('  CoinGecko fetch failed:', e.message);
    return {};
  }
}

async function fetchUSDINR() {
  console.log('Fetching USD/INR rate...');
  try {
    const data = await fetchJSON('https://query1.finance.yahoo.com/v8/finance/chart/USDINR=X?interval=1d&range=1d');
    const rate = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
    if (rate) {
      console.log(`  USD/INR: ${rate}`);
      return rate;
    }
  } catch (e) {
    console.warn('  USD/INR fetch failed:', e.message);
  }
  return null;
}

// ═══════════════════════════════════════════════════════
// UPDATE FILES
// ═══════════════════════════════════════════════════════
function updatePrice(content, symbol, newPrice, isUS = false) {
  const symKey = isUS ? symbol : (symbol === 'TATAMOTORS' ? 'TMCV' : symbol);

  // Handle both minified (key:val) and spaced (key: val) formats
  // Use a line-based approach for reliability
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if this line contains the symbol definition
    const symPattern = new RegExp(`symbol:\\s*'${symKey}'`);
    if (!symPattern.test(line)) continue;

    const qtyMatch = line.match(/qty:\s*([\d.]+)/);
    const buyValueMatch = line.match(/buyValue:\s*([\d.]+)/);
    if (!qtyMatch || !buyValueMatch) continue;

    const qty = parseFloat(qtyMatch[1]);
    const buyValue = parseFloat(buyValueMatch[1]);
    const newValue = Math.round(qty * newPrice);
    const newPnl = ((newValue - buyValue) / buyValue * 100).toFixed(1);

    const pnlNum = parseFloat(newPnl);
    let newStatus;
    if (pnlNum > 15) newStatus = 'positive';
    else if (pnlNum > -5) newStatus = 'neutral';
    else if (pnlNum > -20) newStatus = 'warning';
    else newStatus = 'critical';

    // Replace values in line
    let updated = line.replace(/currentPrice:\s*[\d.]+/, `currentPrice: ${newPrice}`);
    updated = updated.replace(/currentValue:\s*[\d.]+/, `currentValue: ${newValue}`);
    updated = updated.replace(/pnl:\s*[\d.-]+/, `pnl: ${newPnl}`);
    updated = updated.replace(/status:\s*'[a-z]+'/, `status: '${newStatus}'`);
    lines[i] = updated;
  }
  return lines.join('\n');
}

function updateCryptoPrice(content, symbol, newPrice) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const symPattern = new RegExp(`symbol:\\s*'${symbol}'`);
    if (!symPattern.test(line)) continue;

    const qtyMatch = line.match(/qty:\s*([\d.]+)/);
    const buyValueMatch = line.match(/buyValue:\s*([\d.]+)/);
    if (!qtyMatch || !buyValueMatch) continue;

    const qty = parseFloat(qtyMatch[1]);
    const buyValue = parseFloat(buyValueMatch[1]);
    const newValue = Math.round(qty * newPrice);
    const newPnl = ((newValue - buyValue) / buyValue * 100).toFixed(1);

    const pnlNum = parseFloat(newPnl);
    let newStatus;
    if (pnlNum > 15) newStatus = 'positive';
    else if (pnlNum > -10) newStatus = 'neutral';
    else if (pnlNum > -30) newStatus = 'warning';
    else newStatus = 'critical';

    let updated = line.replace(/currentPrice:\s*[\d.]+/, `currentPrice: ${newPrice}`);
    updated = updated.replace(/currentValue:\s*[\d.]+/, `currentValue: ${newValue}`);
    updated = updated.replace(/pnl:\s*[\d.-]+/, `pnl: ${newPnl}`);
    updated = updated.replace(/status:\s*'[a-z]+'/, `status: '${newStatus}'`);
    lines[i] = updated;
  }
  return lines.join('\n');
}

function updateUSDINR(content, rate) {
  // Handle both {inr:84.5} and { inr: 84.5 } formats
  return content.replace(/currency:\s*\{\s*inr:\s*[\d.]+\s*\}/g, `currency: { inr: ${rate} }`);
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════
async function main() {
  console.log('=== Nivesh Price Updater ===');
  console.log(`Time: ${new Date().toISOString()}\n`);

  // Fetch all prices
  const [stockPrices, cryptoPrices, usdInr] = await Promise.all([
    fetchAllStockPrices(),
    fetchCryptoPrices(),
    fetchUSDINR()
  ]);

  const stockCount = Object.keys(stockPrices).length;
  const cryptoCount = Object.keys(cryptoPrices).length;
  console.log(`\nFetched: ${stockCount} stocks, ${cryptoCount} crypto, USD/INR: ${usdInr || 'failed'}`);

  if (stockCount === 0 && cryptoCount === 0) {
    console.log('No prices fetched - skipping update');
    process.exit(0);
  }

  // Update docs/index.html
  const htmlPath = path.join(__dirname, '../../docs/index.html');
  const jsPath = path.join(__dirname, '../../src/data/portfolio.js');

  for (const filePath of [htmlPath, jsPath]) {
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${filePath} - not found`);
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let updates = 0;

    // Update USD/INR
    if (usdInr) {
      const before = content;
      content = updateUSDINR(content, usdInr);
      if (content !== before) updates++;
    }

    // Update Indian stocks
    for (const [sym, price] of Object.entries(stockPrices)) {
      if (INDIAN_SYMBOLS.some(s => s.replace('.NS', '') === sym)) {
        const before = content;
        content = updatePrice(content, sym, price, false);
        if (content !== before) updates++;
      }
    }

    // Update US stocks
    for (const [sym, price] of Object.entries(stockPrices)) {
      if (US_SYMBOLS.includes(sym)) {
        const before = content;
        content = updatePrice(content, sym, price, true);
        if (content !== before) updates++;
      }
    }

    // Update crypto
    for (const [sym, price] of Object.entries(cryptoPrices)) {
      const before = content;
      content = updateCryptoPrice(content, sym, price);
      if (content !== before) updates++;
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${path.basename(filePath)}: ${updates} price changes`);
  }

  console.log('\nDone!');
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
