const fs = require('fs');
const path = require('path');
const https = require('https');
const mongoose = require('../server/node_modules/mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/Ecommerce';

const publicImagesDir = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(publicImagesDir, filename);
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Handle redirects
        let newUrl = response.headers.location;
        if (newUrl.startsWith('/')) {
            newUrl = 'https://loremflickr.com' + newUrl; // In case of relative redirect
        }
        downloadImage(newUrl, filename).then(resolve).catch(reject);
      } else if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(`/images/products/${filename}`);
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clean all 3 categories
    await mongoose.connection.collection('products').deleteMany({
      category: { $in: ['Clothes', 'Makeup', 'Toys'] }
    });
    console.log('Cleaned old clothes, makeup, and toys products.');

    const newProducts = [];
    
    // Clothes
    for (let i = 1; i <= 6; i++) {
      const filename = `clothes_final_${i}.jpg`;
      const localUrl = await downloadImage(`https://loremflickr.com/600/800/fashion,clothing?random=${i}`, filename);
      newProducts.push({
        name: `Premium Men/Women Fashion Style ${i}`,
        price: 2500 + (i * 500),
        originalPrice: 3500 + (i * 500),
        description: 'High quality premium clothing item, perfect for everyday wear. Comfortable and stylish.',
        category: 'Clothes',
        image: localUrl,
        stock: 50,
        sold: 20,
        rating: 4.8,
        reviews: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Prepared clothing ${i}`);
    }

    // Makeup
    for (let i = 1; i <= 6; i++) {
      const filename = `makeup_final_${i}.jpg`;
      const localUrl = await downloadImage(`https://loremflickr.com/600/800/makeup,cosmetics?random=${i}`, filename);
      newProducts.push({
        name: `Luxury Makeup Kit Edition ${i}`,
        price: 1500 + (i * 300),
        originalPrice: 2000 + (i * 300),
        description: 'Professional grade makeup item. Long-lasting, high-quality ingredients for a flawless finish.',
        category: 'Makeup',
        image: localUrl,
        stock: 80,
        sold: 45,
        rating: 4.7,
        reviews: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Prepared makeup ${i}`);
    }

    // Toys
    for (let i = 1; i <= 6; i++) {
      const filename = `toys_final_${i}.jpg`;
      const localUrl = await downloadImage(`https://loremflickr.com/600/800/toy,kids?random=${i}`, filename);
      newProducts.push({
        name: `Fun Kids Toy Playset ${i}`,
        price: 1200 + (i * 200),
        originalPrice: 1800 + (i * 200),
        description: 'Engaging, educational and fun toy set for kids. Made with safe, high-quality materials.',
        category: 'Toys',
        image: localUrl,
        stock: 45,
        sold: 15,
        rating: 4.6,
        reviews: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Prepared toy ${i}`);
    }

    // Insert
    if (newProducts.length > 0) {
      const result = await mongoose.connection.collection('products').insertMany(newProducts);
      console.log(`Successfully added ${result.insertedCount} products with LOCAL images!`);
    }

  } catch (error) {
    console.error('Error in final fix:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
