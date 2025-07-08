"use client";

import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";

import Button from "@/common/button";
import logo from "@/assets/images/logo.png";
import { useAuth } from "@/providers/AuthContext";

const Header = () => {
  const { token, isLoading } = useAuth();

  // During loading, show login state to prevent hydration mismatch
  const isLoggedIn = !isLoading && token;

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
            <Link href={isLoggedIn ? "/dashboard" : "/login"}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 space-x-reverse"
              >
                <User className="w-4 h-4" />
                <span>{isLoggedIn ? "داشبورد" : "ورود"}</span>
              </Button>
            </Link>
          </nav>

          <div className="md:hidden">
            <Link href={isLoggedIn ? "/dashboard" : "/login"}>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
