const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Product = require('../models/Product');
const User = require('../models/User');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample products data
const products = [
  {
    name: "Growth Bites Original",
    description: "Complete nutrition for growing children with essential proteins and minerals. Fortified with calcium, vitamin D, and iron to support healthy development.",
    shortDescription: "Essential nutrients for healthy growth and development",
    price: 24.99,
    originalPrice: 29.99,
    category: "Growth Support",
    subcategory: "Protein Rich",
    stock: 150,
    images: [
      { url: "/assets/img-1.jpg", alt: "Growth Bites Original", isPrimary: true },
      { url: "/assets/fortified-grains.jpg", alt: "Growth Bites Ingredients" }
    ],
    sizes: [
      { name: "Small (200g)", price: 24.99, stock: 50 },
      { name: "Medium (400g)", price: 44.99, stock: 75 },
      { name: "Large (800g)", price: 79.99, stock: 25 }
    ],
    nutritionFacts: {
      servingSize: "30g",
      calories: 120,
      protein: "8g",
      carbohydrates: "15g",
      fat: "3g",
      fiber: "4g",
      sugar: "2g",
      sodium: "150mg",
      vitamins: ["Vitamin D", "Vitamin B12", "Folate"],
      minerals: ["Calcium", "Iron", "Zinc"]
    },
    ingredients: ["Sorghum flour", "Millet", "Whey protein", "Calcium carbonate", "Iron fumarate"],
    allergens: ["Contains milk"],
    benefits: ["Supports bone development", "Enhances muscle growth", "Boosts energy levels"],
    ageRange: { min: 2, max: 12 },
    rating: 4.8,
    numReviews: 156,
    featured: true,
    tags: ["protein", "calcium", "growth", "bestseller"],
    weight: "400g",
    shelfLife: "18 months",
    storageInstructions: "Store in a cool, dry place"
  },
  {
    name: "Brain Boost Bites",
    description: "Omega-3 rich snacks formulated to support cognitive development and brain health in children.",
    shortDescription: "Cognitive support with omega-3 and essential nutrients",
    price: 27.99,
    originalPrice: 32.99,
    category: "Brain Boost",
    subcategory: "Omega-3",
    stock: 120,
    images: [
      { url: "/assets/brain-boost-ideas.jpg", alt: "Brain Boost Bites", isPrimary: true },
      { url: "/assets/img-1.jpg", alt: "Brain Boost Nutrition" }
    ],
    sizes: [
      { name: "Small (200g)", price: 27.99, stock: 40 },
      { name: "Medium (400g)", price: 49.99, stock: 60 },
      { name: "Large (800g)", price: 89.99, stock: 20 }
    ],
    nutritionFacts: {
      servingSize: "30g",
      calories: 130,
      protein: "7g",
      carbohydrates: "16g",
      fat: "5g",
      fiber: "3g",
      sugar: "3g",
      sodium: "120mg",
      vitamins: ["Vitamin E", "B-Complex", "Choline"],
      minerals: ["Zinc", "Magnesium", "Selenium"]
    },
    ingredients: ["Quinoa flour", "Chia seeds", "Fish oil powder", "Blueberry extract", "Zinc oxide"],
    allergens: ["Contains fish"],
    benefits: ["Enhances memory", "Improves focus", "Supports brain development"],
    ageRange: { min: 3, max: 15 },
    rating: 4.7,
    numReviews: 89,
    featured: true,
    tags: ["omega-3", "brain", "memory", "focus"],
    weight: "400g",
    shelfLife: "15 months",
    storageInstructions: "Store in a cool, dry place away from light"
  },
  {
    name: "Immune Support Bites",
    description: "Vitamin C, D, zinc and elderberry fortified snacks designed to strengthen children's immune systems.",
    shortDescription: "Immune system support with vitamins and antioxidants",
    price: 26.99,
    category: "Immune Support",
    subcategory: "Vitamin Fortified",
    stock: 100,
    images: [
      { url: "/assets/immune-support-foods.jpg", alt: "Immune Support Bites", isPrimary: true },
      { url: "/assets/img-1.jpg", alt: "Immune Support Benefits" }
    ],
    sizes: [
      { name: "Small (200g)", price: 26.99, stock: 35 },
      { name: "Medium (400g)", price: 47.99, stock: 45 },
      { name: "Large (800g)", price: 84.99, stock: 20 }
    ],
    nutritionFacts: {
      servingSize: "30g",
      calories: 115,
      protein: "6g",
      carbohydrates: "18g",
      fat: "2g",
      fiber: "5g",
      sugar: "4g",
      sodium: "100mg",
      vitamins: ["Vitamin C", "Vitamin D3", "Vitamin A"],
      minerals: ["Zinc", "Selenium", "Iron"]
    },
    ingredients: ["Oat flour", "Elderberry extract", "Acerola cherry", "Zinc gluconate", "Vitamin D3"],
    allergens: ["May contain traces of nuts"],
    benefits: ["Boosts immunity", "Fights infections", "Supports recovery"],
    ageRange: { min: 1, max: 12 },
    rating: 4.6,
    numReviews: 134,
    featured: false,
    tags: ["immune", "vitamin-c", "elderberry", "antioxidant"],
    weight: "400g",
    shelfLife: "24 months",
    storageInstructions: "Store in a cool, dry place"
  },
  {
    name: "Protein Power Snacks",
    description: "High-protein snacks for muscle development and sustained energy throughout the day.",
    shortDescription: "High-protein snacks for energy and muscle development",
    price: 22.99,
    originalPrice: 25.99,
    category: "Growth Support",
    subcategory: "Protein Rich",
    stock: 80,
    images: [
      { url: "/assets/img-1.jpg", alt: "Protein Power Snacks", isPrimary: true }
    ],
    sizes: [
      { name: "Small (200g)", price: 22.99, stock: 30 },
      { name: "Medium (400g)", price: 39.99, stock: 35 },
      { name: "Large (800g)", price: 69.99, stock: 15 }
    ],
    nutritionFacts: {
      servingSize: "30g",
      calories: 140,
      protein: "12g",
      carbohydrates: "12g",
      fat: "4g",
      fiber: "3g",
      sugar: "2g",
      sodium: "180mg",
      vitamins: ["B-Complex", "Vitamin E"],
      minerals: ["Iron", "Magnesium", "Potassium"]
    },
    ingredients: ["Pea protein", "Brown rice protein", "Almonds", "Sunflower seeds", "Natural flavors"],
    allergens: ["Contains nuts"],
    benefits: ["Builds muscle", "Sustained energy", "Post-workout recovery"],
    ageRange: { min: 5, max: 18 },
    rating: 4.5,
    numReviews: 67,
    featured: false,
    tags: ["protein", "energy", "muscle", "recovery"],
    weight: "400g",
    shelfLife: "12 months",
    storageInstructions: "Store in a cool, dry place"
  },
  {
    name: "Calcium Crunch",
    description: "Calcium and vitamin D fortified snacks specifically designed for strong bone development.",
    shortDescription: "Calcium-rich snacks for strong bones and teeth",
    price: 23.99,
    category: "Growth Support",
    subcategory: "Mineral Enhanced",
    stock: 90,
    images: [
      { url: "/assets/img-1.jpg", alt: "Calcium Crunch", isPrimary: true }
    ],
    sizes: [
      { name: "Small (200g)", price: 23.99, stock: 30 },
      { name: "Medium (400g)", price: 42.99, stock: 40 },
      { name: "Large (800g)", price: 74.99, stock: 20 }
    ],
    nutritionFacts: {
      servingSize: "30g",
      calories: 110,
      protein: "5g",
      carbohydrates: "16g",
      fat: "3g",
      fiber: "4g",
      sugar: "3g",
      sodium: "140mg",
      vitamins: ["Vitamin D3", "Vitamin K2"],
      minerals: ["Calcium", "Phosphorus", "Magnesium"]
    },
    ingredients: ["Sesame seeds", "Calcium carbonate", "Vitamin D3", "Honey", "Vanilla extract"],
    allergens: ["Contains sesame"],
    benefits: ["Strengthens bones", "Supports dental health", "Prevents deficiencies"],
    ageRange: { min: 2, max: 16 },
    rating: 4.4,
    numReviews: 92,
    featured: false,
    tags: ["calcium", "bones", "teeth", "vitamin-d"],
    weight: "400g",
    shelfLife: "18 months",
    storageInstructions: "Store in a cool, dry place"
  },
  {
    name: "Focus Fuel",
    description: "Specially formulated to support concentration and mental clarity in school-age children.",
    shortDescription: "Mental clarity and concentration support",
    price: 28.99,
    category: "Brain Boost",
    subcategory: "Vitamin Fortified",
    stock: 70,
    images: [
      { url: "/assets/focus-fuel.jpg", alt: "Focus Fuel", isPrimary: true }
    ],
    sizes: [
      { name: "Small (200g)", price: 28.99, stock: 25 },
      { name: "Medium (400g)", price: 51.99, stock: 30 },
      { name: "Large (800g)", price: 92.99, stock: 15 }
    ],
    nutritionFacts: {
      servingSize: "30g",
      calories: 125,
      protein: "7g",
      carbohydrates: "17g",
      fat: "4g",
      fiber: "3g",
      sugar: "2g",
      sodium: "110mg",
      vitamins: ["B-Complex", "Vitamin C", "Choline"],
      minerals: ["Iron", "Zinc", "Magnesium"]
    },
    ingredients: ["Ginkgo biloba extract", "Green tea extract", "B-vitamins", "Iron bisglycinate"],
    allergens: ["None"],
    benefits: ["Improves concentration", "Enhances memory", "Reduces mental fatigue"],
    ageRange: { min: 6, max: 18 },
    rating: 4.3,
    numReviews: 45,
    featured: false,
    tags: ["focus", "concentration", "memory", "study"],
    weight: "400g",
    shelfLife: "15 months",
    storageInstructions: "Store in a cool, dry place"
  }
];

// Sample admin user
const adminUser = {
  name: "Admin User",
  email: "admin@hopebites.com",
  password: "admin123456",
  role: "admin",
  isEmailVerified: true
};

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Create admin user
    await User.create(adminUser);
    console.log('Admin user created'.green.inverse);

    // Create products
    await Product.create(products);
    console.log('Products imported'.green.inverse);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}