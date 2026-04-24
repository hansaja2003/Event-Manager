import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registration: {
      type: mongoose.Schema.Types.ObjectId,// Optional reference to the registration record
      ref: "Registration",
      default: null,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Excused"],// Updated enum values
      default: "Present",
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
    markedBy: {// Optional reference to the user who marked the attendance
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ event: 1, user: 1 }, { unique: true });
attendanceSchema.index({ event: 1, status: 1, createdAt: -1 });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
