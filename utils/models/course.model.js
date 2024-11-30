import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseTitle: String,
    courseContent: String,
    courseAuthor: String,
    coursePdf: String,
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "facultyData",
        required: true,
    }
},{
    timestamps: true,
})

const courseModel = mongoose.model("courseData", courseSchema);

export default courseModel;