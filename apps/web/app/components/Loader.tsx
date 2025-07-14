import React from "react"

/** Loader
 * Simple loading component that displays a spinner and an optional message.
 * Used to indicate loading state in various parts of the application.
 * Can be customized with a message prop.
 */

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
