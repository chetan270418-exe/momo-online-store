import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Veg Momo',
        'Chicken Momo',
        'Fried Momo',
        'Steam Momo',
        'Paneer Momo',
        'Special Momo',
      ],
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
    },
    stock: {
      type: Number,
      required: true,
      default: 50,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    offer: {
      isActive: { type: Boolean, default: false },
      label: { type: String, default: '' },       // e.g. "20% OFF", "MEAL DEAL"
      discount: { type: Number, default: 0 },    // percentage discount (0-100)
      color: { type: String, default: '#EF4444' }, // hex color for badge
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
