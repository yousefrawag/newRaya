const SectionSchema = require("../model/Sections")
const addSection = async (req, res, next) => {
    try {
        const { name, Features } = req.body;
        if (!name || !Features) return res.status(400).json({ message: "إسم القسم مطلوب" });

        const newMessage = await SectionSchema.create(req.body);
  

        res.status(201).json({ message: "تم إنشاء قسم جديد", newMessage });
    } catch (error) {
        next(error);
    }
};

// استرجاع جميع الرسائل
const getAllSections = async (req, res) => {
    const data = await SectionSchema.find({}).sort({ createdAt: -1 });
    res.status(200).json(data);
};

// استرجاع رسالة واحدة
const getSectionById = async (req, res) => {
    const { id } = req.params;
    const data = await SectionSchema.findById(id);
    if (!data) return res.status(404).json({ message: "لم يتم العثور على القسم." });
    res.status(200).json(data);
};

// حذف رسالة
const deleteSection = async (req, res) => {
    const { id } = req.params;
    const Section = await SectionSchema.findByIdAndDelete(id);
    if (!Section) return res.status(404).json({ message: "لم يتم العثور على القسم." });
    res.status(200).json({ message: "تم حذف القسم بنجاح." });
};

// تحديث رسالة
const updateSection = async (req, res) => {
    const { id } = req.params;
    const updatedMessage = await SectionSchema.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMessage) return res.status(404).json({ message: "لم يتم العثور على الرسالة." });
    res.status(200).json({ message: "تم تحديث الرسالة بنجاح.", updatedMessage });
};
module.exports = {addSection , getAllSections , updateSection , deleteSection , getSectionById}