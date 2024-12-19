const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

// import routes
const postsRoutes = require('./routes/posts');

const PORT = process.env.PORT || 5000;

const app = express();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// middlewares
app.use(bodyParser.json());
app.use(morgan("combined"));

// connect to mongo
connectDB();

// define routes
app.get('/', (req, res) => {
  res.json({"status": "healthy"});
});

app.use('/api/posts', postsRoutes);

module.exports = app;
