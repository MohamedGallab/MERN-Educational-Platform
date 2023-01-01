import { useEffect, useState } from "react";
import { Col, Container } from "react-bootstrap";
import axios from "axios";
import CourseReportsCard from "../../components/admin/CourseReportsCard";
import Pagination from "../../components/shared/pagination/Pagination";
let pageSize = 12;
function ViewReports() {
	const [Courses, setCourses] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	let firstPageIndex = (currentPage - 1) * pageSize;
	let lastPageIndex = firstPageIndex + pageSize;
	let currentCourses = Courses.slice(firstPageIndex, lastPageIndex);
	const getReports = async () => {
		const config = {
			method: "GET",
			url: `http://localhost:4000/api/reports/`,
		};
		try {
			const response = await axios(config);
			setCourses(response.data);
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		getReports();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<Container className="my-2 d-flex flex-wrap">
			{currentCourses.map((course, i) => (
				<Col sm={3} className="mb-2 me-2">
					<CourseReportsCard course={course} />
				</Col>
			))}
			<Pagination
				className="pagination-bar"
				currentPage={currentPage}
				totalCount={Courses.length}
				pageSize={pageSize}
				onPageChange={(page) => setCurrentPage(page)}
			/>
		</Container>
	);
}
export default ViewReports;
