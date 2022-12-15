import { Routes, Route } from "react-router-dom";
import AdminView from "../pages/admin/AdminView";
import CreateAdmin from "../pages/admin/CreateAdmin";
import CreateCorporateTrainee from "../pages/admin/CreateCorporateTrainee";
import CreateInstructor from "../pages/admin/CreateInstructor";
import CourseRequests from "../pages/admin/CourseRequests";
import Layout from "../components/shared/Layout";
import Protected from "../components/shared/Protected";

export function AdminRoutes() {
	return (
		<>
			<Protected authorizedUserType={"Administrator"}>
				<Layout />
				<Routes>
					<Route 
						path="" 
						element={<AdminView />} 
					/>
					<Route 
						path="createAdmin" 
						element={<CreateAdmin />} 
					/>
					<Route
						path="createCorporateTrainee"
						element={<CreateCorporateTrainee />}
					/>
					<Route
						path="createInstructor"
						element={<CreateInstructor />}
					/>
					<Route path="courseRequests" element={<CourseRequests />} />
				</Routes>
			</Protected>
		</>
	);
}
