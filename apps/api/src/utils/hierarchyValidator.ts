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

import { Department } from "../models/Department"

export async function buildHierarchyMap(
	departmentId: string
): Promise<HierarchyMap> {
	const department = await Department.findById(departmentId).lean()
	const map: HierarchyMap = new Map()

	if (!department || !department.hierarchy) return map

	for (const [empId, entry] of Object.entries(department.hierarchy)) {
		const sub = (entry as { subordinates?: any[] }).subordinates || []
		map.set(
			empId,
			sub.map((s: any) => s.toString())
		)
	}
	return map
}
