const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        enum: ['1ኛ ክፍል' , '2ኛ ክፍል', '3ኛ ክፍል', '4ኛ ክፍል', '5ኛ ክፍል', '6ኛ ክፍል', '7ኛ ክፍል', '8ኛ ክፍል', '9ኛ ክፍል', '10ኛ ክፍል', 'ዮሐንስ ቀዳማይ', 'ዮሐንስ ካልዐይ', 'ዮሐንስ ሳልሳይ', 'ዮሐንስ ማዕክላዊ'],
        required: true,
    },
    start_date: {
        type: String,
        required: true,
    },
    end_date: {
        type: String,
        required: false,
    },
    teacher: {
        type: String,
        required: false,
    },
    status: {
        type: Boolean,
        default: true,
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},
{
    timestamps: true,
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;