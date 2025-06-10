"use client";
import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-[1200px] text-center">
        <h1 className="text-9xl font-bold text-primary-500">404</h1>

        <div className="relative h-1 w-90 mx-auto my-6">
          <div className="absolute inset-0 bg-accent-500 transform -skew-x-12"></div>
          <div className="absolute inset-0 right-10 bg-secondary-500 transform skew-x-12"></div>
        </div>

        <h2 className="text-3xl font-bold text-neutral-800 mb-6">
          صفحه مورد نظر یافت نشد
        </h2>

        <p className="text-neutral-600 mb-10 max-w-lg mx-auto">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است. لطفاً
          از طریق دکمه زیر به صفحه اصلی بازگردید.
        </p>

        <Link
          href="/"
          className="inline-block px-8 py-3 bg-primary-500 text-white rounded-md shadow-md hover:bg-primary-600 transition-colors duration-300 font-medium"
        >
          بازگشت به صفحه اصلی
        </Link>

        <div className="mt-16 flex justify-center gap-x-4">
          <div
            className="w-4 h-4 rounded-full bg-primary-300"
            style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          ></div>
          <div
            className="w-4 h-4 rounded-full bg-secondary-300"
            style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.2s",
            }}
          ></div>
          <div
            className="w-4 h-4 rounded-full bg-accent-300"
            style={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.4s",
            }}
          ></div>
        </div>
      </div>

      {/* Add the keyframes animation directly in the component */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
