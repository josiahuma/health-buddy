const mongoose = require('mongoose');

const practitionerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
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
    field: {
      type: String,
      required: [true, 'Field of specialization is required'],
      enum: [
        'Doctor',
        'Nurse',
        'Optician',
        'Physiotherapist',
        'Psychologist',
        'Other',
      ], // Restrict to specific fields, or extend as needed
    },
    consultationFee: {
      type: Number,
      required: [false, 'Consultation fee is not required'],
      min: [0, 'Consultation fee must be a positive number'],
    },
    role: {
      type: String,
      enum: ['practitioner'], // Enum allows easy extension for additional roles in the future
      default: 'practitioner', // Default role for practitioners
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Prevent returning the password field in queries
practitionerSchema.methods.toJSON = function () {
  const practitionerObject = this.toObject();
  delete practitionerObject.password;
  return practitionerObject;
};

// Add pre-save middleware for hashing passwords (if not hashed already)
practitionerSchema.pre('save', async function (next) {
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

module.exports = mongoose.model('Practitioner', practitionerSchema);
