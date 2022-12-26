import { useEffect, useState, useRef } from "react";
import { Container, Tabs, Tab, Row, Col, Modal, Form } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import InstructorReviewCard from "../components/instructor/InstructorReviewCard";
import API from "../functions/api";
import { Button } from "@mui/material";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import { useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";
export default function ViewInstructor() {
	const location = useLocation();
	const { id } = useParams();

	// const instructorId = location.state.instructorId;
	const 	instructorId = id;
	const userID = useSelector((state) => state.userReducer.user._id);
	const userType = useSelector((state) => state.userReducer.type);
	const [InstructorInfo, setInstructorInfo] = useState([]);
	const [InstructorCourses, setInstructorCourses] = useState([]);
	const [InstructorReviews, setInstructorReviews] = useState([]);

	//modal
	const [showReviewInstructorModal, setShowReviewInstructorModal] =
		useState(false);
	const handleCloseReviewInstructorModal = () =>
		setShowReviewInstructorModal(false);
	const handleShowReviewInstructorModal = () =>
		setShowReviewInstructorModal(true);
	const reviewInstructorDescription = useRef();

	const getInstructorCourses = async () => {
		try {
			const response = await API.get(
				`/instructors/${instructorId}/courses`
			);
			setInstructorCourses(response.data.courses);
		} catch (err) {
			console.log(err);
		}
	};

	const getInstructorReviews = async () => {
		try {
			const response = await API.get(
				`/instructors/${instructorId}/reviews`
			);
			setInstructorInfo(response.data);
			setInstructorReviews(response.data.reviews);
		} catch (err) {
			console.log(err);
		}
	};

	const [instructorRating, setInstructorRating] = useState(0);
	const handleInstructorRating = (rating) => {
		setInstructorRating(rating);
	};
	async function reviewInstructor() {
		let data = {
			rating: instructorRating,
			review: reviewInstructorDescription.current.value,
			trainee: userID,
			traineeType: userType,
		};

		handleCloseReviewInstructorModal();
		try {
			const response = await API.post(
				`/instructors/${instructorId}/review`,
				data
			);

			getInstructorReviews();
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		getInstructorCourses();
		getInstructorReviews();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [instructorId]);

	return (
		<Container className="my-3">
			<Row>
				<Col>
					<h1 className="fw-bold">{InstructorInfo.username}</h1>
				</Col>
				<Col className="d-flex justify-content-end">
					{userType !== "Instructor" && (
						<Button
							color="primary"
							variant="contained"
							endIcon={<RateReviewRoundedIcon />}
							onClick={handleShowReviewInstructorModal}
						>
							Review instructor
						</Button>
					)}
				</Col>
			</Row>

			<h5 className="text-muted">{InstructorInfo.email}</h5>
			<p className="lh-base">{InstructorInfo.biography}</p>
			<Tabs
				id="controlled-tab-example"
				defaultActiveKey="Courses"
				className="mb-3"
			>
				<Tab eventKey="Courses" title="Courses">
					{InstructorCourses.map((course, i) => (
						<CourseCard key={"course_" + i} course={course} />
					))}
				</Tab>
				<Tab eventKey="Reviews" title="Reviews">
					{InstructorReviews.map((review) => (
						<InstructorReviewCard
							key={"review_" + review.trainee.email}
							traineeEmail={review.trainee.email}
							review={review.review}
							rating={review.rating}
						/>
					))}
				</Tab>
			</Tabs>

			{/* <Col lg={8} className="d-flex flex-column justify-content-center m-auto">
				{Reviews.map((review) => (
					<InstructorReviewCard
						key={"review_" + review.trainee.email}
						traineeEmail={review.trainee.email}
						review={review.review}
						rating={review.rating}
					/>
				))}
			</Col> */}

			<Modal
				show={showReviewInstructorModal}
				onHide={handleCloseReviewInstructorModal}
			>
				<Modal.Header closeButton>
					<Modal.Title>Rate </Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="rateCourse">
							<Rating
								allowFraction="true"
								onClick={handleInstructorRating}
								/* Available Props */
							/>
						</Form.Group>
						<Form.Group
							className="mb-3"
							controlId="ratingDescription"
						>
							<Form.Label>Description</Form.Label>
							<Form.Control
								as="textarea"
								ref={reviewInstructorDescription}
								placeholder="Review"
								rows={3}
								style={{ height: "100px" }}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={handleCloseReviewInstructorModal}
					>
						Cancel
					</Button>
					<Button variant="primary" onClick={reviewInstructor}>
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
}
