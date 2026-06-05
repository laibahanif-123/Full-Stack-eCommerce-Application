const mongoose = require('../server/node_modules/mongoose');
const https = require('https');

const MONGODB_URI = 'mongodb://localhost:27017/Ecommerce';

function verifyImage(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302);
    }).on('error', () => {
      resolve(false);
    });
  });
}

const moreMakeupProducts = [
  {
    name: 'Luxury Setting Powder',
    price: 3200,
    originalPrice: 4500,
    description: 'Translucent setting powder for a flawless, airbrushed finish that lasts all day.',
    category: 'Makeup',
    image: 'https://images.pexels.com/photos/1373305/pexels-photo-1373305.jpeg', // We will replace if invalid
    stock: 45,
    sold: 12,
    rating: 4.8,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    fallback: 'https://images.unsplash.com/photo-1590156546946-cb5afcf42250?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Waterproof Eyeliner Pen',
    price: 850,
    originalPrice: 1200,
    description: 'Ultra-precise waterproof liquid eyeliner for the perfect winged look.',
    category: 'Makeup',
    image: 'https://images.unsplash.com/photo-1631214499912-14eb58c56fa7?auto=format&fit=crop&w=600&q=80',
    stock: 120,
    sold: 80,
    rating: 4.6,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    fallback: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Hydrating Lip Gloss',
    price: 950,
    originalPrice: 1500,
    description: 'Non-sticky, hydrating lip gloss with a beautiful shimmery finish.',
    category: 'Makeup',
    image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg', 
    stock: 65,
    sold: 25,
    rating: 4.7,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    fallback: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Blush & Bronzer Duo',
    price: 1800,
    originalPrice: 2500,
    description: 'Compact duo featuring a peachy blush and warm bronzer for a sun-kissed look.',
    category: 'Makeup',
    image: 'https://images.unsplash.com/photo-1512496015851-a1c8485f7560?auto=format&fit=crop&w=600&q=80',
    stock: 40,
    sold: 15,
    rating: 4.5,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    fallback: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Makeup Primer',
    price: 2100,
    originalPrice: 3000,
    description: 'Pore-minimizing primer that creates a smooth canvas for makeup application.',
    category: 'Makeup',
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80',
    stock: 55,
    sold: 20,
    rating: 4.8,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    fallback: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80'
  }
];

const knownGoodImages = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1512496015851-a1c8485f7560?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1590156546946-cb5afcf42250?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80'
];

async function seedMakeup() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // First let's fix the broken one: 'Professional 15-Piece Makeup Brush Set'
    console.log('Fixing the broken image for Professional 15-Piece Makeup Brush Set...');
    await mongoose.connection.collection('products').updateMany(
      { name: 'Professional 15-Piece Makeup Brush Set' },
      { $set: { image: knownGoodImages[0] } }
    );
    console.log('Fixed!');

    // Now let's verify and prepare the new products
    console.log('Verifying images for new products...');
    let goodIndex = 1;
    for (const product of moreMakeupProducts) {
      const isValid = await verifyImage(product.image);
      if (!isValid) {
        product.image = product.fallback || knownGoodImages[goodIndex % knownGoodImages.length];
        goodIndex++;
      }
      delete product.fallback; // remove temporary key
    }

    // Insert the new makeup products
    const result = await mongoose.connection.collection('products').insertMany(moreMakeupProducts);
    
    console.log(`Successfully added ${result.insertedCount} new makeup products!`);
    
  } catch (error) {
    console.error('Error adding products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedMakeup();
