const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();

// import routes
const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth').router;
const communitiesRoutes = require('./routes/communities');
const canvasRoutes = require('./routes/canvas');

const PORT = process.env.PORT || 5000;

const app = express();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// middlewares
app.use(bodyParser.json({ limit: '2mb' }));
app.use(morgan("combined"));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// connect to mongo
connectDB();

// register routes
app.get('/', (_, res) => {
  res.json({ "message": "alive" });
});

app.use('/api/posts', postsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/community', communitiesRoutes);
app.use('/api/canvas', canvasRoutes);

module.exports = app;