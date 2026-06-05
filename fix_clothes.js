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

const fakestoreClothes = [
  {
    name: 'Fjallraven - Foldsack No. 1 Backpack',
    price: 3200,
    originalPrice: 4500,
    description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve.',
    category: 'Clothes',
    url: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
  },
  {
    name: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 1200,
    originalPrice: 1800,
    description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket. Soft cotton blend.',
    category: 'Clothes',
    url: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg'
  },
  {
    name: 'Mens Cotton Jacket',
    price: 4500,
    originalPrice: 6000,
    description: 'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions.',
    category: 'Clothes',
    url: 'https://fakestoreapi.com/img/71li-ujtlHZ._AC_UX679_.jpg'
  },
  {
    name: 'Mens Casual Slim Fit',
    price: 1500,
    originalPrice: 2200,
    description: 'The color could be slightly different between on the screen and in practice. Lightweight.',
    category: 'Clothes',
    url: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg'
  },
  {
    name: 'Womens Bi-Color Short Sleeve T-shirt',
    price: 1300,
    originalPrice: 2000,
    description: '95% Rayon, 5% Spandex. Smooth, stretchy and comfortable fabric.',
    category: 'Clothes',
    url: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg'
  },
  {
    name: 'Womens Faux Leather Moto Biker Jacket',
    price: 5200,
    originalPrice: 7500,
    description: 'Faux leather polyurethane. Water-repellent and windproof. Perfect for biking or casual wear.',
    category: 'Clothes',
    url: 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg'
  }
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete the bad loremflickr clothes
    const delRes = await mongoose.connection.collection('products').deleteMany({
      category: 'Clothes',
      name: { $regex: /Premium Men\/Women Fashion Style/ }
    });
    console.log(`Cleaned ${delRes.deletedCount} weird clothing items.`);

    const newProducts = [];
    
    // Download and prepare Fakestore Clothes
    for (let i = 0; i < fakestoreClothes.length; i++) {
      const item = fakestoreClothes[i];
      const filename = `real_clothes_${i}.jpg`;
      const localUrl = await downloadImage(item.url, filename);
      
      newProducts.push({
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        description: item.description,
        category: 'Clothes',
        image: localUrl,
        stock: 50,
        sold: 25,
        rating: 4.6 + (i * 0.05),
        reviews: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Prepared real clothing item: ${item.name}`);
    }

    // Insert
    if (newProducts.length > 0) {
      const result = await mongoose.connection.collection('products').insertMany(newProducts);
      console.log(`Successfully added ${result.insertedCount} REAL clothing products with LOCAL images!`);
    }

  } catch (error) {
    console.error('Error in fix_clothes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
