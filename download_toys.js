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

const toysData = {
  broken: [
    {
      name: 'STEM Building Blocks Set 500+ Pieces Educational',
      url: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Wooden Forest Adventure Play Set',
      url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'
    }
  ],
  new: [
    {
      name: 'Interactive Smart Robot Toy',
      price: 4500,
      originalPrice: 6000,
      description: 'Programmable smart robot with voice control, dancing features, and interactive learning games.',
      url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Kids Educational Learning Tablet',
      price: 3200,
      originalPrice: 4500,
      description: 'Pre-loaded with math, spelling, and logic games. Features parental controls and eye-protection screen.',
      url: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Remote Control Helicopter',
      price: 2800,
      originalPrice: 4000,
      description: 'Easy-to-fly RC helicopter with altitude hold, one-key takeoff/landing, and LED lights.',
      url: 'https://images.unsplash.com/photo-1576404918712-4f3583c270d4?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Giant Stuffed Dinosaur',
      price: 1500,
      originalPrice: 2200,
      description: 'Super soft, 2-foot tall plush dinosaur. Hypoallergenic and perfect for hugging.',
      url: 'https://images.unsplash.com/photo-1559564483-36fa8c07e0c4?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Outdoor Water Gun Set (2 Pack)',
      price: 1200,
      originalPrice: 1800,
      description: 'High-capacity water blasters with 30-foot range. Perfect for summer pool parties and outdoor fun.',
      url: 'https://images.unsplash.com/photo-1570183183062-87856d3527a0?auto=format&fit=crop&w=600&q=80'
    }
  ]
};

async function fixAndAddToys() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Fix broken toys
    for (let i = 0; i < toysData.broken.length; i++) {
      const toy = toysData.broken[i];
      const filename = `broken_toy_${i}.jpg`;
      const localUrl = await downloadImage(toy.url, filename);
      await mongoose.connection.collection('products').updateMany(
        { name: toy.name },
        { $set: { image: localUrl } }
      );
      console.log(`Fixed image for ${toy.name}`);
    }

    // 2. Add new toys
    const newProductsToInsert = [];
    for (let i = 0; i < toysData.new.length; i++) {
      const toy = toysData.new[i];
      const filename = `new_toy_${i}.jpg`;
      const localUrl = await downloadImage(toy.url, filename);
      
      newProductsToInsert.push({
        name: toy.name,
        price: toy.price,
        originalPrice: toy.originalPrice,
        description: toy.description,
        category: 'Toys',
        image: localUrl,
        stock: 45 + (i * 10),
        sold: 15 + i,
        rating: 4.5 + (i % 5)*0.1,
        reviews: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Prepared new toy: ${toy.name}`);
    }

    if (newProductsToInsert.length > 0) {
      const result = await mongoose.connection.collection('products').insertMany(newProductsToInsert);
      console.log(`Successfully added ${result.insertedCount} new toys!`);
    }

  } catch (error) {
    console.error('Error fixing/adding toys:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixAndAddToys();
