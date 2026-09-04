// controllers/propertyController.js
const Property = require('../model/AskShareProperty');
const cloudinary = require("../middleware/cloudinary");

// إضافة عقار جديد
exports.createProperty = async (req, res) => {
  try {
    // 1. الحصول على البيانات النصية من حقل "data"
    let payload = {};
    if (req.body.data) {
      try {
        payload = JSON.parse(req.body.data);
        console.log("b1" , payload)
        console.log("b2" , req.body.data)
      } catch (parseError) {
        return res.status(400).json({ success: false, error: 'Invalid JSON in data field' });
      }
    } else {
      return res.status(400).json({ success: false, error: 'Missing data field' });
    }

    const { client, project } = payload;
    if (!client || !project) {
      return res.status(400).json({ success: false, error: 'Client or project data missing' });
    }

    // 2. معالجة الملفات المرفوعة (إذا وجدت)
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // قم برفع الملف إلى Cloudinary (أو أي خدمة)
        const { imageURL, imageID } = await cloudinary.upload(file.path, 'projectFiles/property/images');
        uploadedImages.push({ fileURL: imageURL, fileID: imageID });
      }
    }

    // 3. دمج الصور مع بيانات المشروع
    const propertyData = {
      client,
      project: {
        ...project,
        imagesURLs: uploadedImages,
      },
    };

    // 4. حفظ في قاعدة البيانات
    const property = new Property(propertyData);
    await property.save();

    res.status(201).json({ success: true, data: property });
  } catch (error) {
    console.error('Error in createProperty:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// تعديل عقار (بالمعرف)
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!property) {
      return res.status(404).json({ success: false, error: 'العقار غير موجود' });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// حذف عقار
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return res.status(404).json({ success: false, error: 'العقار غير موجود' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// مشاهدة عقار واحد
exports.getProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ success: false, error: 'العقار غير موجود' });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// مشاهدة جميع العقارات (اختياري)
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};