import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@threadstory.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    phone: '+91 9876543210',
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  }
];

const products = [
  {
    name: 'Elegant Silk Saree',
    description: 'Beautiful handwoven silk saree with intricate golden border. Perfect for weddings and special occasions.',
    price: 4999,
    category: 'saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=700&fit=crop',
    stock: 15,
    sizes: ['Free Size'],
    colors: ['Red', 'Blue', 'Green'],
    featured: true,
    rating: 4.5,
    numReviews: 12
  },
  {
    name: 'Cotton Printed Saree',
    description: 'Comfortable cotton saree with beautiful floral prints. Ideal for daily wear.',
    price: 1299,
    category: 'saree',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=700&fit=crop',
    stock: 25,
    sizes: ['Free Size'],
    colors: ['Pink', 'Yellow', 'White'],
    featured: false,
    rating: 4.2,
    numReviews: 8
  },
  {
    name: 'Designer Anarkali Kurti',
    description: 'Stylish Anarkali kurti with embroidered work. Perfect for parties and festivals.',
    price: 2499,
    category: 'kurti',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=700&fit=crop',
    stock: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Maroon', 'Navy Blue'],
    featured: true,
    rating: 4.7,
    numReviews: 15
  },
  {
    name: 'Casual Cotton Kurti',
    description: 'Comfortable cotton kurti for everyday wear. Breathable and stylish.',
    price: 899,
    category: 'kurti',
    image: 'https://images.unsplash.com/photo-1583391733981-e8c9e2f55e4d?w=500&h=700&fit=crop',
    stock: 30,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Beige', 'Light Blue'],
    featured: false,
    rating: 4.0,
    numReviews: 6
  },
  {
    name: 'Bridal Lehenga Choli',
    description: 'Stunning bridal lehenga with heavy embroidery and stone work. Make your special day memorable.',
    price: 15999,
    category: 'lehenga',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=700&fit=crop',
    stock: 5,
    sizes: ['S', 'M', 'L'],
    colors: ['Red', 'Pink', 'Gold'],
    featured: true,
    rating: 5.0,
    numReviews: 20
  },
  {
    name: 'Party Wear Lehenga',
    description: 'Elegant party wear lehenga with mirror work. Perfect for sangeet and mehendi functions.',
    price: 8999,
    category: 'lehenga',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&h=700&fit=crop',
    stock: 10,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Purple', 'Turquoise', 'Orange'],
    featured: false,
    rating: 4.6,
    numReviews: 10
  },
  {
    name: 'Banarasi Silk Saree',
    description: 'Traditional Banarasi silk saree with zari work. A timeless classic.',
    price: 6999,
    category: 'saree',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500&h=700&fit=crop',
    stock: 12,
    sizes: ['Free Size'],
    colors: ['Maroon', 'Royal Blue', 'Bottle Green'],
    featured: true,
    rating: 4.8,
    numReviews: 18
  },
  {
    name: 'Straight Cut Kurti Set',
    description: 'Modern straight cut kurti with palazzo pants. Comfortable and trendy.',
    price: 1799,
    category: 'kurti',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=700&fit=crop',
    stock: 22,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Mustard', 'Coral', 'Mint Green'],
    featured: false,
    rating: 4.3,
    numReviews: 9
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️  Data Destroyed!');

    // Insert users one by one to trigger password hashing
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@threadstory.com',
      password: 'admin123',
      role: 'admin'
    });

    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
      phone: '+91 9876543210',
      address: {
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      }
    });

    const janeUser = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'user'
    });

    console.log('✅ Users Imported!');

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log('✅ Products Imported!');

    // Create sample orders
    const sampleOrders = [
      {
        user: regularUser._id,
        orderItems: [
          {
            product: createdProducts[0]._id,
            name: createdProducts[0].name,
            quantity: 1,
            price: createdProducts[0].price,
            image: createdProducts[0].image,
            size: 'Free Size',
            color: 'Red'
          }
        ],
        shippingAddress: regularUser.address,
        paymentMethod: 'COD',
        itemsPrice: 4999,
        taxPrice: 500,
        shippingPrice: 100,
        totalPrice: 5599,
        isPaid: false,
        status: 'Processing'
      },
      {
        user: regularUser._id,
        orderItems: [
          {
            product: createdProducts[2]._id,
            name: createdProducts[2].name,
            quantity: 2,
            price: createdProducts[2].price,
            image: createdProducts[2].image,
            size: 'M',
            color: 'Black'
          }
        ],
        shippingAddress: regularUser.address,
        paymentMethod: 'Card',
        itemsPrice: 4998,
        taxPrice: 500,
        shippingPrice: 100,
        totalPrice: 5598,
        isPaid: true,
        paidAt: Date.now(),
        status: 'Delivered',
        isDelivered: true,
        deliveredAt: Date.now()
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log('✅ Orders Imported!');

    console.log('\n🎉 Data Import Success!');
    console.log('\n📧 Admin Login:');
    console.log('   Email: admin@threadstory.com');
    console.log('   Password: admin123');
    console.log('\n📧 User Login:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123\n');

    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️  Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
