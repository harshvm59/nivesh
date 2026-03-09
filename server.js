// ╔══════════════════════════════════════════════════════════╗
// ║  Nivesh - Investment Intelligence by HVM                ║
// ╚══════════════════════════════════════════════════════════╝

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./src/routes/api');
const { startScheduler } = require('./src/scheduler');
const { initTwilio } = require('./src/services/whatsapp');
const { refreshAllPrices } = require('./src/services/marketData');
const zerodha = require('./src/services/zerodha');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files (dashboard)
app.use(express.static(path.join(__dirname, 'public')));

// ═══════════════════════════════════════════════════════════
// ZERODHA OAuth Routes
// ═══════════════════════════════════════════════════════════

// Step 1: Redirect user to Zerodha login
app.get('/zerodha/login', (req, res) => {
  const callbackURL = `http://${req.headers.host}/zerodha/callback`;
  const loginURL = zerodha.getLoginURL(callbackURL);
  res.redirect(loginURL);
});

// Step 2: Handle callback after Zerodha login
app.get('/zerodha/callback', async (req, res) => {
  const requestToken = req.query.request_token;
  if (!requestToken) {
    return res.status(400).send('Missing request_token. Login failed.');
  }

  const result = await zerodha.exchangeToken(requestToken);
  if (result.success) {
    res.send(`
      <html><body style="background:#000;color:#fff;font-family:Inter,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;">
        <div style="text-align:center;">
          <div style="font-size:48px;margin-bottom:16px;">✅</div>
          <h1 style="color:#00E676;margin-bottom:8px;">Zerodha Connected</h1>
          <p style="color:rgba(255,255,255,0.5);">Welcome, ${result.user}. Token valid until 6 AM IST.</p>
          <a href="/" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#E8272C;color:#fff;border-radius:100px;text-decoration:none;font-weight:600;">Open Nivesh</a>
        </div>
      </body></html>
    `);
  } else {
    res.status(400).send(`
      <html><body style="background:#000;color:#fff;font-family:Inter,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;">
        <div style="text-align:center;">
          <div style="font-size:48px;margin-bottom:16px;">❌</div>
          <h1 style="color:#E8272C;">Login Failed</h1>
          <p style="color:rgba(255,255,255,0.5);">${result.error}</p>
          <a href="/zerodha/login" style="display:inline-block;margin-top:20px;padding:12px 24px;background:#E8272C;color:#fff;border-radius:100px;text-decoration:none;font-weight:600;">Try Again</a>
        </div>
      </body></html>
    `);
  }
});

// Zerodha status + holdings
app.get('/api/zerodha/status', (req, res) => {
  res.json({
    success: true,
    data: {
      authenticated: zerodha.isAuthenticated(),
      loginURL: `/zerodha/login`,
    },
  });
});

app.get('/api/zerodha/holdings', async (req, res) => {
  const result = await zerodha.fetchHoldings();
  res.json(result);
});

// ═══════════════════════════════════════════════════════════
// API routes
// ═══════════════════════════════════════════════════════════
app.use('/api', apiRoutes);

// Catch-all: serve dashboard
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, async () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   Nivesh - Investment Intelligence           ║');
  console.log('║   by HVM                                     ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║   Dashboard:  http://localhost:${PORT}           ║`);
  console.log(`║   API:        http://localhost:${PORT}/api       ║`);
  console.log(`║   Zerodha:    http://localhost:${PORT}/zerodha/login ║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  // Initialize WhatsApp
  initTwilio();

  // Start scheduler
  startScheduler();

  // Fetch live prices on startup
  console.log('[Startup] Fetching live prices...');
  try {
    const result = await refreshAllPrices();
    console.log(`[Startup] Live prices loaded: ${result.count || 0} symbols`);
  } catch (e) {
    console.log('[Startup] Price fetch failed (will retry on next request)');
  }

  console.log('[Server] Nivesh is running!');
});
