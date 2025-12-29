import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['saree', 'kurti', 'lehenga'],
    lowercase: true
  },
  image: {
    type: String,
    default: '/images/products/default.jpg'
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  sizes: [{
    type: String,
    validate: {
      validator: function(v) {
        const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
        return validSizes.includes(v);
      },
      message: props => `${props.value} is not a valid size`
    }
  }],
  colors: [String],
  featured: {
    type: Boolean,
    default: false
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
