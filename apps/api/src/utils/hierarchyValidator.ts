export type HierarchyMap = Map<string, string[]>

export function hasCircularHierarchy(
	map: HierarchyMap,
	startId: string,
	newSuperiorId: string
): boolean {
	if (startId === newSuperiorId) return true
	const subordinates = map.get(newSuperiorId) || []
	for (const subId of subordinates) {
		if (hasCircularHierarchy(map, startId, subId)) return true
	}
	return false
}

import { Employee } from "../models/Employee"

export async function buildHierarchyMap(
	departmentId: string
): Promise<HierarchyMap> {
	const employees = await Employee.find({ departments: departmentId }).lean()
	const map: HierarchyMap = new Map()

	for (const emp of employees) {
		const hierarchyMap = new Map(Object.entries(emp.hierarchy || {}))
		const sub = hierarchyMap.get(departmentId.toString())?.subordinates || []

		map.set(
			emp._id.toString(),
			sub.map((s: any) => s.toString())
		)
	}
	return map
}
