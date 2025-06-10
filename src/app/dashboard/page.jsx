"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, User, LogOut } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "@/providers/AuthContext";
import { userUpdate } from "@/services/authServices";
import RequetsContents from "./components/RequetsContents";

const DashboardPage = () => {
  const { user, setUser, token, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleLogout = () => {
    logout();
    toast.success("با موفقیت خارج شدید");
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
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-text to-neutral-600 bg-clip-text text-transparent">
                پنل کاربری
              </h1>
              <p className="text-neutral-500 mt-1 text-lg">
                مدیریت اطلاعات و درخواست‌های خود
              </p>
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
      </motion.div>
    </div>
  );
};

export default DashboardPage;
