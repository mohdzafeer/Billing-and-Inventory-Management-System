const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      id: decoded.id,
      role: decoded.role || 'admin',
      orgId: decoded.orgId || decoded.id,
    }
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
