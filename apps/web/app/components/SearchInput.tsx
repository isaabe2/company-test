import React from "react"

/** SearchInput
 * A reusable search input component.
 * Accepts a value, placeholder, and onChange handler.
 * Can be styled with additional className and inline styles.
 */

interface SearchInputProps {
	value: string
	placeholder?: string
	onChange: (value: string) => void
	className?: string
	style?: React.CSSProperties
}

const SearchInput: React.FC<SearchInputProps> = ({
	value,
	placeholder,
	onChange,
	className = "",
	style,
}) => (
	<input
		type="text"
		className={`form-control ms-2 ${className}`}
		style={{ maxWidth: 250, ...style }}
		placeholder={placeholder || "Search..."}
		value={value}
		onChange={(e) => onChange(e.target.value)}
	/>
)

export default SearchInput
