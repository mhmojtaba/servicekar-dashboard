"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Settings, Wrench, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Button from "@/common/button";
import logo from "@/assets/images/logo.png";
import { useAuth } from "@/providers/AuthContext";

const Header = () => {
  const { token, isLoading } = useAuth();
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);

  // During loading, show login state to prevent hydration mismatch
  const isLoggedIn = !isLoading && token;

  const loginOptions = [
    {
      title: "ورود کاربر",
      description: "ورود به حساب کاربری",
      href: "/login",
      icon: User,
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
    },
    {
      title: "پنل مدیریت",
      description: "ورود مدیران سیستم",
      href: "/admin/login",
      icon: Settings,
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "from-purple-600 to-purple-700",
    },
    {
      title: "پنل تکنسین",
      description: "ورود تکنسین‌ها",
      href: "/technician/login",
      icon: Wrench,
      gradient: "from-green-500 to-green-600",
      hoverGradient: "from-green-600 to-green-700",
    },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 space-x-reverse"
          >
            <div className="w-12 h-14 bg-gradient-to-br border border-blue-600  rounded-xl flex items-center justify-center">
              <div className="bg-white rounded-full py-0 shadow-lg w-full h-full">
                <Image
                  src={logo}
                  width={100}
                  height={100}
                  alt="شرکت خدمات گستر جزائری"
                  className="rounded-full object-contain"
                />
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-primary-600">
                شرکت خدمات گستر جزائری
              </h1>
              <p className="text-sm text-gray-600">تعمیر و نگهداری تخصصی</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              خانه
            </Link>
            <Link
              href="/request"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              ثبت درخواست
            </Link>
            <Link
              href="/about-us"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              درباره ما
            </Link>

            {/* Desktop Login Section */}
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  <User className="w-4 h-4" />
                  <span>داشبورد</span>
                </Button>
              </Link>
            ) : (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 space-x-reverse"
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                >
                  <User className="w-4 h-4" />
                  <span>ورود</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showLoginDropdown ? "rotate-180" : ""}`}
                  />
                </Button>

                <AnimatePresence>
                  {showLoginDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                      onMouseLeave={() => setShowLoginDropdown(false)}
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                          انتخاب نوع ورود
                        </h3>
                        <div className="space-y-3">
                          {loginOptions.map((option, index) => (
                            <motion.div
                              key={option.href}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Link
                                href={option.href}
                                onClick={() => setShowLoginDropdown(false)}
                                className="block group"
                              >
                                <div
                                  className={`p-4 rounded-xl bg-gradient-to-r ${option.gradient} group-hover:bg-gradient-to-r group-hover:${option.hoverGradient} transition-all duration-200 transform group-hover:scale-[1.02] shadow-md group-hover:shadow-lg`}
                                >
                                  <div className="flex items-center gap-3 text-white">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                      <option.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 text-right">
                                      <h4 className="font-semibold text-sm">
                                        {option.title}
                                      </h4>
                                      <p className="text-xs text-white/80">
                                        {option.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>

          {/* Mobile Section */}
          <div className="md:hidden">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                >
                  <User className="w-4 h-4" />
                </Button>

                <AnimatePresence>
                  {showLoginDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                          انتخاب نوع ورود
                        </h3>
                        <div className="space-y-3">
                          {loginOptions.map((option, index) => (
                            <motion.div
                              key={option.href}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Link
                                href={option.href}
                                onClick={() => setShowLoginDropdown(false)}
                                className="block group"
                              >
                                <div
                                  className={`p-3 rounded-xl bg-gradient-to-r ${option.gradient} group-hover:bg-gradient-to-r group-hover:${option.hoverGradient} transition-all duration-200 transform group-hover:scale-[1.02] shadow-md group-hover:shadow-lg`}
                                >
                                  <div className="flex items-center gap-3 text-white">
                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                      <option.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 text-right">
                                      <h4 className="font-semibold text-sm">
                                        {option.title}
                                      </h4>
                                      <p className="text-xs text-white/80">
                                        {option.description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
