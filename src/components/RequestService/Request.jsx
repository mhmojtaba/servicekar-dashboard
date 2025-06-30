"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import {
  Image,
  MapPin,
  Plus,
  Settings,
  Trash,
  Loader2,
  User,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";
import { FaExclamationTriangle, FaSpinner } from "react-icons/fa";

import { useRequests } from "@/providers/RequestsContext";
import { useAuth } from "@/providers/AuthContext";
import { selectOptionsGenerator, uploadFile } from "@/utils/utils";
import { customSelectStyles } from "@/styles/customeStyles";

const SelectLocation = dynamic(
  () => import("@/components/SelectLocation/SelectLocation"),
  {
    loading: () => (
      <div className="flex items-center justify-center h-[250px] sm:h-[350px] md:h-[400px] bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl border-2 border-dashed border-neutral-200">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-3" />
          <p className="text-sm text-neutral-600 font-medium">
            بارگذاری نقشه...
          </p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const AddRequest = () => {
  const router = useRouter();
  const { token, user } = useAuth();
  const {
    service,
    requester_type,
    operation_type,
    addUpdateRequests,
    isUpdating,
    fetchDataWithMobile,
    isGettingDataWithMobile,
    suggestedAddresses,
    reasonBlock,
    setSuggestedAddresses,
    setReasonBlock,
    selectedAddress,
    setSelectedAddress,
  } = useRequests();

  const [requestData, setRequestData] = useState({
    id_service: null,
    requester_type: null,
    operation_type: null,
    address: "",
    device_count: "",
    mobile: user?.mobile || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    img: "",
  });

  const [location, setLocation] = useState([32.644397, 51.667455]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const [errors, setErrors] = useState({
    id_service: false,
    requester_type: false,
    operation_type: false,
    address: false,
    location: false,
    device_count: false,
    mobile: false,
    first_name: false,
    last_name: false,
  });

  const serviceOptions = selectOptionsGenerator(service);

  function reverseFunction(e) {
    if (!e) return;
    var url = `https://map.ir/reverse/no?lat=${e[0]}&lon=${e[1]}`;
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_MAPIR_API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => setRequestData({ ...requestData, address: data.address }))
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    reverseFunction(location);
  }, [location]);

  useEffect(() => {
    const checkMobileStatus = async () => {
      if (requestData.mobile && errors.mobile === false) {
        try {
          const res = await fetchDataWithMobile(requestData.mobile);
          if (res?.msg === 2) {
            setIsBlocked(true);
          } else {
            setIsBlocked(false);
          }
        } catch (error) {
          console.error("Error checking mobile status:", error);
          setIsBlocked(false);
        }
      } else {
        setSuggestedAddresses([]);
        setIsBlocked(false);
      }
    };

    checkMobileStatus();
  }, [requestData.mobile, errors.mobile]);

  useEffect(() => {
    if (selectedAddress !== null) {
      setRequestData({
        ...requestData,
        first_name: selectedAddress.first_name,
        last_name: selectedAddress.last_name,
        address: selectedAddress.address,
      });
      setLocation([selectedAddress.latitude, selectedAddress.longitude]);
    } else {
      setRequestData({
        ...requestData,
        first_name: "",
        last_name: "",
        address: "",
      });
    }
  }, [selectedAddress]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("لطفا فقط فایل تصویری انتخاب کنید");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از 15 مگابایت باشد");
      return;
    }

    setImageFile(file);
    setIsImageUploading(true);

    try {
      const response = await uploadFile(file, token);

      if (response?.data?.msg === 0) {
        const imageUrl = response.data.path;
        setRequestData({ ...requestData, img: imageUrl });
        setImagePreview(URL.createObjectURL(file));
        toast.success("تصویر با موفقیت بارگزاری شد");
      } else {
        toast.error(response?.data?.msg_text || "خطا در بارگزاری تصویر");
        setImageFile(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در آپلود تصویر");
      setImageFile(null);
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRequestData({ ...requestData, img: "" });
    const fileInput = document.getElementById("image-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...requestData,
        location: { lat: location[0], lng: location[1] },
      };

      const res = await addUpdateRequests(data);

      if (res?.msg === 0) {
        setRequestData({
          id_service: null,
          requester_type: null,
          operation_type: null,
          address: "",
          device_count: "",
          mobile: "",
          first_name: "",
          last_name: "",
          img: "",
        });
        setLocation([32.644397, 51.667455]);
        setErrors({
          id_service: false,
          requester_type: false,
          operation_type: false,
          address: false,
          location: false,
          device_count: false,
          mobile: false,
          first_name: false,
          last_name: false,
        });
        handleRemoveImage();

        router.push("/dashboard?tab=requests");
      } else {
        toast.error(res?.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validateForm = () => {
    let valid = true;
    if (
      !requestData.first_name ||
      !requestData.last_name ||
      !requestData.mobile ||
      !requestData.id_service ||
      !requestData.operation_type ||
      !requestData.address ||
      !location.length ||
      !requestData.device_count ||
      !requestData.requester_type ||
      isUpdating
    ) {
      valid = false;
    }
    return valid;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-neutral-50 to-neutral-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              ارسال درخواست جدید
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              اطلاعات خود را با دقت وارد کنید تا درخواست شما به بهترین شکل ثبت
              شود
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <motion.div
          className="bg-surface rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 xl:p-12">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Personal Information Section */}
                <motion.div
                  className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-6 border border-neutral-100 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-800">
                        اطلاعات شخصی
                      </h3>
                      <p className="text-sm text-neutral-600">
                        اطلاعات هویتی خود را وارد کنید
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-semibold text-neutral-700"
                      >
                        نام <span className="text-error-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        value={requestData.first_name}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            first_name: e.target.value,
                          })
                        }
                        className="block w-full px-4 py-3 text-sm text-neutral-700 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-300 shadow-sm"
                        placeholder="نام خود را وارد کنید"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-semibold text-neutral-700"
                      >
                        نام خانوادگی <span className="text-error-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        value={requestData.last_name}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            last_name: e.target.value,
                          })
                        }
                        className="block w-full px-4 py-3 text-sm text-neutral-700 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-300 shadow-sm"
                        placeholder="نام خانوادگی خود را وارد کنید"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-semibold text-neutral-700"
                    >
                      شماره موبایل <span className="text-error-500">*</span>
                    </label>
                    <input
                      style={{ direction: "ltr" }}
                      type="tel"
                      id="mobile"
                      value={requestData.mobile}
                      onChange={(e) => {
                        const value = e.target.value;
                        setRequestData({ ...requestData, mobile: value });
                        const regex = /^09\d{9}$/;
                        if (value && !regex.test(value)) {
                          setErrors({ ...errors, mobile: true });
                        } else {
                          setErrors({ ...errors, mobile: false });
                        }
                      }}
                      className={`block w-full px-4 py-3 text-sm text-neutral-700 bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-300 shadow-sm ${
                        errors.mobile
                          ? "border-error-500 bg-error-50"
                          : "border-neutral-200"
                      }`}
                      placeholder="09123456789"
                      maxLength="11"
                      required
                    />
                    {errors.mobile && requestData.mobile && (
                      <p className="text-sm text-error-500 flex items-center gap-2 mt-2">
                        <AlertCircle className="w-4 h-4" />
                        شماره موبایل معتبر نیست
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Mobile Status Section */}
                {isGettingDataWithMobile ? (
                  <motion.div
                    className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-8 border border-neutral-200 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <FaSpinner className="text-3xl text-primary-500 mb-3 animate-spin mx-auto" />
                        <p className="text-neutral-600 font-medium">
                          در حال بررسی شماره موبایل...
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : isBlocked ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-gradient-to-br from-error-50 to-red-100 rounded-2xl p-8 border-2 border-error-200 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-6 left-6 w-12 h-12 bg-error-400 rounded-full blur-sm"></div>
                      <div className="absolute bottom-6 right-6 w-8 h-8 bg-error-300 rounded-full blur-sm"></div>
                    </div>

                    <div className="relative z-10 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.2,
                          duration: 0.5,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-error-500 text-white rounded-full mb-4 shadow-lg"
                      >
                        <FaExclamationTriangle size={24} />
                      </motion.div>

                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="text-2xl font-bold text-error-800 mb-3"
                      >
                        کاربر مسدود شده
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        className="text-error-700 text-base mb-4 leading-relaxed max-w-md mx-auto"
                      >
                        این شماره موبایل در لیست سیاه قرار دارد و امکان ثبت
                        درخواست جدید ندارد
                      </motion.p>

                      {reasonBlock && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6, duration: 0.3 }}
                          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-error-200 shadow-inner max-w-md mx-auto"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-error-500 rounded-full mt-2"></div>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-error-800 block mb-1">
                                دلیل مسدودیت:
                              </span>
                              <p className="text-sm text-error-700 leading-relaxed">
                                {reasonBlock}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.3 }}
                        className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-error-200"
                      >
                        <span className="w-2 h-2 bg-error-500 rounded-full animate-pulse"></span>
                        <span className="text-xs text-error-600 font-medium">
                          برای رفع مسدودیت با مدیر سیستم تماس بگیرید
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : suggestedAddresses.length > 0 ? (
                  <motion.div
                    className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-6 border border-neutral-200 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-8 bg-gradient-to-b from-secondary-500 to-secondary-600 rounded-full"></div>
                      <h4 className="text-xl font-bold text-neutral-800">
                        آدرس های پیشنهادی
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {suggestedAddresses.map((address, index) => (
                        <div
                          key={index}
                          className={`cursor-pointer border-2 p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
                            selectedAddress === address
                              ? "border-primary-400 bg-primary-50 shadow-md"
                              : "border-neutral-200 hover:border-neutral-300"
                          }`}
                          onClick={() => setSelectedAddress(address)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {selectedAddress === address && (
                                <CheckCircle className="w-4 h-4 text-primary-500" />
                              )}
                              <span
                                className={`text-sm font-medium ${
                                  selectedAddress === address
                                    ? "text-primary-700"
                                    : "text-neutral-600"
                                }`}
                              >
                                {address.first_name || "نام ثبت نشده"}{" "}
                                {address.last_name}
                              </span>
                            </div>
                            <div
                              className={`text-xs leading-relaxed ${
                                selectedAddress === address
                                  ? "text-primary-600"
                                  : "text-neutral-500"
                              }`}
                            >
                              {address.address}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : null}

                {/* Service Information Section */}
                <motion.div
                  className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-6 border border-neutral-100 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-800">
                        اطلاعات سرویس
                      </h3>
                      <p className="text-sm text-neutral-600">
                        جزئیات سرویس مورد نظر را مشخص کنید
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-neutral-700">
                        نام سرویس <span className="text-error-500">*</span>
                      </label>
                      <Select
                        options={serviceOptions}
                        value={serviceOptions.find(
                          (option) => option.value == requestData.id_service
                        )}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            id_service: e.value,
                          })
                        }
                        styles={customSelectStyles}
                        placeholder="سرویس مورد نظر را انتخاب کنید"
                        isSearchable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-neutral-700">
                        درخواست کننده <span className="text-error-500">*</span>
                      </label>
                      <Select
                        options={requester_type}
                        value={requester_type.find(
                          (option) => option.value == requestData.requester_type
                        )}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            requester_type: e.value,
                          })
                        }
                        styles={customSelectStyles}
                        placeholder="نوع درخواست کننده را انتخاب کنید"
                        isSearchable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-neutral-700">
                        نوع سرویس <span className="text-error-500">*</span>
                      </label>
                      <Select
                        options={operation_type}
                        value={operation_type.find(
                          (option) => option.value == requestData.operation_type
                        )}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            operation_type: e.value,
                          })
                        }
                        styles={customSelectStyles}
                        placeholder="نوع سرویس را انتخاب کنید"
                        isSearchable
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="device_count"
                        className="block text-sm font-semibold text-neutral-700"
                      >
                        تعداد دستگاه <span className="text-error-500">*</span>
                      </label>
                      <input
                        style={{ direction: "ltr" }}
                        type="number"
                        id="device_count"
                        value={requestData.device_count}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            device_count: e.target.value,
                          })
                        }
                        className="block w-full px-4 py-3 text-sm text-neutral-700 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-300 shadow-sm no-spinner placeholder:text-right"
                        placeholder="تعداد دستگاه را وارد کنید"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Image Upload Section */}
                <motion.div
                  className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-6 border border-neutral-100 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-800">
                        تصویر (اختیاری)
                      </h3>
                      <p className="text-sm text-neutral-600">
                        تصویر مرتبط با درخواست خود را آپلود کنید
                      </p>
                    </div>
                  </div>

                  {!imagePreview ? (
                    <div className="space-y-4">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isImageUploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`block w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                          isImageUploading
                            ? "border-neutral-300 bg-neutral-100 cursor-not-allowed"
                            : "border-neutral-300 hover:border-primary-400 hover:bg-primary-50"
                        }`}
                      >
                        <div className="text-center">
                          {isImageUploading ? (
                            <div className="flex flex-col items-center gap-3">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                              <p className="text-sm font-medium text-neutral-600">
                                در حال آپلود...
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-3">
                              <Upload className="w-8 h-8 text-neutral-400" />
                              <div>
                                <p className="text-sm font-medium text-neutral-700">
                                  کلیک کنید تا تصویر انتخاب کنید
                                </p>
                                <p className="text-xs text-neutral-500 mt-1">
                                  حداکثر حجم: 15 مگابایت
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative overflow-hidden rounded-xl border-2 border-neutral-200 shadow-lg">
                        <img
                          src={imagePreview}
                          alt="پیش نمایش تصویر"
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-3 right-3 w-10 h-10 bg-error-500 hover:bg-error-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 mt-2 text-center">
                        تصویر با موفقیت آپلود شد
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Location Information Section */}
                <motion.div
                  className="bg-gradient-to-br from-neutral-50 to-white rounded-2xl p-6 border border-neutral-100 shadow-sm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-error-500 to-error-600 rounded-xl flex items-center justify-center shadow-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-800">
                        اطلاعات مکانی
                      </h3>
                      <p className="text-sm text-neutral-600">
                        موقعیت و آدرس دقیق را مشخص کنید
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-neutral-700">
                        انتخاب موقعیت <span className="text-error-500">*</span>
                      </label>
                      <div className="h-80 w-full rounded-xl overflow-hidden border-2 border-neutral-200 bg-neutral-50 shadow-inner">
                        <SelectLocation
                          location={location}
                          setLocation={setLocation}
                        />
                      </div>
                      <p className="text-xs text-neutral-500 flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        موقعیت مورد نظر را روی نقشه انتخاب کنید
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="address"
                        className="block text-sm font-semibold text-neutral-700"
                      >
                        آدرس <span className="text-error-500">*</span>
                      </label>
                      <textarea
                        id="address"
                        rows="4"
                        value={requestData.address}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            address: e.target.value,
                          })
                        }
                        className="block w-full px-4 py-3 text-sm text-neutral-700 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-300 resize-none shadow-sm"
                        placeholder="آدرس کامل را وارد کنید..."
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.div
              className="mt-12 pt-8 border-t border-neutral-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <button
                onClick={handleSubmit}
                disabled={!validateForm()}
                type="submit"
                className={`w-full px-8 py-4 text-lg font-semibold text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-4 focus:ring-success-200 shadow-lg ${
                  !validateForm()
                    ? "bg-neutral-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 hover:shadow-xl"
                }`}
              >
                {isUpdating ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    لطفا صبر کنید...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Plus className="w-5 h-5" />
                    ثبت درخواست
                  </div>
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddRequest;
