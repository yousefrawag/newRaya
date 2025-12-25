const customerSchema = require("../../model/customerSchema");

module.exports.advancedSearch = async (req, res) => {
  try {
    const searchData = req.query;

    console.log("======= SEARCH DEBUG START =======");
    console.log("RAW REQUEST QUERY:", searchData);

    let filter = {};
    let appliedFilters = [];

    // --------------------------------------------------------
    // 🔥 1) الحقول اللي يتم البحث فيها بالكلمات المفتاحية
    // --------------------------------------------------------
    const searchableFields = [
      "fullName",
      "phone",
      "region",
      "governote",
      "source",
      "clientwork",
      "clientStatus",
      "project",
      "notes",
      "clientendRequr",
      "followBy",
      "addBy"
    ];

    // --------------------------------------------------------
    // 🔥 2) بحث عام بالكلمات المفتاحية allwords
    // --------------------------------------------------------
    if (searchData.allwords) {
      let words = [];

      if (Array.isArray(searchData.allwords)) {
        words = searchData.allwords.map(w => w.trim());
      } else if (typeof searchData.allwords === "string") {
        words = searchData.allwords.split(",").map(w => w.trim());
      }

      if (words.length > 0) {
        filter.$or = [];

        words.forEach(word => {
          const regex = new RegExp(word, "i");

          // البحث في الحقول الأساسية
          searchableFields.forEach(field => {
            filter.$or.push({ [field]: regex });
          });

          // البحث داخل clientRequirements (Array of Objects)
          filter.$or.push({
            clientRequirements: {
              $elemMatch: {
                $or: [
                  { rquireLocation: regex },
                  { requireRegion: regex },
                  { require: regex },
                  { requireType: regex }
                ]
              }
            }
          });
        });

        appliedFilters.push(`allwords: [${words.join(", ")}]`);
        console.log("🔍 Full-text Word Search:", words);
      }
    }

    // --------------------------------------------------------
    // 🔥 3) باقي الفلاتر (لو CurrenTap = info)
    // --------------------------------------------------------
    if (searchData.CurrenTap === "info") {
      console.log("📌 Applying INFO filters");

     const fieldsToCheck = [
  'addBy',
  'userfollow',
  'region',
  'governote',
  'cashOption',
  'InstallmentType',
  'clientendRequr'
];

fieldsToCheck.forEach(field => {
  if (searchData[field] && searchData[field].toString().trim() !== '') {
    const value = searchData[field].toString().trim();

    filter[field] = {
      $regex: value,
      $options: 'i'
    };

    appliedFilters.push(`${field}: contains "${value}"`);
  }
});


      const multiValueFields = [
        'clientwork',
        'source',
        'clientStatus',
        'project',
        'isViwed'
      ];

      multiValueFields.forEach(field => {
        if (searchData[field]) {
          let values;

          if (typeof searchData[field] === 'string') {
            values = searchData[field].split(',').map(val => val.trim());
          } else if (Array.isArray(searchData[field])) {
            values = searchData[field].map(val => val.toString().trim());
          }

          if (values?.length > 0) {
            filter[field] = { $in: values };
            appliedFilters.push(`${field}: [${values.join(", ")}]`);
          }
        }
      });

      if (searchData.firstPaymentFrom || searchData.firstPaymentTo) {
        filter.firstPayment = {};
        if (searchData.firstPaymentFrom)
          filter.firstPayment.$gte = searchData.firstPaymentFrom;
        if (searchData.firstPaymentTo)
          filter.firstPayment.$lte = searchData.firstPaymentTo;

        appliedFilters.push(`firstPayment Range`);
      }
if (searchData.followFrom || searchData.followTo) {

  const from = parseInt(searchData.followFrom) || 0;
  const to = parseInt(searchData.followTo) || 999999;

  filter.$expr = {
    $and: [
      { $gte: [ { $size: { $ifNull: ["$SectionFollow", []] } }, from ] },
      { $lte: [ { $size: { $ifNull: ["$SectionFollow", []] } }, to ] }
    ]
  };
}


if (searchData.ordersFrom || searchData.ordersTo) {

  const from = parseInt(searchData.ordersFrom) || 0;
  const to = parseInt(searchData.ordersTo) || 999999;

  if (!filter.$and) filter.$and = [];

  filter.$and.push({
    $expr: {
      $and: [
        { 
          $gte: [
            { $size: { $ifNull: ["$clientRequirements", []] } }, 
            from 
          ] 
        },
        { 
          $lte: [
            { $size: { $ifNull: ["$clientRequirements", []] } }, 
            to 
          ] 
        }
      ]
    }
  });

  appliedFilters.push(`clientRequirements Count Range`);
}


      // فلتر clientRequirements من الـ INFO
      if (searchData.rquireLocation || searchData.requireRegion || searchData.require || searchData.requireType) {
        filter.clientRequirements = { $elemMatch: {} };

        const reqFields = [
          { key: 'rquireLocation', value: searchData.rquireLocation },
          { key: 'requireRegion', value: searchData.requireRegion },
          { key: 'require', value: searchData.require },
          { key: 'requireType', value: searchData.requireType }
        ];

        reqFields.forEach(field => {
          if (field.value && field.value.toString().trim() !== '') {
            filter.clientRequirements.$elemMatch[field.key] = field.value.toString().trim();
          }
        });

        if (Object.keys(filter.clientRequirements.$elemMatch).length === 0) {
          delete filter.clientRequirements;
        }
      }
    }

    console.log("======= FINAL FILTER =======");
    console.log(JSON.stringify(filter, null, 2));

    // --------------------------------------------------------
    // 🔥 4) تنفيذ البحث
    // --------------------------------------------------------
    const customers = await customerSchema.find(filter);

    console.log(`📊 RESULTS: ${customers.length} customers`);

    return res.json({
      status: "success",
      results: customers.length,
      data: customers,
      appliedFilters
    });

  } catch (error) {
    console.error("❌ ADVANCED SEARCH ERROR:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
 
    });
  }
};
