// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');


const app = express();
app.use(cors());



app.get('/:code', async (req, res, next) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (!url) return res.status(404).json({ message: 'URL not found' });

    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl); 
  } catch (error) {
    next(error);
  }
});


app.use('/auth', userRoutes);


app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI =process.env.MONGODB_URI
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('Connected to MongoDB');

    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}



startServer()
