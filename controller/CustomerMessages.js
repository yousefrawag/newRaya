const CustomerMessages = require("../model/CustomerMessages");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS,
    },
});

const sendEmail = async (email, name) => {
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: "شكراً لتواصلك معنا!",
        html: `
        <div style="direction: rtl; text-align: center; font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
            <h2 style="color: #333;">مرحبًا ${name}!</h2>
            <p style="font-size: 18px; color: #555;">تم استلام رسالتك بنجاح وسنقوم بالرد عليك قريبًا.</p>
            <p style="font-size: 16px; color: #777;">مع أطيب التحيات، فريق الدعم</p>
        </div>
        `,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) console.error("Error sending email:", error);
    });
};

// إضافة رسالة جديدة
const addMessage = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) return res.status(400).json({ message: "الاسم والبريد الإلكتروني مطلوبان." });

        const newMessage = await CustomerMessages.create(req.body);
        await sendEmail(email, name);

        res.status(201).json({ message: "تم إضافة الرسالة وإرسال البريد الإلكتروني بنجاح.", newMessage });
    } catch (error) {
        next(error);
    }
};

// استرجاع جميع الرسائل
const getAllMessages = async (req, res) => {
    const data = await CustomerMessages.find().sort({ createdAt: -1 });
    res.status(200).json(data);
};

// استرجاع رسالة واحدة
const getMessageById = async (req, res) => {
    const { id } = req.params;
    const message = await CustomerMessages.findById(id);
    if (!message) return res.status(404).json({ message: "لم يتم العثور على الرسالة." });
    res.status(200).json(message);
};

// حذف رسالة
const deleteMessage = async (req, res) => {
    const { id } = req.params;
    const message = await CustomerMessages.findByIdAndDelete(id);
    if (!message) return res.status(404).json({ message: "لم يتم العثور على الرسالة." });
    res.status(200).json({ message: "تم حذف الرسالة بنجاح." });
};

// تحديث رسالة
const updateMessage = async (req, res) => {
    const { id } = req.params;
    const updatedMessage = await CustomerMessages.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMessage) return res.status(404).json({ message: "لم يتم العثور على الرسالة." });
    res.status(200).json({ message: "تم تحديث الرسالة بنجاح.", updatedMessage });
};

module.exports = { addMessage, getAllMessages, getMessageById, deleteMessage, updateMessage };
