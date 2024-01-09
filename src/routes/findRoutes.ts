import { RouteTypes, RoutesWithActions } from "./types";


export const findRoutes = (
    routes: RoutesWithActions | RouteTypes[],
    pathname: string
) => {
    let result = []
    for (const route of routes) {
        if (route.path && route.path === pathname) {
            result.push({ id: route.id, name: route.name, path: route.path, icon: route.icon })
            break
        } else {
            if (route.chids) {
                for (const child of route.chids) {
                    if (child.path === pathname) {
                        result.push({ id: route.id, name: route.name, icon: route.icon })
                        result.push({ id: child.path, name: child.name, path: child.path })
                        break
                    }
                }
            }
        }
    }

    return result
}