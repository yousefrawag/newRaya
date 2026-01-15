// const customerSchema = require("../../model/customerSchema");

// module.exports.advancedSearch = async (req, res) => {
//   try {
//     const searchData = req.query;

//     console.log("======= SEARCH DEBUG START =======");
//     console.log("RAW REQUEST QUERY:", searchData);

//     let filter = {};
//     let appliedFilters = [];

//     // --------------------------------------------------------
//     // 🔥 1) الحقول اللي يتم البحث فيها بالكلمات المفتاحية
//     // --------------------------------------------------------
//     const searchableFields = [
//       "fullName",
//       "phone",
//       "region",
//       "governote",
//       "source",
//       "clientwork",
//       "clientStatus",
//       "project",
//       "notes",
//       "clientendRequr",
//       "followBy",
//       "addBy",
//       "relatedStauts"
//     ];

//     // --------------------------------------------------------
//     // 🔥 2) بحث عام بالكلمات المفتاحية
//     // 👉 يشتغل فقط لو CurrenTap !== info
//     // --------------------------------------------------------
//     if (searchData.allwords && searchData.CurrenTap !== "info") {
//       let words = [];

//       if (Array.isArray(searchData.allwords)) {
//         words = searchData.allwords.map(w => w.trim());
//       } else if (typeof searchData.allwords === "string") {
//         words = searchData.allwords.split(",").map(w => w.trim());
//       }

//       if (words.length > 0) {
//         filter.$or = [];

//         words.forEach(word => {
//           const regex = new RegExp(word, "i");

//           searchableFields.forEach(field => {
//             filter.$or.push({ [field]: regex });
//           });

//           // clientRequirements (Array of Objects)
//           filter.$or.push({
//             clientRequirements: {
//               $exists: true,
//               $ne: [],
//               $elemMatch: {
//                 $or: [
//                   { rquireLocation: regex },
//                   { requireRegion: regex },
//                   { require: regex },
//                   { requireType: regex }
//                 ]
//               }
//             }
//           });
//         });

//         appliedFilters.push(`allwords: [${words.join(", ")}]`);
//       }
//     }

//     // --------------------------------------------------------
//     // 🔥 3) بحث INFO (بحث مخصص)
//     // --------------------------------------------------------
//     if (searchData.CurrenTap === "info") {
//       console.log("📌 Applying INFO filters");

//       const fieldsToCheck = [
//         "addBy",
//         "userfollow",
//         "InstallmentType",
//         "clientendRequr"
//       ];

//       fieldsToCheck.forEach(field => {
//         if (searchData[field]?.toString().trim()) {
//           const value = searchData[field].toString().trim();
//           filter[field] = { $regex: value, $options: "i" };
//           appliedFilters.push(`${field}: "${value}"`);
//         }
//       });

//       const multiValueFields = [
//         "clientwork",
//         "source",
//         "clientStatus",
//         "governote",
//         "project",
//         "isViwed",
//         "region",
//         "relatedStauts",
//         "cashOption"
//       ];

//       multiValueFields.forEach(field => {
//         if (searchData[field]) {
//           let values = [];

//           if (typeof searchData[field] === "string") {
//             values = searchData[field].split(",").map(v => v.trim());
//           } else if (Array.isArray(searchData[field])) {
//             values = searchData[field].map(v => v.toString().trim());
//           }

//           if (values.length > 0) {
//             filter[field] = { $in: values };
//             appliedFilters.push(`${field}: [${values.join(", ")}]`);
//           }
//         }
//       });

//       // --------- Range Filters ---------
//       if (searchData.firstPaymentFrom || searchData.firstPaymentTo) {
//         filter.firstPayment = {};
//         if (searchData.firstPaymentFrom)
//           filter.firstPayment.$gte = searchData.firstPaymentFrom;
//         if (searchData.firstPaymentTo)
//           filter.firstPayment.$lte = searchData.firstPaymentTo;
//       }

//       if (searchData.followFrom || searchData.followTo) {
//         filter.$expr = {
//           $and: [
//             { $gte: [{ $size: { $ifNull: ["$SectionFollow", []] } }, +searchData.followFrom || 0] },
//             { $lte: [{ $size: { $ifNull: ["$SectionFollow", []] } }, +searchData.followTo || 999999] }
//           ]
//         };
//       }

//       if (searchData.ordersFrom || searchData.ordersTo) {
//         if (!filter.$and) filter.$and = [];

//         filter.$and.push({
//           $expr: {
//             $and: [
//               { $gte: [{ $size: { $ifNull: ["$clientRequirements", []] } }, +searchData.ordersFrom || 0] },
//               { $lte: [{ $size: { $ifNull: ["$clientRequirements", []] } }, +searchData.ordersTo || 999999] }
//             ]
//           }
//         });
//       }

//       // --------- clientRequirements INFO ---------
//       if (
//         searchData.rquireLocation?.length ||
//         searchData.requireRegion?.length ||
//         searchData.require?.length ||
//         searchData.requireType?.length
//       ) {
//         filter.clientRequirements = {
//           $exists: true,
//           $ne: [],
//           $elemMatch: {}
//         };

//         const reqFields = [
//           { key: "rquireLocation", value: searchData.rquireLocation },
//           { key: "requireRegion", value: searchData.requireRegion },
//           { key: "require", value: searchData.require },
//           { key: "requireType", value: searchData.requireType }
//         ];

//         reqFields.forEach(({ key, value }) => {
//           if (Array.isArray(value) && value.length > 0) {
//             filter.clientRequirements.$elemMatch[key] = {
//               $in: value.map(v => v.toString().trim())
//             };
//           }
//         });

//         if (Object.keys(filter.clientRequirements.$elemMatch).length === 0) {
//           delete filter.clientRequirements;
//         }
//       }
//     }

//     console.log("======= FINAL FILTER =======");
//     console.log(JSON.stringify(filter, null, 2));

//     const customers = await customerSchema.find(filter);

//     return res.json({
//       status: "success",
//       results: customers.length,
//       data: customers,
//       appliedFilters
//     });

//   } catch (error) {
//     console.error("❌ ADVANCED SEARCH ERROR:", error);
//     res.status(500).json({
//       status: "error",
//       message: error.message
//     });
//   }
// };
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
      "addBy",
      "relatedStauts"
    ];

    // --------------------------------------------------------
    // 🔥 2) بحث عام بالكلمات المفتاحية
    // 👉 يشتغل فقط لو CurrenTap !== info
    // --------------------------------------------------------
    if (searchData.allwords && searchData.CurrenTap !== "info") {
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

          searchableFields.forEach(field => {
            filter.$or.push({ [field]: regex });
          });

          // clientRequirements (Array of Objects)
          filter.$or.push({
            clientRequirements: {
              $exists: true,
              $ne: [],
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
      }
    }

    // --------------------------------------------------------
    // 🔥 3) بحث INFO (بحث مخصص)
    // --------------------------------------------------------
    if (searchData.CurrenTap === "info") {
      console.log("📌 Applying INFO filters");

      // حقول البحث بالنص
      const textSearchFields = [
        "addBy",
        "userfollow",
        "InstallmentType",
        "clientendRequr"
      ];

      textSearchFields.forEach(field => {
        if (searchData[field]?.toString().trim()) {
          const value = searchData[field].toString().trim();
          filter[field] = { $regex: value, $options: "i" };
          appliedFilters.push(`${field}: "${value}"`);
        }
      });

      // حقول البحث بقيم متعددة
      const multiValueFields = [
        "clientwork",
        "source",
        "clientStatus",
        "governote",
        "project",
        "isViwed",
        "region",
        "relatedStauts",
        "cashOption"
      ];

      multiValueFields.forEach(field => {
        if (searchData[field]) {
          let values = [];

          if (typeof searchData[field] === "string") {
            values = searchData[field].split(",").map(v => v.trim());
          } else if (Array.isArray(searchData[field])) {
            values = searchData[field].map(v => v.toString().trim());
          }

          if (values.length > 0) {
            filter[field] = { $in: values };
            appliedFilters.push(`${field}: [${values.join(", ")}]`);
          }
        }
      });

      // --------- فلترات النطاقات ---------
      // فلتر firstPayment
      if (searchData.firstPaymentFrom || searchData.firstPaymentTo) {
        filter.firstPayment = {};
        if (searchData.firstPaymentFrom)
          filter.firstPayment.$gte = Number(searchData.firstPaymentFrom);
        if (searchData.firstPaymentTo)
          filter.firstPayment.$lte = Number(searchData.firstPaymentTo);
      }

      // فلتر عدد المتابعات
      if (searchData.followFrom || searchData.followTo) {
        filter.$expr = {
          $and: [
            { $gte: [{ $size: { $ifNull: ["$SectionFollow", []] } }, +searchData.followFrom || 0] },
            { $lte: [{ $size: { $ifNull: ["$SectionFollow", []] } }, +searchData.followTo || 999999] }
          ]
        };
      }

      // فلتر عدد الطلبات
      if (searchData.ordersFrom || searchData.ordersTo) {
        if (!filter.$and) filter.$and = [];

        filter.$and.push({
          $expr: {
            $and: [
              { $gte: [{ $size: { $ifNull: ["$clientRequirements", []] } }, +searchData.ordersFrom || 0] },
              { $lte: [{ $size: { $ifNull: ["$clientRequirements", []] } }, +searchData.ordersTo || 999999] }
            ]
          }
        });
      }

      // --------- فلترات clientRequirements ---------
      const clientReqFields = [
        { key: "rquireLocation", value: searchData.rquireLocation },
        { key: "requireRegion", value: searchData.requireRegion },
        { key: "require", value: searchData.require },
        { key: "requireType", value: searchData.requireType }
      ];

      // التحقق مما إذا كان هناك أي قيم في حقول clientRequirements
      const hasClientReqFilters = clientReqFields.some(
        field => field.value && 
        (Array.isArray(field.value) ? field.value.length > 0 : field.value.toString().trim())
      );

      if (hasClientReqFilters) {
        filter.clientRequirements = {
          $exists: true,
          $ne: []
        };

        const elemMatchConditions = [];

        clientReqFields.forEach(({ key, value }) => {
          if (value) {
            let valuesArray = [];

            if (Array.isArray(value)) {
              valuesArray = value.map(v => v.toString().trim());
            } else if (typeof value === "string") {
              valuesArray = value.split(",").map(v => v.trim());
            } else {
              valuesArray = [value.toString().trim()];
            }

            // إزالة القيم الفارغة
            valuesArray = valuesArray.filter(v => v && v.trim() !== "");

            if (valuesArray.length > 0) {
              elemMatchConditions.push({
                [key]: { $in: valuesArray }
              });
              appliedFilters.push(`${key}: [${valuesArray.join(", ")}]`);
            }
          }
        });

        // تطبيق الفلتر على clientRequirements
        if (elemMatchConditions.length > 0) {
          filter.clientRequirements.$elemMatch = { 
            $and: elemMatchConditions 
          };
        } else {
          delete filter.clientRequirements;
        }
      }
    }

    console.log("======= FINAL FILTER =======");
    console.log(JSON.stringify(filter, null, 2));
    console.log("Applied Filters:", appliedFilters);

    const customers = await customerSchema.find(filter);

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
      message: error.message
    });
  }
};