import mongoose from "mongoose";

const facultySchema = new mongoose.Schema(
    {
        facultyName: String,
        facultyEmail: {
            type: String,
            required: true,
            unique: true,
        },
        facultyMobile: String,
        facultyPassword: String,
        facultyProfile: String,
        adminId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "adminData",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const facultyModel = mongoose.model("facultyData", facultySchema);

export default facultyModel;
