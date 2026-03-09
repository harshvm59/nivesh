// Portfolio Intelligence System - Complete Portfolio Data
// Last updated: 2026-03-08

const PORTFOLIO_META = {
  owner: 'Harsha',
  totalValue: null, // computed dynamically
  totalValueUSD: null,
  ytdReturn: 12.84,
  oneDayChange: -1.06,
  allocationTarget: { india: 60, us: 30, crypto: 10 },
  currency: { inr: 84.5 }, // USD to INR
};

// ═══════════════════════════════════════════════════════════
// INDIAN STOCKS - 30 Holdings (₹14.24L / 65%)
// ═══════════════════════════════════════════════════════════
const INDIAN_STOCKS = [
  { symbol: 'KPITTECH', name: 'KPIT Technologies', sector: 'IT Services', qty: 50, buyPrice: 1480, currentPrice: 673, buyValue: 74000, currentValue: 33650, pnl: -54.5, status: 'critical', alert: 'Fundamentals breaking - revenue growth declining, margins compressing' },
  { symbol: 'BEL', name: 'Bharat Electronics', sector: 'Defence', qty: 200, buyPrice: 148, currentPrice: 300.5, buyValue: 29600, currentValue: 60100, pnl: 103.0, status: 'positive', alert: 'Defence tailwind - order book strong' },
  { symbol: 'SHRIRAMFIN', name: 'Shriram Finance', sector: 'NBFC', qty: 25, buyPrice: 1720, currentPrice: 3320, buyValue: 43000, currentValue: 83000, pnl: 93.0, status: 'positive', alert: 'Credit cycle tailwind - AUM growing 20%+' },
  { symbol: 'ETERNAL', name: 'Eternal (Zomato)', sector: 'Consumer Tech', qty: 300, buyPrice: 185, currentPrice: 131, buyValue: 55500, currentValue: 39300, pnl: -29.2, status: 'critical', alert: 'Quick commerce competition intensifying' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', qty: 30, buyPrice: 1580, currentPrice: 1720, buyValue: 47400, currentValue: 51600, pnl: 8.9, status: 'positive', alert: 'Merger integration on track' },
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Conglomerate', qty: 20, buyPrice: 2450, currentPrice: 2680, buyValue: 49000, currentValue: 53600, pnl: 9.4, status: 'positive', alert: 'Jio + Retail growth steady' },
  { symbol: 'TCS', name: 'Tata Consultancy', sector: 'IT Services', qty: 12, buyPrice: 3650, currentPrice: 3820, buyValue: 43800, currentValue: 45840, pnl: 4.7, status: 'neutral', alert: 'Deal pipeline healthy but macro headwinds' },
  { symbol: 'INFY', name: 'Infosys', sector: 'IT Services', qty: 25, buyPrice: 1520, currentPrice: 1580, buyValue: 38000, currentValue: 39500, pnl: 3.9, status: 'neutral', alert: 'Guidance maintained' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto', qty: 60, buyPrice: 620, currentPrice: 710, buyValue: 37200, currentValue: 42600, pnl: 14.5, status: 'positive', alert: 'JLR margins improving' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'NBFC', qty: 6, buyPrice: 6800, currentPrice: 7420, buyValue: 40800, currentValue: 44520, pnl: 9.1, status: 'positive', alert: 'AUM growth 28% YoY' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', qty: 55, buyPrice: 580, currentPrice: 750, buyValue: 31900, currentValue: 41250, pnl: 29.3, status: 'positive', alert: 'NIMs stable, asset quality improving' },
  { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure', qty: 10, buyPrice: 3200, currentPrice: 3550, buyValue: 32000, currentValue: 35500, pnl: 10.9, status: 'positive', alert: 'Order book at all-time high' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma', sector: 'Pharma', qty: 20, buyPrice: 1350, currentPrice: 1680, buyValue: 27000, currentValue: 33600, pnl: 24.4, status: 'positive', alert: 'Specialty portfolio ramping up' },
  { symbol: 'TITAN', name: 'Titan Company', sector: 'Consumer', qty: 8, buyPrice: 3400, currentPrice: 3150, buyValue: 27200, currentValue: 25200, pnl: -7.4, status: 'warning', alert: 'Jewellery demand slowing' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', sector: 'Auto', qty: 3, buyPrice: 10200, currentPrice: 11800, buyValue: 30600, currentValue: 35400, pnl: 15.7, status: 'positive', alert: 'SUV mix improving margins' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', sector: 'Consumer', qty: 10, buyPrice: 3100, currentPrice: 2680, buyValue: 31000, currentValue: 26800, pnl: -13.5, status: 'warning', alert: 'Competition from Birla Opus + Grasim' },
  { symbol: 'WIPRO', name: 'Wipro', sector: 'IT Services', qty: 50, buyPrice: 420, currentPrice: 455, buyValue: 21000, currentValue: 22750, pnl: 8.3, status: 'neutral', alert: 'Turnaround progressing slowly' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', qty: 18, buyPrice: 960, currentPrice: 1250, buyValue: 17280, currentValue: 22500, pnl: 30.2, status: 'positive', alert: 'Best-in-class asset quality' },
  { symbol: 'HCLTECH', name: 'HCL Technologies', sector: 'IT Services', qty: 12, buyPrice: 1380, currentPrice: 1520, buyValue: 16560, currentValue: 18240, pnl: 10.1, status: 'positive', alert: 'Services + products mix strong' },
  { symbol: 'COALINDIA', name: 'Coal India', sector: 'Mining', qty: 40, buyPrice: 380, currentPrice: 420, buyValue: 15200, currentValue: 16800, pnl: 10.5, status: 'neutral', alert: 'Dividend yield 6%+ attractive' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', sector: 'Conglomerate', qty: 5, buyPrice: 2800, currentPrice: 2450, buyValue: 14000, currentValue: 12250, pnl: -12.5, status: 'warning', alert: 'Governance concerns lingering' },
  { symbol: 'TATAPOWER', name: 'Tata Power', sector: 'Power', qty: 30, buyPrice: 380, currentPrice: 420, buyValue: 11400, currentValue: 12600, pnl: 10.5, status: 'positive', alert: 'Renewable capacity addition on track' },
  { symbol: 'IRCTC', name: 'IRCTC', sector: 'Travel', qty: 12, buyPrice: 850, currentPrice: 780, buyValue: 10200, currentValue: 9360, pnl: -8.2, status: 'warning', alert: 'Convenience fee cut impact' },
  { symbol: 'DMART', name: 'Avenue Supermarts', sector: 'Retail', qty: 2, buyPrice: 4200, currentPrice: 3950, buyValue: 8400, currentValue: 7900, pnl: -6.0, status: 'warning', alert: 'Quick commerce disruption risk' },
  { symbol: 'PERSISTENT', name: 'Persistent Systems', sector: 'IT Services', qty: 4, buyPrice: 4800, currentPrice: 5200, buyValue: 19200, currentValue: 20800, pnl: 8.3, status: 'positive', alert: 'Product engineering demand strong' },
  { symbol: 'DIXON', name: 'Dixon Technologies', sector: 'Electronics', qty: 3, buyPrice: 5500, currentPrice: 6200, buyValue: 16500, currentValue: 18600, pnl: 12.7, status: 'positive', alert: 'PLI beneficiary, Samsung partnership' },
  { symbol: 'HAL', name: 'Hindustan Aeronautics', sector: 'Defence', qty: 5, buyPrice: 3200, currentPrice: 3800, buyValue: 16000, currentValue: 19000, pnl: 18.8, status: 'positive', alert: 'Tejas orders + helicopter exports' },
  { symbol: 'INDHOTEL', name: 'Indian Hotels', sector: 'Hospitality', qty: 15, buyPrice: 520, currentPrice: 640, buyValue: 7800, currentValue: 9600, pnl: 23.1, status: 'positive', alert: 'RevPAR expansion, new openings' },
  { symbol: 'JIOFIN', name: 'Jio Financial', sector: 'NBFC', qty: 20, buyPrice: 320, currentPrice: 285, buyValue: 6400, currentValue: 5700, pnl: -10.9, status: 'warning', alert: 'Still in ramp-up phase' },
  { symbol: 'PAYTM', name: 'One97 Communications', sector: 'Fintech', qty: 15, buyPrice: 680, currentPrice: 520, buyValue: 10200, currentValue: 7800, pnl: -23.5, status: 'critical', alert: 'RBI restrictions + revenue hit' },
];

// ═══════════════════════════════════════════════════════════
// US STOCKS - 16 Holdings ($85.5K / 30%)
// ═══════════════════════════════════════════════════════════
const US_STOCKS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', sector: 'Semiconductors', qty: 50, buyPrice: 62, currentPrice: 127.7, buyValue: 3100, currentValue: 6385, pnl: 106.0, status: 'positive', alert: 'AI dominance continues, Blackwell ramp' },
  { symbol: 'TSLA', name: 'Tesla Inc', sector: 'EV / Auto', qty: 20, buyPrice: 210, currentPrice: 312.9, buyValue: 4200, currentValue: 6258, pnl: 49.0, status: 'positive', alert: 'Robotaxi catalyst + energy storage' },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Social Media', qty: 12, buyPrice: 380, currentPrice: 570, buyValue: 4560, currentValue: 6840, pnl: 50.0, status: 'positive', alert: 'Reels monetization + Reality Labs progress' },
  { symbol: 'MSFT', name: 'Microsoft Corp', sector: 'Software', qty: 15, buyPrice: 420, currentPrice: 405.8, buyValue: 6300, currentValue: 6087, pnl: -3.39, status: 'warning', alert: 'Azure growth watch - 31% vs 35% prior' },
  { symbol: 'AAPL', name: 'Apple Inc', sector: 'Consumer Tech', qty: 30, buyPrice: 178, currentPrice: 218, buyValue: 5340, currentValue: 6540, pnl: 22.5, status: 'positive', alert: 'iPhone cycle + Services growing 14%' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', sector: 'Search / Cloud', qty: 35, buyPrice: 138, currentPrice: 172, buyValue: 4830, currentValue: 6020, pnl: 24.6, status: 'positive', alert: 'Search + Cloud profitable, Gemini traction' },
  { symbol: 'AMZN', name: 'Amazon.com', sector: 'E-Commerce / Cloud', qty: 28, buyPrice: 155, currentPrice: 198, buyValue: 4340, currentValue: 5544, pnl: 27.7, status: 'positive', alert: 'AWS re-acceleration + retail margins' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Semiconductors', qty: 30, buyPrice: 120, currentPrice: 158, buyValue: 3600, currentValue: 4740, pnl: 31.7, status: 'positive', alert: 'MI300X ramp, data center share gains' },
  { symbol: 'NFLX', name: 'Netflix Inc', sector: 'Streaming', qty: 8, buyPrice: 480, currentPrice: 680, buyValue: 3840, currentValue: 5440, pnl: 41.7, status: 'positive', alert: 'Ad tier growth + password sharing crackdown working' },
  { symbol: 'CRM', name: 'Salesforce Inc', sector: 'Enterprise SW', qty: 18, buyPrice: 245, currentPrice: 285, buyValue: 4410, currentValue: 5130, pnl: 16.3, status: 'positive', alert: 'AI agents integration boosting deal sizes' },
  { symbol: 'AVGO', name: 'Broadcom Inc', sector: 'Semiconductors', qty: 25, buyPrice: 155, currentPrice: 192, buyValue: 3875, currentValue: 4800, pnl: 23.9, status: 'positive', alert: 'VMware integration + AI networking' },
  { symbol: 'PLTR', name: 'Palantir Technologies', sector: 'AI / Analytics', qty: 100, buyPrice: 22, currentPrice: 82, buyValue: 2200, currentValue: 8200, pnl: 272.7, status: 'positive', alert: 'AIP platform driving commercial growth' },
  { symbol: 'SNOW', name: 'Snowflake Inc', sector: 'Cloud Data', qty: 20, buyPrice: 185, currentPrice: 165, buyValue: 3700, currentValue: 3300, pnl: -10.8, status: 'warning', alert: 'Consumption model headwinds' },
  { symbol: 'COIN', name: 'Coinbase Global', sector: 'Crypto Exchange', qty: 15, buyPrice: 180, currentPrice: 210, buyValue: 2700, currentValue: 3150, pnl: 16.7, status: 'neutral', alert: 'Tied to crypto cycle' },
  { symbol: 'SOFI', name: 'SoFi Technologies', sector: 'Fintech', qty: 200, buyPrice: 8.5, currentPrice: 13.2, buyValue: 1700, currentValue: 2640, pnl: 55.3, status: 'positive', alert: 'Bank charter driving NII growth' },
  { symbol: 'NIO', name: 'NIO Inc', sector: 'EV', qty: 300, buyPrice: 8, currentPrice: 5.1, buyValue: 2400, currentValue: 1530, pnl: -36.3, status: 'critical', alert: 'Cash burn + China EV price war' },
];

// ═══════════════════════════════════════════════════════════
// CRYPTO - 6 Holdings (₹1.99L / 5%)
// ═══════════════════════════════════════════════════════════
const CRYPTO_HOLDINGS = [
  { symbol: 'BTC', name: 'Bitcoin', qty: 0.012, buyPrice: 5200000, currentPrice: 3484000, buyValue: 62400, currentValue: 41808, pnl: -33.0, status: 'warning', alert: 'Halving cycle maturing - historically recovers', dominance: 54.2 },
  { symbol: 'ETH', name: 'Ethereum', qty: 0.25, buyPrice: 320000, currentPrice: 182400, buyValue: 80000, currentValue: 45600, pnl: -43.0, status: 'critical', alert: 'L2 scaling reducing fee revenue, deflationary thesis weakening', dominance: 16.8 },
  { symbol: 'SOL', name: 'Solana', qty: 2, buyPrice: 18500, currentPrice: 9065, buyValue: 37000, currentValue: 18130, pnl: -51.0, status: 'critical', alert: 'Network congestion issues, but DeFi TVL growing', dominance: 2.1 },
  { symbol: 'SHIB', name: 'Shiba Inu', qty: 5000000, currentPrice: 0.0014, buyPrice: 0.005, buyValue: 25000, currentValue: 7000, pnl: -72.0, status: 'critical', alert: 'Meme coin - no fundamental value, consider exit', dominance: 0.4 },
  { symbol: 'AVAX', name: 'Avalanche', qty: 8, buyPrice: 4200, currentPrice: 2800, buyValue: 33600, currentValue: 22400, pnl: -33.3, status: 'warning', alert: 'Subnet adoption growing but token underperforming', dominance: 0.8 },
  { symbol: 'ADA', name: 'Cardano', qty: 200, buyPrice: 68, currentPrice: 52, buyValue: 13600, currentValue: 10400, pnl: -23.5, status: 'warning', alert: 'Governance improvements but ecosystem still small', dominance: 1.2 },
];

// ═══════════════════════════════════════════════════════════
// 10-QUARTER FUNDAMENTALS (Q2 FY23 → Q3 FY26)
// ═══════════════════════════════════════════════════════════
const QUARTERS = ['Q2 FY23', 'Q3 FY23', 'Q4 FY23', 'Q1 FY24', 'Q2 FY24', 'Q3 FY24', 'Q4 FY24', 'Q1 FY25', 'Q2 FY25', 'Q3 FY25'];

const FUNDAMENTALS = {
  // KPITTECH - Deteriorating fundamentals (revenue growth slowing, margins compressing)
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
  // BEL - Strong and improving
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
  // SHRIRAMFIN - Strong recovery
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
  // ETERNAL (Zomato) - Mixed, competition pressure
  ETERNAL: {
    revenue:    [2100, 2400, 2700, 3000, 3350, 3600, 3800, 4000, 4100, 4200],
    revenueGrowth: [70, 65, 55, 45, 38, 30, 25, 20, 15, 12],
    netProfit:  [-120, -80, -40, 10, 30, 50, 60, 40, 20, -10],
    opm:        [-8.0, -5.5, -3.0, 0.5, 2.0, 3.5, 4.2, 3.0, 1.8, 0.5],
    eps:        [-0.14, -0.09, -0.05, 0.01, 0.03, 0.06, 0.07, 0.05, 0.02, -0.01],
    roe:        [-5.2, -3.5, -1.8, 0.4, 1.2, 2.0, 2.5, 1.8, 0.8, -0.3],
    debtToEquity: [0.01, 0.01, 0.01, 0.02, 0.02, 0.03, 0.05, 0.08, 0.10, 0.12],
    trend: 'deteriorating',
    signal: 'SELL',
    summary: 'Revenue growth decelerating sharply (70% → 12%). Brief profitability now reversed. Quick commerce competition (Blinkit vs Instamart vs Zepto) burning cash.'
  },
  // HDFCBANK - Stable blue-chip
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
  // NVDA - US stock with strong growth
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
  // MSFT - Slight deceleration
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
    summary: 'Azure growth at 31% vs 35% prior quarter. Copilot monetization still early. Overall business solid but multiple rich.'
  },
  // TSLA
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
    summary: 'Auto margins under pressure but energy storage + robotaxi optionality. Revenue growth low single digits. Valuation premium for future bets.'
  },
  // PAYTM - Stressed
  PAYTM: {
    revenue:    [1850, 2060, 2340, 2500, 2520, 1680, 1640, 1750, 1800, 1850],
    revenueGrowth: [40, 35, 28, 22, 18, -18, -30, -30, -29, 10],
    netProfit:  [-570, -520, -460, -360, -290, -550, -840, -680, -420, -350],
    opm:        [-18.0, -14.5, -10.0, -5.5, -2.0, -22.0, -35.0, -25.0, -15.0, -10.0],
    eps:        [-9.0, -8.2, -7.2, -5.7, -4.6, -8.7, -13.2, -10.7, -6.6, -5.5],
    roe:        [-15.0, -14.0, -12.5, -10.0, -8.0, -16.0, -24.0, -19.0, -12.0, -10.0],
    debtToEquity: [0.02, 0.02, 0.02, 0.02, 0.02, 0.03, 0.05, 0.06, 0.06, 0.06],
    trend: 'deteriorating',
    signal: 'SELL',
    summary: 'RBI action devastated lending business. Revenue dropped 30%. Losses widening. Recovery slow. Consider full exit.'
  },
  // NIO - US-listed stress
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
// ALERTS (Pre-generated)
// ═══════════════════════════════════════════════════════════
const ALERTS = [
  {
    id: 1,
    type: 'critical',
    symbol: 'KPITTECH',
    market: 'india',
    title: 'Fundamentals Breaking Down',
    message: 'Revenue growth collapsed: 32% → 4%. Operating margins: 35% → 28.5%. EPS declining 5 quarters. Classic deterioration pattern.',
    action: 'SELL 50% position. Set stop-loss at ₹620 for remainder.',
    framework: 'Buffett: Quality score dropped from 85 to 45. Lynch: PEG ratio 4.2x (overvalued). Exit.',
    timestamp: new Date().toISOString(),
    priority: 1,
  },
  {
    id: 2,
    type: 'critical',
    symbol: 'ETERNAL',
    market: 'india',
    title: 'Profitability Reversed + Competition',
    message: 'Revenue growth: 70% → 12%. Brief profitability now reversed (₹-10 Cr loss). Quick commerce burning cash.',
    action: 'SELL 100%. Reallocate to SHRIRAMFIN or BEL.',
    framework: 'Lynch: Growth without profits = speculation. Jhunjhunwala: Sector too competitive, no moat.',
    timestamp: new Date().toISOString(),
    priority: 2,
  },
  {
    id: 3,
    type: 'critical',
    symbol: 'PAYTM',
    market: 'india',
    title: 'RBI Restrictions Impact Continuing',
    message: 'Revenue dropped 30% after RBI action. Losses widening. Lending business crippled.',
    action: 'EXIT fully. Regulatory risk unquantifiable.',
    framework: 'Buffett: Regulatory moat destroyed. No margin of safety at any price.',
    timestamp: new Date().toISOString(),
    priority: 3,
  },
  {
    id: 4,
    type: 'critical',
    symbol: 'NIO',
    market: 'us',
    title: 'Cash Burn + China EV Price War',
    message: 'Persistent losses ($4.7B trailing). Debt-to-equity 2.5x. No path to profitability.',
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
    title: 'Meme Coin - No Fundamental Value',
    message: 'Down 72%. No revenue, no product, no moat. Pure speculation.',
    action: 'EXIT 100%. Zero fundamental thesis.',
    framework: 'All frameworks: Uninvestable. No business model to analyze.',
    timestamp: new Date().toISOString(),
    priority: 5,
  },
  {
    id: 6,
    type: 'warning',
    symbol: 'MSFT',
    market: 'us',
    title: 'Azure Growth Deceleration',
    message: 'Azure growth 31% vs 35% prior. Copilot monetization slower than expected. Still strong but watch.',
    action: 'HOLD. Add on dips below $380. Core position.',
    framework: 'Buffett: Quality score 92 (excellent). Lynch: PEG 1.8 (fair). No action needed yet.',
    timestamp: new Date().toISOString(),
    priority: 6,
  },
  {
    id: 7,
    type: 'warning',
    symbol: 'ASIANPAINT',
    market: 'india',
    title: 'New Competition Threat',
    message: 'Birla Opus + Grasim entering paints. Pricing power at risk. Volume growth slowing.',
    action: 'HOLD tight. Watch next 2 quarters for market share data. Reduce if share loss >2%.',
    framework: 'Buffett: Moat narrowing (was wide). Lynch: Growth slowing at premium valuation.',
    timestamp: new Date().toISOString(),
    priority: 7,
  },
  {
    id: 8,
    type: 'warning',
    symbol: 'SNOW',
    market: 'us',
    title: 'Consumption Headwinds',
    message: 'Revenue growth decelerating. Customers optimizing cloud spend. Competition from Databricks.',
    action: 'HOLD small. Do not add. Review after Q4 results.',
    framework: 'Lynch: PEG 5.8x (expensive for growth rate). Watch for inflection.',
    timestamp: new Date().toISOString(),
    priority: 8,
  },
  {
    id: 9,
    type: 'warning',
    symbol: 'ETH',
    market: 'crypto',
    title: 'L2 Scaling Reducing Fee Revenue',
    message: 'Down 43%. L2s cannibalizing mainnet fees. Deflationary thesis weakening.',
    action: 'HOLD. Core crypto position but reduce if drops below $1,800.',
    framework: 'Crypto thesis: Still #2 platform but narrative shifting.',
    timestamp: new Date().toISOString(),
    priority: 9,
  },
  {
    id: 10,
    type: 'opportunity',
    symbol: 'BEL',
    market: 'india',
    title: 'Defence Tailwind Continues',
    message: 'Revenue growth 22%+. Margins expanding. Order book ₹76,000 Cr. Near-zero debt.',
    action: 'ADD on dips below ₹280. Position for long-term defence capex cycle.',
    framework: 'Buffett: Quality 88. Jhunjhunwala: Sector macro tailwind, government backing.',
    timestamp: new Date().toISOString(),
    priority: 10,
  },
  {
    id: 11,
    type: 'opportunity',
    symbol: 'SHRIRAMFIN',
    market: 'india',
    title: 'Credit Cycle Sweet Spot',
    message: 'AUM growth 23%+. Margins 42%. Vehicle finance demand booming. De-leveraging balance sheet.',
    action: 'HOLD core. Add up to 5% portfolio weight on any 10% correction.',
    framework: 'Buffett: Quality improving. Jhunjhunwala: Contrarian 2 years ago, now mainstream.',
    timestamp: new Date().toISOString(),
    priority: 11,
  },
  {
    id: 12,
    type: 'opportunity',
    symbol: 'PLTR',
    market: 'us',
    title: 'AIP Platform Driving Growth',
    message: 'Up 272%. AIP bootcamps converting to contracts. Government + commercial both growing.',
    action: 'HOLD but do NOT add at current valuation. Take 20% profit if up another 30%.',
    framework: 'Lynch: Classic 10-bagger but now priced for perfection. Lock gains partially.',
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
