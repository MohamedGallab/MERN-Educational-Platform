const express = require("express");

const {
	getCourse,
	getCourses,
	updateCourse,
	reportCourse,
	populateReports,
	getReports,
	reviewCourse,
} = require("../controllers/courseController");

const router = express.Router();

// Report a Course
router.get("/reports", getReports);

// Report a Course
router.put("/:id/report", reportCourse);

// Report a Course
router.get("/:id/report", populateReports);

// GET a course
router.get("/:id", getCourse);

// PUT a Course
router.put("/:id", updateCourse);

// GET all Courses
router.get("/", getCourses);

// Review Course
router.post("/:courseId/review", reviewCourse);

module.exports = router;
