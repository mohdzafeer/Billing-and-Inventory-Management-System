const Redis = require('ioredis')

let client = null

function getRedisClient() {
  if (!client) {
    const url = process.env.REDIS_URL || 'redis://localhost:6379'
    client = new Redis(url, {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
    })
    client.on('connect', () => console.log('Redis connected'))
    client.on('error', (err) => console.warn('Redis error:', err.message))
  }
  return client
}

module.exports = { getRedisClient }
