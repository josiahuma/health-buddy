const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email validation
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'], 
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  role: { 
    type: String, 
    enum: ['user', 'practitioner', 'admin'], // Define allowed roles
    default: 'user', // Default role
  },
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Prevent returning the password field in queries
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Add pre-save middleware for hashing passwords (if not hashed already)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password hasn't changed

  const bcrypt = require('bcrypt');
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
