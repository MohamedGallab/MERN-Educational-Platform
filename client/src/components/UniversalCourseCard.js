import {
	Button,
	Badge,
	Card,
	CardGroup,
	Col,
	Row,
	ListGroup,
	Modal,
	Form,
} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Stars from "./Stars";
import { useDispatch, useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";
import API from "../functions/api";
import { setInfo, clearInfo } from "../redux/courseInfoSlice";

import {
	setExamsAndSubtitles,
	clearCreateCourse,
} from "../redux/createCourseSlice";

import { addNotification } from "../redux/notificationsSlice";
import { deleteCourseInstructor } from "../redux/userSlice";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function UniversalCourseCard(props) {
	const dispatch = useDispatch();
	const MySwal = withReactContent(Swal);

	const course = props.course;
	const cardType = props.cardType;

	//deluxe EDITION STUFF
	const instructorId = props.instructorId;

	//DISCOUNT EDITION STUFF
	const handleCheck = props.handleCheck;
	const defaultChecked = props.defaultChecked;
	const cardColor = props.bg;

	const user = useSelector((state) => state.userReducer.user);
	const userType = useSelector((state) => state.userReducer.type);
	const currency = useSelector((state) => state.userReducer.user.currency);

	//price data (owned/refunded/price etc)
	const [traineeOwnsCourse, setTraineeOwnsCourse] = useState(false);
	const [traineeRequestedRefund, setTraineeRequestedRefund] = useState(false);

	const [
		corpTraineeAlreadyRequestedAccess,
		setCorpTraineeAlreadyRequestedAccess,
	] = useState(false);
	const [corpTraineeRequestStatus, setCorpTraineeRequestStatus] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		setTraineeOwnsCourse(false);
		setTraineeRequestedRefund(false);
		if (userType === "Trainee" || userType === "CorporateTrainee") {
			user.courses.forEach((userCourse) => {
				if (userCourse.course === course._id) {
					if (userCourse.requestedRefund) {
						setTraineeRequestedRefund(true);
					} else {
						setTraineeOwnsCourse(true);
					}
				}
			});
		}

		setCorpTraineeAlreadyRequestedAccess(false);
		setCorpTraineeRequestStatus("");
		if (userType === "CorporateTrainee") {
			user.requests.forEach((request) => {
				if (request.courseId === course._id) {
					setCorpTraineeAlreadyRequestedAccess(true);
					setCorpTraineeRequestStatus(request.status);
				}
			});
		}
	}, [course]);

	//BASIC COURSE CARD FOR TRAINEE/CORP TRAINEE

	const handleViewCourse = () => {
		if (userType === "Administrator") {
			navigate("/admin/courses/" + course._id);
		} else {
			navigate("/" + userType.toLowerCase() + "/courses/" + course._id);
		}
	};

	function continueCourse() {
		navigate(
			"/" +
				userType.toLowerCase() +
				"/courses/" +
				course._id +
				"/continueCourse",
			{
				state: {
					course: { _id: course._id, title: course.title },
				},
			}
		);
	}

	//deluxe EDITION STUFF : EDIT COURSE fOR instructor TO EDIT SHIT
	const handleEditCourse = () => {
		dispatch(setInfo(course));
		dispatch(setExamsAndSubtitles(course));
		navigate("../createCourse", {
			state: { status: course.status, _id: course._id },
		});
	};

	const handlePublishCourse = async () => {
		await API.put(`/courses/${course._id}`, { status: "Published" });
		dispatch(clearInfo());
		dispatch(clearCreateCourse());
		
		MySwal.fire({
			toast: true,
			position: 'bottom-end',
			showConfirmButton: false,
			timer: 4000,
			title: <strong>Create Course</strong>,
			html: <i>Course Published Successfully!</i>,
			icon: "success",
			timerProgressBar: true,
			grow:'row'
		});
		props.setDetectChange(!props.DetectChange);
	};

	const handleCloseCourse = async () => {
		await API.put(`/courses/${course._id}`, { status: "Closed" });
		dispatch(clearInfo());
		dispatch(clearCreateCourse());
		MySwal.fire({
			toast: true,
			position: 'bottom-end',
			showConfirmButton: false,
			timer: 4000,
			title: <strong>Create Course</strong>,
			html: <i>Course Closed Successfully!</i>,
			icon: "success",
			timerProgressBar: true,
			grow:'row'
		});
		props.setDetectChange(!props.DetectChange);
	};

	const handleDeleteDraft = async () => {
		await API.delete(`/courses/${instructorId}`, {
			data: { courseId: props.course._id },
		});

		dispatch(clearInfo());
		dispatch(clearCreateCourse());
		dispatch(deleteCourseInstructor({ courseId: props.course._id }));
		
		MySwal.fire({
			toast: true,
			position: 'bottom-end',
			showConfirmButton: false,
			timer: 4000,
			title: <strong>Delete Course</strong>,
			html: <i>Draft Deleted Successfully!</i>,
			icon: "success",
			timerProgressBar: true,
			grow:'row'
		});
		props.setDetectChange(!props.DetectChange);
	};

	const displayInstructorEditCourseButtons = () => {
		switch (course.status) {
			case "Draft": {
				return (
					<>
						<Button className="me-1" onClick={handleDeleteDraft}>
							Delete Course
						</Button>
						<Button className="me-1" onClick={handleEditCourse}>
							Open Draft
						</Button>
						{/* <Button className="me-1" onClick={handlePublishCourse}>
							Publish Course
						</Button> */}
					</>
				);
			}
			case "Published": {
				return (
					<>
						<Button className="me-1" onClick={handleCloseCourse}>
							Close Course
						</Button>
					</>
				);
			}
			default: {
				return <></>;
			}
		}
	};

	return (
		<Card className="my-3" bg={cardColor ? cardColor : "light"}>
			<Card.Header>
				<Row>
					<Card.Title className="courseCardTitle pe-0">
						{course.title}{" "}
					</Card.Title>

					<p className="textFit my-auto text-muted">
						{Math.ceil(course.totalSeconds / 3600)} Hours
					</p>

					<Col sm={4}>
						{course.subjects.map((subject, i) =>
							i <= 1 ? (
								<Badge key={"subject_badge_" + i} className="p-2 mx-1 ">
									{subject}
								</Badge>
							) : (
								""
							)
						)}
						{course.subjects.length >= 2 && <span>...</span>}
					</Col>
					<Col className="starsContainer fitWidth" sm={4} md={4} lg={2}>
						<Rating
							key={"stars_" + course._id}
							id={course._id}
							allowFraction="true"
							initialValue={course.rating ? course.rating : 0}
							readonly="true"
							size={20}
						/>
					</Col>
				</Row>
				{course.status === "Closed" ? (
					<Badge pill bg="dark" className="mx-1 ">
						{course.status}
					</Badge>
				) : (
					((userType === "Instructor" &&
						course.instructors.some((courseInstructor) => {
							return courseInstructor._id === user._id;
						})) ||
						userType === "Administrator") &&
					cardType === "Deluxe" && (
						<Badge
							pill
							bg={course.status === "Draft" ? "secondary" : "success"}
						>
							{course.status}
						</Badge>
					)
				)}
				{course.status === "Published" &&
					course.rank > 0 &&
					course.rank < 6 && (
						<Badge pill bg="danger" className=" mx-1 ">
							<span style={{ color: "#ffffff" }}>
								#{course.rank} in Popularity
							</span>
						</Badge>
					)}
			</Card.Header>
			<Card.Body>
				<Row>
					<h6 className="text-muted textFit courseCardLabel  my-1">
						Instructor
					</h6>

					{course.instructors.map((instructor, i) => (
						<>
							<Button
								className="p-0 me-2 fitWidth"
								variant="link"
								onClick={() => {
									if (userType === "Trainee") {
										navigate("/trainee/viewInstructor/" + instructor._id);
									} else if (userType === "CorporateTrainee") {
										navigate(
											"/corporateTrainee/viewInstructor/" + instructor._id
										);
									} else if (userType === "Instructor") {
										navigate("/instructor/viewInstructor/" + instructor._id);
									} else if (userType === "Administrator") {
										navigate("/admin/viewInstructor/" + instructor._id);
									} else {
										navigate("/guest/viewInstructor/" + instructor._id);
									}
								}}
								key={"instructor_" + i}
							>
								{instructor.firstName
									? instructor.firstName + " " + instructor.lastName
									: instructor.username}
							</Button>
						</>
					))}
				</Row>
				<br />
				<Row>
					<Col sm={8}>
						<h6 className="text-muted textFit courseCardLabel">Summary</h6>

						<Card.Text>
							{course.summary.length < 200
								? course.summary
								: course.summary.substring(0, 200) + "..."}
						</Card.Text>
					</Col>
					<Col sm={1} className="priceContainer textFit  justify-content-end">
						{traineeOwnsCourse ? (
							<h6>Owned</h6>
						) : traineeRequestedRefund ? (
							<h6>Requested Refund</h6>
						) : userType !== "CorporateTrainee" ? (
							course.status === "Published" &&
							(course.promotion.discount &&
							course.promotion.discount !== 0 &&
							course.promotion.endDate >= new Date().toISOString() &&
							course.promotion.startDate <= new Date().toISOString() ? (
								<>
									{Math.trunc(course.price * 100) === 0 ? (
										<h5>FREE</h5>
									) : (
										<>
											<h6>{course.price + " " + currency}</h6>

											<p>
												<del>{course.originalPrice}</del>{" "}
												<span style={{ color: "red" }}>
													{course.promotion.discount + "% OFF"}
												</span>
											</p>
										</>
									)}
								</>
							) : (
								<h6 style={{ display: "inline-block" }}>
									{Math.trunc(course.originalPrice * 100) === 0
										? "FREE"
										: course.originalPrice + " " + currency}
								</h6>
							))
						) : corpTraineeAlreadyRequestedAccess ? (
							<h6>
								Request
								{" " + corpTraineeRequestStatus}
							</h6>
						) : (
							<></>
						)}
					</Col>
				</Row>
				<Row>
					{cardType === "Basic" ? (
						<Col
							className="ms-auto fitWidth d-flex  justify-content-end"
							sm={2}
							md={2}
							lg={2}
						>
							<Button onClick={handleViewCourse}>View Course</Button>
							{traineeOwnsCourse && (
								<>
									&nbsp;
									<Button
										key="continueCourseButton"
										variant="success"
										className=""
										onClick={continueCourse}
									>
										Continue Course
									</Button>
								</>
							)}
						</Col>
					) : cardType === "Deluxe" ? (
						<Col
							className="ms-auto fitWidth d-flex  justify-content-end"
							sm={2}
							md={2}
							lg={2}
						>
							{displayInstructorEditCourseButtons()}{" "}
							{course.status !== "Draft" && (
								<Button onClick={handleViewCourse}>View Course</Button>
							)}
						</Col>
					) : (
						<Col
							className="ms-auto fitWidth d-flex  justify-content-end"
							sm={2}
							md={2}
							lg={2}
						>
							<Form.Check
								defaultChecked={defaultChecked}
								value={course._id}
								type="checkbox"
								label="Select For Promotion"
								onChange={(e) => {
									handleCheck(e);
								}}
							/>
							&nbsp; &nbsp;
							<Button onClick={handleViewCourse}>View Course</Button>
						</Col>
					)}
				</Row>
			</Card.Body>
		</Card>
	);
}

export default UniversalCourseCard;
