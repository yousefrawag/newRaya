const ExpensessSchema = require("../../model/Expensess")
const useschema = require("../../model/userSchema")
const nodemailer = require("nodemailer");
const notvcation = require("../../model/notificationSchema")
const path = require("path");
const addExpenses = async (req , res) => {
    const {user} = req.body
    if(user){
        const addnew = await ExpensessSchema.create(req.body)
        const currentuser = await useschema.findById(user)
           const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASS,
              },
            });
    // addnew.type for expenses type 
    // addnew.total for total
    // addnew.curenccy for curenccy
        await notvcation.create(
            {
      user: user,  // Ensure this is a number if required
      employee: req.token?.id,
      levels: "expensess",
      type: "add",
      allowed:addnew?._id,
      message:"تهانيا تم إضافة مصروف جديد لك 💰",
    }
    
        )
        
       const mailOptions = {
  from: process.env.GMAIL_EMAIL,
  to: currentuser.email,
  subject: `📢 تم إضافة مصروف جديد (${addnew.type})`,
  html: `
    <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px; color: #333; line-height: 1.8;">
      <h2 style="color: #218bc7;">مرحبًا ${currentuser.fullName} 👋</h2>
      
      <p>نود إعلامك بأنه تم إضافة مصروف جديد لحسابك في نظام <strong>الراية للتطوير العقاري</strong>، والتفاصيل كالتالي:</p>

      <ul style="list-style: none; padding: 0;">
        <li>📝 <strong>نوع المصروف:</strong> ${addnew.type}</li>
        <li>💰 <strong>المبلغ:</strong> ${addnew.total} ${addnew.curenccy}</li>
      </ul>

      <p>للاطلاع على تفاصيل حسابك أو إدارة المصروفات، يمكنك تسجيل الدخول عبر الرابط التالي:</p>

      <div style="text-align: center; margin-top: 20px;">
        <a href="${process.env.CLIENT_URL}" 
          style="display: inline-block; padding: 12px 24px; background-color: #218bc7; color: white; text-decoration: none; font-size: 16px; border-radius: 5px;">
          🔐 تسجيل الدخول إلى الحساب
        </a>
      </div>

      <p style="margin-top: 20px; font-size: 12px; color: #888;">📌 هذا البريد مرسل تلقائيًا، لا ترد عليه.</p>
    </div>
  `,
};

        
            // Send Email
            await transporter.sendMail(mailOptions);
       return res.status(200).json({mesg:"Expensess add sucuufuly" , addnew});
    } else {
        res.status(400).json({mesg:"name is required"})
    }

}
module.exports = addExpenses