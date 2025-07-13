export interface Department {
	_id: string
	name: string
	description: string
	hierarchy: Record<string, any>
	createdAt?: string
	updatedAt?: string
}
