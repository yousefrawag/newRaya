// utils/matchingUtils.js

/**
 * تحويل القيمة إلى رقم بغض النظر عن نوعها (string, number)
 * مفيد جداً لأن الدفعات والأقساط قد تأتي كنصوص "450000" أو "1,500,000"
 */
const toNumber = (value) => {
  if (typeof value === 'number' && !isNaN(value)) return value;
  if (typeof value === 'string') {
    // إزالة الفواصل والمسافات والأحرف غير الرقمية (ما عدا النقطة للكسور العشرية)
    const cleaned = value.replace(/,/g, '').replace(/\s/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

/**
 * حساب درجة تطابق الموقع (30 نقطة كحد أقصى)
 */
const calculateLocationScore = (customerReq, project) => {
  // customerReq.rquireLocation مقابل project.governoate
  const locationMatch = customerReq.rquireLocation &&
    project.governoate &&
    customerReq.rquireLocation.toLowerCase() === project.governoate.toLowerCase();

  // customerReq.requireRegion مقابل project.city
  const regionMatch = customerReq.requireRegion &&
    project.city &&
    customerReq.requireRegion.toLowerCase() === project.city.toLowerCase();

  if (locationMatch && regionMatch) {
    return 30;
  }
  return 0;
};

/**
 * حساب درجة تطابق نوع العقار باستخدام التسلسل الهرمي (Exact -> Related -> Partial)
 * (30 نقطة كحد أقصى)
 */
const calculateTypeScoreWithHierarchy = (customerReq, property, allRegions, allClientRequirements) => {
  // الخطوة 1: مطابقة تامة (Exact Match)
  const exactTypeMatch = customerReq.require &&
    property.floorType &&
    customerReq.require.toLowerCase() === property.floorType.toLowerCase();

  const exactPropertyTypeMatch = customerReq.requireType &&
    property.floorTypeFlow &&
    customerReq.requireType.toLowerCase() === property.floorTypeFlow.toLowerCase();

  if (exactTypeMatch && exactPropertyTypeMatch) {
    return 30;
  }

  // الخطوة 2: هل نوع العقار موجود في relatedRegions الخاصة بمتطلب العميل؟
  const customerRequirementObj = allClientRequirements.find(
    req => req.name && req.name.toLowerCase() === (customerReq.require || '').toLowerCase()
  );

  if (customerRequirementObj && customerRequirementObj.relatedRegions) {
    const typeInRelated = customerRequirementObj.relatedRegions.some(
      region => region.toLowerCase() === (property.floorType || '').toLowerCase()
    );
    const propertyTypeInRelated = customerRequirementObj.relatedRegions.some(
      region => region.toLowerCase() === (property.floorTypeFlow || '').toLowerCase()
    );

    if (typeInRelated && propertyTypeInRelated) {
      return 25; // مطابقة عبر التصنيف (Related Match)
    } else if (typeInRelated || propertyTypeInRelated) {
      return 20; // مطابقة جزئية (Partial Match)
    }
  }

  // الخطوة 3: عكس البحث - هل متطلب العميل موجود في relatedRegions الخاصة بالعقار؟
  const propertyTypeObj = allRegions.find(
    region => region.name && region.name.toLowerCase() === (property.floorType || '').toLowerCase()
  );

  if (propertyTypeObj && propertyTypeObj.relatedRegions) {
    const customerTypeInRelated = propertyTypeObj.relatedRegions.some(
      region => region.toLowerCase() === (customerReq.require || '').toLowerCase()
    );
    const customerPropertyTypeInRelated = propertyTypeObj.relatedRegions.some(
      region => region.toLowerCase() === (customerReq.requireType || '').toLowerCase()
    );

    if (customerTypeInRelated && customerPropertyTypeInRelated) {
      return 25;
    } else if (customerTypeInRelated || customerPropertyTypeInRelated) {
      return 20;
    }
  }

  return 0; // لا يوجد تطابق
};

/**
 * استخراج تفاصيل نوع المطابقة (للـ Frontend)
 */
const getMatchedTypes = (customerReq, property, allRegions, allClientRequirements) => {
  // مطابقة تامة
  const exactTypeMatch = customerReq.require &&
    property.floorType &&
    customerReq.require.toLowerCase() === property.floorType.toLowerCase();

  const exactPropertyTypeMatch = customerReq.requireType &&
    property.floorTypeFlow &&
    customerReq.requireType.toLowerCase() === property.floorTypeFlow.toLowerCase();

  if (exactTypeMatch && exactPropertyTypeMatch) {
    return { matchType: "Exact Match" };
  }

  // مطابقة عبر التصنيف
  const customerRequirementObj = allClientRequirements.find(
    req => req.name && req.name.toLowerCase() === (customerReq.require || '').toLowerCase()
  );

  if (customerRequirementObj && customerRequirementObj.relatedRegions) {
    const typeInRelated = customerRequirementObj.relatedRegions.some(
      region => region.toLowerCase() === (property.floorType || '').toLowerCase()
    );
    const propertyTypeInRelated = customerRequirementObj.relatedRegions.some(
      region => region.toLowerCase() === (property.floorTypeFlow || '').toLowerCase()
    );

    if (typeInRelated && propertyTypeInRelated) {
      return { matchType: "Related Match" };
    }
  }

  return { matchType: "Partial Match" };
};

/**
 * حساب درجة الدفعة الأولى (20 نقطة كحد أقصى)
 * كلما قل الفرق بين دفعة العميل ودفعة الشقة، زادت النقاط
 */
const calculateFirstPaymentScore = (customer, property) => {
  const customerPayment = toNumber(customer.firstPayment);
  const propertyPayment = toNumber(property.downPayment);

  if (customerPayment === 0 || propertyPayment === 0) {
    return 0;
  }

  const difference = Math.abs(customerPayment - propertyPayment);
  const percentageDiff = (difference / Math.max(customerPayment, propertyPayment)) * 100;

  if (percentageDiff <= 10) {
    return 20;
  }

  // انخفاض تدريجي: 10% فرق = 20 نقطة، 100% فرق = 0 نقطة
  const score = 20 - ((percentageDiff - 10) / 90) * 20;
  return Math.max(0, Math.round(score));
};

/**
 * حساب درجة القسط الشهري (20 نقطة كحد أقصى)
 * كلما قل الفرق بين قسط العميل وقسط الشقة، زادت النقاط
 */
const calculateMonthlyScore = (customer, property) => {
  const customerMonthly = toNumber(customer.Paymentpermonth);
  const propertyMonthly = toNumber(property.monthlyInstallment);

  if (customerMonthly === 0 || propertyMonthly === 0) {
    return 0;
  }

  const difference = Math.abs(customerMonthly - propertyMonthly);
  const percentageDiff = (difference / Math.max(customerMonthly, propertyMonthly)) * 100;

  if (percentageDiff <= 10) {
    return 20;
  }

  const score = 20 - ((percentageDiff - 10) / 90) * 20;
  return Math.max(0, Math.round(score));
};

/**
 * الدالة الأساسية: حساب درجة المطابقة الكلية (Total Score)
 * تجمع بين الموقع، النوع، الدفعة الأولى، والقسط الشهري
 * وتعيد مصفوفة الأسباب (reasons) مع النتيجة الكلية
 */
const calculateMatchScore = (customerReq, project, property, customer, allRegions, allClientRequirements) => {
  const reasons = [];
  let totalScore = 0;

  // 1. الموقع والمنطقة (30 نقطة)
  const locationScore = calculateLocationScore(customerReq, project);
  if (locationScore > 0) {
    reasons.push({
      field: "location",
      customerValue: `${customerReq.rquireLocation || 'N/A'} - ${customerReq.requireRegion || 'N/A'}`,
      propertyValue: `${project.governoate || 'N/A'} - ${project.city || 'N/A'}`,
      score: locationScore
    });
    totalScore += locationScore;
  }

  // 2. نوع العقار (30 نقطة)
  const typeScore = calculateTypeScoreWithHierarchy(
    customerReq,
    property,
    allRegions,
    allClientRequirements
  );
  if (typeScore > 0) {
    const matchedTypes = getMatchedTypes(customerReq, property, allRegions, allClientRequirements);
    reasons.push({
      field: "propertyType",
      customerValue: `${customerReq.require || 'N/A'} - ${customerReq.requireType || 'N/A'}`,
      propertyValue: `${property.floorType || 'N/A'} - ${property.floorTypeFlow || 'N/A'}`,
      matchedVia: matchedTypes.matchType || "Exact Match",
      score: typeScore
    });
    totalScore += typeScore;
  }

  // 3. الدفعة الأولى (20 نقطة)
  const firstPaymentScore = calculateFirstPaymentScore(customer, property);
  if (firstPaymentScore > 0) {
    const matchPercent = Math.round(firstPaymentScore / 0.2);
    reasons.push({
      field: "firstPayment",
      customerValue: customer.firstPayment || 0,
      propertyValue: property.downPayment || 0,
      matchPercent: Math.min(matchPercent, 100)
    });
    totalScore += firstPaymentScore;
  }

  // 4. القسط الشهري (20 نقطة)
  const monthlyScore = calculateMonthlyScore(customer, property);
  if (monthlyScore > 0) {
    const matchPercent = Math.round(monthlyScore / 0.2);
    reasons.push({
      field: "monthly",
      customerValue: customer.Paymentpermonth || 0,
      propertyValue: property.monthlyInstallment || 0,
      matchPercent: Math.min(matchPercent, 100)
    });
    totalScore += monthlyScore;
  }

  return {
    totalScore: Math.round(totalScore),
    reasons: reasons
  };
};

// تصدير جميع الدوال لاستخدامها في أي مكان (المطابقة الفورية، التقارير، إلخ)
module.exports = {
  toNumber,
  calculateLocationScore,
  calculateTypeScoreWithHierarchy,
  getMatchedTypes,
  calculateFirstPaymentScore,
  calculateMonthlyScore,
  calculateMatchScore,
};