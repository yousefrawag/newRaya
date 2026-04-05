const customerSchema = require("../../model/customerSchema");
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
        fullName: getValue("إسم المشترى").toString().trim(),
        phoneNumber: getValue("جوال 1").toString().trim(),
        lengthofFollow: getValue("عدد المتابعات"),
        lengthofRequest: getValue("عدد متطلبات العميل"),
        secondaryPhoneNumber: getValue("جوال 2").toString().trim(),
        clientStatus: getValue("حالة العميل").toString().trim(),
        relatedStauts: getValue("وصف حالة العميل").toString().trim(),
        notes: getValue("ملاحظات").toString().trim(),
        project: getValue("المشروع المهتم به").toString().trim(),
        addBy: getValue("إسم المسوق").toString().trim(),
        userfollow: getValue("إسم المتابع").toString().trim(),
        currency: getValue("نوع العملة").toString().trim(),
        firstPayment: getValue("الدفعة الأولى").toString().trim(),
        isViwed: getValue("هل تمت المعاينة").toString().trim(),
        source: getValue("مصدر العميل").toString().trim(),
        clientwork: getValue("وظيفة العميل").toString().trim(),
        createdAt: getValue("تاريخ الإنشاء") ? new Date(getValue("تاريخ الإنشاء")) : new Date(),
        clientRequirements: [],
        SectionFollow: [],
        clientRequire :getValue("متطلبات العميل قديم").toString().trim(),
        clientendRequr: getValue("اخر ماتم التواصل مع  العميل").toString().trim()
    };

    // 2. معالجة متطلبات العميل
    const reqStr = getValue("متطلبات العميل جديد").toString().trim();
    if (reqStr && reqStr !== "لا يوجد") {
        finalData.clientRequirements = reqStr.split("|").map(r => {
            const p = r.split("-").map(d => d.trim());
            return { 
                rquireLocation: p[0] || "", 
                requireRegion: p[1] || "", 
                require: p[2] || "", 
                requireType: p[3] || "" 
            };
        });
    }
    const cleanArabicDateString = (str) => {
        if (!str) return "";
        let s = str.toString();
        
        // تحويل الأرقام العربية الشرقية (٠١٢٣٤٥٦٧٨٩) إلى (0123456789)
        const arabicNums = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
        arabicNums.forEach((num, i) => {
            s = s.replace(new RegExp(num, 'g'), i);
        });

        // إزالة رموز الـ Unicode المخفية (Control Characters) التي تسبب الفشل
        // هذه الخطوة هي الأهم لحل مشكلة "١٢‏/٢‏/٢٠٢٦"
        s = s.replace(/[\u200e\u200f\u202a-\u202e]/g, ""); 

        // إزالة أي مسافات أو حروف أخرى، نترك فقط الأرقام والفواصل
        return s.replace(/[^\d\/\-]/g, '').trim();
    };
const parseArabicDate = (dateStr) => {
        const cleaned = cleanArabicDateString(dateStr);
        if (!cleaned) return null;

        // تقسيم التاريخ (يوم/شهر/سنة)
        const parts = cleaned.split(/[\/\-]/);

        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // الشهور تبدأ من 0
            const year = parseInt(parts[2], 10);

            // التأكد من أن السنة كاملة
            const fullYear = year < 100 ? 2000 + year : year;

            const d = new Date(fullYear, month, day);
            if (!isNaN(d.getTime())) return d;
        }
        
        return null;
    };
    // 3. قسم الاتصالات (المتابعات) - الحل النهائي
// 3. معالجة قسم الاتصالات بناءً على أعمدة الجدول في الصورة
    const lastStatus = getValue("أخر حالة اتصال"); 
    const lastDateRaw = getValue("تاريخ أخر اتصال");
    const followDetails = getValue("أخر اتصال"); // العمود اللي فيه النص "مهتم - متبقي دفع..."
    const employeeName = getValue("إسم المتابع"); // العمود اللي فيه اسم الموظف

    if (followDetails && followDetails !== "لا يوجد") {
        
        // تحويل التاريخ بشكل سليم
let followDate = parseArabicDate(lastDateRaw) ||  new Date();

        finalData.SectionFollow.push({
            // حالة الاتصال (VIP, محتمل، إلخ)
            CustomerDealsatuts: lastStatus || "لا يوجد", 
            
            // تفاصيل الاتصال (النص المكتوب في خانة أخر اتصال)
            details: followDetails, 
            
            // هيكل الموظف (لازم أوبجكت fullName عشان الفرونت إيند يقرأه)
            userFullName: employeeName || "غير معروف",
            
            // تاريخ المتابعة
            createdAt: followDate
        });
      console.log("followDate" , followDate);
      console.log("followDetails" , followDetails);
      
        
    }

    return finalData;
};
// 2. الـ Controller الفعلي اللي هيرتبط بالـ Route
const insertMany = async (req, res) => {
    try {
        const { customers } = req.body; // دي المصفوفة الخام اللي جاية من الفرونت إيند

        if (!customers || !Array.isArray(customers)) {
            return res.status(400).json({ success: false, message: "بيانات غير صالحة" });
        }

        // تحويل كل السطور للشكل المطلوب في الـ DB
        const parsedCustomers = customers.map(row => processExcelRow(row));

        // حفظ البيانات كلها مرة واحدة في الداتابيز
        // ordered: false معناها لو رقم تليفون متكرر اضرب فيه Error بس كمل حفظ الباقي ومتقفش
       console.log("befroe insert" , parsedCustomers?.length);
       
        const result =  await customerSchema.insertMany(parsedCustomers, { ordered: false });
 console.log("after insert" , result?.length);
        res.status(200).json({ success: true, message: "تم استيراد العملاء بنجاح!" });
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
