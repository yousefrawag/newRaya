// services/reportService.js

const Report = require("../../model/ReportMatchClients");
const customerSchema = require("../../model/customerSchema");
const projectSchema = require("../../model/projectSchema");
const regionSchema = require("../../model/regionSchema");
const clientRequirementSchema = require("../../model/ClientRequirement");
const { calculateMatchScore } = require("../../utils/calculateMatchServies");

// عدد العملاء في القائمة المختصرة (أقرب غير المطابقين)
const SHORTLIST_LIMIT = 50; // يمكن تغييرها حسب الحاجة

/**
 * توليد تقرير أسبوعي أو شهري
 * @param {string} type - "weekly" أو "monthly"
 * @param {Date} startDate - بداية الفترة
 * @param {Date} endDate - نهاية الفترة
 * @returns {Object} التقرير المحفوظ
 */
const generateReport = async (type, startDate, endDate) => {
  console.log(`⏳ بدء توليد التقرير ${type}...`);

  // 1. جلب البيانات الأساسية
  const allCustomers = await customerSchema.find();
  const allProjects = await projectSchema.find();
  const allRegions = await regionSchema.find();
  const allClientRequirements = await clientRequirementSchema.find();

  // 2. استخراج جميع الشقق من جميع المشاريع (مع بيانات المشروع)
  let allProperties = [];
  allProjects.forEach(project => {
    project.properties.forEach(prop => {
      allProperties.push({
        ...prop.toObject(),
        projectId: project._id,
        projectName: project.projectName,
        governoate: project.governoate,
        city: project.city,
      });
    });
  });

  if (allProperties.length === 0) {
    console.warn("⚠️ لا توجد شقق في النظام، التقرير سيكون فارغاً.");
  }

  const matched = [];
  const unmatched = [];

  // 3. التكرار على كل عميل
  for (const customer of allCustomers) {
    // تخطي العميل إذا لم يكن لديه متطلبات
    if (!customer.clientRequirements || customer.clientRequirements.length === 0) {
      unmatched.push({
        customerId: customer._id,
        customerName: customer.fullName,
        status: "unmatched",
        unmatchedReasons: ["لا يوجد متطلبات مسجلة للعميل"],
        score: 0,
        customerRequirements: [], // لا توجد متطلبات
        closestMatch: null,
      });
      continue;
    }

    let bestMatch = null;
    let bestScore = 0;

    // 4. مقارنة العميل بكل الشقق المتاحة
    for (const property of allProperties) {
      const mockProject = {
        _id: property.projectId,
        projectName: property.projectName,
        governoate: property.governoate,
        city: property.city,
      };

      for (const req of customer.clientRequirements) {
        const result = calculateMatchScore(
          req,
          mockProject,
          property,
          customer,
          allRegions,
          allClientRequirements
        );

        if (result.totalScore > bestScore) {
          bestScore = result.totalScore;
          bestMatch = {
            property: property,
            project: mockProject,
            reasons: result.reasons,
            score: result.totalScore,
          };
        }
      }
    }

    // 5. بناء بيانات العميل للتقرير
    const customerReportData = {
      customerId: customer._id,
      customerName: customer.fullName,
      score: bestScore,
      status: bestScore >= 70 ? "matched" : "unmatched",
      // ✅ تخزين متطلبات العميل (لجميع الحالات)
      customerRequirements: customer.clientRequirements.map(req => ({
        rquireLocation: req.rquireLocation,
        requireRegion: req.requireRegion,
        require: req.require,
        requireType: req.requireType,
      })),
    };

    if (bestMatch && bestScore >= 70) {
      // عميل مطابق
      customerReportData.matchedProperty = {
        projectId: bestMatch.project._id,
        projectName: bestMatch.project.projectName,
        floorType: bestMatch.property.floorType || "N/A",
        floorTypeFlow: bestMatch.property.floorTypeFlow || "N/A",
        price: bestMatch.property.price || 0,
        downPayment: bestMatch.property.downPayment || 0,
        monthlyInstallment: bestMatch.property.monthlyInstallment || 0,
        governoate: bestMatch.project.governoate || "N/A",
        city: bestMatch.project.city || "N/A",
      };
      customerReportData.reasons = bestMatch.reasons;
      matched.push(customerReportData);
    } else {
      // عميل غير مطابق - نحلل الأسباب ونخزن أقرب تطابق
      const reasons = [];
      if (!bestMatch) {
        reasons.push("لا توجد شقق متاحة حالياً");
      } else if (bestScore < 70) {
        const locationReason = bestMatch.reasons.find(r => r.field === 'location');
        const typeReason = bestMatch.reasons.find(r => r.field === 'propertyType');
        const firstPaymentReason = bestMatch.reasons.find(r => r.field === 'firstPayment');
        const monthlyReason = bestMatch.reasons.find(r => r.field === 'monthly');

        if (locationReason && locationReason.score === 0) {
          reasons.push("الموقع المطلوب غير متوفر (لا يوجد مشروع في هذه المنطقة)");
        } else if (locationReason && locationReason.score < 30) {
          reasons.push("الموقع غير مطابق تماماً (اختلاف في المنطقة)");
        }

        if (typeReason && typeReason.score === 0) {
          reasons.push("نوع العقار المطلوب غير متوفر");
        } else if (typeReason && typeReason.score < 30) {
          reasons.push("نوع العقار قريب لكن ليس مطابقاً تماماً");
        }

        if (firstPaymentReason && firstPaymentReason.matchPercent < 70) {
          reasons.push(`الدفعة الأولى غير مناسبة (نسبة التوافق ${firstPaymentReason.matchPercent}%)`);
        }
        if (monthlyReason && monthlyReason.matchPercent < 70) {
          reasons.push(`القسط الشهري غير مناسب (نسبة التوافق ${monthlyReason.matchPercent}%)`);
        }

        if (reasons.length === 0) {
          reasons.push(`الدرجة الكلية (${bestScore}%) أقل من الحد الأدنى 70%`);
        }
      }
      customerReportData.unmatchedReasons = reasons;

      // ✅ تخزين أقرب تطابق (حتى لو كان أقل من 70)
      if (bestMatch) {
        customerReportData.closestMatch = {
          score: bestMatch.score,
          property: {
            projectId: bestMatch.project._id,
            projectName: bestMatch.project.projectName,
            floorType: bestMatch.property.floorType || "N/A",
            floorTypeFlow: bestMatch.property.floorTypeFlow || "N/A",
            price: bestMatch.property.price || 0,
            downPayment: bestMatch.property.downPayment || 0,
            monthlyInstallment: bestMatch.property.monthlyInstallment || 0,
            governoate: bestMatch.project.governoate || "N/A",
            city: bestMatch.project.city || "N/A",
          },
          reasons: bestMatch.reasons,
        };
      } else {
        customerReportData.closestMatch = null;
      }

      unmatched.push(customerReportData);
    }
  }

  // 6. ترتيب غير المطابقين حسب الـ Score (تنازلياً)
  const sortedUnmatched = unmatched.sort((a, b) => (b.score || 0) - (a.score || 0));

  // 7. أخذ القائمة المختصرة (أقرب 50 عميلاً غير مطابق)
  const shortlistUnmatched = sortedUnmatched.slice(0, SHORTLIST_LIMIT);

  // 8. حساب الملخص
  const summary = {
    totalCustomers: allCustomers.length,
    matchedCount: matched.length,
    unmatchedCount: unmatched.length, // العدد الإجمالي
    avgScore: matched.length > 0
      ? Math.round(matched.reduce((sum, c) => sum + c.score, 0) / matched.length)
      : 0,
  };

  // 9. حفظ التقرير في قاعدة البيانات
  const report = new Report({
    name: `تقرير ${type === 'weekly' ? 'أسبوعي' : 'شهري'} - ${new Date().toLocaleDateString('ar-EG')}`,
    type: type,
    startDate: startDate,
    endDate: endDate,
    generatedAt: new Date(),
    summary: summary,
    matchedCustomers: matched,
    shortlistUnmatched: shortlistUnmatched, // ✅ نخزن القائمة المختصرة فقط
  });

  await report.save();
  console.log(`✅ تم حفظ التقرير، عدد المطابقين: ${matched.length}، عدد غير المطابقين الكلي: ${unmatched.length}، القائمة المختصرة: ${shortlistUnmatched.length}`);
  return report;
};

module.exports = { generateReport };