// Portfolio Intelligence System - Zerodha Kite Connect Integration
// Handles OAuth2 login flow + holdings fetch
//
// HOW ZERODHA AUTH WORKS:
// 1. User visits /zerodha/login → redirected to Kite login page
// 2. After login, Kite redirects back to /zerodha/callback?request_token=xxx
// 3. We exchange request_token for access_token using API secret
// 4. access_token is valid until 6 AM IST next day
// 5. We use access_token to fetch holdings, positions, etc.

const axios = require('axios');
const crypto = require('crypto');

let accessToken = null;
let tokenExpiry = null;

const API_KEY = process.env.ZERODHA_API_KEY;
const API_SECRET = process.env.ZERODHA_API_SECRET;
const BASE_URL = 'https://api.kite.trade';
const LOGIN_URL = 'https://kite.zerodha.com/connect/login';

function getLoginURL(redirectURL) {
  return `${LOGIN_URL}?v=3&api_key=${API_KEY}&redirect_url=${encodeURIComponent(redirectURL)}`;
}

async function exchangeToken(requestToken) {
  try {
    // Checksum = SHA256(api_key + request_token + api_secret)
    const checksum = crypto
      .createHash('sha256')
      .update(API_KEY + requestToken + API_SECRET)
      .digest('hex');

    const res = await axios.post(`${BASE_URL}/session/token`, null, {
      params: {
        api_key: API_KEY,
        request_token: requestToken,
        checksum,
      },
      headers: { 'X-Kite-Version': '3' },
    });

    if (res.data?.data?.access_token) {
      accessToken = res.data.data.access_token;
      // Token valid until 6 AM IST next day
      const now = new Date();
      const expiry = new Date(now);
      expiry.setDate(expiry.getDate() + 1);
      expiry.setHours(0, 30, 0, 0); // 6 AM IST = 00:30 UTC
      tokenExpiry = expiry;

      console.log(`[Zerodha] Access token obtained. Expires: ${expiry.toISOString()}`);
      return { success: true, user: res.data.data.user_name || 'Unknown' };
    }
    return { success: false, error: 'No access token in response' };
  } catch (e) {
    console.error('[Zerodha] Token exchange failed:', e.response?.data || e.message);
    return { success: false, error: e.response?.data?.message || e.message };
  }
}

function isAuthenticated() {
  return accessToken && tokenExpiry && new Date() < tokenExpiry;
}

async function fetchHoldings() {
  if (!isAuthenticated()) return { success: false, error: 'Not authenticated. Login at /zerodha/login' };

  try {
    const res = await axios.get(`${BASE_URL}/portfolio/holdings`, {
      headers: {
        'X-Kite-Version': '3',
        Authorization: `token ${API_KEY}:${accessToken}`,
      },
    });
    return { success: true, data: res.data.data };
  } catch (e) {
    return { success: false, error: e.response?.data?.message || e.message };
  }
}

async function fetchPositions() {
  if (!isAuthenticated()) return { success: false, error: 'Not authenticated' };

  try {
    const res = await axios.get(`${BASE_URL}/portfolio/positions`, {
      headers: {
        'X-Kite-Version': '3',
        Authorization: `token ${API_KEY}:${accessToken}`,
      },
    });
    return { success: true, data: res.data.data };
  } catch (e) {
    return { success: false, error: e.response?.data?.message || e.message };
  }
}

module.exports = {
  getLoginURL,
  exchangeToken,
  isAuthenticated,
  fetchHoldings,
  fetchPositions,
  getAccessToken: () => accessToken,
};
