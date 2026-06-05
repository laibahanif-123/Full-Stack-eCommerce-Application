const mongoose = require('../server/node_modules/mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/Ecommerce';

async function fixPowderImage() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Update the image for 'Luxury Setting Powder'
    const result = await mongoose.connection.collection('products').updateMany(
      { name: 'Luxury Setting Powder' },
      { $set: { image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80' } }
    );
    
    console.log(`Successfully updated ${result.modifiedCount} product(s)!`);
    
  } catch (error) {
    console.error('Error fixing product:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

fixPowderImage();
