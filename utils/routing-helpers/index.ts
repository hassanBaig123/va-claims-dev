// Define route groups
export const userRoutes = [
    "/todos",
    "/courses",
    "/courses/*",
    "/profile",
    "/profile/*",
    "/additional",
    "/upgrade",
];

export const adminRoutes = [
    "/admin/*",
    "/admin/backlog",
    "/admin/*",
    "/admin/customers",
    "/admin/orders",
    "/admin/reports",
    "/admin/swarm",
    "/tasks",
    "/tasks-group",
    "/tools"
];

export function matchesRoute(path: string, route: string) {
    if (route.includes("*")) {
        return path.startsWith(route.replace("/*", ""));
    }
    return path === route || path.match(new RegExp(`^${route.replace(/:\w+/g, "\\w+")}$`));
}