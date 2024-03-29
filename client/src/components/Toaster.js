import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, Toast } from "react-bootstrap";

import { removeNotification } from "../redux/notificationsSlice";
export default function Toaster() {
	const dispatch = useDispatch();
	const Notifications = useSelector((state) => state.notificationsReducer.notifications);
	return (
		<ToastContainer
			className="w-50 d-flex flex-column align-items-end my-3 position-fixed"
			position="bottom-end">
			{Notifications.map((notification, i) => (
				<Toast
					delay={3000}
					autohide={true}
					className="d-inline-block my-1 me-3 l"
					key={i}
					onClose={() => {
						dispatch(removeNotification(i));
					}}>
					<Toast.Header>
						<strong className="me-auto">{notification.title} </strong>
					</Toast.Header>
					<Toast.Body className={notification.color}>{notification.info}</Toast.Body>
				</Toast>
			))}
		</ToastContainer>
	);
}
