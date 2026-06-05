// server/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const MONGODB_CONNECT_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Ecommerce';

const usersData = [
  { name: 'Administrator', email: 'admin@shophub.com', password: 'admin123', role: 'admin' },
  { name: 'John Doe', email: 'user@shophub.com', password: 'user123', role: 'user' }
];

const productsData = [
  // ==================== ELECTRONICS (8 items) ====================
  {
    name: 'Samsung Galaxy Buds Pro Wireless Earbuds',
    price: 2999,
    originalPrice: 4999,
    description: 'Active Noise Cancellation, 360 Audio, IPX7 water resistant, 28hr battery with case. Intelligent ANC with 3 adjustable levels. Rich sound by AKG.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=600&q=80',
    stock: 85,
    rating: 4.7,
    sold: 12500
  },
  {
    name: 'Smart Watch Fitness Tracker with Heart Rate Monitor',
    price: 3499,
    originalPrice: 5999,
    description: '1.69" HD display, 24/7 heart rate & SpO2 monitoring, 100+ sports modes, 7-day battery life, IP68 waterproof. Compatible with Android & iOS.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    stock: 45,
    rating: 4.8,
    sold: 8900
  },
  {
    name: 'Portable Power Bank 20000mAh Fast Charging',
    price: 1899,
    originalPrice: 2999,
    description: 'Dual USB-C output, 22.5W super fast charging, LED battery indicator, slim design. Charges iPhone 14 up to 4 times. Airline safe.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
    stock: 120,
    rating: 4.6,
    sold: 15600
  },
  {
    name: 'RGB Mechanical Gaming Keyboard 75% Compact',
    price: 4999,
    originalPrice: 7999,
    description: 'Hot-swappable switches, per-key RGB lighting, PBT keycaps, Bluetooth 5.0 + USB-C wired mode. Gasket mount structure for typing comfort.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80',
    stock: 30,
    rating: 4.8,
    sold: 5400
  },
  {
    name: 'Wireless Bluetooth Speaker Portable Waterproof',
    price: 2199,
    originalPrice: 3499,
    description: '20W stereo sound, IPX7 waterproof, 12-hour playtime, built-in mic for calls. TWS pairing for dual speaker mode. Perfect for outdoor use.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
    stock: 65,
    rating: 4.5,
    sold: 7800
  },
  {
    name: 'USB LED Ring Light 10" with Tripod Stand',
    price: 1299,
    originalPrice: 2199,
    description: '3 color modes, 10 brightness levels, phone holder included. Perfect for TikTok, YouTube, video calls and selfies. Height adjustable up to 50".',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80',
    stock: 90,
    rating: 4.4,
    sold: 22000
  },
  {
    name: 'Wireless Gaming Mouse RGB 7200 DPI',
    price: 1599,
    originalPrice: 2499,
    description: '7 programmable buttons, adjustable DPI up to 7200, ergonomic design, rechargeable battery lasts 40hrs. RGB breathing light effects.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
    stock: 75,
    rating: 4.6,
    sold: 9300
  },
  {
    name: 'Mini Portable Projector HD 1080P WiFi',
    price: 8999,
    originalPrice: 14999,
    description: 'Native 1080P, WiFi & Bluetooth, 200" screen size, built-in speakers, HDMI/USB ports. Home cinema experience. Keystone correction included.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80',
    stock: 15,
    rating: 4.3,
    sold: 3200
  },

  // ==================== FASHION (8 items) ====================
  {
    name: 'Men Premium Cotton Polo T-Shirt',
    price: 899,
    originalPrice: 1499,
    description: 'Premium 100% combed cotton, breathable fabric, classic collar design. Available in multiple colors. Machine washable, pre-shrunk fabric.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    stock: 200,
    rating: 4.6,
    sold: 18500
  },
  {
    name: 'Slim Fit Stretch Denim Jeans Men',
    price: 1799,
    originalPrice: 2999,
    description: 'Premium stretch denim, medium indigo wash, 5-pocket styling. Comfortable slim fit with subtle distressing. Zip fly with button closure.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    stock: 150,
    rating: 4.7,
    sold: 12300
  },
  {
    name: 'Running Sports Shoes Lightweight Breathable',
    price: 2499,
    originalPrice: 3999,
    description: 'Ultra-lightweight mesh upper, responsive foam cushioning, rubber outsole for grip. Perfect for running, gym and daily wear. Anti-slip design.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    stock: 80,
    rating: 4.6,
    sold: 25600
  },
  {
    name: 'Women Crossbody Leather Handbag',
    price: 1599,
    originalPrice: 2799,
    description: 'PU leather with gold-tone hardware, adjustable strap, multiple compartments. Compact design fits phone, wallet, keys and essentials.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    stock: 60,
    rating: 4.5,
    sold: 8700
  },
  {
    name: 'Polarized Aviator Sunglasses UV400 Protection',
    price: 699,
    originalPrice: 1299,
    description: 'Classic aviator design, polarized UV400 lenses, gold-tone metal frame. Includes microfiber pouch and hard case. Unisex design.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
    stock: 100,
    rating: 4.5,
    sold: 31000
  },
  {
    name: 'Winter Hoodie Fleece Lined Oversized',
    price: 1999,
    originalPrice: 3499,
    description: 'Heavy fleece lining, oversized fit, kangaroo pocket, double-layered hood. Ultra warm for winter. Premium stitching throughout.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
    stock: 70,
    rating: 4.8,
    sold: 14200
  },
  {
    name: 'Genuine Leather Belt Men Automatic Buckle',
    price: 599,
    originalPrice: 999,
    description: 'Genuine cowhide leather, automatic ratchet buckle, adjustable size. Width 3.5cm, fits waist 28-44 inches. Elegant business design.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    stock: 130,
    rating: 4.4,
    sold: 19800
  },
  {
    name: 'Cargo Pants Men Streetwear Cotton',
    price: 1499,
    originalPrice: 2499,
    description: 'Cotton-ripstop fabric, multiple cargo pockets, elastic waistband with drawstring. Relaxed fit, ankle ties. Trendy streetwear style.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&w=600&q=80',
    stock: 90,
    rating: 4.4,
    sold: 11500
  },

  // ==================== HOME (7 items) ====================
  {
    name: 'LED Desk Lamp Eye Care Reading Light',
    price: 1499,
    originalPrice: 2499,
    description: 'Flexible gooseneck, 5 brightness levels, 3 color temperatures. USB charging port. Touch control, memory function. Anti-flicker eye protection.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    stock: 55,
    rating: 4.5,
    sold: 6700
  },
  {
    name: 'Scented Candles Gift Set Premium Soy Wax (3-Pack)',
    price: 999,
    originalPrice: 1699,
    description: 'Hand-poured soy wax, lavender + vanilla + ocean breeze scents. 40-hour burn time each. Lead-free cotton wicks. Comes in premium gift box.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1602607411816-55e98f4ef2d3?auto=format&fit=crop&w=600&q=80',
    stock: 40,
    rating: 4.6,
    sold: 4500
  },
  {
    name: 'Wall Clock Modern Minimalist Silent 12"',
    price: 899,
    originalPrice: 1499,
    description: 'Silent sweep movement, brushed aluminum frame, clear large numbers. Battery operated. Fits living room, bedroom, office, kitchen.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80',
    stock: 35,
    rating: 4.3,
    sold: 3800
  },
  {
    name: 'Ceramic Coffee Mug Set 4-Pack Handcrafted',
    price: 1199,
    originalPrice: 1899,
    description: 'Set of 4 handcrafted ceramic mugs, earth-tone colors. Microwave & dishwasher safe. 350ml capacity each. Ergonomic handle design.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80',
    stock: 30,
    rating: 4.5,
    sold: 5200
  },
  {
    name: 'Artificial Plant Decor Potted Succulent Set',
    price: 799,
    originalPrice: 1299,
    description: 'Set of 3 realistic artificial succulents in ceramic pots. No maintenance required. Perfect for desk, shelf, bathroom decoration.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
    stock: 50,
    rating: 4.4,
    sold: 8900
  },
  {
    name: 'Kitchen Organizer Spice Rack Stainless Steel',
    price: 1399,
    originalPrice: 2199,
    description: '2-tier rotating spice rack, stainless steel construction, holds 16 jars. 360° turntable base. Space-saving kitchen countertop organizer.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    rating: 4.7,
    sold: 2100
  },
  {
    name: 'Throw Pillow Covers Velvet Set of 4',
    price: 699,
    originalPrice: 1199,
    description: '18x18 inch velvet pillow covers, hidden zipper closure. Set of 4 in matching earthy colors. Machine washable, fade resistant.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    stock: 80,
    rating: 4.6,
    sold: 13400
  },

  // ==================== SPORTS (7 items) ====================
  {
    name: 'Cast Iron Hex Dumbbell Set 5-25 lbs',
    price: 3999,
    originalPrice: 5999,
    description: 'Cast iron core with rubber hex coating. Ergonomic chrome handles with cross-knurl grip. Floor-safe, non-rolling hex design. Set of 5 pairs.',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=600&q=80',
    stock: 20,
    rating: 4.7,
    sold: 4200
  },
  {
    name: 'Yoga Mat Premium Non-Slip 6mm Thick',
    price: 1299,
    originalPrice: 2199,
    description: 'Extra thick 6mm eco-friendly TPE material, alignment lines printed. Non-slip dual surface. Carrying strap included. 183x61cm.',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80',
    stock: 60,
    rating: 4.8,
    sold: 9800
  },
  {
    name: 'Stainless Steel Water Bottle 1L Insulated',
    price: 799,
    originalPrice: 1299,
    description: 'Double-wall vacuum insulation keeps cold 24hrs, hot 12hrs. BPA-free, leak-proof lid. Sweat-free exterior. Powder-coated finish.',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    stock: 100,
    rating: 4.5,
    sold: 16700
  },
  {
    name: 'Resistance Bands Set 5-Pack with Handles',
    price: 899,
    originalPrice: 1499,
    description: '5 resistance levels (10-50 lbs), latex tubes with cushioned handles. Door anchor, ankle straps & carry bag included. Full body workout.',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?auto=format&fit=crop&w=600&q=80',
    stock: 70,
    rating: 4.4,
    sold: 11200
  },
  {
    name: 'Jump Rope Speed Skipping Adjustable',
    price: 399,
    originalPrice: 699,
    description: 'Ball bearing design for smooth rotation, adjustable steel cable, foam grip handles. Counter feature tracks jumps. Great for cardio & HIIT.',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    stock: 150,
    rating: 4.3,
    sold: 28000
  },
  {
    name: 'Football Soccer Ball Size 5 Match Quality',
    price: 1199,
    originalPrice: 1899,
    description: 'Hand-stitched PU leather, official size 5. Excellent air retention, balanced flight. Suitable for training and matches on all surfaces.',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=600&q=80',
    stock: 45,
    rating: 4.6,
    sold: 7500
  },
  {
    name: 'Gym Gloves with Wrist Support Pair',
    price: 599,
    originalPrice: 999,
    description: 'Breathable mesh back, padded palm for grip, adjustable wrist wrap for support. Anti-slip silicone coating. Ideal for weightlifting & CrossFit.',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    stock: 85,
    rating: 4.5,
    sold: 14300
  },

  // ==================== BOOKS (7 items) ====================
  {
    name: 'Atomic Habits by James Clear - Paperback',
    price: 699,
    originalPrice: 1099,
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. #1 New York Times bestseller. Over 15 million copies sold worldwide.',
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    stock: 100,
    rating: 4.9,
    sold: 45000
  },
  {
    name: 'Rich Dad Poor Dad by Robert Kiyosaki',
    price: 599,
    originalPrice: 899,
    description: 'What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not! #1 Personal Finance book of all time.',
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    stock: 80,
    rating: 4.8,
    sold: 38000
  },
  {
    name: 'The Psychology of Money by Morgan Housel',
    price: 749,
    originalPrice: 1199,
    description: 'Timeless Lessons on Wealth, Greed, and Happiness. 19 short stories exploring the strange ways people think about money.',
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    stock: 65,
    rating: 4.7,
    sold: 22000
  },
  {
    name: 'Ikigai: The Japanese Secret to a Long and Happy Life',
    price: 499,
    originalPrice: 799,
    description: 'Discover the secrets to longevity and happiness from the Japanese island of Okinawa. International bestseller translated into 60+ languages.',
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    stock: 90,
    rating: 4.6,
    sold: 19500
  },
  {
    name: 'Think and Grow Rich by Napoleon Hill',
    price: 449,
    originalPrice: 699,
    description: 'The landmark bestseller about the principles of success. Based on 25 years of research with over 500 successful individuals.',
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
    stock: 120,
    rating: 4.7,
    sold: 52000
  },
  {
    name: 'Deep Work by Cal Newport - Focus in Distracted World',
    price: 799,
    originalPrice: 1299,
    description: 'Rules for Focused Success in a Distracted World. Learn the superpower of deep concentration in an era of social media and notifications.',
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    stock: 55,
    rating: 4.8,
    sold: 15600
  },
  {
    name: 'The Alchemist by Paulo Coelho - Special Edition',
    price: 549,
    originalPrice: 899,
    description: 'A magical fable about following your dreams. One of the best-selling books in history with over 150 million copies sold worldwide.',
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=600&q=80',
    stock: 75,
    rating: 4.9,
    sold: 67000
  },

  // ==================== TOYS (7 items) ====================
  {
    name: 'STEM Building Blocks Set 500+ Pieces Educational',
    price: 1999,
    originalPrice: 3499,
    description: 'Engineering building blocks with gears, axles, wheels. Compatible with major brands. Ages 6+. Develops spatial thinking & problem solving.',
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?auto=format&fit=crop&w=600&q=80',
    stock: 35,
    rating: 4.7,
    sold: 8900
  },
  {
    name: 'Wooden Forest Adventure Play Set',
    price: 1299,
    originalPrice: 1999,
    description: 'Sustainable beechwood, non-toxic water-based paints. Includes trees, animals, characters. Develops imagination & fine motor skills. Ages 3+.',
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1566576912321-d58def7a968f?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    rating: 4.4,
    sold: 4200
  },
  {
    name: 'Remote Control Racing Car 1:14 Scale High Speed',
    price: 2499,
    originalPrice: 3999,
    description: '2.4GHz remote control, 30km/h top speed, 4WD, rechargeable battery. LED headlights, rubber tires. Racing excitement for kids & adults.',
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=600&q=80',
    stock: 30,
    rating: 4.5,
    sold: 6700
  },
  {
    name: 'Art Supplies Kit 150-Piece Drawing Set',
    price: 1499,
    originalPrice: 2499,
    description: 'Colored pencils, watercolors, crayons, markers, pastels, sketch pads. Premium wooden case. Perfect gift for budding artists. Ages 4+.',
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    stock: 45,
    rating: 4.6,
    sold: 11200
  },
  {
    name: 'Puzzle 1000 Pieces World Map Educational',
    price: 699,
    originalPrice: 1099,
    description: 'Premium quality 1000-piece world map puzzle. Finished size 70x50cm. Vibrant colors, thick cardboard pieces. Educational & relaxing activity.',
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=600&q=80',
    stock: 55,
    rating: 4.3,
    sold: 7800
  },
  {
    name: 'Plush Teddy Bear Giant 3ft Soft Stuffed',
    price: 1799,
    originalPrice: 2999,
    description: '3 feet tall super soft plush teddy bear. Hypoallergenic filling, velvet-soft fur. Perfect birthday/anniversary gift. Ribbon bow accent.',
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?auto=format&fit=crop&w=600&q=80',
    stock: 20,
    rating: 4.8,
    sold: 15400
  },
  {
    name: 'Board Game Family Strategy Night Collection',
    price: 1299,
    originalPrice: 1999,
    description: 'Set of 3 classic strategy board games for family game night. 2-6 players. Ages 8+. Hours of fun and bonding for the whole family.',
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?auto=format&fit=crop&w=600&q=80',
    stock: 40,
    rating: 4.5,
    sold: 5600
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to database:', MONGODB_CONNECT_URI);
    await mongoose.connect(MONGODB_CONNECT_URI);
    console.log('Database connected successfully.');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('Existing collections cleared.');

    const createdUsers = await User.create(usersData);
    console.log(`Seeded ${createdUsers.length} user accounts.`);

    const createdProducts = await Product.create(productsData);
    console.log(`Seeded ${createdProducts.length} products across 6 categories.`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
