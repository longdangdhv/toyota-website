const fs = require('fs');
const path = require('path');

// Đường dẫn các file JSON
const carsFile = path.join(__dirname, 'cars.json');
const newsFile = path.join(__dirname, 'news.json');
const promotionsFile = path.join(__dirname, 'promotions.json');
const testDrivesFile = path.join(__dirname, 'data-test-drives.json');
const quotesFile = path.join(__dirname, 'data-quotes.json');
const contactsFile = path.join(__dirname, 'data-contacts.json');
const imagesFile = path.join(__dirname, 'data-images.json');
const showroomFile = path.join(__dirname, 'data-showroom.json');

// Đọc dữ liệu từ file
const readJSON = (filePath, defaultValue = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
};

// Ghi dữ liệu vào file
const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Đọc dữ liệu ban đầu
const carsData = readJSON(carsFile);
const newsData = readJSON(newsFile);
const promotionsData = readJSON(promotionsFile);

module.exports = {
  // Cars
  getAllCars: () => carsData,
  
  getCarById: (id) => carsData.find(car => car.id === id),
  
  getCarBySlug: (slug) => carsData.find(car => car.slug === slug),
  
  getFeaturedCars: () => carsData.filter(car => car.featured),
  
  addCar: (carData) => {
    carsData.push(carData);
    writeJSON(carsFile, carsData);
    return { lastInsertRowid: carData.id };
  },
  
  updateCar: (carData) => {
    const index = carsData.findIndex(car => car.id === carData.id);
    if (index !== -1) {
      // Giữ lại specs, features, colors, versions từ xe cũ
      const oldCar = carsData[index];
      carsData[index] = { 
        ...oldCar,
        ...carData,
        // Đảm bảo không mất các field quan trọng
        specs: carData.specs || oldCar.specs,
        features: carData.features || oldCar.features,
        colors: carData.colors || oldCar.colors,
        versions: carData.versions || oldCar.versions
      };
      writeJSON(carsFile, carsData);
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
  
  // Test Drives - LƯU VÀO FILE
  createTestDrive: (data) => {
    const testDrives = readJSON(testDrivesFile);
    const newTestDrive = {
      id: testDrives.length > 0 ? Math.max(...testDrives.map(t => t.id || 0)) + 1 : 1,
      ...data,
      created_at: new Date().toISOString()
    };
    testDrives.push(newTestDrive);
    writeJSON(testDrivesFile, testDrives);
    return { lastInsertRowid: newTestDrive.id };
  },
  
  getAllTestDrives: () => {
    const testDrives = readJSON(testDrivesFile);
    return testDrives.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  
  // Quotes - LƯU VÀO FILE
  createQuote: (data) => {
    const quotes = readJSON(quotesFile);
    const newQuote = {
      id: quotes.length > 0 ? Math.max(...quotes.map(q => q.id || 0)) + 1 : 1,
      ...data,
      created_at: new Date().toISOString()
    };
    quotes.push(newQuote);
    writeJSON(quotesFile, quotes);
    return { lastInsertRowid: newQuote.id };
  },
  
  getAllQuotes: () => {
    const quotes = readJSON(quotesFile);
    return quotes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  
  // Contacts - LƯU VÀO FILE
  createContact: (data) => {
    const contacts = readJSON(contactsFile);
    const newContact = {
      id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id || 0)) + 1 : 1,
      ...data,
      created_at: new Date().toISOString()
    };
    contacts.push(newContact);
    writeJSON(contactsFile, contacts);
    return { lastInsertRowid: newContact.id };
  },
  
  getAllContacts: () => {
    const contacts = readJSON(contactsFile);
    return contacts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  
  getContactById: (id) => {
    const contacts = readJSON(contactsFile);
    return contacts.find(contact => contact.id === parseInt(id));
  },
  
  deleteContact: (id) => {
    const contacts = readJSON(contactsFile);
    const filteredContacts = contacts.filter(contact => contact.id !== parseInt(id));
    if (contacts.length !== filteredContacts.length) {
      writeJSON(contactsFile, filteredContacts);
      return { changes: 1 };
    }
    return { changes: 0 };
  },
  
  searchContacts: (keyword) => {
    const contacts = readJSON(contactsFile);
    const search = keyword.toLowerCase();
    return contacts.filter(contact => 
      (contact.name && contact.name.toLowerCase().includes(search)) ||
      (contact.phone && contact.phone.includes(search)) ||
      (contact.email && contact.email.toLowerCase().includes(search)) ||
      (contact.message && contact.message.toLowerCase().includes(search))
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // Uploaded Images - lưu vào file JSON
  getAllUploadedImages: () => {
    return readJSON(imagesFile, []);
  },

  saveUploadedImage: (name, imageData) => {
    const images = readJSON(imagesFile, []);
    const newImage = {
      id: images.length > 0 ? Math.max(...images.map(i => i.id || 0)) + 1 : 1,
      name,
      image_data: imageData,
      created_at: new Date().toISOString()
    };
    images.push(newImage);
    writeJSON(imagesFile, images);
    return { lastInsertRowid: newImage.id };
  },

  deleteUploadedImage: (id) => {
    const images = readJSON(imagesFile, []);
    const filtered = images.filter(img => img.id !== id);
    writeJSON(imagesFile, filtered);
    return { changes: images.length - filtered.length };
  },

  // Showroom Info
  getShowroomInfo: () => {
    return readJSON(showroomFile, null);
  },

  updateShowroomInfo: (data) => {
    writeJSON(showroomFile, data);
    return { changes: 1 };
  }
};
