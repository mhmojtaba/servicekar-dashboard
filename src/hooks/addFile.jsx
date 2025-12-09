import { useState } from "react";
import { toast } from "react-toastify";
import { uploadFile } from "@/utils/utils";

export const useFileUpload = (token) => {
	const [filePath, setFilePath] = useState(null);
	const [loading, setLoading] = useState(false);
	const handleFileUpload = async (file) => {
		if (file) {
			if (file.size < 209715201) {
				try {
					setLoading(true);
					const { data } = await uploadFile(file, token);

					setFilePath(data?.path);
					setLoading(false);
					return data?.path;
				} catch (error) {
					console.error(error);
					toast.error("متاسفانه مشکلی در بارگذاری فایل رخ داده است!");
					setLoading(false);
				}
			} else {
				toast.error("حجم فایل شما نباید بیش از 200 mb باشد");
			}
		}
	};

	return { filePath, handleFileUpload, loading };
};
