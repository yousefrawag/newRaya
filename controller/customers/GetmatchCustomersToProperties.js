const customerSchema = require("../../model/customerSchema");
const projectSchema = require("../../model/projectSchema");
const regionSchema = require("../../model/regionSchema");
const clientRequirementSchema = require("../../model/ClientRequirement");

const GetmatchCustomersToProperties = async (req, res, next) => {
  try {
    const { id, propertyId } = req.params;

    // Get the project with its properties
    const CurrentProject = await projectSchema
      .findById(id)
      .populate("addedBy");

    if (!CurrentProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Find the specific property in the project
    const property = CurrentProject.properties.find(
      item => item._id.toString() === propertyId
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    // Get all regions and client requirements for reference
    const allRegions = await regionSchema.find();
    const allClientRequirements = await clientRequirementSchema.find();

    // Get all customers
    const allCustomers = await customerSchema.find();

    // Filter and score customers
    const matchedCustomers = [];

    for (const customer of allCustomers) {
      // Skip customers without requirements
      if (!customer.clientRequirements || customer.clientRequirements.length === 0) {
        continue;
      }

      // Check each requirement for this customer
      for (const customerReq of customer.clientRequirements) {
        // Calculate scores
        const scoreResult = calculateMatchScore(
          customerReq,
          CurrentProject,
          property,
          customer,
          allRegions,
          allClientRequirements
        );

        // Only add if score >= 70
        if (scoreResult.totalScore >= 70) {
          matchedCustomers.push({
            customerId: customer._id,
            customerName: customer.fullName,
            score: scoreResult.totalScore,
            matchedProperty: {
              projectId: CurrentProject._id,
              projectName: CurrentProject.projectName || "Unknown Project",
              // بيانات الشقة حسب المسميات الصحيحة
              floorType: property.floorType || "N/A",
              floorTypeFlow: property.floorTypeFlow || "N/A",
              propertyStatus: property.propertyStatus || "N/A",
              price: property.price || 0,
              downPayment: property.downPayment || 0,
              monthlyInstallment: property.monthlyInstallment || 0,
              // بيانات الموقع
              governoate: CurrentProject.governoate || "N/A",
              city: CurrentProject.city || "N/A"
            },
            reasons: scoreResult.reasons
          });
          break; // Only add once per customer
        }
      }
    }

    // Sort by score descending
    matchedCustomers.sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      data: matchedCustomers,
      totalMatched: matchedCustomers.length
    });

  } catch (error) {
    console.error("Error in GetmatchCustomersToProperties:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Calculate match score between customer requirement and property
 */
const calculateMatchScore = (customerReq, project, property, customer, allRegions, allClientRequirements) => {
  const reasons = [];
  let totalScore = 0;

  // 1. Location & Region Matching (30%)
  // مقارنة: customer.rquireLocation مع project.governoate
  // و customer.requireRegion مع project.city
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

  // 2. Property Type Matching (30%)
  // مقارنة: customer.require مع property.floorType
  // و customer.requireType مع property.floorTypeFlow
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

  // 3. First Payment Matching (20%)
  // مقارنة: customer.firstPayment مع property.downPayment
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

  // 4. Monthly Payment Matching (20%)
  // مقارنة: customer.Paymentpermonth مع property.monthlyInstallment
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

/**
 * Calculate location/region score (30 points max)
 */
const calculateLocationScore = (customerReq, project) => {
  // مقارنة rquireLocation مع governoate
  const locationMatch = customerReq.rquireLocation && 
                       project.governoate && 
                       customerReq.rquireLocation.toLowerCase() === project.governoate.toLowerCase();
  
  // مقارنة requireRegion مع city
  const regionMatch = customerReq.requireRegion && 
                     project.city && 
                     customerReq.requireRegion.toLowerCase() === project.city.toLowerCase();

  if (locationMatch && regionMatch) {
    return 30;
  }
  
  return 0;
};

/**
 * Calculate property type score using hierarchical matching
 */
const calculateTypeScoreWithHierarchy = (customerReq, property, allRegions, allClientRequirements) => {
  // Step 1: Check exact match first
  // مقارنة require مع floorType
  const exactTypeMatch = customerReq.require && 
                        property.floorType && 
                        customerReq.require.toLowerCase() === property.floorType.toLowerCase();
  
  // مقارنة requireType مع floorTypeFlow
  const exactPropertyTypeMatch = customerReq.requireType && 
                                property.floorTypeFlow && 
                                customerReq.requireType.toLowerCase() === property.floorTypeFlow.toLowerCase();

  if (exactTypeMatch && exactPropertyTypeMatch) {
    return 30; // Full score for exact match
  }

  // Step 2: Check if property type is in the relatedRegions of the customer's requirement
  const customerRequirementObj = allClientRequirements.find(
    req => req.name && req.name.toLowerCase() === (customerReq.require || '').toLowerCase()
  );

  if (customerRequirementObj && customerRequirementObj.relatedRegions) {
    // Check if property.floorType matches any related region
    const typeInRelated = customerRequirementObj.relatedRegions.some(
      region => region.toLowerCase() === (property.floorType || '').toLowerCase()
    );
    
    // Check if property.floorTypeFlow matches any related region
    const propertyTypeInRelated = customerRequirementObj.relatedRegions.some(
      region => region.toLowerCase() === (property.floorTypeFlow || '').toLowerCase()
    );

    if (typeInRelated && propertyTypeInRelated) {
      return 25; // High score for related match
    } else if (typeInRelated || propertyTypeInRelated) {
      return 20; // Partial related match
    }
  }

  // Step 3: Check if customer requirement is in property's relatedRegions (reverse mapping)
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
      return 25; // High score for related match
    } else if (customerTypeInRelated || customerPropertyTypeInRelated) {
      return 20; // Partial related match
    }
  }

  return 0; // No match
};

/**
 * Get detailed matching information
 */
const getMatchedTypes = (customerReq, property, allRegions, allClientRequirements) => {
  // Check exact match
  const exactTypeMatch = customerReq.require && 
                        property.floorType && 
                        customerReq.require.toLowerCase() === property.floorType.toLowerCase();
  
  const exactPropertyTypeMatch = customerReq.requireType && 
                                property.floorTypeFlow && 
                                customerReq.requireType.toLowerCase() === property.floorTypeFlow.toLowerCase();

  if (exactTypeMatch && exactPropertyTypeMatch) {
    return { matchType: "Exact Match" };
  }

  // Check related match
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
 * Calculate first payment score (20 points max)
 */
const calculateFirstPaymentScore = (customer, property) => {
  const customerPayment = customer.firstPayment || 0;
  const propertyPayment = property.downPayment || 0;

  if (customerPayment === 0 || propertyPayment === 0) {
    return 0;
  }

  const difference = Math.abs(customerPayment - propertyPayment);
  const percentageDiff = (difference / Math.max(customerPayment, propertyPayment)) * 100;
  
  if (percentageDiff <= 10) {
    return 20;
  }
  
  const score = 20 - ((percentageDiff - 10) / 90) * 20;
  return Math.max(0, Math.round(score));
};

/**
 * Calculate monthly payment score (20 points max)
 */
const calculateMonthlyScore = (customer, property) => {
  const customerMonthly = customer.Paymentpermonth || 0;
  const propertyMonthly = property.monthlyInstallment || 0;

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

module.exports = GetmatchCustomersToProperties;