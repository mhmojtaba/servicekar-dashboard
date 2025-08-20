import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
	User,
	LogOut,
	Loader2,
	Home,
	MapPin,
	Save,
	AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import { userUpdate } from "@/services/authServices";
import { useAuth } from "@/providers/AuthContext";

const MapSection = dynamic(
	() => import("@/components/SelectLocation/MapSection"),
	{
		loading: () => (
			<div className="flex items-center justify-center h-[280px] bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl border-2 border-dashed border-neutral-200">
				<div className="text-center space-y-3">
					<Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto" />
					<p className="text-sm text-neutral-600 font-medium">
						بارگذاری نقشه...
					</p>
				</div>
			</div>
		),
		ssr: false,
	}
);

const UserProfile = () => {
	const { user, setUser, token, logout } = useAuth();
	const [profileData, setProfileData] = useState({
		first_name: user?.first_name || "",
		last_name: user?.last_name || "",
		mobile: user?.mobile || "",
		address: user?.address || "",
		location: user?.location || { lat: "", lng: "" },
	});
	const [isUpdating, setIsUpdating] = useState(false);
	const [errors, setErrors] = useState({});

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setProfileData((prev) => ({
				...prev,
				[name]: value,
			}));

			// Clear error for this field when user starts typing
			if (errors[name]) {
				setErrors((prev) => ({
					...prev,
					[name]: "",
				}));
			}
		},
		[errors]
	);

	const handleLocationChange = useCallback(
		(lat, lng) => {
			setProfileData((prev) => ({
				...prev,
				location: { lat, lng },
			}));

			// Clear location error
			if (errors.location) {
				setErrors((prev) => ({
					...prev,
					location: "",
				}));
			}
		},
		[errors]
	);

	const validateForm = () => {
		const newErrors = {};

		if (!profileData.first_name.trim()) {
			newErrors.first_name = "نام الزامی است";
		}

		if (!profileData.last_name.trim()) {
			newErrors.last_name = "نام خانوادگی الزامی است";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleUpdateProfile = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error("لطفاً اطلاعات مورد نیاز را تکمیل کنید");
			return;
		}

		setIsUpdating(true);
		try {
			const data = {
				token,
				first_name: profileData.first_name,
				last_name: profileData.last_name,
				mobile: profileData.mobile,
				address: profileData.address,
				lat: profileData.location.lat,
				lng: profileData.location.lng,
			};
			const response = await userUpdate(data);

			if (response.data?.msg === 0) {
				const updatedUser = {
					...user,
					...profileData,
				};

				setUser(updatedUser);

				if (typeof window !== "undefined") {
					localStorage.setItem("dashboard-user", JSON.stringify(updatedUser));
				}

				toast.success("اطلاعات با موفقیت به‌روزرسانی شد");
			} else {
				toast.error(response.data?.msg_text || "خطا در به‌روزرسانی اطلاعات");
			}
		} catch (error) {
			console.error("Profile update error:", error);
			toast.error("خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید");
		} finally {
			setIsUpdating(false);
		}
	};

	const handleLogout = async () => {
		// Check for unsaved changes
		if (
			profileData.first_name !== user.first_name ||
			profileData.last_name !== user.last_name ||
			profileData.mobile !== user.mobile ||
			profileData.address !== user.address ||
			profileData.location.lat !== user.location.lat ||
			profileData.location.lng !== user.location.lng
		) {
			const discardResult = await Swal.fire({
				title: "تغییرات ذخیره نشده",
				text: "شما تغییراتی انجام داده‌اید که ذخیره نشده است. آیا می‌خواهید بدون ذخیره خارج شوید؟",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#EF4444",
				cancelButtonColor: "#6B7280",
				confirmButtonText: "خروج بدون ذخیره",
				cancelButtonText: "انصراف",
				reverseButtons: true,
				customClass: {
					container: "swal-rtl",
				},
			});

			if (!discardResult.isConfirmed) {
				return;
			}
		}

		const result = await Swal.fire({
			title: "خروج از حساب کاربری",
			text: "آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#EF4444",
			cancelButtonColor: "#6B7280",
			confirmButtonText: "خروج",
			cancelButtonText: "انصراف",
			reverseButtons: true,
			customClass: {
				container: "swal-rtl",
			},
		});

		if (result.isConfirmed) {
			if (typeof window !== "undefined") {
				localStorage.removeItem("dashboard-token");
				localStorage.removeItem("dashboard-user");
			}

			logout();

			setTimeout(() => {
				toast.success("با موفقیت خارج شدید");
				window.location.href = "/";
			}, 100);
		}
	};

	return (
		<motion.div
			key="profile"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.4 }}
		>
			<form onSubmit={handleUpdateProfile} className="space-y-8">
				{/* Header */}
				<div className="flex items-center justify-between pb-6 px-4 pt-4 border rounded-tr-2xl rounded-tl-2xl border-neutral-200">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-primary-100 rounded-xl">
							<User className="w-6 h-6 text-primary-600" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-neutral-800">
								پروفایل کاربری
							</h2>
							<p className="text-sm text-neutral-600 mt-1">
								اطلاعات شخصی و موقعیت مکانی خود را مدیریت کنید
							</p>
						</div>
					</div>
				</div>

				{/* Personal Information */}
				<div className="bg-white border border-neutral-200 rounded-2xl p-6">
					<h3 className="text-lg font-semibold text-neutral-800 mb-6 flex items-center gap-2">
						<User className="w-5 h-5 text-primary-500" />
						اطلاعات شخصی
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="block text-sm font-medium text-neutral-700">
								نام <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="first_name"
								value={profileData.first_name}
								onChange={handleInputChange}
								className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
									errors.first_name
										? "border-red-300 bg-red-50"
										: "border-neutral-200 hover:border-neutral-300"
								}`}
								placeholder="نام خود را وارد کنید"
							/>
							{errors.first_name && (
								<p className="text-sm text-red-600 flex items-center gap-1">
									<AlertCircle className="w-4 h-4" />
									{errors.first_name}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-neutral-700">
								نام خانوادگی <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="last_name"
								value={profileData.last_name}
								onChange={handleInputChange}
								className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
									errors.last_name
										? "border-red-300 bg-red-50"
										: "border-neutral-200 hover:border-neutral-300"
								}`}
								placeholder="نام خانوادگی خود را وارد کنید"
							/>
							{errors.last_name && (
								<p className="text-sm text-red-600 flex items-center gap-1">
									<AlertCircle className="w-4 h-4" />
									{errors.last_name}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-neutral-700">
								شماره موبایل
							</label>
							<input
								type="text"
								name="mobile"
								value={profileData.mobile}
								disabled
								className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${"border-neutral-200 hover:border-neutral-300"}`}
							/>
						</div>
					</div>
				</div>

				{/* Address */}
				<div className="bg-white border border-neutral-200 rounded-2xl p-6">
					<h3 className="text-lg font-semibold text-neutral-800 mb-6 flex items-center gap-2">
						<Home className="w-5 h-5 text-green-500" />
						آدرس
					</h3>

					<div className="space-y-2">
						<label className="block text-sm font-medium text-neutral-700">
							آدرس کامل
						</label>
						<textarea
							rows="4"
							name="address"
							value={profileData.address}
							onChange={handleInputChange}
							className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none ${"border-neutral-200 hover:border-neutral-300"}`}
							placeholder="آدرس کامل خود را وارد کنید..."
						/>
					</div>
				</div>

				<div className="bg-white border border-neutral-200 rounded-2xl p-6">
					<h3 className="text-lg font-semibold text-neutral-800 mb-6 flex items-center gap-2">
						<MapPin className="w-5 h-5 text-blue-500" />
						موقعیت مکانی
					</h3>

					<div className="space-y-4">
						<div
							className={`rounded-xl overflow-hidden border-2 transition-all ${
								errors.location ? "border-red-300" : "border-neutral-200"
							}`}
						>
							<MapSection
								location={
									profileData.location.lat && profileData.location.lng
										? {
												lat: profileData.location.lat,
												lng: profileData.location.lng,
											}
										: null
								}
								onChange={handleLocationChange}
							/>
						</div>

						{errors.location && (
							<p className="text-sm text-red-600 flex items-center gap-1">
								<AlertCircle className="w-4 h-4" />
								{errors.location}
							</p>
						)}

						<p className="text-sm text-neutral-500 flex items-center gap-2">
							<MapPin className="w-4 h-4" />
							موقعیت دقیق خود را روی نقشه مشخص کنید
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-200">
					<button
						type="submit"
						disabled={
							isUpdating || !profileData.first_name || !profileData.last_name
						}
						className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white rounded-xl font-medium transition-all disabled:cursor-not-allowed"
					>
						{isUpdating ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								در حال ذخیره...
							</>
						) : (
							<>
								<Save className="w-4 h-4" />
								ذخیره تغییرات
							</>
						)}
					</button>

					<button
						type="button"
						onClick={handleLogout}
						className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
					>
						<LogOut className="w-4 h-4" />
						خروج از حساب
					</button>
				</div>
			</form>
		</motion.div>
	);
};

export default UserProfile;
