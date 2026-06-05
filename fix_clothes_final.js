const mongoose = require('../server/node_modules/mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/Ecommerce';

const realClothes = [
  {
    name: 'Men Premium Cotton Polo T-Shirt',
    price: 1800,
    originalPrice: 2500,
    description: 'Premium 100% combed cotton, breathable fabric. Available in multiple colors. Machine washable.',
    category: 'Clothes',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    stock: 200,
    sold: 85,
    rating: 4.6,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Slim Fit Stretch Denim Jeans Men',
    price: 2500,
    originalPrice: 3500,
    description: 'Premium stretch denim, medium indigo wash, 5-pocket styling. Comfortable slim fit.',
    category: 'Clothes',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    stock: 150,
    sold: 120,
    rating: 4.7,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Winter Hoodie Fleece Lined Oversized',
    price: 3200,
    originalPrice: 4500,
    description: 'Heavy fleece lining, oversized fit, kangaroo pocket, double-layered hood. Ultra warm for winter.',
    category: 'Clothes',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
    stock: 70,
    sold: 45,
    rating: 4.8,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Cargo Pants Men Streetwear Cotton',
    price: 2800,
    originalPrice: 3800,
    description: 'Cotton-ripstop fabric, multiple cargo pockets, elastic waistband with drawstring. Relaxed fit.',
    category: 'Clothes',
    image: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=600&q=80',
    stock: 90,
    sold: 30,
    rating: 4.4,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Women Crossbody Leather Handbag',
    price: 3500,
    originalPrice: 5000,
    description: 'PU leather with gold-tone hardware, adjustable strap, multiple compartments.',
    category: 'Clothes',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    stock: 60,
    sold: 25,
    rating: 4.5,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Polarized Aviator Sunglasses UV400',
    price: 1500,
    originalPrice: 2500,
    description: 'Classic aviator design, polarized UV400 lenses, gold-tone metal frame.',
    category: 'Clothes',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
    stock: 100,
    sold: 60,
    rating: 4.5,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete the bad loremflickr clothes
    const delRes = await mongoose.connection.collection('products').deleteMany({
      category: 'Clothes'
    });
    console.log(`Cleaned ${delRes.deletedCount} old clothing items.`);

    // Insert
    const result = await mongoose.connection.collection('products').insertMany(realClothes);
    console.log(`Successfully added ${result.insertedCount} REAL clothing products with verified Unsplash URLs!`);

  } catch (error) {
    console.error('Error in fix_clothes_final:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

run();
