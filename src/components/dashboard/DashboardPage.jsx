"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, User, Plus, Calendar } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "@/providers/AuthContext";
import RequetsContents from "./components/RequetsContents";

import UserProfile from "./components/UserProfile";
import AddRequest from "../RequestService/Request";

import logo from "@/assets/images/logo.png";

const DashboardContent = () => {
	const { user, token } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const tab = searchParams.get("tab");

	const [activeTab, setActiveTab] = useState("profile");

	const tabsData = [
		{
			label: "اطلاعات کاربری",
			icon: User,
			value: "profile",
			component: <UserProfile />,
		},
		{
			label: "ثبت درخواست",
			icon: Plus,
			value: "add-requests",
			component: <AddRequest />,
		},
		{
			label: "درخواست‌های من",
			icon: FileText,
			value: "requests",
			component: <RequetsContents />,
		},
	];

	useEffect(() => {
		if (tab) {
			setActiveTab(tab);
		}
	}, [tab]);

	useEffect(() => {
		if (!token) {
			toast.warning("لطفا وارد حساب کاربری خود شوید");
			tab
				? router.push(`/login?redirect=/?tab=${tab}`)
				: router.push("/login?redirect=/");
			return;
		}
	}, [token, router, tab]);

	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};
	return (
		<div className="min-h-screen bg-background">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
			>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="mb-8"
				>
					<div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-3xl border border-blue-100/50 p-8 mb-6 shadow-xl">
						<div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-30"></div>
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
						<div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>

						<div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
							<div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
								<motion.div
									initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
									animate={{ scale: 1, opacity: 1, rotate: 0 }}
									transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
									className="relative group"
								>
									<div className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center p-3 border-2 border-blue-100 overflow-hidden">
										<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-50"></div>
										<div className="absolute inset-0 bg-gradient-to-tr from-blue-400/10 via-transparent to-purple-400/10 group-hover:from-blue-400/20 group-hover:to-purple-400/20 transition-all duration-500"></div>

										<div className="relative z-10 w-full h-full flex items-center justify-center">
											<Image
												src={logo}
												alt="شرکت خدمات گستر جزائری"
												width={80}
												height={80}
												className="object-contain w-full h-full"
												priority
											/>
										</div>

										<div className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
										<div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60 animate-pulse delay-300"></div>
									</div>

									<div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
								</motion.div>

								<motion.div
									initial={{ x: -20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ delay: 0.3, duration: 0.6 }}
									className="flex-1 space-y-3"
								>
									<div className="space-y-1">
										<motion.h2
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.4 }}
											className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent"
										>
											شرکت خدمات گستر جزائری
										</motion.h2>
										<div className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
									</div>

									<div className="flex items-center gap-3 flex-wrap">
										<h1 className="text-xl md:text-4xl font-black bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
											پنل کاربری
										</h1>
										<div className="flex items-center gap-1">
											<div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
											<div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
											<div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
										</div>
									</div>

									<p className="text-slate-600 text-sm md:text-base font-medium flex items-center gap-2">
										<span className="w-1 h-1 bg-slate-400 rounded-full"></span>
										مدیریت هوشمند اطلاعات و درخواست‌های شما
										<span className="text-blue-500">✨</span>
									</p>

									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.5 }}
										className="flex items-center gap-2 text-sm text-slate-500 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 w-fit border border-blue-100 shadow-sm"
									>
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<span className="font-medium">
											خوش آمدید، {user?.first_name || "کاربر"} عزیز
										</span>
										<div className="flex w-fit items-center gap-1.5 px-2.5 py-1.5 bg-white/60 backdrop-blur-sm rounded-lg border border-neutral-200/50 shadow-sm">
											<Calendar className="w-3.5 h-3.5 text-primary-600" />
											<span className="text-xs font-medium text-neutral-700">
												امروز:{" "}
												{new Date().toLocaleDateString("fa-IR", {
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</span>
										</div>
									</motion.div>
								</motion.div>
							</div>

							{/* <motion.div
								initial={{ scale: 0.8, opacity: 0, x: 20 }}
								animate={{ scale: 1, opacity: 1, x: 0 }}
								transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
								className="hidden md:block"
							>
								<Link
									href="/request"
									className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105 overflow-hidden"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

									<div className="relative flex items-center gap-3">
										<div className="p-2 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform duration-300">
											<Plus className="w-6 h-6" />
										</div>
										<span className="font-extrabold tracking-wide">
											درخواست جدید
										</span>
									</div>

									<div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300"></div>
									<div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300 delay-150"></div>
								</Link>
							</motion.div> */}
						</div>
					</div>

					<div className="flex gap-2 bg-white rounded-2xl p-2 border border-neutral-200 shadow-sm">
						{tabsData.map((tab) => (
							<button
								key={tab.value}
								onClick={() => handleTabChange(tab.value)}
								className={`flex w-full md:w-auto items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
									activeTab === tab.value
										? "bg-primary-500 text-white shadow-lg"
										: "text-neutral-600 hover:bg-neutral-50 border border-neutral-200"
								}`}
							>
								<tab.icon className="w-4 h-4 hidden md:block" />
								<span className="text-[10px] md:text-base">{tab.label}</span>
							</button>
						))}
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="bg-surface rounded-2xl shadow-card border border-neutral-200 overflow-hidden"
				>
					<div className="p-6">
						<AnimatePresence mode="wait">
							{tabsData.find((tab) => tab.value === activeTab)?.component}
						</AnimatePresence>
					</div>
				</motion.div>

				<motion.span
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					className="fixed bottom-8 left-8 bg-primary-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors duration-200 z-10 md:hidden"
				>
					<span onClick={() => setActiveTab("add-requests")}>
						<Plus className="h-6 w-6" />
					</span>
				</motion.span>
			</motion.div>
		</div>
	);
};

const DashboardPage = () => {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-background flex items-center justify-center">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
						<span className="text-neutral-600 font-medium">بارگذاری...</span>
					</div>
				</div>
			}
		>
			<DashboardContent />
		</Suspense>
	);
};

export default DashboardPage;
