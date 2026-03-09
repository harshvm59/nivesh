// Portfolio Intelligence System - Analysis Service
// Fundamentals analysis + Investor frameworks (Buffett, Lynch, Jhunjhunwala)

const { FUNDAMENTALS, QUARTERS } = require('../data/portfolio');

// ═══════════════════════════════════════════════════════════
// FUNDAMENTALS ANALYSIS
// ═══════════════════════════════════════════════════════════

function analyzeTrend(data) {
  if (!data || data.length < 4) return { direction: 'insufficient', slope: 0 };
  const recent = data.slice(-4);
  const earlier = data.slice(-8, -4);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.length ? earlier.reduce((a, b) => a + b, 0) / earlier.length : recentAvg;
  const change = ((recentAvg - earlierAvg) / Math.abs(earlierAvg || 1)) * 100;

  if (change > 10) return { direction: 'improving', slope: change };
  if (change < -10) return { direction: 'deteriorating', slope: change };
  return { direction: 'stable', slope: change };
}

function getFundamentals(symbol) {
  const data = FUNDAMENTALS[symbol];
  if (!data) return null;

  const revTrend = analyzeTrend(data.revenue);
  const profitTrend = analyzeTrend(data.netProfit);
  const marginTrend = analyzeTrend(data.opm);
  const epsTrend = analyzeTrend(data.eps);

  return {
    symbol,
    quarters: QUARTERS,
    metrics: {
      revenue: data.revenue,
      revenueGrowth: data.revenueGrowth,
      netProfit: data.netProfit,
      opm: data.opm,
      eps: data.eps,
      roe: data.roe,
      debtToEquity: data.debtToEquity,
    },
    trends: {
      revenue: revTrend,
      profit: profitTrend,
      margin: marginTrend,
      eps: epsTrend,
    },
    overall: data.trend,
    signal: data.signal,
    summary: data.summary,
  };
}

// ═══════════════════════════════════════════════════════════
// INVESTOR FRAMEWORKS
// ═══════════════════════════════════════════════════════════

function buffettAnalysis(symbol) {
  const data = FUNDAMENTALS[symbol];
  if (!data) return { score: 0, grade: 'N/A', details: [] };

  const latestROE = data.roe[data.roe.length - 1];
  const latestDebt = data.debtToEquity[data.debtToEquity.length - 1];
  const latestMargin = data.opm[data.opm.length - 1];
  const marginTrend = analyzeTrend(data.opm);
  const roeTrend = analyzeTrend(data.roe);

  let score = 0;
  const details = [];

  // ROE Check (>15% = great)
  if (latestROE > 20) { score += 25; details.push({ metric: 'ROE', value: `${latestROE}%`, verdict: 'Excellent', emoji: '🟢' }); }
  else if (latestROE > 15) { score += 18; details.push({ metric: 'ROE', value: `${latestROE}%`, verdict: 'Good', emoji: '🟢' }); }
  else if (latestROE > 10) { score += 10; details.push({ metric: 'ROE', value: `${latestROE}%`, verdict: 'Average', emoji: '🟡' }); }
  else { score += 0; details.push({ metric: 'ROE', value: `${latestROE}%`, verdict: 'Poor', emoji: '🔴' }); }

  // Debt Check (<0.5 = great)
  if (latestDebt < 0.1) { score += 25; details.push({ metric: 'Debt/Equity', value: `${latestDebt}x`, verdict: 'Fortress', emoji: '🟢' }); }
  else if (latestDebt < 0.5) { score += 18; details.push({ metric: 'Debt/Equity', value: `${latestDebt}x`, verdict: 'Conservative', emoji: '🟢' }); }
  else if (latestDebt < 1.0) { score += 10; details.push({ metric: 'Debt/Equity', value: `${latestDebt}x`, verdict: 'Moderate', emoji: '🟡' }); }
  else { score += 0; details.push({ metric: 'Debt/Equity', value: `${latestDebt}x`, verdict: 'High', emoji: '🔴' }); }

  // Margin Stability
  if (marginTrend.direction === 'improving') { score += 25; details.push({ metric: 'Margin Trend', value: `+${marginTrend.slope.toFixed(1)}%`, verdict: 'Expanding', emoji: '🟢' }); }
  else if (marginTrend.direction === 'stable') { score += 18; details.push({ metric: 'Margin Trend', value: 'Stable', verdict: 'Consistent', emoji: '🟢' }); }
  else { score += 5; details.push({ metric: 'Margin Trend', value: `${marginTrend.slope.toFixed(1)}%`, verdict: 'Compressing', emoji: '🔴' }); }

  // Competitive Moat (proxy: ROE consistency)
  if (roeTrend.direction === 'improving' && latestROE > 15) { score += 25; details.push({ metric: 'Moat', value: 'Wide', verdict: 'Durable advantage', emoji: '🟢' }); }
  else if (roeTrend.direction === 'stable') { score += 15; details.push({ metric: 'Moat', value: 'Narrow', verdict: 'Some advantage', emoji: '🟡' }); }
  else { score += 5; details.push({ metric: 'Moat', value: 'None', verdict: 'No advantage', emoji: '🔴' }); }

  const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';
  return { score, grade, details, verdict: score >= 70 ? 'BUY/HOLD' : score >= 40 ? 'HOLD/WATCH' : 'AVOID/SELL' };
}

function lynchAnalysis(symbol) {
  const data = FUNDAMENTALS[symbol];
  if (!data) return { peg: 0, category: 'N/A', verdict: '' };

  const latestGrowth = data.revenueGrowth[data.revenueGrowth.length - 1];
  const earningsGrowth = latestGrowth > 0 ? latestGrowth : 1;

  // Simplified PEG (using revenue growth as proxy)
  const assumedPE = (() => {
    if (['KPITTECH', 'ETERNAL', 'PAYTM'].includes(symbol)) return 60;
    if (['NVDA', 'PLTR', 'TSLA'].includes(symbol)) return 50;
    if (['BEL', 'SHRIRAMFIN', 'HDFCBANK'].includes(symbol)) return 25;
    if (['MSFT', 'META', 'GOOGL', 'AAPL'].includes(symbol)) return 30;
    return 35;
  })();

  const peg = earningsGrowth > 0 ? (assumedPE / earningsGrowth).toFixed(2) : 99;

  let category, verdict;
  if (latestGrowth > 25) { category = 'Fast Grower'; }
  else if (latestGrowth > 10) { category = 'Stalwart'; }
  else if (latestGrowth > 0) { category = 'Slow Grower'; }
  else { category = 'Turnaround'; }

  if (peg < 1) verdict = 'Undervalued - Strong BUY';
  else if (peg < 1.5) verdict = 'Fair value - HOLD';
  else if (peg < 2.5) verdict = 'Expensive - WATCH';
  else verdict = 'Overvalued - AVOID';

  return {
    peg: parseFloat(peg),
    pe: assumedPE,
    growthRate: latestGrowth,
    category,
    verdict,
    details: [
      { metric: 'P/E Ratio', value: `${assumedPE}x` },
      { metric: 'Growth Rate', value: `${latestGrowth}%` },
      { metric: 'PEG Ratio', value: `${peg}x` },
      { metric: 'Category', value: category },
    ],
  };
}

function jhunjhunwalaAnalysis(symbol) {
  const data = FUNDAMENTALS[symbol];
  if (!data) return { score: 0, signals: [] };

  const signals = [];
  let score = 0;

  // Sector rotation check
  const sectorTailwinds = {
    KPITTECH: { sector: 'IT Services', macro: 'negative', reason: 'Global IT spending slowdown' },
    BEL: { sector: 'Defence', macro: 'positive', reason: 'Government defence capex at all-time high' },
    SHRIRAMFIN: { sector: 'NBFC', macro: 'positive', reason: 'Credit cycle upturn, vehicle demand strong' },
    ETERNAL: { sector: 'Consumer Tech', macro: 'negative', reason: 'Hypercompetition in quick commerce' },
    HDFCBANK: { sector: 'Banking', macro: 'neutral', reason: 'Rate cycle peaking, NIM pressure' },
    NVDA: { sector: 'AI/Semiconductors', macro: 'positive', reason: 'AI capex cycle in early innings' },
    MSFT: { sector: 'Software', macro: 'neutral', reason: 'Enterprise spending cautious' },
    TSLA: { sector: 'EV', macro: 'neutral', reason: 'EV adoption growing but competition fierce' },
    PAYTM: { sector: 'Fintech', macro: 'negative', reason: 'Regulatory headwinds, trust deficit' },
    NIO: { sector: 'China EV', macro: 'negative', reason: 'China deflation, EV price war, cash burn' },
  };

  const sectorData = sectorTailwinds[symbol];
  if (sectorData) {
    if (sectorData.macro === 'positive') { score += 35; signals.push({ type: 'tailwind', emoji: '🟢', text: `Sector tailwind: ${sectorData.reason}` }); }
    else if (sectorData.macro === 'neutral') { score += 15; signals.push({ type: 'neutral', emoji: '🟡', text: `Sector neutral: ${sectorData.reason}` }); }
    else { score += 0; signals.push({ type: 'headwind', emoji: '🔴', text: `Sector headwind: ${sectorData.reason}` }); }
  }

  // Contrarian check (beaten down but fundamentals recovering?)
  const revGrowthRecent = data.revenueGrowth.slice(-2);
  const revGrowthEarlier = data.revenueGrowth.slice(-4, -2);
  const isRecovering = revGrowthRecent[1] > revGrowthRecent[0] && revGrowthEarlier[1] < revGrowthRecent[0];

  if (isRecovering) {
    score += 30;
    signals.push({ type: 'contrarian', emoji: '🟢', text: 'Growth inflecting upward - potential contrarian play' });
  }

  // Promoter/institutional interest (simplified)
  const latestROE = data.roe[data.roe.length - 1];
  if (latestROE > 20) { score += 20; signals.push({ type: 'quality', emoji: '🟢', text: `High ROE (${latestROE}%) - institutional favorite` }); }
  else if (latestROE > 10) { score += 10; signals.push({ type: 'quality', emoji: '🟡', text: `Moderate ROE (${latestROE}%)` }); }
  else { signals.push({ type: 'quality', emoji: '🔴', text: `Low ROE (${latestROE}%) - value trap risk` }); }

  // Market cap bias (Jhunjhunwala favored mid-caps with growth)
  const latestGrowth = data.revenueGrowth[data.revenueGrowth.length - 1];
  if (latestGrowth > 20) { score += 15; signals.push({ type: 'growth', emoji: '🟢', text: `Strong growth (${latestGrowth}%) in sweet spot` }); }

  const verdict = score >= 60 ? 'STRONG BUY' : score >= 40 ? 'ACCUMULATE' : score >= 20 ? 'HOLD' : 'AVOID';

  return { score, verdict, signals };
}

function getFullAnalysis(symbol) {
  return {
    fundamentals: getFundamentals(symbol),
    buffett: buffettAnalysis(symbol),
    lynch: lynchAnalysis(symbol),
    jhunjhunwala: jhunjhunwalaAnalysis(symbol),
  };
}

module.exports = {
  getFundamentals,
  buffettAnalysis,
  lynchAnalysis,
  jhunjhunwalaAnalysis,
  getFullAnalysis,
  analyzeTrend,
};
