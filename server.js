const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cluster = require('cluster');
const os = require('os');

dotenv.config();

const PORT = process.env.PORT || 4002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack-app';

if (cluster.isMaster) {
  const numCPUs = os.cpus().length>3 ? 1 : os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
    cluster.fork();
  });
} else {
  const app = express();

  app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true, // Allows cookies to be sent
  }));
  
  // app.use(cors());
  app.use(express.json());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
  });
  app.use(limiter);

  mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/products', require('./routes/products'));

  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is running on port ${PORT}`);
  });
}