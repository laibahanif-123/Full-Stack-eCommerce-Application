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
        downloadImage(response.headers.location, filename).then(resolve).catch(reject);
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

// Very reliable, non-blocking image URLs
const imageSources = {
  clothes: [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507679622140-615bd279785c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ebd?auto=format&fit=crop&w=600&q=80'
  ],
  makeup: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512496015851-a1c8485f7560?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1590156546946-cb5afcf42250?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'
  ]
};

async function fixAllImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // First delete all Clothes and Makeup to have a perfectly clean slate
    await mongoose.connection.collection('products').deleteMany({
      category: { $in: ['Clothes', 'Makeup'] }
    });
    console.log('Cleaned old clothes and makeup products.');

    // Download images and prepare products
    const newProducts = [];
    
    // Create 5 clothes
    for (let i = 0; i < 5; i++) {
      const filename = `clothes_${i}.jpg`;
      const localUrl = await downloadImage(imageSources.clothes[i], filename);
      newProducts.push({
        name: `Premium Clothing Item ${i+1}`,
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
      console.log(`Prepared clothing ${i+1}`);
    }

    // Create 5 makeup
    for (let i = 0; i < 5; i++) {
      const filename = `makeup_${i}.jpg`;
      const localUrl = await downloadImage(imageSources.makeup[i], filename);
      newProducts.push({
        name: `Luxury Makeup Item ${i+1}`,
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
      console.log(`Prepared makeup ${i+1}`);
    }

    // Insert new products
    const result = await mongoose.connection.collection('products').insertMany(newProducts);
    console.log(`Successfully added ${result.insertedCount} foolproof local-image products!`);

  } catch (error) {
    console.error('Error fixing images:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixAllImages();
