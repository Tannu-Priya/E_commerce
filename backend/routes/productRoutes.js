import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let products = Product.find(query);

    // Sorting
    if (sort === 'price-low') {
      products = products.sort({ price: 1 });
    } else if (sort === 'price-high') {
      products = products.sort({ price: -1 });
    } else if (sort === 'newest') {
      products = products.sort({ createdAt: -1 });
    }

    const result = await products;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    console.log('POST /api/products - Create product request');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user?.name, '(', req.user?.email, ')', 'Role:', req.user?.role);

    // Validate required fields
    const { name, description, price, category, stock } = req.body;
    
    if (!name || !description || !price || !category || stock === undefined) {
      console.error('Missing required fields:', { 
        name: !!name, 
        description: !!description, 
        price: !!price, 
        category: !!category, 
        stock: stock !== undefined 
      });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image || '/images/products/default.jpg',
      stock: req.body.stock,
      sizes: req.body.sizes || [],
      colors: req.body.colors || []
    });

    const createdProduct = await product.save();
    console.log('Product created successfully:', createdProduct._id);
    res.status(201).json(createdProduct);
    
  } catch (error) {
    console.error('Error creating product:', error.message);
    console.error('Error name:', error.name);
    console.error('Stack trace:', error.stack);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.error('Validation errors:', validationErrors);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    console.log('PUT /api/products/:id - Product update request');
    console.log('Product ID:', req.params.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user?.name, '(', req.user?.email, ')', 'Role:', req.user?.role);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.error('Invalid product ID format:', req.params.id);
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      console.error('Product not found:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Current product data:', {
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors
    });

    // Update fields with proper validation
    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.price !== undefined) product.price = req.body.price;
    if (req.body.category !== undefined) product.category = req.body.category;
    if (req.body.image !== undefined) product.image = req.body.image;
    if (req.body.stock !== undefined) product.stock = req.body.stock;
    if (req.body.sizes !== undefined) product.sizes = req.body.sizes;
    if (req.body.colors !== undefined) product.colors = req.body.colors;

    console.log('Updated product data before save:', {
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors
    });

    const updatedProduct = await product.save();
    console.log('Product updated successfully:', updatedProduct._id);
    res.json(updatedProduct);
    
  } catch (error) {
    console.error('Error updating product:', error.message);
    console.error('Error name:', error.name);
    console.error('Stack trace:', error.stack);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.error('Validation errors:', validationErrors);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    // Handle cast errors (invalid ObjectId, etc.)
    if (error.name === 'CastError') {
      console.error('Cast error:', error.message);
      return res.status(400).json({ message: 'Invalid data format' });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Create product review
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
