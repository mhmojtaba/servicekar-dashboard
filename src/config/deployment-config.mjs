const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/dashboard";
const configuredApiBaseUrl = process.env.NEXT_PUBLIC_BASE_API_URL_HOST?.trim();

function normalizeBasePath(path) {
	const trimmedPath = path.trim();
	if (!trimmedPath || trimmedPath === "/") return "";
	return `/${trimmedPath.replace(/^\/+|\/+$/g, "")}`;
}

export const BASE_PATH = normalizeBasePath(configuredBasePath);
export const API_BASE_URL_OVERRIDE = configuredApiBaseUrl?.replace(/\/+$/, "");

export function withBasePath(path) {
	if (!path || !path.startsWith("/")) return path;
	if (!BASE_PATH) return path;
	if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
	return `${BASE_PATH}${path}`;
}
