const Report = require("../../model/ReportMatchClients");
const customerSchema = require("../../model/customerSchema");
const projectSchema = require("../../model/projectSchema");
const regionSchema = require("../../model/regionSchema");
const clientRequirementSchema = require("../../model/ClientRequirement");
const { calculateMatchScore } = require("../../utils/calculateMatchServies");

const SHORTLIST_LIMIT = 100;

/**
 * بناء كائن العميل للتحليلات (مع الدفعة والقسط)
 */
const buildAnalyticsCustomer = (customer) => ({
  customerId: customer._id,
  customerName: customer.fullName,
  firstPayment: Number(customer.firstPayment) || 0,
  monthlyInstallment: Number(customer.Paymentpermonth) || 0,
});

/**
 * بناء تحليلات التقرير
 */
const buildAnalytics = (allCustomers, matched, shortlistUnmatched) => {
  const analytics = {
    byPropertyType: [],
    byLocation: [],
    byFinancialAbility: [],
    byStatus: {
      matched: { count: 0, customers: [] },
      unmatched: { count: 0, customers: [] },
    },
    byRequireType: [],
    crossTabulation: [],
  };

  // 1. تصنيف حسب المطابقة
  const matchedCustomers = matched.map(c => buildAnalyticsCustomer({ _id: c.customerId, fullName: c.customerName }));
  const unmatchedCustomers = shortlistUnmatched.map(c => buildAnalyticsCustomer({ _id: c.customerId, fullName: c.customerName }));
  
  analytics.byStatus.matched.count = matchedCustomers.length;
  analytics.byStatus.matched.customers = matchedCustomers;
  analytics.byStatus.unmatched.count = unmatchedCustomers.length;
  analytics.byStatus.unmatched.customers = unmatchedCustomers;

  // 2. تصنيف حسب نوع العقار والتابع
  const typeMap = new Map();
  const requireTypeMap = new Map();

  for (const customer of allCustomers) {
    const reqs = customer.clientRequirements || [];
    for (const req of reqs) {
      const typeName = req.require || 'غير محدد';
      const subTypeName = req.requireType || 'غير محدد';

      // حسب نوع العقار
      if (!typeMap.has(typeName)) {
        typeMap.set(typeName, { 
          name: typeName, 
          count: 0, 
          customers: [], 
          subTypes: new Map() 
        });
      }
      const typeData = typeMap.get(typeName);
      typeData.count++;
      typeData.customers.push(buildAnalyticsCustomer(customer));

      // حسب التابع (داخل النوع)
      if (!typeData.subTypes.has(subTypeName)) {
        typeData.subTypes.set(subTypeName, { 
          name: subTypeName, 
          count: 0, 
          customers: [] 
        });
      }
      const subTypeData = typeData.subTypes.get(subTypeName);
      subTypeData.count++;
      subTypeData.customers.push(buildAnalyticsCustomer(customer));

      // حسب التابع (مستقل)
      if (!requireTypeMap.has(subTypeName)) {
        requireTypeMap.set(subTypeName, { 
          name: subTypeName, 
          count: 0, 
          customers: [] 
        });
      }
      const reqTypeData = requireTypeMap.get(subTypeName);
      reqTypeData.count++;
      reqTypeData.customers.push(buildAnalyticsCustomer(customer));
    }
  }

  analytics.byPropertyType = Array.from(typeMap.values()).map(item => ({
    ...item,
    subTypes: Array.from(item.subTypes.values()),
  }));
  analytics.byRequireType = Array.from(requireTypeMap.values());

  // 3. تصنيف حسب الموقع والمنطقة
  const locationMap = new Map();
  for (const customer of allCustomers) {
    const reqs = customer.clientRequirements || [];
    for (const req of reqs) {
      const locationName = req.rquireLocation || 'غير محدد';
      const regionName = req.requireRegion || 'غير محدد';

      if (!locationMap.has(locationName)) {
        locationMap.set(locationName, { 
          name: locationName, 
          count: 0, 
          customers: [], 
          regions: new Map() 
        });
      }
      const locData = locationMap.get(locationName);
      locData.count++;
      locData.customers.push(buildAnalyticsCustomer(customer));

      if (!locData.regions.has(regionName)) {
        locData.regions.set(regionName, { 
          name: regionName, 
          count: 0, 
          customers: [] 
        });
      }
      const regionData = locData.regions.get(regionName);
      regionData.count++;
      regionData.customers.push(buildAnalyticsCustomer(customer));
    }
  }

  analytics.byLocation = Array.from(locationMap.values()).map(item => ({
    ...item,
    regions: Array.from(item.regions.values()),
  }));

  // 4. تصنيف حسب القدرة المالية
  const ranges = [
    { label: 'أقل من 100,000', min: 0, max: 99999 },
    { label: '100,000 - 200,000', min: 100000, max: 200000 },
    { label: '200,000 - 300,000', min: 200000, max: 300000 },
    { label: 'أكثر من 300,000', min: 300000, max: Infinity },
  ];

  for (const range of ranges) {
    const customersInRange = allCustomers.filter(c => {
      const payment = Number(c.firstPayment) || 0;
      return payment >= range.min && payment <= range.max;
    });
    analytics.byFinancialAbility.push({
      range: range.label,
      min: range.min,
      max: range.max === Infinity ? null : range.max,
      count: customersInRange.length,
      customers: customersInRange.map(c => buildAnalyticsCustomer(c)),
    });
  }

  // 5. تحليلات متقاطعة (Cross-Tabulation)
  const crossTabMap = new Map();

  const paymentRanges = [
    { label: 'أقل من 100,000', min: 0, max: 99999 },
    { label: '100,000 - 200,000', min: 100000, max: 200000 },
    { label: '200,000 - 300,000', min: 200000, max: 300000 },
    { label: '300,000 - 500,000', min: 300000, max: 500000 },
    { label: 'أكثر من 500,000', min: 500000, max: Infinity },
  ];

  for (const customer of allCustomers) {
    const reqs = customer.clientRequirements || [];
    for (const req of reqs) {
      const require = req.require || 'غير محدد';
      const requireType = req.requireType || 'غير محدد';
      const location = req.rquireLocation || 'غير محدد';
      const region = req.requireRegion || 'غير محدد';
      const payment = Number(customer.firstPayment) || 0;

      let paymentRange = 'غير محدد';
      for (const range of paymentRanges) {
        if (payment >= range.min && payment <= range.max) {
          paymentRange = range.label;
          break;
        }
      }

      const key = `${require}|${requireType}|${location}|${region}|${paymentRange}`;
      if (!crossTabMap.has(key)) {
        crossTabMap.set(key, {
          require,
          requireType,
          location,
          region,
          paymentRange,
          customers: new Map(),
        });
      }
      const entry = crossTabMap.get(key);
      if (!entry.customers.has(customer._id.toString())) {
        entry.customers.set(customer._id.toString(), buildAnalyticsCustomer(customer));
      }
    }
  }

  analytics.crossTabulation = Array.from(crossTabMap.values()).map(item => ({
    require: item.require,
    requireType: item.requireType,
    location: item.location,
    region: item.region,
    paymentRange: item.paymentRange,
    count: item.customers.size,
    customers: Array.from(item.customers.values()),
  }));

  return analytics;
};

/**
 * توليد تقرير أسبوعي أو شهري
 */
const generateReport = async (type, startDate, endDate) => {
  console.log(`⏳ بدء توليد التقرير ${type}...`);

  const allCustomers = await customerSchema.find();
  const allProjects = await projectSchema.find();
  const allRegions = await regionSchema.find();
  const allClientRequirements = await clientRequirementSchema.find();

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

  for (const customer of allCustomers) {
    if (!customer.clientRequirements || customer.clientRequirements.length === 0) {
      unmatched.push({
        customerId: customer._id,
        customerName: customer.fullName,
        status: "unmatched",
        unmatchedReasons: ["لا يوجد متطلبات مسجلة للعميل"],
        score: 0,
        customerRequirements: [],
        closestMatch: null,
      });
      continue;
    }

    let bestMatch = null;
    let bestScore = 0;

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

    const customerReportData = {
      customerId: customer._id,
      customerName: customer.fullName,
      score: bestScore,
      status: bestScore >= 70 ? "matched" : "unmatched",
      customerRequirements: customer.clientRequirements.map(req => ({
        rquireLocation: req.rquireLocation,
        requireRegion: req.requireRegion,
        require: req.require,
        requireType: req.requireType,
      })),
    };

    if (bestMatch && bestScore >= 70) {
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

  const sortedUnmatched = unmatched.sort((a, b) => (b.score || 0) - (a.score || 0));
  const shortlistUnmatched = sortedUnmatched.slice(0, SHORTLIST_LIMIT);

  const summary = {
    totalCustomers: allCustomers.length,
    matchedCount: matched.length,
    unmatchedCount: unmatched.length,
    avgScore: matched.length > 0
      ? Math.round(matched.reduce((sum, c) => sum + c.score, 0) / matched.length)
      : 0,
  };

  const analytics = buildAnalytics(allCustomers, matched, shortlistUnmatched);

  const report = new Report({
    name: `تقرير ${type === 'weekly' ? 'أسبوعي' : 'شهري'} - ${new Date().toLocaleDateString('ar-EG')}`,
    type: type,
    startDate: startDate,
    endDate: endDate,
    generatedAt: new Date(),
    summary: summary,
    matchedCustomers: matched,
    shortlistUnmatched: shortlistUnmatched,
    analytics: analytics,
  });

  await report.save();
  console.log(`✅ تم حفظ التقرير، عدد المطابقين: ${matched.length}، غير المطابقين: ${unmatched.length}، القائمة المختصرة: ${shortlistUnmatched.length}`);
  console.log(`✅ عدد التوليفات المتقاطعة: ${analytics.crossTabulation.length}`);
  return report;
};

module.exports = { generateReport };