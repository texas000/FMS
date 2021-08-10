import { Toast, Toaster } from "@blueprintjs/core";
import { Fragment } from "react";
export default function Notification({ show, setShow, msg, intent, icon }) {
	if (show) {
		return (
			<Toaster position="top">
				<Toast
					message={msg}
					intent={intent || "none"}
					onDismiss={() => setShow(false)}
					icon={icon || "cloud-upload"}
					timeout={5000}
				></Toast>
			</Toaster>
		);
	} else {
		return <Fragment></Fragment>;
	}
}
