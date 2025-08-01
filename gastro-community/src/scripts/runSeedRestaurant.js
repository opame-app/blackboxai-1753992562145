import { seedRestaurantData } from './seedRestaurantData.js';

// Run the seed function
seedRestaurantData()
  .then(() => {
    console.log('✅ Restaurant seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error seeding restaurant:', error);
    process.exit(1);
  });
