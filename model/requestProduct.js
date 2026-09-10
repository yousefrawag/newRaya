const mongoose = require('mongoose');

// ----- 1. تعريف الـ Schema -----
const ImportRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'الاسم الكامل مطلوب'],
      trim: true,
      minlength: [2, 'الاسم يجب أن لا يقل عن حرفين'],
      maxlength: [100, 'الاسم طويل جداً'],
    },
    mobile: {
      type: String,
      required: [true, 'رقم الجوال مطلوب'],
      trim: true,
      match: [/^[+\d\s\-()]{7,20}$/, 'رقم الجوال غير صحيح'],
    },
    productName: {
      type: String,
      required: [true, 'اسم المنتج مطلوب'],
      trim: true,
      maxlength: [200, 'اسم المنتج طويل جداً'],
    },
    productLink: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?([\w\-])+\.{1}[a-z]{2,}(.[a-z]{2,})?.*$/,
        'الرابط غير صحيح',
      ],
      default: '',
    },
    quantity: {
      type: String,
      trim: true,
      default: '',
    },
    manufacturerCountry: {
      type: String,
      trim: true,
      default: '',
    },
    deliveryCity: {
      type: String,
      required: [true, 'مدينة الاستلام مطلوبة'],
      trim: true,
    },
    additionalDetails: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'canceled'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // يضيف createdAt و updatedAt تلقائياً
  }
);
module.exports = mongoose.model("ImportRequestSchema" , ImportRequestSchema)
