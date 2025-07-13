import React from "react"

interface LoaderProps {
	message?: string
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading..." }) => (
	<div className="d-flex flex-column align-items-center justify-content-center my-5">
		<div
			className="spinner-border text-success"
			role="status"
			style={{ width: 60, height: 60 }}
		></div>
		<div className="mt-3 fw-bold">{message}</div>
	</div>
)

export default Loader
