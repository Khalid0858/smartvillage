require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/database');

const app = express();

// Connect Database
connectDB();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'SmartVillage API', timestamp: new Date() }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/problems',   require('./routes/problem.routes'));
app.use('/api/notices',    require('./routes/notice.routes'));
app.use('/api/services',   require('./routes/service.routes'));
app.use('/api/products',   require('./routes/product.routes'));
app.use('/api/jobs',       require('./routes/job.routes'));
app.use('/api/posts',      require('./routes/post.routes'));
app.use('/api/donations',  require('./routes/donation.routes'));
app.use('/api/emergency',  require('./routes/emergency.routes'));
app.use('/api/agriculture',require('./routes/agriculture.routes'));
app.use('/api/admin',      require('./routes/admin.routes'));

// Global Error Handler
app.use(require('./middleware/errorHandler'));

module.exports = app;
