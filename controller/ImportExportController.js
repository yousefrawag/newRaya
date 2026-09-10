const mongoose = require('mongoose');
const ImportRequest = require('../model/requestProduct');

// ============ إنشاء طلب جديد ============
const createImportRequest = async (req, res) => {
  try {
    const {
      name,
      mobile,
      productName,
      productLink,
      quantity,
      manufacturerCountry,
      deliveryCity,
      additionalDetails,
    } = req.body;

    if (!name || !mobile || !productName || !deliveryCity) {
      return res.status(400).json({
        success: false,
        message: 'الاسم، رقم الجوال، اسم المنتج، ومدينة الاستلام كلها مطلوبة',
      });
    }

    const newRequest = new ImportRequest({
      name,
      mobile,
      productName,
      productLink,
      quantity,
      manufacturerCountry,
      deliveryCity,
      additionalDetails,
    });

    await newRequest.save();

    res.status(201).json({
      success: true,
      message: 'تم إرسال الطلب بنجاح',
      data: newRequest,
    });
  } catch (error) {
    console.error('Error creating import request:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال الطلب',
      error: error.message,
    });
  }
};

// ============ جلب جميع الطلبات ============
const getImportRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await ImportRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ImportRequest.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching import requests:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الطلبات',
      error: error.message,
    });
  }
};

// ============ جلب طلب واحد ============
const getImportRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'معرف غير صالح',
      });
    }

    const request = await ImportRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود',
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error('Error fetching import request:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب الطلب',
      error: error.message,
    });
  }
};

// ============ تحديث طلب ============
const updateImportRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'معرف غير صالح',
      });
    }

    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedRequest = await ImportRequest.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود',
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم تحديث الطلب بنجاح',
      data: updatedRequest,
    });
  } catch (error) {
    console.error('Error updating import request:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تحديث الطلب',
      error: error.message,
    });
  }
};

// ============ حذف طلب ============
const deleteImportRequest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'معرف غير صالح',
      });
    }

    const deletedRequest = await ImportRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود',
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم حذف الطلب بنجاح',
      data: deletedRequest,
    });
  } catch (error) {
    console.error('Error deleting import request:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء حذف الطلب',
      error: error.message,
    });
  }
};

module.exports = {
  createImportRequest,
  getImportRequests,
  getImportRequestById,
  updateImportRequest,
  deleteImportRequest,
};