
const mongoose = require('mongoose');

// const actionSchema = mongoose.Schema({
//     add: {
//       type: Boolean,
//       default: false
//     },
//     watch: {
//       type: Boolean,
//       default: false
//     },
//     update: {
//       type: Boolean,
//       default: false
//     },
//     delete: {
//       type: Boolean,
//       default: false
//     }
//   });
  


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

module.exports = mongoose.model('crm', userSchema);