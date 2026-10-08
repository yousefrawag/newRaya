const Supplier = require("../model/Supilers");

// إضافة شركة
const createSupplier = async (req, res) => {
  try {
    console.log("suplier-data-create" , req.body)
    const supplier = await Supplier.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: supplier,
    });
  } catch (error) {
    console.error("Create Supplier Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create supplier",
      error: error.message,
    });
  }
};


// تعديل شركة
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: supplier,
    });
  } catch (error) {
    console.error("Update Supplier Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update supplier",
      error: error.message,
    });
  }
};


// حذف شركة
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByIdAndDelete(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    console.error("Delete Supplier Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete supplier",
      error: error.message,
    });
  }
};


// مشاهدة بيانات شركة واحدة
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: supplier,
    });
  } catch (error) {
    console.error("Get Supplier Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get supplier",
      error: error.message,
    });
  }
};
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    console.error("Get All Suppliers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get suppliers",
      error: error.message,
    });
  }
};


module.exports = {
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierById ,
  getAllSuppliers
};