const projectSchema = require("../../model/projectSchema");
// 1. الدالة اللي بتظبط شكل السطر (نفس الكود اللي فات)
const processExcelRow = (row) => {
    const keys = Object.keys(row);
const getValue = (searchName) => {
        // بننظف الاسم المطلوب والأسماء اللي في الإكسيل وبنقارنهم بالظبط
        const key = keys.find(k => k.trim() === searchName.trim());
        if (key) return row[key]?.toString().trim() || "";
        
        // لو ملقاش بالظبط، يدور على "يحتوي على" كخطة بديلة (Fallback)
        const fallbackKey = keys.find(k => k.trim().includes(searchName));
        return row[fallbackKey]?.toString().trim() || "";
    };

    // 1. البيانات الأساسية
    const finalData = {
        projectName: getValue("اسم المشروع").toString().trim(),
        detailedAddress: getValue("عنوان").toString().trim(),
        projectSatatus: getValue("حاله المشروع"),
        estatePrice: getValue("سعر الشقه"),
        upEstatePrice: getValue("سعر الطابق الارضي").toString().trim(),
        RoofPrice: getValue("سعر الروف").toString().trim(),
        PriceLand: getValue("سعر لارض").toString().trim(),
        VailePrice: getValue("سعر الفيلا").toString().trim(),
        projectDetails: getValue("موصفات").toString().trim(),
        partmentFirstInstallment: getValue("دفعه الاوله للشقه").toString().trim(),
        VaileFirstInstallment: getValue("دفعه لاوله لطابق لارضي").toString().trim(),
        RoofFirstInstallment: getValue("دفعه الاوله للروف").toString().trim(),
        buildingAge: getValue("عمر البناء").toString().trim(),
        installments: getValue("امكانيه التقسيط").toString().trim(),
        estateType: getValue("نوع عقار").toString().trim(),
        operationType: getValue("نوع العمليه").toString().trim(),
        createdAt: getValue("تاريخ الإنشاء") ? new Date(getValue("تاريخ الإنشاء")) : new Date(),
       
        installmentPeriod :getValue("مدة التقسيط").toString().trim(),
        availableFloors: getValue("طوابق المتوفرة").toString().trim(),

        areaMatter: getValue("مساحه الشقه").toString().trim(),
        partmentDownMater: getValue("مساحه الشقه الارضي").toString().trim(),
        LandMater: getValue("مساحه لارض").toString().trim(),
        VaileMater: getValue("مساحه الفيلا").toString().trim(),
        RoofMater: getValue("مساحه الروف").toString().trim(),
        ProjectDelivery: getValue("تسليم المشروع").toString().trim(),
        projectNotes: getValue("ملاحظات عقار").toString().trim(),
   
    };

    // 2. معالجة متطلبات العميل
//     const reqStr = getValue("متطلبات العميل جديد").toString().trim();
//     if (reqStr && reqStr !== "لا يوجد") {
//         finalData.clientRequirements = reqStr.split("|").map(r => {
//             const p = r.split("-").map(d => d.trim());
//             return { 
//                 rquireLocation: p[0] || "", 
//                 requireRegion: p[1] || "", 
//                 require: p[2] || "", 
//                 requireType: p[3] || "" 
//             };
//         });
//     }
//     const cleanArabicDateString = (str) => {
//         if (!str) return "";
//         let s = str.toString();
        
//         // تحويل الأرقام العربية الشرقية (٠١٢٣٤٥٦٧٨٩) إلى (0123456789)
//         const arabicNums = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
//         arabicNums.forEach((num, i) => {
//             s = s.replace(new RegExp(num, 'g'), i);
//         });

//         // إزالة رموز الـ Unicode المخفية (Control Characters) التي تسبب الفشل
//         // هذه الخطوة هي الأهم لحل مشكلة "١٢‏/٢‏/٢٠٢٦"
//         s = s.replace(/[\u200e\u200f\u202a-\u202e]/g, ""); 

//         // إزالة أي مسافات أو حروف أخرى، نترك فقط الأرقام والفواصل
//         return s.replace(/[^\d\/\-]/g, '').trim();
//     };
// const parseArabicDate = (dateStr) => {
//         const cleaned = cleanArabicDateString(dateStr);
//         if (!cleaned) return null;

//         // تقسيم التاريخ (يوم/شهر/سنة)
//         const parts = cleaned.split(/[\/\-]/);

//         if (parts.length === 3) {
//             const day = parseInt(parts[0], 10);
//             const month = parseInt(parts[1], 10) - 1; // الشهور تبدأ من 0
//             const year = parseInt(parts[2], 10);

//             // التأكد من أن السنة كاملة
//             const fullYear = year < 100 ? 2000 + year : year;

//             const d = new Date(fullYear, month, day);
//             if (!isNaN(d.getTime())) return d;
//         }
        
//         return null;
//     };
//     // 3. قسم الاتصالات (المتابعات) - الحل النهائي
// // 3. معالجة قسم الاتصالات بناءً على أعمدة الجدول في الصورة
//     const lastStatus = getValue("أخر حالة اتصال"); 
//     const lastDateRaw = getValue("تاريخ أخر اتصال");
//     const followDetails = getValue("أخر اتصال"); // العمود اللي فيه النص "مهتم - متبقي دفع..."
//     const employeeName = getValue("إسم المتابع"); // العمود اللي فيه اسم الموظف

//     if (followDetails && followDetails !== "لا يوجد") {
        
//         // تحويل التاريخ بشكل سليم
// let followDate = parseArabicDate(lastDateRaw) ||  new Date();

//         finalData.SectionFollow.push({
//             // حالة الاتصال (VIP, محتمل، إلخ)
//             CustomerDealsatuts: lastStatus || "لا يوجد", 
            
//             // تفاصيل الاتصال (النص المكتوب في خانة أخر اتصال)
//             details: followDetails, 
            
//             // هيكل الموظف (لازم أوبجكت fullName عشان الفرونت إيند يقرأه)
//             userFullName: employeeName || "غير معروف",
            
//             // تاريخ المتابعة
//             createdAt: followDate
//         });
//       console.log("followDate" , followDate);
//       console.log("followDetails" , followDetails);
      
        
//     }

    return finalData;
};
// 2. الـ Controller الفعلي اللي هيرتبط بالـ Route
const insertMany = async (req, res) => {
    try {
        const { projects } = req.body; // دي المصفوفة الخام اللي جاية من الفرونت إيند

        if (!projects || !Array.isArray(projects)) {
            return res.status(400).json({ success: false, message: "بيانات غير صالحة" });
        }

        // تحويل كل السطور للشكل المطلوب في الـ DB
        const parsedProjects = projects.map(row => processExcelRow(row));

        // حفظ البيانات كلها مرة واحدة في الداتابيز
        // ordered: false معناها لو رقم تليفون متكرر اضرب فيه Error بس كمل حفظ الباقي ومتقفش
       console.log("befroe insert" , parsedProjects?.length);
       
        const result =  await projectSchema.insertMany(parsedProjects, { ordered: false });
 console.log("after insert" , result?.length);
        res.status(200).json({ success: true, message: "تم استيراد المشاريع بنجاح!" });
    } catch (error) {
        console.error("Error importing customers:", error);
        
        // لو الإيرور سببه تكرار مفتاح (رقم تليفون) بس حفظ جزء من البيانات
        if (error.code === 11000) {
             return res.status(200).json({ 
                 success: true, 
                 message: "تم استيراد العملاء الجدد بنجاح، وتم تخطي الأرقام المكررة." 
             });
        }
        
        res.status(500).json({ success: false, message: "حدث خطأ في السيرفر أثناء الاستيراد" });
    }
};

module.exports = insertMany;
