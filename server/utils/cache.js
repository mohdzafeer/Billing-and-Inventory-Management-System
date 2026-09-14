const { getRedisClient } = require('../config/redis')

const TTL = {
  SHORT: 300,  // 5 min — products, bills
  LONG: 600,   // 10 min — settings
}

async function getCache(key) {
  try {
    const data = await getRedisClient().get(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

async function setCache(key, value, ttl = TTL.SHORT) {
  try {
    await getRedisClient().setex(key, ttl, JSON.stringify(value))
  } catch {
    // Redis unavailable — requests still work without cache
  }
}

async function delCache(...keys) {
  try {
    await getRedisClient().del(...keys)
  } catch {
    // silently fail
  }
}

module.exports = { getCache, setCache, delCache, TTL }
