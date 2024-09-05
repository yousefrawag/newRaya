const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);
const missionSchema = mongoose.Schema(
  {
    _id: Number,
    title: {
      type: String,
    },

    description: {
      type: String,
    },
    deadline: Date,
    status: {
      type: String,
      enum: ["inprogress", "completed"],
      default: "inprogress",
    },
    assignedTo: {
      type: Number,
      ref: "users",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects",
    },
    assignedBy: {
      type: Number,
      ref: "users",
    },
    update: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
missionSchema.plugin(autoIncrement, { id: "missionID" });

module.exports = mongoose.model("missions", missionSchema);
