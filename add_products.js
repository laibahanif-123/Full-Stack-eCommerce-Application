const mongoose = require('../server/node_modules/mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/Ecommerce';

const newProducts = [
  // Clothes
  {
    name: 'Men\'s Denim Jacket Classic Fit',
    price: 4500,
    originalPrice: 6000,
    description: 'Classic blue denim jacket with a comfortable fit. Perfect for layering in any season.',
    category: 'Clothes',
    image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ebd?auto=format&fit=crop&w=600&q=80',
    stock: 40,
    sold: 12,
    rating: 4.6,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Women\'s High-Waisted Skinny Jeans',
    price: 3200,
    originalPrice: 4000,
    description: 'Stretchable high-waisted skinny jeans. Comfortable and stylish for daily wear.',
    category: 'Clothes',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    stock: 60,
    sold: 25,
    rating: 4.5,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Unisex Graphic Print Hoodie',
    price: 2800,
    originalPrice: 3500,
    description: 'Warm and cozy hoodie with a unique graphic print. Made from premium fleece cotton.',
    category: 'Clothes',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
    stock: 80,
    sold: 40,
    rating: 4.8,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Men\'s Formal Suit Slim Fit',
    price: 15000,
    originalPrice: 20000,
    description: 'Elegant two-piece slim fit suit. Perfect for weddings, business meetings, and formal events.',
    category: 'Clothes',
    image: 'https://images.unsplash.com/photo-1594938298596-c300705a61ce?auto=format&fit=crop&w=600&q=80',
    stock: 15,
    sold: 5,
    rating: 4.9,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Women\'s Silk Evening Gown',
    price: 8500,
    originalPrice: 12000,
    description: 'Luxurious silk evening gown with an elegant drape and a flattering silhouette.',
    category: 'Clothes',
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80',
    stock: 20,
    sold: 8,
    rating: 4.7,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Basic White T-Shirt 3-Pack',
    price: 1500,
    originalPrice: 2100,
    description: 'Pack of 3 essential white t-shirts. 100% breathable cotton.',
    category: 'Clothes',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
    stock: 150,
    sold: 85,
    rating: 4.4,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // Makeup
  {
    name: 'Luminous Foundation SPF 30',
    price: 2500,
    originalPrice: 3200,
    description: 'Medium-to-full coverage foundation with a glowing, natural finish and sun protection.',
    category: 'Makeup',
    image: 'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?auto=format&fit=crop&w=600&q=80',
    stock: 45,
    sold: 30,
    rating: 4.6,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Volumizing Waterproof Mascara',
    price: 900,
    originalPrice: 1200,
    description: 'Intense black, waterproof mascara that adds volume and length without clumping.',
    category: 'Makeup',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    stock: 80,
    sold: 65,
    rating: 4.5,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Highlighter Glow Kit',
    price: 3500,
    originalPrice: 4500,
    description: 'Palette of 4 illuminating highlighters for a radiant, lit-from-within glow.',
    category: 'Makeup',
    image: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    sold: 10,
    rating: 4.8,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Hydrating Lip Balm with Tint',
    price: 600,
    originalPrice: 800,
    description: 'Nourishing lip balm that provides long-lasting hydration and a sheer pop of color.',
    category: 'Makeup',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
    stock: 120,
    sold: 95,
    rating: 4.7,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Professional Makeup Brush Set (12 Pcs)',
    price: 4200,
    originalPrice: 5500,
    description: 'Complete set of 12 premium synthetic makeup brushes for face and eyes, with a leather case.',
    category: 'Makeup',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    stock: 35,
    sold: 15,
    rating: 4.9,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Matte Setting Spray 100ml',
    price: 1800,
    originalPrice: 2200,
    description: 'Weightless setting spray that locks makeup in place all day with a shine-free matte finish.',
    category: 'Makeup',
    image: 'https://images.unsplash.com/photo-1631214499912-14eb58c56fa7?auto=format&fit=crop&w=600&q=80',
    stock: 50,
    sold: 22,
    rating: 4.6,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Use the native collection to bypass Mongoose schema validation
    const result = await mongoose.connection.collection('products').insertMany(newProducts);
    
    console.log(`Successfully added ${result.insertedCount} new products!`);
    
    // Let's also fix the images of the previous 4 products
    await mongoose.connection.collection('products').updateMany(
      { name: "Men's Casual Cotton Shirt" },
      { $set: { image: 'https://images.unsplash.com/photo-1596755094514-f87e32f0822d?auto=format&fit=crop&w=600&q=80' } }
    );
    await mongoose.connection.collection('products').updateMany(
      { name: "Women's Summer Floral Dress" },
      { $set: { image: 'https://images.unsplash.com/photo-1572804013309-27a88b4a11c8?auto=format&fit=crop&w=600&q=80' } }
    );
    await mongoose.connection.collection('products').updateMany(
      { name: "Pro Matte Liquid Lipstick" },
      { $set: { image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80' } }
    );
    await mongoose.connection.collection('products').updateMany(
      { name: "Eyeshadow Palette 18 Colors" },
      { $set: { image: 'https://images.unsplash.com/photo-1512496015851-a1c8485f7560?auto=format&fit=crop&w=600&q=80' } }
    );
    
    console.log('Fixed broken images of existing products.');
  } catch (error) {
    console.error('Error adding products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedProducts();
