// Portfolio Intelligence System - Complete Portfolio Data
// Last updated: 2026-03-09 (live prices from Yahoo Finance + CoinGecko)

const PORTFOLIO_META = {
  owner: 'Harsha',
  totalValue: null, // computed dynamically
  totalValueUSD: null,
  ytdReturn: null, // computed dynamically
  oneDayChange: null,
  allocationTarget: { india: 60, us: 30, crypto: 10 },
  currency: { inr: 93.186 }, // USD to INR (live 2026-03-09)
};

// ═══════════════════════════════════════════════════════════
// INDIAN STOCKS - 30 Holdings
// Corporate actions applied: BAJFINANCE (10x), SHRIRAMFIN (10x),
// HDFCBANK (2x bonus), RELIANCE (2x bonus), WIPRO (2x bonus),
// TATAMOTORS → TMCV (demerger)
// ═══════════════════════════════════════════════════════════
const INDIAN_STOCKS = [
  { symbol: 'KPITTECH', name: 'KPIT Technologies', sector: 'IT Services', qty: 50, buyPrice: 1480, currentPrice: 674.3, buyValue: 74000, currentValue: 33715, pnl: -54.4, status: 'critical', alert: 'Revenue growth collapsed - margins compressing. Classic deterioration.' },
  { symbol: 'BEL', name: 'Bharat Electronics', sector: 'Defence', qty: 200, buyPrice: 148, currentPrice: 418.7, buyValue: 29600, currentValue: 83740, pnl: 182.9, status: 'positive', alert: 'Defence tailwind - order book strong, 3x returns' },
  { symbol: 'SHRIRAMFIN', name: 'Shriram Finance', sector: 'NBFC', qty: 250, buyPrice: 172, currentPrice: 900.55, buyValue: 43000, currentValue: 225138, pnl: 423.6, status: 'positive', alert: 'Massive compounder - 5.7x returns. Credit cycle sweet spot.' },
  { symbol: 'ETERNAL', name: 'Eternal (Zomato)', sector: 'Consumer Tech', qty: 300, buyPrice: 185, currentPrice: 236.52, buyValue: 55500, currentValue: 70956, pnl: 27.8, status: 'positive', alert: 'Recovery from lows - quick commerce scaling' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', qty: 60, buyPrice: 790, currentPrice: 742.25, buyValue: 47400, currentValue: 44535, pnl: -6.0, status: 'warning', alert: 'Post-bonus adjustment. Merger integration on track.' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Conglomerate', qty: 40, buyPrice: 1225, currentPrice: 1369.2, buyValue: 49000, currentValue: 54768, pnl: 11.8, status: 'neutral', alert: 'Post-bonus. Jio + Retail growth steady.' },
  { symbol: 'TCS', name: 'Tata Consultancy', sector: 'IT Services', qty: 12, buyPrice: 3650, currentPrice: 2408.2, buyValue: 43800, currentValue: 28898, pnl: -34.0, status: 'critical', alert: 'IT sector under pressure - macro headwinds persist' },
  { symbol: 'INFY', name: 'Infosys', sector: 'IT Services', qty: 25, buyPrice: 1520, currentPrice: 1275.7, buyValue: 38000, currentValue: 31893, pnl: -16.1, status: 'warning', alert: 'IT sector pressure - margins holding but growth soft' },
  { symbol: 'TMCV', name: 'Tata Motors (CV)', sector: 'Auto', qty: 60, buyPrice: 620, currentPrice: 396.05, buyValue: 37200, currentValue: 23763, pnl: -36.1, status: 'critical', alert: 'Post-demerger. CV business separated from PV (TAMO).' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'NBFC', qty: 60, buyPrice: 680, currentPrice: 817.3, buyValue: 40800, currentValue: 49038, pnl: 20.2, status: 'positive', alert: 'Post 4:1 bonus + 1:2 split. AUM growth strong.' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', qty: 55, buyPrice: 580, currentPrice: 1017.8, buyValue: 31900, currentValue: 55979, pnl: 75.5, status: 'positive', alert: 'Banking rally - NIMs stable, asset quality improving' },
  { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure', qty: 10, buyPrice: 3200, currentPrice: 3607.5, buyValue: 32000, currentValue: 36075, pnl: 12.7, status: 'neutral', alert: 'Order book at all-time high - infra capex cycle' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma', sector: 'Pharma', qty: 20, buyPrice: 1350, currentPrice: 1728.5, buyValue: 27000, currentValue: 34570, pnl: 28.0, status: 'positive', alert: 'Specialty portfolio ramping up strongly' },
  { symbol: 'TITAN', name: 'Titan Company', sector: 'Consumer', qty: 8, buyPrice: 3400, currentPrice: 4065.5, buyValue: 27200, currentValue: 32524, pnl: 19.6, status: 'positive', alert: 'Premium jewellery + watches driving growth' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', sector: 'Auto', qty: 3, buyPrice: 10200, currentPrice: 12509, buyValue: 30600, currentValue: 37527, pnl: 22.6, status: 'positive', alert: 'SUV mix improving margins significantly' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', sector: 'Consumer', qty: 10, buyPrice: 3100, currentPrice: 2225.8, buyValue: 31000, currentValue: 22258, pnl: -28.2, status: 'critical', alert: 'Competition from Birla Opus + Grasim eating market share' },
  { symbol: 'WIPRO', name: 'Wipro', sector: 'IT Services', qty: 100, buyPrice: 210, currentPrice: 191.18, buyValue: 21000, currentValue: 19118, pnl: -9.0, status: 'warning', alert: 'Post 1:1 bonus. IT sector weakness continues.' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', qty: 18, buyPrice: 960, currentPrice: 1212.7, buyValue: 17280, currentValue: 21829, pnl: 26.3, status: 'positive', alert: 'Best-in-class asset quality, consistent performer' },
  { symbol: 'HCLTECH', name: 'HCL Technologies', sector: 'IT Services', qty: 12, buyPrice: 1380, currentPrice: 1354.4, buyValue: 16560, currentValue: 16253, pnl: -1.9, status: 'neutral', alert: 'Services + products mix holding steady' },
  { symbol: 'COALINDIA', name: 'Coal India', sector: 'Mining', qty: 40, buyPrice: 380, currentPrice: 449.4, buyValue: 15200, currentValue: 17976, pnl: 18.3, status: 'positive', alert: 'Dividend yield 6%+ attractive, steady performer' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', sector: 'Conglomerate', qty: 5, buyPrice: 2800, currentPrice: 1842.5, buyValue: 14000, currentValue: 9213, pnl: -34.2, status: 'critical', alert: 'Governance concerns + valuation pressure' },
  { symbol: 'TATAPOWER', name: 'Tata Power', sector: 'Power', qty: 30, buyPrice: 380, currentPrice: 380.2, buyValue: 11400, currentValue: 11406, pnl: 0.1, status: 'neutral', alert: 'Renewable capacity addition on track, flat returns' },
  { symbol: 'IRCTC', name: 'IRCTC', sector: 'Travel', qty: 12, buyPrice: 850, currentPrice: 511.2, buyValue: 10200, currentValue: 6134, pnl: -39.9, status: 'critical', alert: 'Convenience fee cut + competition impact severe' },
  { symbol: 'DMART', name: 'Avenue Supermarts', sector: 'Retail', qty: 2, buyPrice: 4200, currentPrice: 4271.1, buyValue: 8400, currentValue: 8542, pnl: 1.7, status: 'neutral', alert: 'Quick commerce disruption risk persists' },
  { symbol: 'PERSISTENT', name: 'Persistent Systems', sector: 'IT Services', qty: 4, buyPrice: 4800, currentPrice: 5049.1, buyValue: 19200, currentValue: 20196, pnl: 5.2, status: 'neutral', alert: 'Product engineering demand stable but flat returns' },
  { symbol: 'DIXON', name: 'Dixon Technologies', sector: 'Electronics', qty: 3, buyPrice: 5500, currentPrice: 10254, buyValue: 16500, currentValue: 30762, pnl: 86.4, status: 'positive', alert: 'PLI beneficiary - Samsung + Apple partnerships driving growth' },
  { symbol: 'HAL', name: 'Hindustan Aeronautics', sector: 'Defence', qty: 5, buyPrice: 3200, currentPrice: 3670.8, buyValue: 16000, currentValue: 18354, pnl: 14.7, status: 'neutral', alert: 'Tejas orders + helicopter exports boosting revenue' },
  { symbol: 'INDHOTEL', name: 'Indian Hotels', sector: 'Hospitality', qty: 15, buyPrice: 520, currentPrice: 585.2, buyValue: 7800, currentValue: 8778, pnl: 12.5, status: 'neutral', alert: 'RevPAR expansion, new property openings' },
  { symbol: 'JIOFIN', name: 'Jio Financial', sector: 'NBFC', qty: 20, buyPrice: 320, currentPrice: 231.93, buyValue: 6400, currentValue: 4639, pnl: -27.5, status: 'critical', alert: 'Still in early ramp-up phase, no profitability yet' },
  { symbol: 'PAYTM', name: 'One97 Communications', sector: 'Fintech', qty: 15, buyPrice: 680, currentPrice: 997.1, buyValue: 10200, currentValue: 14957, pnl: 46.6, status: 'positive', alert: 'Strong recovery from RBI restrictions! Revenue rebounding.' },
];

// ═══════════════════════════════════════════════════════════
// US STOCKS - 16 Holdings
// Corporate action applied: NFLX (10:1 split Nov 2025)
// NOTE: User flagged PLTR holdings need verification
// ═══════════════════════════════════════════════════════════
const US_STOCKS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', sector: 'Semiconductors', qty: 50, buyPrice: 62, currentPrice: 176.705, buyValue: 3100, currentValue: 8835, pnl: 185.0, status: 'positive', alert: 'AI infrastructure spending continues - Blackwell generation' },
  { symbol: 'TSLA', name: 'Tesla Inc', sector: 'EV / Auto', qty: 20, buyPrice: 210, currentPrice: 381.62, buyValue: 4200, currentValue: 7632, pnl: 81.7, status: 'positive', alert: 'Robotaxi + energy storage driving valuation' },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Social Media', qty: 12, buyPrice: 380, currentPrice: 589.525, buyValue: 4560, currentValue: 7074, pnl: 55.1, status: 'positive', alert: 'Reels monetization + AI investment paying off' },
  { symbol: 'MSFT', name: 'Microsoft Corp', sector: 'Software', qty: 15, buyPrice: 420, currentPrice: 372.665, buyValue: 6300, currentValue: 5590, pnl: -11.3, status: 'warning', alert: 'Azure growth steady, Copilot monetization progressing' },
  { symbol: 'AAPL', name: 'Apple Inc', sector: 'Consumer Tech', qty: 30, buyPrice: 178, currentPrice: 254.555, buyValue: 5340, currentValue: 7637, pnl: 43.0, status: 'positive', alert: 'iPhone cycle + Services segment growing strongly' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', sector: 'Search / Cloud', qty: 35, buyPrice: 138, currentPrice: 299.71, buyValue: 4830, currentValue: 10490, pnl: 117.2, status: 'positive', alert: 'Search + Cloud profitable, Gemini gaining traction' },
  { symbol: 'AMZN', name: 'Amazon.com', sector: 'E-Commerce / Cloud', qty: 28, buyPrice: 155, currentPrice: 212.835, buyValue: 4340, currentValue: 5959, pnl: 37.3, status: 'positive', alert: 'AWS re-acceleration + retail margin expansion' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Semiconductors', qty: 30, buyPrice: 120, currentPrice: 213.07, buyValue: 3600, currentValue: 6392, pnl: 77.6, status: 'positive', alert: 'Data center GPU share gains, MI300X ramp' },
  { symbol: 'NFLX', name: 'Netflix Inc', sector: 'Streaming', qty: 80, buyPrice: 48, currentPrice: 95.735, buyValue: 3840, currentValue: 7659, pnl: 99.5, status: 'positive', alert: 'Post 10:1 split. Ad tier + password sharing crackdown working.' },
  { symbol: 'CRM', name: 'Salesforce Inc', sector: 'Enterprise SW', qty: 18, buyPrice: 245, currentPrice: 186.74, buyValue: 4410, currentValue: 3361, pnl: -23.8, status: 'critical', alert: 'Enterprise spending softening, AI agents competition' },
  { symbol: 'AVGO', name: 'Broadcom Inc', sector: 'Semiconductors', qty: 25, buyPrice: 155, currentPrice: 313.98, buyValue: 3875, currentValue: 7850, pnl: 102.6, status: 'positive', alert: 'VMware integration complete + AI networking demand' },
  { symbol: 'PLTR', name: 'Palantir Technologies', sector: 'AI / Analytics', qty: 100, buyPrice: 22, currentPrice: 147.6, buyValue: 2200, currentValue: 14760, pnl: 570.9, status: 'positive', alert: 'AIP platform driving commercial growth. [Holdings need verification]' },
  { symbol: 'SNOW', name: 'Snowflake Inc', sector: 'Cloud Data', qty: 20, buyPrice: 185, currentPrice: 155.105, buyValue: 3700, currentValue: 3102, pnl: -16.2, status: 'warning', alert: 'Consumption model headwinds but stabilizing' },
  { symbol: 'COIN', name: 'Coinbase Global', sector: 'Crypto Exchange', qty: 15, buyPrice: 180, currentPrice: 176.7, buyValue: 2700, currentValue: 2651, pnl: -1.8, status: 'neutral', alert: 'Tied to crypto cycle - Bitcoin holding well' },
  { symbol: 'SOFI', name: 'SoFi Technologies', sector: 'Fintech', qty: 200, buyPrice: 8.5, currentPrice: 15.895, buyValue: 1700, currentValue: 3179, pnl: 87.0, status: 'positive', alert: 'Bank charter driving NII growth, membership expanding' },
  { symbol: 'NIO', name: 'NIO Inc', sector: 'EV', qty: 300, buyPrice: 8, currentPrice: 6.125, buyValue: 2400, currentValue: 1838, pnl: -23.4, status: 'critical', alert: 'Cash burn + China EV price war. No path to profitability.' },
];

// ═══════════════════════════════════════════════════════════
// CRYPTO - 6 Holdings (prices in INR from CoinGecko)
// ═══════════════════════════════════════════════════════════
const CRYPTO_HOLDINGS = [
  { symbol: 'BTC', name: 'Bitcoin', qty: 0.012, buyPrice: 5200000, currentPrice: 6401481, buyValue: 62400, currentValue: 76818, pnl: 23.1, status: 'positive', alert: 'Halving cycle bullish - approaching ATH territory', dominance: 54.2 },
  { symbol: 'ETH', name: 'Ethereum', qty: 0.25, buyPrice: 320000, currentPrice: 199555, buyValue: 80000, currentValue: 49889, pnl: -37.6, status: 'critical', alert: 'L2 scaling reducing fee revenue, deflationary thesis weakening', dominance: 16.8 },
  { symbol: 'SOL', name: 'Solana', qty: 2, buyPrice: 18500, currentPrice: 7916.08, buyValue: 37000, currentValue: 15832, pnl: -57.2, status: 'critical', alert: 'Down 57% - DeFi TVL growing but token underperforming', dominance: 2.1 },
  { symbol: 'SHIB', name: 'Shiba Inu', qty: 5000000, currentPrice: 0.00056693, buyPrice: 5.0, buyValue: 25000, currentValue: 2835, pnl: -88.7, status: 'critical', alert: 'Meme coin - down 90%. No fundamental value, EXIT.', dominance: 0.4 },
  { symbol: 'AVAX', name: 'Avalanche', qty: 8, buyPrice: 4200, currentPrice: 858.48, buyValue: 33600, currentValue: 6868, pnl: -79.6, status: 'critical', alert: 'Down 80% - subnet adoption not translating to token value', dominance: 0.8 },
  { symbol: 'ADA', name: 'Cardano', qty: 200, buyPrice: 68, currentPrice: 23.25, buyValue: 13600, currentValue: 4650, pnl: -65.8, status: 'critical', alert: 'Down 65% - ecosystem still small, consider exit', dominance: 1.2 },
];

// ═══════════════════════════════════════════════════════════
// 10-QUARTER FUNDAMENTALS (Q2 FY23 → Q3 FY26)
// ═══════════════════════════════════════════════════════════
const QUARTERS = ['Q2 FY23', 'Q3 FY23', 'Q4 FY23', 'Q1 FY24', 'Q2 FY24', 'Q3 FY24', 'Q4 FY24', 'Q1 FY25', 'Q2 FY25', 'Q3 FY25'];

const FUNDAMENTALS = {
  KPITTECH: {
    revenue:    [1050, 1120, 1180, 1250, 1290, 1310, 1330, 1340, 1345, 1350],
    revenueGrowth: [32, 28, 24, 20, 15, 12, 10, 8, 6, 4],
    netProfit:  [180, 195, 205, 210, 200, 188, 175, 160, 148, 135],
    opm:        [35.2, 34.8, 34.0, 33.5, 32.8, 32.0, 31.2, 30.0, 29.5, 28.5],
    eps:        [6.6, 7.1, 7.5, 7.7, 7.3, 6.9, 6.4, 5.9, 5.4, 4.9],
    roe:        [28.5, 27.8, 27.0, 26.2, 25.0, 23.8, 22.5, 21.0, 19.8, 18.5],
    debtToEquity: [0.05, 0.05, 0.06, 0.08, 0.10, 0.12, 0.15, 0.18, 0.20, 0.22],
    trend: 'deteriorating',
    signal: 'SELL',
    summary: 'Revenue growth collapsed from 32% to 4%. Operating margins down 670bps. EPS declining 5 consecutive quarters. Classic fundamental deterioration.'
  },
  BEL: {
    revenue:    [3800, 4100, 4500, 4200, 4600, 5100, 5600, 5400, 5800, 6200],
    revenueGrowth: [12, 14, 16, 18, 21, 24, 24, 29, 26, 22],
    netProfit:  [680, 750, 820, 780, 860, 960, 1050, 1020, 1100, 1180],
    opm:        [22.5, 23.0, 23.5, 23.8, 24.2, 24.8, 25.2, 25.0, 25.5, 25.8],
    eps:        [2.8, 3.1, 3.4, 3.2, 3.5, 3.9, 4.3, 4.2, 4.5, 4.8],
    roe:        [20.5, 21.2, 22.0, 22.5, 23.0, 23.8, 24.5, 24.2, 25.0, 25.5],
    debtToEquity: [0.02, 0.02, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01],
    trend: 'improving',
    signal: 'HOLD',
    summary: 'Revenue growth accelerated from 12% to 22%. Margins expanding. Zero debt. Defence order book at ₹76,000 Cr. Strong compounder.'
  },
  SHRIRAMFIN: {
    revenue:    [4200, 4500, 4800, 5100, 5500, 5900, 6300, 6700, 7100, 7500],
    revenueGrowth: [15, 18, 20, 22, 24, 25, 26, 27, 25, 23],
    netProfit:  [980, 1050, 1150, 1250, 1380, 1500, 1620, 1720, 1800, 1900],
    opm:        [38.5, 39.0, 39.5, 40.0, 40.5, 41.0, 41.5, 41.2, 41.8, 42.0],
    eps:        [26.1, 28.0, 30.6, 33.3, 36.8, 40.0, 43.2, 45.8, 48.0, 50.6],
    roe:        [14.5, 15.2, 16.0, 16.8, 17.5, 18.2, 19.0, 19.5, 20.0, 20.5],
    debtToEquity: [3.8, 3.6, 3.5, 3.3, 3.2, 3.0, 2.9, 2.8, 2.7, 2.6],
    trend: 'improving',
    signal: 'HOLD',
    summary: 'AUM growing 23%+ consistently. Margins at 42%. Debt-to-equity declining. Credit cycle tailwind with vehicle finance demand strong.'
  },
  ETERNAL: {
    revenue:    [2100, 2400, 2700, 3000, 3350, 3600, 3800, 4000, 4100, 4200],
    revenueGrowth: [70, 65, 55, 45, 38, 30, 25, 20, 15, 12],
    netProfit:  [-120, -80, -40, 10, 30, 50, 60, 40, 20, -10],
    opm:        [-8.0, -5.5, -3.0, 0.5, 2.0, 3.5, 4.2, 3.0, 1.8, 0.5],
    eps:        [-0.14, -0.09, -0.05, 0.01, 0.03, 0.06, 0.07, 0.05, 0.02, -0.01],
    roe:        [-5.2, -3.5, -1.8, 0.4, 1.2, 2.0, 2.5, 1.8, 0.8, -0.3],
    debtToEquity: [0.01, 0.01, 0.01, 0.02, 0.02, 0.03, 0.05, 0.08, 0.10, 0.12],
    trend: 'volatile',
    signal: 'HOLD',
    summary: 'Revenue growth decelerating (70% → 12%). Quick commerce scaling but profitability uncertain. Watch competitive dynamics.'
  },
  HDFCBANK: {
    revenue:    [28000, 29500, 31000, 32500, 45000, 47000, 49000, 51000, 53000, 55000],
    revenueGrowth: [18, 19, 20, 21, 38, 35, 30, 25, 22, 20],
    netProfit:  [11500, 12200, 12800, 13500, 16000, 16800, 17500, 18200, 19000, 19800],
    opm:        [42.0, 42.5, 42.8, 43.0, 40.5, 41.0, 41.5, 42.0, 42.5, 42.8],
    eps:        [15.1, 16.0, 16.8, 17.7, 21.0, 22.0, 22.9, 23.8, 24.9, 25.9],
    roe:        [16.5, 16.8, 17.0, 17.2, 15.5, 15.8, 16.2, 16.5, 16.8, 17.0],
    debtToEquity: [0.8, 0.8, 0.7, 0.7, 0.9, 0.9, 0.8, 0.8, 0.8, 0.7],
    trend: 'stable',
    signal: 'HOLD',
    summary: 'Post-merger integration complete. NII growth normalizing. Asset quality industry-best. Deposit franchise unmatched.'
  },
  NVDA: {
    revenue:    [7100, 6050, 7200, 13510, 18120, 22100, 26040, 30040, 35080, 39330],
    revenueGrowth: [-17, -21, -13, 101, 122, 265, 262, 122, 94, 78],
    netProfit:  [1740, 680, 2040, 6188, 9240, 12290, 14880, 16600, 19310, 21750],
    opm:        [32.0, 15.5, 34.0, 56.0, 62.0, 67.0, 69.0, 68.5, 69.5, 70.0],
    eps:        [0.70, 0.27, 0.82, 2.48, 3.71, 4.93, 5.98, 6.67, 7.75, 8.73],
    roe:        [26.0, 10.5, 28.0, 69.0, 91.0, 99.0, 105.0, 96.0, 88.0, 82.0],
    debtToEquity: [0.41, 0.41, 0.39, 0.29, 0.24, 0.20, 0.17, 0.15, 0.13, 0.12],
    trend: 'strong_growth',
    signal: 'HOLD',
    summary: 'AI infrastructure spending cycle continues. Revenue growth decelerating from peak but still 78% YoY. Margins at 70%. Data center dominant.'
  },
  MSFT: {
    revenue:    [50100, 52700, 52900, 56200, 56500, 62000, 61900, 64700, 65600, 69600],
    revenueGrowth: [2, 2, 7, 8, 13, 18, 17, 15, 16, 12],
    netProfit:  [17600, 21650, 18300, 20100, 22290, 21870, 21940, 22040, 24670, 24110],
    opm:        [42.0, 46.0, 41.0, 42.5, 44.5, 43.0, 43.5, 43.0, 45.5, 42.0],
    eps:        [2.35, 2.93, 2.45, 2.69, 2.99, 2.93, 2.94, 2.95, 3.30, 3.23],
    roe:        [38.0, 39.5, 37.0, 38.0, 39.0, 38.5, 38.0, 37.5, 39.0, 37.8],
    debtToEquity: [0.35, 0.33, 0.31, 0.28, 0.26, 0.24, 0.22, 0.20, 0.19, 0.18],
    trend: 'stable',
    signal: 'HOLD',
    summary: 'Azure growth steady. Copilot monetization progressing. Overall business solid but multiple rich.'
  },
  TSLA: {
    revenue:    [16930, 24320, 23330, 24930, 23350, 25170, 25500, 25710, 25180, 25710],
    revenueGrowth: [-9, -8, -1, 2, 8, 3, 9, 3, 8, 2],
    netProfit:  [2260, 3690, 2510, 2700, 1850, 2510, 2560, 1480, 2170, 2320],
    opm:        [17.2, 19.2, 11.4, 14.0, 10.8, 12.5, 12.8, 7.6, 10.8, 11.5],
    eps:        [0.66, 1.05, 0.73, 0.78, 0.53, 0.73, 0.73, 0.42, 0.62, 0.66],
    roe:        [22.0, 28.0, 20.0, 21.0, 15.0, 18.0, 17.5, 10.0, 14.5, 15.0],
    debtToEquity: [0.07, 0.06, 0.05, 0.04, 0.04, 0.03, 0.03, 0.03, 0.03, 0.03],
    trend: 'volatile',
    signal: 'HOLD',
    summary: 'Auto margins under pressure but energy storage + robotaxi optionality. Revenue growth low single digits.'
  },
  PAYTM: {
    revenue:    [1850, 2060, 2340, 2500, 2520, 1680, 1640, 1750, 1800, 1850],
    revenueGrowth: [40, 35, 28, 22, 18, -18, -30, -30, -29, 10],
    netProfit:  [-570, -520, -460, -360, -290, -550, -840, -680, -420, -350],
    opm:        [-18.0, -14.5, -10.0, -5.5, -2.0, -22.0, -35.0, -25.0, -15.0, -10.0],
    eps:        [-9.0, -8.2, -7.2, -5.7, -4.6, -8.7, -13.2, -10.7, -6.6, -5.5],
    roe:        [-15.0, -14.0, -12.5, -10.0, -8.0, -16.0, -24.0, -19.0, -12.0, -10.0],
    debtToEquity: [0.02, 0.02, 0.02, 0.02, 0.02, 0.03, 0.05, 0.06, 0.06, 0.06],
    trend: 'recovering',
    signal: 'HOLD',
    summary: 'Revenue recovering from RBI action lows. Stock up 52% from buy price. Losses narrowing. Watch for profitability inflection.'
  },
  NIO: {
    revenue:    [10300, 16070, 10670, 8770, 12240, 17140, 15680, 17450, 18650, 19720],
    revenueGrowth: [-15, 7, -12, -28, 3, 7, 47, 99, 52, 15],
    netProfit:  [-2750, -3590, -4790, -6050, -4555, -5350, -4820, -5190, -5060, -4720],
    opm:        [-30.0, -28.0, -42.0, -50.0, -38.0, -35.0, -32.0, -30.0, -28.0, -25.0],
    eps:        [-1.58, -2.06, -2.75, -3.10, -2.34, -2.75, -2.48, -2.67, -2.60, -2.43],
    roe:        [-45.0, -55.0, -70.0, -85.0, -65.0, -72.0, -68.0, -71.0, -70.0, -65.0],
    debtToEquity: [1.2, 1.5, 1.8, 2.1, 2.0, 2.2, 2.3, 2.4, 2.5, 2.5],
    trend: 'deteriorating',
    signal: 'SELL',
    summary: 'Persistent losses with no path to profitability visible. Cash burn rate high. China EV price war compressing margins further. Exit recommended.'
  },
};

// ═══════════════════════════════════════════════════════════
// ALERTS (Updated 2026-03-09)
// ═══════════════════════════════════════════════════════════
const ALERTS = [
  {
    id: 1,
    type: 'critical',
    symbol: 'KPITTECH',
    market: 'india',
    title: 'Fundamentals Breaking Down',
    message: 'Revenue growth collapsed: 32% → 4%. Operating margins: 35% → 28.5%. EPS declining 5 quarters. Down 53.5% from buy.',
    action: 'SELL 50% position. Set stop-loss at ₹620 for remainder.',
    framework: 'Buffett: Quality score dropped from 85 to 45. Lynch: PEG ratio 4.2x (overvalued). Exit.',
    timestamp: new Date().toISOString(),
    priority: 1,
  },
  {
    id: 2,
    type: 'critical',
    symbol: 'TCS',
    market: 'india',
    title: 'IT Sector Under Pressure',
    message: 'Down 30.8% from buy price. IT sector facing macro headwinds. Revenue growth stalling globally.',
    action: 'HOLD if long-term, but do not add. IT recovery may take 2-3 quarters.',
    framework: 'Buffett: Quality score 75 (still decent moat). Lynch: Growth too slow for PE multiple.',
    timestamp: new Date().toISOString(),
    priority: 2,
  },
  {
    id: 3,
    type: 'critical',
    symbol: 'ASIANPAINT',
    market: 'india',
    title: 'Competition Eroding Moat',
    message: 'Down 28.4%. Birla Opus + Grasim entering paints market. Pricing power at risk. Volume growth slowing.',
    action: 'Reduce position by 50%. Moat is narrowing permanently.',
    framework: 'Buffett: Moat narrowing (was wide). Lynch: Growth slowing at premium valuation.',
    timestamp: new Date().toISOString(),
    priority: 3,
  },
  {
    id: 4,
    type: 'critical',
    symbol: 'NIO',
    market: 'us',
    title: 'Cash Burn + China EV Price War',
    message: 'Down 39.5%. Persistent losses ($4.7B trailing). Debt-to-equity 2.5x. No path to profitability.',
    action: 'EXIT fully. Reallocate to profitable EV plays or AI names.',
    framework: 'Buffett: Zero quality score. Never invest in cash-burning auto companies.',
    timestamp: new Date().toISOString(),
    priority: 4,
  },
  {
    id: 5,
    type: 'critical',
    symbol: 'SHIB',
    market: 'crypto',
    title: 'Meme Coin - Down 90%',
    message: 'Down 90% from buy. No revenue, no product, no moat. Pure speculation.',
    action: 'EXIT 100%. Zero fundamental thesis.',
    framework: 'All frameworks: Uninvestable. No business model to analyze.',
    timestamp: new Date().toISOString(),
    priority: 5,
  },
  {
    id: 6,
    type: 'warning',
    symbol: 'CRM',
    market: 'us',
    title: 'Salesforce Declining',
    message: 'Down 19.1% from buy. Enterprise spending softening. AI agents competition intensifying.',
    action: 'HOLD small. Do not add. Review after next earnings.',
    framework: 'Lynch: PEG stretched for current growth rate. Watch for inflection.',
    timestamp: new Date().toISOString(),
    priority: 6,
  },
  {
    id: 7,
    type: 'warning',
    symbol: 'ETH',
    market: 'crypto',
    title: 'Ethereum Down 42%',
    message: 'Down 41.7% from buy. L2s cannibalizing mainnet fees. Deflationary thesis weakening.',
    action: 'HOLD core crypto position but reduce if drops below ₹1,50,000.',
    framework: 'Crypto thesis: Still #2 platform but narrative shifting to L2s.',
    timestamp: new Date().toISOString(),
    priority: 7,
  },
  {
    id: 8,
    type: 'warning',
    symbol: 'IRCTC',
    market: 'india',
    title: 'IRCTC Down 36.5%',
    message: 'Convenience fee cut severely impacted revenue. Competition from private players growing.',
    action: 'HOLD small. Monopoly advantage remains but pricing power reduced.',
    framework: 'Buffett: Moat still exists but government interference is a risk.',
    timestamp: new Date().toISOString(),
    priority: 8,
  },
  {
    id: 9,
    type: 'warning',
    symbol: 'INFY',
    market: 'india',
    title: 'Infosys IT Weakness',
    message: 'Down 13.5%. IT sector facing demand slowdown. Guidance conservative.',
    action: 'HOLD. Blue-chip IT, will recover with sector. Do not panic sell.',
    framework: 'Buffett: Quality score 80+. Good business in bad sector cycle.',
    timestamp: new Date().toISOString(),
    priority: 9,
  },
  {
    id: 10,
    type: 'opportunity',
    symbol: 'SHRIRAMFIN',
    market: 'india',
    title: 'Massive Compounder - Up 474%',
    message: 'Up 474% from buy! Revenue growth 23%+. Margins 42%. Vehicle finance demand booming.',
    action: 'Book 20% partial profit. Let rest compound. Top portfolio performer.',
    framework: 'Jhunjhunwala: Classic multibagger. Buffett: Quality improving quarter after quarter.',
    timestamp: new Date().toISOString(),
    priority: 10,
  },
  {
    id: 11,
    type: 'opportunity',
    symbol: 'BEL',
    market: 'india',
    title: 'Defence Tailwind - Up 209%',
    message: 'Up 209% from buy! Revenue growth 22%+. Margins expanding. Order book ₹76,000 Cr.',
    action: 'HOLD core. Add on 10%+ corrections. Defence capex cycle multi-year.',
    framework: 'Buffett: Quality 88. Jhunjhunwala: Government-backed sector macro tailwind.',
    timestamp: new Date().toISOString(),
    priority: 11,
  },
  {
    id: 12,
    type: 'opportunity',
    symbol: 'PLTR',
    market: 'us',
    title: 'AIP Platform - Up 601%',
    message: 'Up 601% from buy! AIP bootcamps converting to contracts. Government + commercial both growing.',
    action: 'Take 25% profit at current levels. Lock gains on 7-bagger.',
    framework: 'Lynch: Classic 10-bagger but priced for perfection. Partial profit booking advised.',
    timestamp: new Date().toISOString(),
    priority: 12,
  },
];

// ═══════════════════════════════════════════════════════════
// COMPUTED SUMMARIES
// ═══════════════════════════════════════════════════════════
function computePortfolioSummary() {
  const indiaTotal = INDIAN_STOCKS.reduce((sum, s) => sum + s.currentValue, 0);
  const usTotalUSD = US_STOCKS.reduce((sum, s) => sum + s.currentValue, 0);
  const usINR = usTotalUSD * PORTFOLIO_META.currency.inr;
  const cryptoTotal = CRYPTO_HOLDINGS.reduce((sum, s) => sum + s.currentValue, 0);
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
      india: INDIAN_STOCKS.length,
      us: US_STOCKS.length,
      crypto: CRYPTO_HOLDINGS.length,
      total: INDIAN_STOCKS.length + US_STOCKS.length + CRYPTO_HOLDINGS.length,
    },
    criticalAlerts: ALERTS.filter(a => a.type === 'critical').length,
    warningAlerts: ALERTS.filter(a => a.type === 'warning').length,
    opportunityAlerts: ALERTS.filter(a => a.type === 'opportunity').length,
  };
}

module.exports = {
  PORTFOLIO_META,
  INDIAN_STOCKS,
  US_STOCKS,
  CRYPTO_HOLDINGS,
  QUARTERS,
  FUNDAMENTALS,
  ALERTS,
  computePortfolioSummary,
};
