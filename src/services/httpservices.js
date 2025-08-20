import axios from "axios";

const getBaseUrl = () => {
	const isBrowser = typeof window !== "undefined";
	const apipath = "/api";

	if (process.env.NODE_ENV !== "development") {
		return isBrowser
			? window.location.origin + apipath
			: `http://localhost:3000${apipath}`;
	} else {
		return process.env.NEXT_PUBLIC_BASE_API_URL_HOST;
	}
};

const app = axios.create({
	baseURL: getBaseUrl(),
});

const http = {
	get: app.get,
	post: app.post,
	put: app.put,
	delete: app.delete,
	patch: app.patch,
};

export default http;
