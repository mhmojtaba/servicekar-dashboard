"use client";
import React, { useEffect, useState, useMemo } from "react";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronDown,
  ChevronUp,
  Phone,
  Calendar,
  FileText,
  Home,
  Building,
  Package,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { useRequests } from "@/providers/RequestsContext";
import { useAuth } from "@/providers/AuthContext";
import {
  preventArrowKeyChange,
  selectOptionsGenerator,
  uploadFile,
} from "@/utils/utils";
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

// Enhanced Collapsible Section Component
const CollapsibleSection = ({
  title,
  icon: Icon,
  children,
  isExpanded,
  onToggle,
  isMobile = false,
  gradient = "from-blue-500 to-blue-600",
  description = "",
}) => {
  if (!isMobile) {
    return (
      <motion.div
        className="bg-white rounded-3xl border border-neutral-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-neutral-50 to-white p-6 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-neutral-800 mb-1">
                {title}
              </h3>
              {description && (
                <p className="text-sm text-neutral-600">{description}</p>
              )}
            </div>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-3xl border border-neutral-200 shadow-lg overflow-hidden mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between hover:bg-neutral-50 transition-all duration-200 group"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-neutral-800">{title}</h3>
            {description && (
              <p className="text-xs text-neutral-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        <div className="text-neutral-400 group-hover:text-neutral-600 transition-colors duration-200">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-5 border-t border-neutral-100 bg-gradient-to-br from-neutral-50/50 to-white">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

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
    brands,
    brand_models,
    getDeviceWithBarcode,
  } = useRequests();

  const [requestData, setRequestData] = useState({
    id_service: null,
    requester_type: null,
    operation_type: null,
    address: "",
    device_count: 1,
    mobile: "",
    first_name: "",
    last_name: "",
    national_id: "",
    birth_date: "",
    phone: "",
    img: null,
    install_date: "",
    manufacturer_serial: "",
    manufacturer_acceptance_code: "",
    barcode: "",
    brand_id: null,
    model_id: null,
    install_location: "",
    usage_location: "",
    construction_status: "",
    install_as: "",
    building_area: "",
    postal_code: "",
    recommender_mobile: "",
  });

  const [location, setLocation] = useState([32.644397, 51.667455]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    service: false,
    location: false,
    image: false,
  });

  const [errors, setErrors] = useState({
    id_service: false,
    requester_type: false,
    operation_type: false,
    address: false,
    location: false,
    mobile: false,
    first_name: false,
    last_name: false,
  });

  const install_as_options = [
    { value: "اولین", label: "اولین" },
    { value: "جایگزین", label: "جایگزین" },
  ];

  const serviceOptions = selectOptionsGenerator(service);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    const getDeviceDataWithBarcode = async () => {
      if (requestData.barcode) {
        const res = await getDeviceWithBarcode(requestData.barcode);

        if (res?.msg === 0) {
          setRequestData((prev) => ({
            ...prev,
            id_service: res?.data?.id_service,
            brand_id: res?.data?.brand_id,
            model_id: res?.data?.model_id,
            requester_type: res?.data?.requester_type,
          }));
        }
      }
    };
    getDeviceDataWithBarcode();
  }, [requestData.barcode]);

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

  const brandOptions = useMemo(() => {
    if (requestData.id_service) {
      const brandsFound = brands.filter(
        (brand) => brand.id_service == requestData.id_service
      );
      return brandsFound.length > 0 ? selectOptionsGenerator(brandsFound) : [];
    }
    return [];
  }, [requestData.id_service, brands]);

  const modelOptions = useMemo(() => {
    if (requestData.brand_id) {
      const modelsFound = brand_models.filter(
        (model) => model.id_parent == requestData.brand_id
      );
      return modelsFound.length > 0 ? selectOptionsGenerator(modelsFound) : [];
    }
    return [];
  }, [requestData.brand_id, brand_models]);

  const handleBrandChange = (e) => {
    setRequestData((prev) => ({
      ...prev,
      brand_id: e.value,
      model_id: null,
    }));
  };

  const handleServiceChange = (e) => {
    setRequestData((prev) => ({
      ...prev,
      id_service: e.value,
      brand_id: null,
      model_id: null,
    }));
  };

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
          device_count: 1,
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
          mobile: false,
          first_name: false,
          last_name: false,
        });
        handleRemoveImage();

        router.push("/?tab=requests");
      } else {
        toast.error(res?.msg_text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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
      !requestData.requester_type ||
      isUpdating
    ) {
      valid = false;
    }
    return valid;
  };

  console.log("requestData", requestData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:pt-10 lg:pb-20">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl mb-8 shadow-2xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Plus className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-3xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              ارسال درخواست جدید
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              فرم زیر را تکمیل کرده و درخواست خود را ثبت کنید
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10 xl:p-12">
            <div
              className={`${isMobile ? "space-y-6" : "grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-16"}`}
            >
              <div className={`${isMobile ? "space-y-6" : "space-y-10"}`}>
                <CollapsibleSection
                  title="اطلاعات شخصی"
                  icon={User}
                  description="اطلاعات هویتی و تماس خود را وارد کنید"
                  isExpanded={isMobile ? expandedSections.personal : true}
                  onToggle={() => toggleSection("personal")}
                  isMobile={isMobile}
                  gradient="from-blue-500 to-blue-600"
                >
                  <div className={`${isMobile ? "space-y-5" : "space-y-6"}`}>
                    <div
                      className={`grid grid-cols-1 ${isMobile ? "gap-5" : "lg:grid-cols-2 gap-6"}`}
                    >
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          نام <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={requestData.first_name}
                          onChange={(e) =>
                            setRequestData({
                              ...requestData,
                              first_name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3.5 text-neutral-700 bg-white border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300"
                          placeholder="نام خود را وارد کنید"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          نام خانوادگی <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={requestData.last_name}
                          onChange={(e) =>
                            setRequestData({
                              ...requestData,
                              last_name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3.5 text-neutral-700 bg-white border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300"
                          placeholder="نام خانوادگی خود را وارد کنید"
                          required
                        />
                      </div>
                    </div>

                    <div
                      className={`grid grid-cols-1 ${isMobile ? "gap-5" : "lg:grid-cols-2 gap-6"}`}
                    >
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-500" />
                          شماره موبایل <span className="text-red-500">*</span>
                        </label>
                        <input
                          style={{ direction: "ltr" }}
                          type="tel"
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
                          className={`w-full px-4 py-3.5 text-neutral-700 bg-white border-2 rounded-xl focus:ring-2 transition-all duration-200 placeholder:text-neutral-400 ${
                            errors.mobile
                              ? "border-red-500 bg-red-50 focus:ring-red-500/20 focus:border-red-500"
                              : "border-neutral-200 hover:border-neutral-300 focus:ring-green-500/20 focus:border-green-500"
                          }`}
                          placeholder="09123456789"
                          maxLength="11"
                          required
                        />
                        {errors.mobile && requestData.mobile && (
                          <p className="text-sm text-red-500 flex items-center mt-2">
                            <span className="w-1 h-1 bg-red-500 rounded-full ml-2"></span>
                            شماره موبایل معتبر نیست
                          </p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-purple-500" />
                          تلفن ثابت
                        </label>
                        <input
                          style={{ direction: "ltr" }}
                          type="tel"
                          value={requestData.phone}
                          onChange={(e) => {
                            const value = e.target.value;
                            setRequestData({ ...requestData, phone: value });
                          }}
                          className="w-full px-4 py-3.5 text-neutral-700 bg-white border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300"
                          placeholder="02111111111"
                          maxLength="11"
                        />
                      </div>
                    </div>

                    <div
                      className={`grid grid-cols-1 ${isMobile ? "gap-5" : "lg:grid-cols-2 gap-6"}`}
                    >
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-500" />
                          کد ملی
                        </label>
                        <input
                          style={{ direction: "ltr" }}
                          type="text"
                          value={requestData.national_id}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            setRequestData({
                              ...requestData,
                              national_id: value,
                            });
                          }}
                          className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300 placeholder:text-right"
                          placeholder="کد ملی"
                          maxLength={10}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          تاریخ تولد
                        </label>
                        <div className="relative">
                          <DatePicker
                            value={requestData.birth_date || null}
                            onChange={(date) =>
                              setRequestData({
                                ...requestData,
                                birth_date:
                                  date?.format?.("YYYY/MM/DD") || date,
                              })
                            }
                            calendar={persian}
                            locale={persian_fa}
                            containerClassName="w-full"
                            style={{ direction: "ltr" }}
                            format="YYYY/MM/DD"
                            placeholder="تاریخ تولد"
                            inputClass="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300 z-10 placeholder:text-right"
                            calendarPosition="bottom-start"
                            calendarClassName="z-[9999]"
                            portalClassName="z-[9999]"
                            portal={true}
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          شماره موبایل معرف
                        </label>
                        <input
                          type="tel"
                          style={{ direction: "ltr" }}
                          value={requestData.recommender_mobile}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 11);
                            setRequestData({
                              ...requestData,
                              recommender_mobile: value,
                            });
                          }}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                          placeholder="09xxxxxxxxx"
                          maxLength={11}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                {isGettingDataWithMobile && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <h4 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500 ml-2" />
                      در حال دریافت اطلاعات
                    </h4>
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                  </div>
                )}

                {isBlocked && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border-2 border-red-200 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-6 left-6 w-12 h-12 bg-red-400 rounded-full blur-sm"></div>
                      <div className="absolute bottom-6 right-6 w-8 h-8 bg-red-300 rounded-full blur-sm"></div>
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
                        className="inline-flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full mb-4 shadow-lg"
                      >
                        <FaExclamationTriangle size={24} />
                      </motion.div>

                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.3 }}
                        className="text-xl font-bold text-red-800 mb-3"
                      >
                        کاربر مسدود شده
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        className="text-red-700 text-sm mb-4 leading-relaxed max-w-md mx-auto"
                      >
                        این شماره موبایل در لیست سیاه قرار دارد و امکان ثبت
                        درخواست جدید ندارد
                      </motion.p>

                      {reasonBlock && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6, duration: 0.3 }}
                          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-200 shadow-inner max-w-md mx-auto"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-red-800 block mb-1">
                                دلیل مسدودیت:
                              </span>
                              <p className="text-sm text-red-700 leading-relaxed">
                                {reasonBlock}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {suggestedAddresses.length > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <h4 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
                      <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full ml-3"></div>
                      پیشنهادات
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {suggestedAddresses.map((address, index) => (
                        <div
                          key={index}
                          className={`cursor-pointer border-2 p-3 rounded-xl transition-all duration-200 ${
                            selectedAddress === address
                              ? "border-green-400 bg-green-50"
                              : "border-neutral-200 hover:border-green-300"
                          }`}
                          onClick={() => setSelectedAddress(address)}
                        >
                          <div className="text-sm">
                            <span
                              className={`font-medium block mb-1 ${
                                selectedAddress === address
                                  ? "text-green-600"
                                  : "text-neutral-600"
                              }`}
                            >
                              {address.first_name || "نام ثبت نشده"}{" "}
                              {address.last_name}
                            </span>
                            <span
                              className={`text-xs ${
                                selectedAddress === address
                                  ? "text-green-500"
                                  : "text-neutral-500"
                              }`}
                            >
                              {address.address}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <CollapsibleSection
                  title="اطلاعات سرویس"
                  icon={Settings}
                  description="جزئیات سرویس مورد نظر را مشخص کنید"
                  isExpanded={isMobile ? expandedSections.service : true}
                  onToggle={() => toggleSection("service")}
                  isMobile={isMobile}
                  gradient="from-purple-500 to-purple-600"
                >
                  <div className={`${isMobile ? "space-y-5" : "space-y-6"}`}>
                    <div
                      className={`grid grid-cols-1 ${isMobile ? "gap-5" : "lg:grid-cols-2 gap-6"}`}
                    >
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <Package className="w-4 h-4 text-purple-500" />
                          نام سرویس <span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={serviceOptions}
                          value={serviceOptions.find(
                            (option) => option.value == requestData.id_service
                          )}
                          onChange={handleServiceChange}
                          styles={{
                            ...customSelectStyles,
                            control: (provided, state) => ({
                              ...provided,
                              minHeight: "48px",
                              borderRadius: "12px",
                              borderColor: state.isFocused
                                ? "#8B5CF6"
                                : "#E5E7EB",
                              boxShadow: state.isFocused
                                ? "0 0 0 2px rgba(139, 92, 246, 0.1)"
                                : "none",
                              "&:hover": {
                                borderColor: "#8B5CF6",
                              },
                            }),
                          }}
                          placeholder="سرویس مورد نظر را انتخاب کنید"
                          isSearchable
                          menuPortalTarget={
                            typeof document !== "undefined"
                              ? document.body
                              : null
                          }
                          menuPosition="fixed"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <User className="w-4 h-4 text-purple-500" />
                          درخواست کننده <span className="text-red-500">*</span>
                        </label>
                        <Select
                          options={requester_type}
                          value={requester_type.find(
                            (option) =>
                              option.value == requestData.requester_type
                          )}
                          onChange={(e) =>
                            setRequestData({
                              ...requestData,
                              requester_type: e.value,
                            })
                          }
                          styles={{
                            ...customSelectStyles,
                            control: (provided, state) => ({
                              ...provided,
                              minHeight: "48px",
                              borderRadius: "12px",
                              borderColor: state.isFocused
                                ? "#8B5CF6"
                                : "#E5E7EB",
                              boxShadow: state.isFocused
                                ? "0 0 0 2px rgba(139, 92, 246, 0.1)"
                                : "none",
                              "&:hover": {
                                borderColor: "#8B5CF6",
                              },
                            }),
                          }}
                          placeholder="نوع درخواست کننده را انتخاب کنید"
                          isSearchable
                          menuPortalTarget={
                            typeof document !== "undefined"
                              ? document.body
                              : null
                          }
                          menuPosition="fixed"
                        />
                      </div>
                    </div>

                    <div
                      className={`grid grid-cols-1 ${isMobile ? "gap-5" : "lg:grid-cols-2 gap-6"}`}
                    >
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <Package className="w-4 h-4 text-purple-500" />
                          نام برند
                        </label>
                        <Select
                          options={brandOptions}
                          isDisabled={
                            !requestData.id_service || brandOptions.length === 0
                          }
                          value={
                            brandOptions.find(
                              (option) => option.value == requestData.brand_id
                            ) || null
                          }
                          onChange={handleBrandChange}
                          styles={{
                            ...customSelectStyles,
                            control: (provided, state) => ({
                              ...provided,
                              minHeight: "48px",
                              borderRadius: "12px",
                              borderColor: state.isFocused
                                ? "#8B5CF6"
                                : "#E5E7EB",
                              boxShadow: state.isFocused
                                ? "0 0 0 2px rgba(139, 92, 246, 0.1)"
                                : "none",
                              "&:hover": {
                                borderColor: "#8B5CF6",
                              },
                            }),
                          }}
                          placeholder="نام برند را انتخاب کنید"
                          isSearchable
                          menuPosition="fixed"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <Package className="w-4 h-4 text-purple-500" />
                          نام مدل
                        </label>
                        <Select
                          options={modelOptions}
                          isDisabled={
                            !requestData.brand_id || modelOptions.length === 0
                          }
                          value={
                            modelOptions.find(
                              (option) => option.value == requestData.model_id
                            ) || null
                          }
                          onChange={(e) =>
                            setRequestData({
                              ...requestData,
                              model_id: e.value,
                            })
                          }
                          styles={{
                            ...customSelectStyles,
                            control: (provided, state) => ({
                              ...provided,
                              minHeight: "48px",
                              borderRadius: "12px",
                              borderColor: state.isFocused
                                ? "#8B5CF6"
                                : "#E5E7EB",
                              boxShadow: state.isFocused
                                ? "0 0 0 2px rgba(139, 92, 246, 0.1)"
                                : "none",
                              "&:hover": {
                                borderColor: "#8B5CF6",
                              },
                            }),
                          }}
                          placeholder="نام مدل را انتخاب کنید"
                          isSearchable
                          menuPortalTarget={
                            typeof document !== "undefined"
                              ? document.body
                              : null
                          }
                          menuPosition="fixed"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-purple-500" />
                        نوع سرویس <span className="text-red-500">*</span>
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
                        styles={{
                          ...customSelectStyles,
                          control: (provided, state) => ({
                            ...provided,
                            minHeight: "48px",
                            borderRadius: "12px",
                            borderColor: state.isFocused
                              ? "#8B5CF6"
                              : "#E5E7EB",
                            boxShadow: state.isFocused
                              ? "0 0 0 2px rgba(139, 92, 246, 0.1)"
                              : "none",
                            "&:hover": {
                              borderColor: "#8B5CF6",
                            },
                          }),
                        }}
                        placeholder="نوع سرویس را انتخاب کنید"
                        isSearchable
                        menuPortalTarget={
                          typeof document !== "undefined" ? document.body : null
                        }
                        menuPosition="fixed"
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="تصویر (اختیاری)"
                  icon={Camera}
                  description="تصویر مرتبط با درخواست خود را آپلود کنید"
                  isExpanded={isMobile ? expandedSections.image : true}
                  onToggle={() => toggleSection("image")}
                  isMobile={isMobile}
                  gradient="from-orange-500 to-orange-600"
                >
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
                            : "border-neutral-300 hover:border-orange-400 hover:bg-orange-50"
                        }`}
                      >
                        <div className="text-center">
                          {isImageUploading ? (
                            <div className="flex flex-col items-center gap-3">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
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
                          className="absolute top-3 right-3 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 mt-2 text-center">
                        تصویر با موفقیت آپلود شد
                      </p>
                    </div>
                  )}
                </CollapsibleSection>
              </div>

              <div className={`${isMobile ? "space-y-6" : "space-y-10"}`}>
                <CollapsibleSection
                  title="اطلاعات تکمیلی"
                  icon={Building}
                  description="جزئیات اضافی درخواست را مشخص کنید"
                  isExpanded={isMobile ? expandedSections.service : true}
                  onToggle={() => toggleSection("service")}
                  isMobile={isMobile}
                  gradient="from-indigo-500 to-indigo-600"
                >
                  <div className={`${isMobile ? "space-y-5" : "space-y-6"}`}>
                    <div
                      className={`grid grid-cols-1 ${isMobile ? "gap-5" : "lg:grid-cols-2 gap-6"}`}
                    >
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          تاریخ نصب
                        </label>
                        <DatePicker
                          value={requestData.install_date}
                          onChange={(date) =>
                            setRequestData({
                              ...requestData,
                              install_date:
                                date?.format?.("YYYY/MM/DD") || date,
                            })
                          }
                          calendar={persian}
                          locale={persian_fa}
                          containerClassName="w-full"
                          style={{ direction: "ltr" }}
                          format="YYYY/MM/DD"
                          placeholder="انتخاب تاریخ نصب"
                          inputClass="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300 z-10 placeholder:text-right"
                          calendarPosition="bottom-start"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <Settings className="w-4 h-4 text-indigo-500" />
                          نوع نصب
                        </label>
                        <Select
                          options={install_as_options}
                          value={install_as_options.find(
                            (option) => option.value == requestData.install_as
                          )}
                          onChange={(e) =>
                            setRequestData({
                              ...requestData,
                              install_as: e.value,
                            })
                          }
                          styles={{
                            ...customSelectStyles,
                            control: (provided, state) => ({
                              ...provided,
                              minHeight: "48px",
                              borderRadius: "12px",
                              borderColor: state.isFocused
                                ? "#6366F1"
                                : "#E5E7EB",
                              boxShadow: state.isFocused
                                ? "0 0 0 2px rgba(99, 102, 241, 0.1)"
                                : "none",
                              "&:hover": {
                                borderColor: "#6366F1",
                              },
                            }),
                          }}
                          placeholder="نوع نصب"
                          menuPortalTarget={
                            typeof document !== "undefined"
                              ? document.body
                              : null
                          }
                          menuPosition="fixed"
                        />
                      </div>
                    </div>

                    <div
                      className={`grid grid-cols-1 ${isMobile ? "gap-5" : "lg:grid-cols-2 gap-6"}`}
                    >
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          بارکد
                        </label>
                        <input
                          style={{ direction: "ltr" }}
                          type="text"
                          value={requestData.barcode}
                          onChange={(e) =>
                            setRequestData({
                              ...requestData,
                              barcode: e.target.value,
                            })
                          }
                          placeholder="بارکد"
                          className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          شماره سریال تولید کننده
                        </label>
                        <input
                          style={{ direction: "ltr" }}
                          type="text"
                          value={requestData.manufacturer_serial}
                          onChange={(e) =>
                            setRequestData({
                              ...requestData,
                              manufacturer_serial: e.target.value,
                            })
                          }
                          placeholder="شماره سریال تولید کننده"
                          className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300 placeholder:text-right"
                        />
                      </div>
                    </div>

                    <div
                      className={`grid grid-cols-1 ${isMobile ? "gap-5" : "lg:grid-cols-2 gap-6"}`}
                    >
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          کد پذیرش تولید کننده
                        </label>
                        <input
                          style={{ direction: "ltr" }}
                          type="text"
                          value={requestData.manufacturer_acceptance_code}
                          onChange={(e) =>
                            setRequestData({
                              ...requestData,
                              manufacturer_acceptance_code: e.target.value,
                            })
                          }
                          placeholder="کد پذیرش تولید کننده"
                          className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300 placeholder:text-right"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <Home className="w-4 h-4 text-indigo-500" />
                          محل نصب
                        </label>
                        <input
                          type="text"
                          value={requestData.install_location}
                          onChange={(e) =>
                            setRequestData({
                              ...requestData,
                              install_location: e.target.value,
                            })
                          }
                          placeholder="زیرزمین، آشپزخانه، تراس"
                          className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300"
                        />
                      </div>
                    </div>

                    <div
                      className={`grid grid-cols-1 ${isMobile ? "gap-5" : "lg:grid-cols-2 gap-6"}`}
                    >
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <Building className="w-4 h-4 text-indigo-500" />
                          محل استفاده
                        </label>
                        <input
                          type="text"
                          value={requestData.usage_location}
                          onChange={(e) =>
                            setRequestData({
                              ...requestData,
                              usage_location: e.target.value,
                            })
                          }
                          placeholder="مسکونی ، تجاری، اداری"
                          className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <Building className="w-4 h-4 text-indigo-500" />
                          وضعیت ساختمان
                        </label>
                        <input
                          type="text"
                          value={requestData.construction_status}
                          onChange={(e) =>
                            setRequestData({
                              ...requestData,
                              construction_status: e.target.value,
                            })
                          }
                          placeholder="نوساز، قدیمی"
                          className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300"
                        />
                      </div>
                    </div>

                    <div
                      className={`grid grid-cols-1 ${isMobile ? "gap-5" : "lg:grid-cols-2 gap-6"}`}
                    >
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                          <Building className="w-4 h-4 text-indigo-500" />
                          مساحت ساختمان
                        </label>
                        <input
                          style={{ direction: "ltr" }}
                          type="number"
                          value={requestData.building_area}
                          onChange={(e) =>
                            setRequestData({
                              ...requestData,
                              building_area: e.target.value,
                            })
                          }
                          onKeyDown={preventArrowKeyChange}
                          placeholder="مساحت ساختمان"
                          className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300 no-spinner placeholder:text-right"
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="اطلاعات مکانی"
                  icon={MapPin}
                  description="موقعیت و آدرس دقیق را مشخص کنید"
                  isExpanded={isMobile ? expandedSections.location : true}
                  onToggle={() => toggleSection("location")}
                  isMobile={isMobile}
                  gradient="from-green-500 to-green-600"
                >
                  <div className={`${isMobile ? "space-y-5" : "space-y-6"}`}>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-500" />
                        انتخاب موقعیت <span className="text-red-500">*</span>
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
                      <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-500" />
                        کد پستی
                      </label>
                      <input
                        style={{ direction: "ltr" }}
                        type="text"
                        value={requestData.postal_code}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            postal_code: e.target.value,
                          })
                        }
                        maxLength={10}
                        placeholder="کد پستی"
                        className="w-full px-4 py-3.5 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 placeholder:text-neutral-400 hover:border-neutral-300 placeholder:text-right"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-neutral-700 flex items-center gap-2">
                        <Home className="w-4 h-4 text-green-500" />
                        آدرس <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows="4"
                        value={requestData.address}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3.5 text-sm text-neutral-700 bg-white border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 hover:border-neutral-300 resize-none shadow-sm"
                        placeholder="آدرس کامل را وارد کنید..."
                        required
                      />
                    </div>
                  </div>
                </CollapsibleSection>
              </div>
            </div>

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
                className={`w-full px-8 py-4 text-lg font-semibold text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-4 focus:ring-green-200 shadow-lg ${
                  !validateForm()
                    ? "bg-neutral-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-xl"
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
