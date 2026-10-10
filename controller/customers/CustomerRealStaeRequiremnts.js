
const customerSchema = require("../../model/customerSchema");

const CustomerRealStaeRequiremnts = async (req, res) => {
  try {
    const customers = await customerSchema
      .find({
        "clientRequirements.0": { $exists: true },
      })
      .select({
        fullName: 1,
        phoneNumber: 1,
        secondaryPhoneNumber: 1,
        clientRequirements: 1,
      })
      .lean();

    const requirements = [];

    customers.forEach((customer) => {
      const clientRequirements = customer.clientRequirements || [];

      clientRequirements.forEach((requirement, index) => {
        requirements.push({
          customerId: customer._id,
          customerName: customer.fullName || "",
          customerPhone: customer.phoneNumber || "",
          customerSecondaryPhone:
            customer.secondaryPhoneNumber || "",

          // ID افتراضي للطلبات القديمة
          // ويدعم الطلبات التي لا تحتوي على _id
          requirementId:
            requirement._id?.toString() ||
            `${customer._id}_${index}`,

          requirementIndex: index,

          requirement: {
            rquireLocation: requirement.rquireLocation || "",
            requireRegion: requirement.requireRegion || "",
            require: requirement.require || "",
            requireType: requirement.requireType || "",
            currency: requirement.currency || "",
            cashOption: requirement.cashOption || "",
            firstPayment: requirement.firstPayment ?? null,
            Paymentpermonth:
              requirement.Paymentpermonth ?? null,
            requireDetails: requirement.requireDetails || "",
            createdAt: requirement.createdAt || null,
            updatedAt: requirement.updatedAt || null,
          },
        });
      });
    });

    // الأحدث أولًا، اعتمادًا على تاريخ الطلب إن وُجد
    requirements.sort((a, b) => {
      const dateA = a.requirement.createdAt
        ? new Date(a.requirement.createdAt).getTime()
        : 0;

      const dateB = b.requirement.createdAt
        ? new Date(b.requirement.createdAt).getTime()
        : 0;

      return dateB - dateA;
    });

    return res.status(200).json({
      success: true,
      totalRequirements: requirements.length,
      totalCustomers: customers.length,
      data: requirements,
    });
  } catch (error) {
    console.error("CustomerRealStaeRequiremnts Error:", error);

    return res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء جلب طلبات العملاء",
      error: error.message,
    });
  }
};

module.exports = CustomerRealStaeRequiremnts;
