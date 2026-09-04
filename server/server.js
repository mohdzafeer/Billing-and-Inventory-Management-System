require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    ...(process.env.CLIENT_URL_PROD ? [process.env.CLIENT_URL_PROD] : [])
]

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (Postman, mobile apps, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))

app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/bills', require('./routes/bills'))
app.use('/api/settings', require('./routes/settings'))
app.use('/api/members', require('./routes/members'))

app.get('/', (req, res) => res.send('BizManager API is running'))

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})