
const DealyemployeeReports = require("../../model/DealyemployeeReports");
const cloudinary = require("../../middleware/cloudinary");
const customerSchema = require("../../model/customerSchema");

const AddDealyReport = async (req, res) => {
  try {

    const { ReportType } = req.body;

    // =========================
    // PARSE CUSTOMERS
    // =========================
    const Customers = JSON.parse(
      req.body.Customers || "[]"
    );

    req.body.Customers = Customers;

    // =========================
    // VALIDATION
    // =========================
    if (!ReportType) {
      return res.status(400).json({
        mesg: "ReportType is required",
      });
    }

    // =========================
    // CREATE REPORT
    // =========================
    const addnew =
      new DealyemployeeReports(req.body);

    // =========================
    // UPLOAD FILES
    // =========================
    const docsURLs = [];

    if (req.files?.length > 0) {

      for (const file of req.files) {

        const {
          imageURL: fileURL,
          imageID: fileID,
        } = await cloudinary.upload(
          file.path,
          "projectFiles/docs"
        );

        docsURLs.push({
          fileURL,
          fileID,
        });

      }

    }

    addnew.docsURLs = docsURLs;

    // =========================
    // ADDED BY
    // =========================
    addnew.addedBy = req.token.id;

    // =========================
    // SAVE REPORT
    // =========================
    await addnew.save();

    // =========================
    // FOLLOW SECTION
    // =========================
    const newSectionFollow = {
      details: req.body.endcontact,

      detailsDate:
        req.body.ContactDate,

      user: req.token.id,

      meeting:
        req.body.customerDate,

      ReportType:
        req.body.ReportType,

      ReportTypeDescriep:
        req.body.ReportTypeDescriep,

      contactNotes:
        req.body.notes,

      CustomerDealsatutsDescrep:
        req.body.CustomerDealsatutsDescrep,

      CustomerDealsatuts:
        req.body.CustomerDealsatuts,

      nextReminderDate:
        req.body.nextReminderDate
          ? new Date(
              req.body.nextReminderDate
            )
          : null,

      createdAt: new Date(),

      reportId: addnew._id,
    };

    // =========================
    // UPDATE CUSTOMERS
    // =========================
    if (Customers?.length > 0) {

      await customerSchema.updateMany(
        {
          _id: { $in: Customers },
        },
        {
          $push: {
            SectionFollow:
              newSectionFollow,
          },
        }
      );

    }

    // =========================
    // RESPONSE
    // =========================
    return res.status(200).json({
      mesg:
        "Report added successfully",
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      mesg: "Server Error",
      error: error.message,
    });

  }
};

module.exports = AddDealyReport;

