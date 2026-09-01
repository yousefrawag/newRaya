// controllers/propertyController.js
const Property = require('../model/AskShareProperty');

// إضافة عقار جديد
exports.createProperty = async (req, res) => {

  try {
    console.log(req.body)
    const property = new Property(req.body);
    await property.save();
    res.status(201).json({ success: true, data: property });
  } catch (error) {
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