const { MongoClient, ObjectId } = require('mongodb');

// MongoDB Connection
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db;

// Kết nối MongoDB
async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      db = client.db('toyota');
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }
  return db;
}

// Đọc data từ JSON files (fallback)
const fs = require('fs');
const path = require('path');
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'cars.json'), 'utf-8'));
const newsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'news.json'), 'utf-8'));
const promotionsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'promotions.json'), 'utf-8'));

module.exports = {
  // Cars (từ JSON)
  getAllCars: () => carsData,
  
  getCarById: (id) => carsData.find(car => car.id === id),
  
  getCarBySlug: (slug) => carsData.find(car => car.slug === slug),
  
  getFeaturedCars: () => carsData.filter(car => car.featured),
  
  updateCar: async (carData) => {
    try {
      const database = await connectDB();
      const result = await database.collection('cars').updateOne(
        { id: carData.id },
        { $set: carData },
        { upsert: true }
      );
      return { changes: result.modifiedCount || result.upsertedCount };
    } catch (error) {
      console.error('Error updating car:', error);
      return { changes: 0 };
    }
  },
  
  // News (từ JSON)
  getAllNews: () => newsData,
  
  getNewsById: (id) => newsData.find(news => news.id === id),
  
  getLatestNews: (limit = 3) => newsData.slice(0, limit),
  
  // Promotions (từ JSON)
  getAllPromotions: () => promotionsData,
  
  getActivePromotions: (limit = 2) => promotionsData.slice(0, limit),
  
  // Test Drives - PERSISTENT MongoDB
  createTestDrive: async (data) => {
    try {
      const database = await connectDB();
      const result = await database.collection('test_drives').insertOne({
        ...data,
        created_at: new Date()
      });
      return { lastInsertRowid: result.insertedId };
    } catch (error) {
      console.error('Error creating test drive:', error);
      throw error;
    }
  },
  
  getAllTestDrives: async () => {
    try {
      const database = await connectDB();
      return await database.collection('test_drives')
        .find()
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      console.error('Error getting test drives:', error);
      return [];
    }
  },
  
  // Quotes - PERSISTENT MongoDB
  createQuote: async (data) => {
    try {
      const database = await connectDB();
      const result = await database.collection('quotes').insertOne({
        ...data,
        created_at: new Date()
      });
      return { lastInsertRowid: result.insertedId };
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
  },
  
  getAllQuotes: async () => {
    try {
      const database = await connectDB();
      return await database.collection('quotes')
        .find()
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      console.error('Error getting quotes:', error);
      return [];
    }
  },
  
  // Contacts - PERSISTENT MongoDB
  createContact: async (data) => {
    try {
      const database = await connectDB();
      const result = await database.collection('contacts').insertOne({
        ...data,
        created_at: new Date()
      });
      return { lastInsertRowid: result.insertedId };
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },
  
  getAllContacts: async () => {
    try {
      const database = await connectDB();
      return await database.collection('contacts')
        .find()
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      console.error('Error getting contacts:', error);
      return [];
    }
  },
  
  getContactById: async (id) => {
    try {
      const database = await connectDB();
      return await database.collection('contacts').findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error('Error getting contact:', error);
      return null;
    }
  },
  
  deleteContact: async (id) => {
    try {
      const database = await connectDB();
      const result = await database.collection('contacts').deleteOne({ _id: new ObjectId(id) });
      return { changes: result.deletedCount };
    } catch (error) {
      console.error('Error deleting contact:', error);
      return { changes: 0 };
    }
  },
  
  searchContacts: async (keyword) => {
    try {
      const database = await connectDB();
      const search = keyword.toLowerCase();
      return await database.collection('contacts')
        .find({
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { message: { $regex: search, $options: 'i' } }
          ]
        })
        .sort({ created_at: -1 })
        .toArray();
    } catch (error) {
      console.error('Error searching contacts:', error);
      return [];
    }
  }
};
