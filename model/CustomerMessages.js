const mongoose = require("mongoose");

const CustomerMessagesSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        services: { type: String },
        visa: { type: String },
        arriveDate: { type: Date },
        outDate: { type: Date },
        hotelName: { type: String },
        numberOfUsers: { type: Number },
        numberOfRooms: { type: Number },
        ticketType: { type: String },
        flyingType: { type: String },
        Requesttype:String
    },
    { timestamps: true }
);

module.exports = mongoose.model("CustomerMessages", CustomerMessagesSchema);
