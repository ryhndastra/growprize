const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db-api/apiDB');
const { createSession, requireAuth, COOKIE_NAME, sha256 } = require('../middleware/web-auth');
const { getActualPlayerFilename } = require('./account');

const router = express.Router();
const SECRET_KEY = process.env.CLIENT_SECRET;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { paymentDir } = require('../config/paths');

const lastRollTime = new Map();

function verifyApiKeyIfPresent(req) {
  const auth = req.headers['x-api-key'];
  if (auth && auth !== SECRET_KEY) {
    return false;
  }
  return true;
}

function getCasesConfig() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, '../config/cases.json'), 'utf8');
    return JSON.parse(raw).cases || [];
  } catch (err) {
    console.error('Failed to read config/cases.json:', err);
    return [];
  }
}

router.post('/register', async (req, res) => {
  if (!verifyApiKeyIfPresent(req)) return res.status(403).json({ error: 'Forbidden' });

  const { growId, email, password } = req.body;
  if (!growId || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const trimmedGrowId = typeof growId === 'string' ? growId.trim() : '';
  const trimmedEmail = typeof email === 'string' ? email.trim() : '';

  if (!/^[a-zA-Z0-9]{3,20}$/.test(trimmedGrowId)) {
    return res.status(400).json({ error: 'GrowID must be between 3 and 20 alphanumeric characters' });
  }

  if (!EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length > 254) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const actualGrowId = await getActualPlayerFilename(trimmedGrowId);
    if (!actualGrowId) {
      return res.status(400).json({ error: 'Invalid GrowID' });
    }

    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users.accounts (grow_id, email, password_hash)
       VALUES ($1, $2, $3) RETURNING uid, grow_id, email, balance`,
      [actualGrowId, trimmedEmail.toLowerCase(), hash]
    );
    await createSession(res, rows[0].uid);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'GrowID or email is already registered' });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    if (!verifyApiKeyIfPresent(req)) return res.status(403).json({ error: 'Forbidden' });

    const { growId, email, password } = req.body;
    if (!growId || !email || !password) {
      return res.status(400).json({ error: 'GrowID, email, and password are required' });
    }

    const trimmedGrowId = typeof growId === 'string' ? growId.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';

    if (!/^[a-zA-Z0-9]{3,20}$/.test(trimmedGrowId)) {
      return res.status(400).json({ error: 'Invalid GrowID' });
    }

    if (!EMAIL_REGEX.test(trimmedEmail) || trimmedEmail.length > 254) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const actualGrowId = await getActualPlayerFilename(trimmedGrowId);
    if (!actualGrowId) {
      return res.status(400).json({ error: 'Invalid GrowID' });
    }

    const { rows } = await pool.query(
      'SELECT uid, grow_id, email, balance, password_hash FROM users.accounts WHERE LOWER(grow_id) = LOWER($1) AND LOWER(email) = LOWER($2)',
      [actualGrowId, trimmedEmail]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid GrowID, email, or password' });
    }

    await createSession(res, user.uid);
    res.json({ uid: user.uid, grow_id: user.grow_id, email: user.email, balance: user.balance });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json(req.user);
});

router.post('/logout', async (req, res) => {
  try {
    if (!verifyApiKeyIfPresent(req)) return res.status(403).json({ error: 'Forbidden' });
    
    const token = req.cookies?.[COOKIE_NAME];
    if (typeof token === 'string' && token.length > 0) {
      await pool.query('DELETE FROM users.sessions WHERE token_hash = $1', [sha256(token)]);
    }
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/cases', (req, res) => {
  const cases = getCasesConfig();
  res.json({ cases });
});

router.post('/topup', requireAuth, async (req, res) => {
  try {
    if (!verifyApiKeyIfPresent(req)) return res.status(403).json({ error: 'Forbidden' });

    const { amount } = req.body;
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || !isFinite(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'Nominal top-up tidak valid' });
    }

    if (numAmount < 0.10) {
      return res.status(400).json({ error: 'Minimal top-up adalah $0.10' });
    }

    if (numAmount > 10000) {
      return res.status(400).json({ error: 'Maksimal top-up adalah $10,000.00' });
    }

    const roundedAmount = Math.round(numAmount * 100) / 100;

    const { rows } = await pool.query(
      `UPDATE users.accounts 
       SET balance = COALESCE(balance, 0) + $1 
       WHERE uid = $2 
       RETURNING uid, grow_id, email, balance`,
      [roundedAmount, req.user.uid]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: 'Akun tidak ditemukan' });
    }

    res.json({
      success: true,
      message: `Top-up sebesar $${roundedAmount.toFixed(2)} berhasil!`,
      balance: rows[0].balance,
      addedAmount: roundedAmount
    });
  } catch (err) {
    console.error('Topup error:', err);
    res.status(500).json({ error: 'Gagal memproses top-up' });
  }
});

router.post('/roll', requireAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    if (!verifyApiKeyIfPresent(req)) return res.status(403).json({ error: 'Forbidden' });

    const { caseId, itemId } = req.body;
    const allCases = getCasesConfig();

    const selectedCase = allCases.find((c) => c.id === caseId);
    if (!selectedCase) {
      return res.status(400).json({ error: 'Case tidak valid' });
    }

    const wonItem = selectedCase.items.find((it) => it.id === itemId);
    if (!wonItem) {
      return res.status(400).json({ error: 'Item prize tidak valid' });
    }

    const now = Date.now();
    const lastTime = lastRollTime.get(req.user.uid) || 0;
    if (now - lastTime < 1500) {
      return res.status(429).json({ error: 'Terlalu cepat! Mohon tunggu proses spin selesai.' });
    }
    lastRollTime.set(req.user.uid, now);

    const spinCost = Number(selectedCase.price || 0);

    await client.query('BEGIN');

    const accountCheck = await client.query(
      'SELECT balance FROM users.accounts WHERE uid = $1 FOR UPDATE',
      [req.user.uid]
    );

    if (!accountCheck.rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Akun tidak ditemukan' });
    }

    const currentBalance = parseFloat(accountCheck.rows[0].balance || 0);

    if (currentBalance < spinCost) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Saldo tidak mencukupi untuk melakukan spin ini' });
    }

    const updateResult = await client.query(
      'UPDATE users.accounts SET balance = balance - $1 WHERE uid = $2 RETURNING balance',
      [spinCost, req.user.uid]
    );

    const wonCount = Math.max(1, parseInt(wonItem.count, 10) || 1);
    const wonWorth = Number(wonItem.worth || 0);

    await client.query(
      `INSERT INTO users.backpack (uid, item_id, item_name, count, worth, rarity, color)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (uid, item_id)
       DO UPDATE SET 
         count = users.backpack.count + EXCLUDED.count,
         worth = EXCLUDED.worth,
         updated_at = NOW()`,
      [
        req.user.uid,
        wonItem.itemId,
        wonItem.name,
        wonCount,
        wonWorth,
        wonItem.rarity || 'common',
        wonItem.color || '#4b69ff'
      ]
    );

    await client.query('COMMIT');

    const newBalance = updateResult.rows[0].balance;

    res.json({
      success: true,
      item: wonItem,
      spinCost,
      balance: newBalance,
      message: `Selamat! Anda mendapatkan ${wonItem.name} (x${wonCount}) bernilai $${wonWorth.toFixed(2)}! Item telah masuk ke Backpack Anda.`
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Roll error:', err);
    res.status(500).json({ error: 'Gagal memproses roll gacha' });
  } finally {
    client.release();
  }
});

router.get('/backpack', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, item_id, item_name, count, worth, rarity, color, updated_at
       FROM users.backpack
       WHERE uid = $1 AND count > 0
       ORDER BY worth DESC, count DESC`,
      [req.user.uid]
    );

    const totalWorth = rows.reduce((sum, it) => sum + (Number(it.worth || 0) * Number(it.count || 0)), 0);
    const totalCount = rows.reduce((sum, it) => sum + Number(it.count || 0), 0);

    res.json({
      items: rows,
      totalCount,
      totalWorth: parseFloat(totalWorth.toFixed(2))
    });
  } catch (err) {
    console.error('Get backpack error:', err);
    res.status(500).json({ error: 'Gagal memuat data backpack' });
  }
});

router.post('/backpack/redeem', requireAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Pilih minimal satu item untuk di-redeem' });
    }

    await client.query('BEGIN');

    const redeemedLines = [];

    for (const reqItem of items) {
      const targetItemId = parseInt(reqItem.itemId, 10);
      const targetQty = Math.max(1, parseInt(reqItem.quantity, 10) || 1);

      if (!targetItemId || isNaN(targetItemId)) continue;

      const itemRow = await client.query(
        'SELECT id, item_id, item_name, count, worth, rarity FROM users.backpack WHERE uid = $1 AND item_id = $2 FOR UPDATE',
        [req.user.uid, targetItemId]
      );

      if (!itemRow.rows[0] || itemRow.rows[0].count < targetQty) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Jumlah item '${itemRow.rows[0]?.item_name || targetItemId}' di backpack tidak mencukupi!`
        });
      }

      const currentCount = itemRow.rows[0].count;
      if (currentCount - targetQty <= 0) {
        await client.query('DELETE FROM users.backpack WHERE id = $1', [itemRow.rows[0].id]);
      } else {
        await client.query('UPDATE users.backpack SET count = count - $1, updated_at = NOW() WHERE id = $2', [
          targetQty,
          itemRow.rows[0].id
        ]);
      }

      redeemedLines.push({
        item_id: targetItemId,
        item_name: itemRow.rows[0].item_name,
        quantity: targetQty,
        worth: Number(itemRow.rows[0].worth || 0)
      });
    }

    if (redeemedLines.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Tidak ada item yang dapat di-redeem' });
    }

    await client.query('COMMIT');

    const purchaseFolder = paymentDir;
    if (!fs.existsSync(purchaseFolder)) {
      fs.mkdirSync(purchaseFolder, { recursive: true });
    }

    const growid = req.user.grow_id;
    const filepath = path.join(purchaseFolder, `${growid}.json`);

    let playerData = {
      total_spent: 0,
      total_usd: 0,
      purchases: []
    };

    if (fs.existsSync(filepath)) {
      try {
        playerData = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      } catch {
        console.error('Corrupted payment file:', filepath);
      }
    }

    const orderId = `REDEEM-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const paidAt = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour12: false,
    });

    const orderItems = redeemedLines.map((it) => ({
      productId: String(it.item_id),
      quantity: it.quantity,
      unitPrice: it.worth,
      lineTotal: Number((it.worth * it.quantity).toFixed(2))
    }));

    const rewards = {};
    redeemedLines.forEach((it) => {
      rewards[String(it.item_id)] = it.quantity;
    });

    playerData.purchases.push({
      orderId,
      productId: 'backpack_redeem',
      price: 0,
      usd: 0,
      subtotal: 0,
      promoCode: 'REDEEM_BACKPACK',
      promoDiscount: 0,
      items: orderItems,
      rewards,
      paidAt
    });

    fs.writeFileSync(filepath, JSON.stringify(playerData, null, 2));

    res.json({
      success: true,
      message: `Berhasil me-redeem ${redeemedLines.length} jenis item ke in-game (${growid})! Item akan langsung dikirim ke game.`,
      redeemed: redeemedLines
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Redeem error:', err);
    res.status(500).json({ error: 'Gagal memproses redeem ke in-game' });
  } finally {
    client.release();
  }
});

router.post('/backpack/sell', requireAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    if (!verifyApiKeyIfPresent(req)) return res.status(403).json({ error: 'Forbidden' });

    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Pilih minimal satu item untuk dijual ke balance' });
    }

    await client.query('BEGIN');

    let totalEarned = 0;
    const soldItems = [];

    for (const reqItem of items) {
      const targetItemId = parseInt(reqItem.itemId, 10);
      const targetQty = Math.max(1, parseInt(reqItem.quantity, 10) || 1);

      if (!targetItemId || isNaN(targetItemId)) continue;

      const itemRow = await client.query(
        'SELECT id, item_id, item_name, count, worth FROM users.backpack WHERE uid = $1 AND item_id = $2 FOR UPDATE',
        [req.user.uid, targetItemId]
      );

      if (!itemRow.rows[0] || itemRow.rows[0].count < targetQty) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Jumlah item '${itemRow.rows[0]?.item_name || targetItemId}' tidak mencukupi untuk dijual!`
        });
      }

      const itemWorth = Number(itemRow.rows[0].worth || 0);
      const lineTotal = Math.round(itemWorth * targetQty * 100) / 100;
      totalEarned += lineTotal;

      const currentCount = itemRow.rows[0].count;
      if (currentCount - targetQty <= 0) {
        await client.query('DELETE FROM users.backpack WHERE id = $1', [itemRow.rows[0].id]);
      } else {
        await client.query(
          'UPDATE users.backpack SET count = count - $1, updated_at = NOW() WHERE id = $2',
          [targetQty, itemRow.rows[0].id]
        );
      }

      soldItems.push({
        item_id: targetItemId,
        item_name: itemRow.rows[0].item_name,
        quantity: targetQty,
        worth: itemWorth,
        lineTotal
      });
    }

    if (soldItems.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Tidak ada item yang dapat dijual' });
    }

    const totalEarnedRounded = Math.round(totalEarned * 100) / 100;
    const updateAcc = await client.query(
      'UPDATE users.accounts SET balance = balance + $1 WHERE uid = $2 RETURNING balance',
      [totalEarnedRounded, req.user.uid]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      earned: totalEarnedRounded,
      balance: updateAcc.rows[0].balance,
      message: `Berhasil menjual ${soldItems.length} jenis item senilai $${totalEarnedRounded.toFixed(2)} ke saldo Anda!`,
      soldItems
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Sell backpack item error:', err);
    res.status(500).json({ error: 'Gagal menjual item ke saldo' });
  } finally {
    client.release();
  }
});

module.exports = router;