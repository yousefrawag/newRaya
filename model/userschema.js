
const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name."]
    },
    email: {
      type: String,
      required: [true, 'Please add a valid email.'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password.']
    },
    image: {
      type: String,
      default:"https://ps.w.org/user-avatar-reloaded/assets/icon-128x128.png?rev=2540745"
    },
    role: {
      type: String,
      enum: ['admin', 'employer'],
      default: 'employer'
    },
    permissions: {
      type:mongoose.Schema.Types.ObjectId,
            ref:"permission"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('user', userSchema);