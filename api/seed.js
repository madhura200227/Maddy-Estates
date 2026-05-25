import Property from './models/Property.js';
import { defaultProperties } from './seedData.js';

export async function seedProperties() {
  try {
    const count = await Property.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding default luxury properties into MongoDB...');
      await Property.insertMany(defaultProperties);
      console.log('✅ Seeding complete: 6 premium properties loaded.');
    } else {
      console.log(`ℹ️ Properties database already has ${count} records. Skipping seeding.`);
    }
  } catch (error) {
    console.error('❌ Error during property seeding:', error);
  }
}
