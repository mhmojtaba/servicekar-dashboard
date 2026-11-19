import axios from "axios";
import {
	API_BASE_URL_OVERRIDE,
	withBasePath,
} from "@/config/deployment-config.mjs";

const app = axios.create({
	baseURL: API_BASE_URL_OVERRIDE || "https://gostarservices.ir/api",
});

const handleResponse = (response) => {
	if (response?.data?.msg === 150 && typeof window !== "undefined") {
		localStorage.removeItem("dashboard-token");
		localStorage.removeItem("dashboard-user");
		window.location.href = withBasePath("/login");
		return Promise.reject(response);
	}
	return Promise.resolve(response);
};

const handleError = (error) => {
	if (error?.response?.data?.msg === 150 && typeof window !== "undefined") {
		localStorage.removeItem("dashboard-token");
		localStorage.removeItem("dashboard-user");
		window.location.href = withBasePath("/login");
		return Promise.reject(error);
	}
	return Promise.reject(error);
};

app.interceptors.response.use(handleResponse, handleError);

const http = {
	get: app.get,
	post: app.post,
	put: app.put,
	delete: app.delete,
	patch: app.patch,
};

export default http;
