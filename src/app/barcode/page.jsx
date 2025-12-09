"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search,
	Barcode,
	AlertCircle,
	Loader2,
	CheckCircle2,
	XCircle,
	Plus,
} from "lucide-react";

import { getRequestDataWithBarcode } from "@/services/requestsServices";
import RequestCard from "@/components/dashboard/components/RequestCard";
import { useRequests } from "@/providers/RequestsContext";
import BillModal from "@/components/dashboard/components/BillModal";
import logo from "@/assets/images/logo.png";

const BarcodePageContent = () => {
	const [request, setRequest] = useState(null);
	const [barcodeService, setBarcodeService] = useState(null);
	const [isError, setIsError] = useState(false);
	const [showBillModal, setShowBillModal] = useState(false);
	const { setSelectedRequest } = useRequests();

	const { isPending, mutateAsync: mutateGetRequestDataWithBarcode } =
		useMutation({
			mutationFn: getRequestDataWithBarcode,
		});

	const searchParams = useSearchParams();
	const id = searchParams.get("id");

	const handleBill = (request) => {
		setSelectedRequest(request);
		setShowBillModal(true);
	};

	useEffect(() => {
		const getRequestData = async () => {
			if (!id) {
				setIsError(true);
				return;
			}

			try {
				setIsError(false);
				const { data: res } = await mutateGetRequestDataWithBarcode(id);
				if (res?.msg === 0) {
					setRequest(res?.data);
					setBarcodeService(res?.service);
				} else {
					toast.error(res?.msg_text || "خطا در دریافت اطلاعات");
					setIsError(true);
				}
			} catch (error) {
				console.log(error);
				toast.error("خطا در ارتباط با سرور");
				setIsError(true);
			}
		};
		getRequestData();
	}, [id, mutateGetRequestDataWithBarcode]);

	if (isPending) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="bg-white rounded-3xl shadow-2xl border border-neutral-200 p-8 max-w-md w-full mx-4"
				>
					<div className="text-center">
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
							className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg"
						>
							<Loader2 className="w-8 h-8 text-white" />
						</motion.div>
						<h2 className="text-2xl font-bold text-neutral-800 mb-3">
							در حال جستجو...
						</h2>
						<p className="text-neutral-600 mb-6">
							در حال دریافت اطلاعات درخواست برای کد اشتراک
						</p>
						<div className="flex items-center justify-center gap-2 text-blue-500">
							<Barcode className="w-5 h-5" />
							<span className="text-sm font-medium">{id}</span>
						</div>
					</div>
				</motion.div>
			</div>
		);
	}

	if (isError || !id) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-pink-50 flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white rounded-3xl shadow-2xl border border-neutral-200 p-8 max-w-md w-full mx-4"
				>
					<div className="text-center">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-6 shadow-lg"
						>
							<XCircle className="w-8 h-8 text-white" />
						</motion.div>
						<h2 className="text-2xl font-bold text-neutral-800 mb-3">
							درخواست یافت نشد
						</h2>
						<p className="text-neutral-600 mb-6">
							{!id
								? "کد اشتراک مورد نظر یافت نشد"
								: "درخواستی برای این کد اشتراک یافت نشد"}
						</p>
						{id && (
							<div className="bg-neutral-50 rounded-xl p-4 mb-6">
								<div className="flex items-center justify-center gap-2 text-neutral-600">
									<Barcode className="w-4 h-4" />
									<span className="text-sm font-medium">کد اشتراک: {id}</span>
								</div>
							</div>
						)}
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => window.history.back()}
							className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
						>
							بازگشت
						</motion.button>
					</div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
			<div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700">
				<div className="absolute inset-0">
					<div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-teal-600/90"></div>
					<div className="absolute top-0 left-0 w-full h-full opacity-20">
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
					</div>
				</div>

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<motion.div
						className="flex items-center justify-between gap-4"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<div className="flex items-center gap-3">
							<motion.div
								className="relative group"
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
							>
								<div className="relative w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl shadow-lg flex items-center justify-center p-2 border border-white/30 overflow-hidden">
									<div className="absolute inset-0 bg-gradient-to-br from-white/95 to-white/90"></div>
									<div className="relative z-10 w-full h-full flex items-center justify-center">
										<Image
											src={logo}
											alt="شرکت خدمات گستر جزائری"
											width={48}
											height={48}
											className="object-contain w-full h-full"
											priority
										/>
									</div>
								</div>
							</motion.div>
							<motion.div
								className="hidden sm:block"
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2 }}
							>
								<h2 className="text-base md:text-lg font-bold text-white">
									شرکت خدمات گستر جزائری
								</h2>
							</motion.div>
						</div>

						<div className="flex items-center gap-3">
							<motion.div
								className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30"
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3 }}
							>
								<Barcode className="w-4 h-4 text-white" />
								<span className="text-sm md:text-base font-medium text-white">
									{id}
								</span>
							</motion.div>
							<motion.div
								className="flex items-center gap-2 text-white/90"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4 }}
							>
								<CheckCircle2 className="w-4 h-4" />
								<span className="text-sm font-medium">
									{request?.length || 0} نتیجه
								</span>
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
				<motion.div
					className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.2 }}
				>
					<div className="p-6 sm:p-8 lg:p-10">
						{request?.length > 0 ? (
							<div className="space-y-6">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4, delay: 0.4 }}
									className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6"
								>
									<div className="flex items-center gap-3">
										<div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
										<h2 className="text-2xl font-bold text-neutral-800">
											درخواست‌های مرتبط
										</h2>
									</div>
									<motion.div
										className=""
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4, delay: 0.6 }}
									>
										<Link
											href="/?tab=add-requests"
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105"
										>
											<Plus className="w-5 h-5" />
											درخواست جدید
										</Link>
									</motion.div>
								</motion.div>

								<AnimatePresence>
									{request.map((requestItem, index) => (
										<motion.div
											key={requestItem.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
											exit={{ opacity: 0, y: -20 }}
										>
											<RequestCard
												request={requestItem}
												index={index}
												target="barcode"
												onBill={() => handleBill(requestItem)}
												barcodeService={barcodeService}
											/>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						) : (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.4, delay: 0.4 }}
								className="text-center py-12"
							>
								<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
									<AlertCircle className="w-8 h-8 text-white" />
								</div>
								<h3 className="text-xl font-bold text-neutral-800 mb-3">
									درخواستی یافت نشد
								</h3>
								<p className="text-neutral-600 mb-6 max-w-md mx-auto">
									برای کد اشتراک وارد شده هیچ درخواستی در سیستم ثبت نشده است
								</p>
								<div className="bg-neutral-50 rounded-xl p-4 max-w-sm mx-auto">
									<div className="flex items-center justify-center gap-2 text-neutral-600">
										<Barcode className="w-4 h-4" />
										<span className="text-sm font-medium">کد اشتراک: {id}</span>
									</div>
								</div>
								<motion.div
									className=""
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4, delay: 0.6 }}
								>
									<Link
										href="/request"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105"
									>
										<Plus className="w-5 h-5" />
										ثبت درخواست جدید
									</Link>
								</motion.div>
							</motion.div>
						)}
					</div>
				</motion.div>
			</div>

			{showBillModal && (
				<BillModal
					isOpen={showBillModal}
					onClose={() => setShowBillModal(false)}
				/>
			)}
		</div>
	);
};

const BarcodePageLoading = () => (
	<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			className="bg-white rounded-3xl shadow-2xl border border-neutral-200 p-8 max-w-md w-full mx-4"
		>
			<div className="text-center">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
					className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg"
				>
					<Loader2 className="w-8 h-8 text-white" />
				</motion.div>
				<h2 className="text-2xl font-bold text-neutral-800 mb-3">
					در حال بارگذاری...
				</h2>
				<p className="text-neutral-600">لطفاً صبر کنید...</p>
			</div>
		</motion.div>
	</div>
);

const BarcodePage = () => {
	return (
		<Suspense fallback={<BarcodePageLoading />}>
			<BarcodePageContent />
		</Suspense>
	);
};

export default BarcodePage;
