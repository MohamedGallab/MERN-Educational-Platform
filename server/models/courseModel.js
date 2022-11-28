const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const subtitleSchemaModule = require("./schemas/subtitleSchema");
const subtitleSchema = subtitleSchemaModule.subtitleSchema;
const exerciseSchema = subtitleSchemaModule.exerciseSchema;

const ratingSchema = new Schema({
	rating: Number,
	review: String,
	trainee: Schema.ObjectId, //Reference trainee.
});

const reportSchema = new Schema({
	title: String,
	type: {
		type: String,
		required: true,
		enum: ["Technical", "Financial", "Other"],
	},
	isResolved: Boolean,
	isSeen: Boolean,
	description: String,
	author: {
		type: Schema.Types.ObjectId,
		required: true,
		// Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
		// will look at the `onModel` property to find the right model.
		refPath: "reports.traineeType",
	},
	traineeType: {
		type: String,
		required: true,
		enum: ["Trainee", "CorprateTrainee"],
	},
});

const courseSchema = new Schema(
	{
		title: String,
		subjects: [String],
		summary: String,
		originalPrice: Number,
		discount: Number,
		price: Number,
		totalHours: Number,
		previewVideo: String,
		instructors: [{ type: Schema.ObjectId, ref: "Instructor" }],
		subtitles: [subtitleSchema],
		exam: exerciseSchema,
		rating: Number,
		reviews: [ratingSchema],
		popularity: Number,
		reports: [reportSchema],
	},
	{ timestamps: true }
);

courseSchema.pre("save", function (next) {
	this.price =
		this.originalPrice - (this.originalPrice * this.discount) / 100;
	this.popularity = this.reviews.length;
	this.totalHours = 0;
	this.subtitles.forEach(subtitle => {
		this.totalHours += subtitle.hours;
	});
	next();
});

module.exports = mongoose.model("Course", courseSchema);