const fs = require('fs');
const path = require('path');

// Đọc dữ liệu từ JSON files
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'cars.json'), 'utf-8'));
const newsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'news.json'), 'utf-8'));
const promotionsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'promotions.json'), 'utf-8'));

// In-memory storage cho production (Vercel)
let testDrives = [];
let quotes = [];
let contacts = [];

module.exports = {
  // Cars
  getAllCars: () => carsData,
  
  getCarById: (id) => carsData.find(car => car.id === id),
  
  getCarBySlug: (slug) => carsData.find(car => car.slug === slug),
  
  getFeaturedCars: () => carsData.filter(car => car.featured),
  
  updateCar: (carData) => {
    const index = carsData.findIndex(car => car.id === carData.id);
    if (index !== -1) {
      carsData[index] = { ...carsData[index], ...carData };
      // Save to file for persistence
      try {
        fs.writeFileSync(
          path.join(__dirname, 'cars.json'),
          JSON.stringify(carsData, null, 2)
        );
      } catch (err) {
        console.error('Cannot write to file in serverless environment');
      }
      return { changes: 1 };
    }
    return { changes: 0 };
  },
  
  // News
  getAllNews: () => newsData,
  
  getNewsById: (id) => newsData.find(news => news.id === id),
  
  getLatestNews: (limit = 3) => newsData.slice(0, limit),
  
  // Promotions
  getAllPromotions: () => promotionsData,
  
  getActivePromotions: (limit = 2) => promotionsData.slice(0, limit),
  
  // Test Drives
  createTestDrive: (data) => {
    const newTestDrive = {
      id: testDrives.length + 1,
      ...data,
      created_at: new Date().toISOString()
    };
    testDrives.push(newTestDrive);
    return { lastInsertRowid: newTestDrive.id };
  },
  
  getAllTestDrives: () => testDrives.sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  ),
  
  // Quotes
  createQuote: (data) => {
    const newQuote = {
      id: quotes.length + 1,
      ...data,
      created_at: new Date().toISOString()
    };
    quotes.push(newQuote);
    return { lastInsertRowid: newQuote.id };
  },
  
  getAllQuotes: () => quotes.sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  ),
  
  // Contacts
  createContact: (data) => {
    const newContact = {
      id: contacts.length + 1,
      ...data,
      created_at: new Date().toISOString()
    };
    contacts.push(newContact);
    return { lastInsertRowid: newContact.id };
  },
  
  getAllContacts: () => contacts.sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  ),
  
  getContactById: (id) => contacts.find(contact => contact.id === id),
  
  deleteContact: (id) => {
    const index = contacts.findIndex(contact => contact.id === id);
    if (index !== -1) {
      contacts.splice(index, 1);
      return { changes: 1 };
    }
    return { changes: 0 };
  },
  
  searchContacts: (keyword) => {
    const search = keyword.toLowerCase();
    return contacts.filter(contact => 
      (contact.name && contact.name.toLowerCase().includes(search)) ||
      (contact.phone && contact.phone.includes(search)) ||
      (contact.email && contact.email.toLowerCase().includes(search)) ||
      (contact.message && contact.message.toLowerCase().includes(search))
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};
