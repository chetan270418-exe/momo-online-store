import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

dotenv.config();

const products = [
  { name: 'Classic Veg Momo', description: 'Steamed dumplings stuffed with a savory mix of fresh cabbage, carrots, onions, and aromatic herbs and spices. Served with spicy red chutney.', price: 120, category: 'Veg Momo', stock: 50, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80', rating: 4.5, numReviews: 12, isAvailable: true },
  { name: 'Paneer Tikka Momo', description: 'Soft dumplings filled with crumbled paneer marinated in tikka masala, bell peppers, and onions. A fusion delight!', price: 150, category: 'Veg Momo', stock: 40, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80', rating: 4.3, numReviews: 8, isAvailable: true },
  { name: 'Classic Chicken Momo', description: 'Juicy hand-minced chicken with garlic, ginger, cilantro, and a touch of soy sauce wrapped in thin dough. A crowd favorite!', price: 150, category: 'Chicken Momo', stock: 60, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80', rating: 4.7, numReviews: 25, isAvailable: true },
  { name: 'Spicy Chicken Momo', description: 'Fiery chicken filling loaded with green chilies, Szechuan pepper, and a secret spice blend. Not for the faint-hearted!', price: 160, category: 'Chicken Momo', stock: 45, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1519d0?w=800&q=80', rating: 4.4, numReviews: 15, isAvailable: true },
  { name: 'Crispy Fried Veg Momo', description: 'Golden deep-fried momos with a satisfying crunch on the outside and flavorful vegetable filling inside. Served with schezwan sauce.', price: 140, category: 'Fried Momo', stock: 50, image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&q=80', rating: 4.2, numReviews: 10, isAvailable: true },
  { name: 'Fried Chicken Momo', description: 'Crispy fried dumplings stuffed with succulent spiced chicken. The perfect combination of crunch and flavor.', price: 170, category: 'Fried Momo', stock: 55, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&q=80', rating: 4.6, numReviews: 18, isAvailable: true },
  { name: 'Steamed Mushroom Momo', description: 'Delicate steamed dumplings filled with shiitake and button mushrooms, a hint of truffle oil, and fresh herbs.', price: 180, category: 'Steam Momo', stock: 30, image: 'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?w=800&q=80', rating: 4.1, numReviews: 6, isAvailable: true },
  { name: 'Steamed Prawn Momo', description: 'Premium steamed momos with fresh tiger prawns, lemongrass, Thai basil, and a splash of fish sauce. A seafood lovers dream.', price: 220, category: 'Steam Momo', stock: 25, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80', rating: 4.8, numReviews: 20, isAvailable: true },
  { name: 'Tandoori Paneer Momo', description: 'Paneer cubes marinated in smoky tandoori masala with onions and capsicum, wrapped in soft momo dough. Char-grilled to perfection.', price: 160, category: 'Paneer Momo', stock: 40, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80', rating: 4.5, numReviews: 14, isAvailable: true },
  { name: 'Cheese Corn Paneer Momo', description: 'Gooey mozzarella cheese and sweet corn mixed with crumbled paneer. Loved by kids and adults alike.', price: 150, category: 'Paneer Momo', stock: 50, image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&q=80', rating: 4.3, numReviews: 9, isAvailable: true },
  { name: 'Chef Special Jhol Momo', description: 'Momos drowned in a tangy, spicy, and nutty sesame-tomato broth. A traditional Nepali delicacy.', price: 190, category: 'Special Momo', stock: 30, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80', rating: 4.9, numReviews: 35, isAvailable: true },
  { name: 'Chocolate Momo (Dessert)', description: 'Sweet dough wrapped around warm, melted dark chocolate and crushed nuts. Served with vanilla ice cream.', price: 140, category: 'Special Momo', stock: 20, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80', rating: 4.6, numReviews: 16, isAvailable: true }
];

const seedData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    const createdUsers = [];
    createdUsers.push(await User.create({ name: 'Admin User', email: 'admin@momocafe.com', password: 'password123', role: 'admin' }));
    createdUsers.push(await User.create({ name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'user' }));

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map(product => {
      return { ...product, reviews: [
        { user: createdUsers[1]._id, name: createdUsers[1].name, rating: product.rating, comment: 'Great momos!' }
      ]};
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
