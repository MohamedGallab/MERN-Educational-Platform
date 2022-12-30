import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";

import { addVideoToSubtitle, editVideoOfSubtitle } from "../../../redux/createCourseSlice";
import API from "../../../functions/api";
import { MdOutlineError } from "react-icons/md";

export default function AddVideo(props) {
	const dispatch = useDispatch();

	const DescriptionRef = useRef(null);
	const [Url, setUrl] = useState(props.case === "Add" ? "" : props.video.url);
	const [Title, setTitle] = useState(props.case === "Add" ? "" : props.video.title);

	const [Description, setDescription] = useState(
		props.case === "Add" ? "" : props.video.description
	);
	
	const [MissingTitle , setMissingTitle] = useState(false);
	const [MissingUrl , setMissingUrl] = useState(false);
	const [BadUrl , setBadUrl] = useState(false);
	const [MissingDescription , setMissingDescription] = useState(false);

	const SubtitleKey = props.subtitleKey;
	const VideoKey = props.videoKey;
	const videoIndex = useSelector(
		(state) => state.createCourseReducer.subtitlesIndices[SubtitleKey]
	);

	const resizeTextArea = (textAreaRef) => {
		textAreaRef.current.style.height = "auto";
		textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
	};
	useEffect(() => resizeTextArea(DescriptionRef), [Description]);

	const handleAddVideo = async () => {
		if(Title === ""){
			setMissingTitle(true);
		} else {
			setMissingTitle(false);
		}
		if(Description === ""){
			setMissingDescription(true);
		} else {
			setMissingDescription(false);
		}
		let invalidUrl = false;
		if (Url === "") {
			setMissingUrl(true);
			
			setBadUrl(false);
		} else {
			setMissingUrl(false);
			let videoId;
			if (Url.includes("watch?v=")) {
				videoId = Url.split("watch?v=")[1];
			} else {
				videoId =
					Url.split("/")[
						Url.split("/").length - 1
					];
			}
			console.log(videoId);
			// videoId = videoId[videoId.length - 1].split("watch?v=")[1];
			let response = await API.get(
				`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyBEiJPdUdU5tpzqmYs7h-RPt6J8VoXeyyY`
			);
			console.log(response);

			if (response.data.items.length === 0) {
				invalidUrl = true;
				setBadUrl(true);
				
			} else{
				invalidUrl = false;
				setBadUrl(false);
			} 
		}
		if(invalidUrl || Url === "" || Title === "" || Description === ""){
			return;
		}
		
		if (props.case === "Add") {
			let newVideo = { title: Title, url: Url, description: Description, index: videoIndex };
			dispatch(addVideoToSubtitle({ subtitleKey: SubtitleKey, video: newVideo }));
		} else {
			let newVideo = {
				title: Title,
				url: Url,
				description: Description,
				index: videoIndex - 1,
			};

			dispatch(
				editVideoOfSubtitle({ subtitleKey: props.subtitleKey, videoKey: VideoKey, video: newVideo })
			);
		}
		setUrl("");
		setDescription("");
		setTitle("");
		props.handleClose();
	};

	return (
		<Modal
			show={props.show}
			onHide={props.handleClose}
			backdrop="static"
			keyboard={false}
			size="xl"
			dialogClassName="modal-90w"
			aria-labelledby="example-custom-modal-styling-title"
			centered>
			<Modal.Header closeButton>
				<Modal.Title id="example-custom-modal-styling-title">
					{props.case === "Add" ? "Adding" : "Editting"} a Video
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Group className="mb-3 d-flex align-items-center justify-content-start">
					<Col>
						<Row className="justify-content-center">
							<Form.Label column sm={1}>
							<span>Title</span>
							<br />
							<span>{MissingTitle && <span className="error">Missing<MdOutlineError/></span>}</span>
							</Form.Label>
							
							<Col sm={5}>
								<Form.Control
									type="text"
									placeholder="Video Title"
									value={Title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</Col>
							<Form.Label column sm={1}>
								<span>Url</span>
								<br />
								<span>{MissingUrl && <span className="error">Missing<MdOutlineError/></span>}</span>
								<br />
								<span>{BadUrl && <span className="error">Invalid Url<MdOutlineError/></span>}</span>
							</Form.Label>
							<Col sm={4}>
								<Form.Control
									type="text"
									placeholder="Video Url"
									value={Url}
									onChange={(e) => setUrl(e.target.value)}
								/>
							</Col>
						</Row>
						<Row className="mt-3 justify-content-center">
							<Form.Label column sm={1}>
							<span>Description</span>
							<br />
							<span>{MissingDescription && <span className="error">Missing<MdOutlineError/></span>}</span>
							</Form.Label>
							<Col sm={10}>
								<Form.Control
									ref={DescriptionRef}
									type="text"
									as="textarea"
									rows={2}
									placeholder="Video Description"
									value={Description}
									onChange={(e) => setDescription(e.target.value)}
								/>
							</Col>
						</Row>
					</Col>
				</Form.Group>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={props.handleClose}>
					Close
				</Button>
				<Button id="addSubject" onClick={handleAddVideo}>
					{props.case} Video
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
