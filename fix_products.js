const mongoose = require('../server/node_modules/mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/Ecommerce';

const newProducts = [
  // ================= MEN'S CLOTHES =================
  {
    name: 'Men\'s Premium Formal Suit',
    price: 18500,
    originalPrice: 25000,
    description: 'Elegant tailored slim-fit suit for men. Perfect for weddings, corporate events, and formal gatherings. Includes blazer and trousers.',
    category: 'Clothes',
    image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 25,
    sold: 15,
    rating: 4.8,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Men\'s Casual Denim Jacket',
    price: 4500,
    originalPrice: 6000,
    description: 'Classic blue vintage wash denim jacket. Durable, comfortable, and perfect for layering during casual outings.',
    category: 'Clothes',
    image: 'https://images.pexels.com/photos/373899/pexels-photo-373899.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 50,
    sold: 32,
    rating: 4.7,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Men\'s Urban Streetwear Hoodie',
    price: 3200,
    originalPrice: 4500,
    description: 'Cozy and stylish oversized hoodie. Made with premium cotton blend fleece for maximum warmth and comfort.',
    category: 'Clothes',
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 75,
    sold: 45,
    rating: 4.6,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Men\'s Classic White Polo Shirt',
    price: 1800,
    originalPrice: 2500,
    description: 'Essential white polo shirt with a tailored fit. Breathable cotton pique fabric, ideal for summer days.',
    category: 'Clothes',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 120,
    sold: 80,
    rating: 4.5,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Men\'s Black Leather Biker Jacket',
    price: 12000,
    originalPrice: 16000,
    description: 'Authentic genuine leather biker jacket. Features metallic zips, tailored fit, and premium inner lining.',
    category: 'Clothes',
    image: 'https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 20,
    sold: 8,
    rating: 4.9,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ================= WOMEN'S CLOTHES =================
  {
    name: 'Women\'s Summer Floral Maxi Dress',
    price: 3800,
    originalPrice: 5000,
    description: 'Beautiful lightweight floral maxi dress. Breathable fabric perfect for beach days or summer parties.',
    category: 'Clothes',
    image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 40,
    sold: 28,
    rating: 4.8,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Women\'s Elegant Silk Evening Gown',
    price: 9500,
    originalPrice: 14000,
    description: 'Luxurious silk evening gown featuring a flattering drape, elegant slit, and a smooth satin finish.',
    category: 'Clothes',
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 15,
    sold: 6,
    rating: 4.9,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Women\'s Casual White Top & Jeans Set',
    price: 4500,
    originalPrice: 6000,
    description: 'A perfect everyday combo. Includes a comfortable white cotton top and premium stretchable blue jeans.',
    category: 'Clothes',
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 60,
    sold: 35,
    rating: 4.7,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Women\'s Designer Trench Coat',
    price: 8200,
    originalPrice: 11000,
    description: 'Classic beige trench coat with a belted waist. Water-resistant material, perfect for autumn and winter.',
    category: 'Clothes',
    image: 'https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 25,
    sold: 12,
    rating: 4.8,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Women\'s Chic Office Blazer',
    price: 5500,
    originalPrice: 7500,
    description: 'Professional tailored blazer for women. Features a sharp cut, premium fabric, and comfortable lining.',
    category: 'Clothes',
    image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 35,
    sold: 18,
    rating: 4.6,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ================= MAKEUP =================
  {
    name: 'Pro Eyeshadow Palette 24 Colors',
    price: 3500,
    originalPrice: 4800,
    description: 'Highly pigmented 24-color eyeshadow palette. Mix of velvety mattes and dazzling shimmers for any look.',
    category: 'Makeup',
    image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 50,
    sold: 34,
    rating: 4.8,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Velvet Matte Liquid Lipstick',
    price: 1200,
    originalPrice: 1800,
    description: 'Intense color payoff with a transfer-proof, long-lasting matte finish. Enriched with vitamin E to prevent drying.',
    category: 'Makeup',
    image: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 120,
    sold: 85,
    rating: 4.7,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Luminous Flawless Foundation',
    price: 2800,
    originalPrice: 3800,
    description: 'Medium to full coverage foundation that blends seamlessly into the skin. Leaves a glowing, natural finish.',
    category: 'Makeup',
    image: 'https://images.pexels.com/photos/1115128/pexels-photo-1115128.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 80,
    sold: 52,
    rating: 4.6,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Professional 15-Piece Makeup Brush Set',
    price: 4200,
    originalPrice: 6000,
    description: 'Complete professional brush set made with ultra-soft, cruelty-free synthetic bristles. Includes leather pouch.',
    category: 'Makeup',
    image: 'https://images.pexels.com/photos/1373305/pexels-photo-1373305.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 45,
    sold: 26,
    rating: 4.9,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Glow Highlighter & Blush Duo',
    price: 2100,
    originalPrice: 3000,
    description: 'A perfect duo to add a rosy tint and a radiant glow to your cheeks. Long-wearing and blendable formula.',
    category: 'Makeup',
    image: 'https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg?auto=compress&cs=tinysrgb&w=800',
    stock: 65,
    sold: 40,
    rating: 4.7,
    reviews: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function fixProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // First, let's delete ALL products that are currently in Clothes and Makeup
    // to clean up the broken images and start fresh with our premium list.
    const deleteResult = await mongoose.connection.collection('products').deleteMany({
      category: { $in: ['Clothes', 'Makeup'] }
    });
    console.log(`Cleared ${deleteResult.deletedCount} old products with broken images.`);
    
    // Insert the new premium curated products
    const insertResult = await mongoose.connection.collection('products').insertMany(newProducts);
    console.log(`Successfully added ${insertResult.insertedCount} new premium products!`);
    
  } catch (error) {
    console.error('Error fixing products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixProducts();
