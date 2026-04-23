require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const clearDB = async () => {
  try {
    await connectDB();
    console.log('Dropping all collections...');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    for (let collection of collections) {
      await db.collection(collection.name).drop();
      console.log(`Dropped collection: ${collection.name}`);
    }

    console.log('Database cleanly reset.');
    process.exit();
  } catch (error) {
    console.error(`Error clearing database: ${error}`);
    // If db hasn't fully connected, wait a bit or exit
    process.exit(1);
  }
};

// Wait for connection to be fully established by mongoose
mongoose.connection.once('open', () => {
  clearDB();
});

// Since connectDB doesn't return the resolved mongoose connection, 
// we call it, and the once('open') event handler fires.
connectDB();
