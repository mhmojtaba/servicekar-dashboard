"use client";
import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, User, LogOut, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { useAuth } from "@/providers/AuthContext";
import { userUpdate } from "@/services/authServices";
import RequetsContents from "./components/RequetsContents";
import Link from "next/link";

const DashboardContent = () => {
  const { user, setUser, token, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/");
      return;
    }
  }, [token, router]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileData.first_name.trim() || !profileData.last_name.trim()) {
      toast.error("نام و نام خانوادگی الزامی است");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await userUpdate({
        token,
        ...profileData,
      });

      if (response.data?.msg === 0) {
        setUser((prev) => ({
          ...prev,
          ...profileData,
        }));

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              ...profileData,
            })
          );
        }

        toast.success("اطلاعات با موفقیت به‌روزرسانی شد");
      } else {
        toast.error(response.data?.msg_text || "خطا در به‌روزرسانی اطلاعات");
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در به‌روزرسانی اطلاعات");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
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
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-16 md:mt-0"
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

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <User className="w-10 h-10 text-white relative z-10" />
                    {/* Floating particles */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-700"></div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 -z-10"></div>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                      پنل کاربری
                    </h1>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-lg font-medium flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                    مدیریت هوشمند اطلاعات و درخواست‌های شما
                    <span className="text-blue-500">✨</span>
                  </p>

                  {/* Welcome message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2 text-sm text-slate-500 bg-white/40 backdrop-blur-sm rounded-full px-3 py-1 w-fit"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    خوش آمدید، {user?.first_name || "کاربر"} عزیز
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
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
              </motion.div>
            </div>
          </div>

          <div className="flex gap-2 bg-white rounded-2xl p-2 border border-neutral-200 shadow-sm">
            <button
              onClick={() => handleTabChange("profile")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                activeTab === "profile"
                  ? "bg-primary-500 text-white shadow-lg"
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <User className="w-4 h-4" />
              اطلاعات کاربری
            </button>
            <button
              onClick={() => handleTabChange("requests")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                activeTab === "requests"
                  ? "bg-primary-500 text-white shadow-lg"
                  : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <FileText className="w-4 h-4" />
              درخواست‌های من
            </button>
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
              {activeTab === "profile" ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="flex items-center gap-4 pb-4 border-b border-neutral-200">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-neutral-800">
                        بروزرسانی اطلاعات کاربری
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700">
                          نام <span className="text-error-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          value={profileData.first_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="نام خود را وارد کنید"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700">
                          نام خانوادگی <span className="text-error-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={profileData.last_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                          placeholder="نام خانوادگی خود را وارد کنید"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-200">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            در حال به‌روزرسانی...
                          </>
                        ) : (
                          <>
                            <User className="w-4 h-4" />
                            به‌روزرسانی اطلاعات
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-error-500 hover:bg-error-600 text-white rounded-xl font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        خروج از حساب
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="requests"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <RequetsContents />
                </motion.div>
              )}
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
          <Link href="/request">
            <Plus className="h-6 w-6" />
          </Link>
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
