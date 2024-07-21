import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    redirect: {
        type: String,
    },
    approved: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model("Announcement", announcementSchema)