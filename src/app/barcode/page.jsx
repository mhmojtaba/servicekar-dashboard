"use client";

import React, { useEffect, useState, Suspense } from "react";
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
} from "lucide-react";

import { getRequestDataWithBarcode } from "@/services/requestsServices";
import RequestCard from "@/components/dashboard/components/RequestCard";

const BarcodePageContent = () => {
  const [request, setRequest] = useState(null);
  const [isError, setIsError] = useState(false);

  const { isPending, mutateAsync: mutateGetRequestDataWithBarcode } =
    useMutation({
      mutationFn: getRequestDataWithBarcode,
    });

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

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
              در حال دریافت اطلاعات درخواست برای بارکد
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
                ? "بارکد مورد نظر یافت نشد"
                : "درخواستی برای این بارکد یافت نشد"}
            </p>
            {id && (
              <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-neutral-600">
                  <Barcode className="w-4 h-4" />
                  <span className="text-sm font-medium">بارکد: {id}</span>
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
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-teal-600/90"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Search className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              نتایج جستجو
            </motion.h1>

            <motion.div
              className="flex items-center justify-center gap-4 text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Barcode className="w-6 h-6" />
              <span className="text-xl font-medium">بارکد: {id}</span>
            </motion.div>

            <motion.div
              className="mt-6 flex items-center justify-center gap-2 text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">
                {request?.length || 0} درخواست یافت شد
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="p-6 sm:p-8 lg:p-10">
            {request?.length > 0 ? (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-neutral-800">
                    درخواست‌های مرتبط
                  </h2>
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
                  برای بارکد وارد شده هیچ درخواستی در سیستم ثبت نشده است
                </p>
                <div className="bg-neutral-50 rounded-xl p-4 max-w-sm mx-auto">
                  <div className="flex items-center justify-center gap-2 text-neutral-600">
                    <Barcode className="w-4 h-4" />
                    <span className="text-sm font-medium">بارکد: {id}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
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
