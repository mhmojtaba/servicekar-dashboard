"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Image, MapPin, Plus, Settings, Trash } from "lucide-react";

import { useRequests } from "@/providers/RequestsContext";
import { useAuth } from "@/providers/AuthContext";
import { selectOptionsGenerator, uploadFile } from "@/utils/utils";
import SelectLocation from "@/components/SelectLocation/SelectLocation";
import { customSelectStyles } from "@/styles/customeStyles";

const AddRequest = () => {
  const router = useRouter();
  const { token, user } = useAuth();
  const {
    service,
    requester_type,
    operation_type,
    addUpdateRequests,
    isUpdating,
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
        toast.success(res?.msg_text);
        router.push("/dashboard");
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
    <div className="min-h-screen bg-gradient-to-br from-background via-neutral-50 to-neutral-100 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 mb-2">
            ارسال درخواست جدید
          </h1>
          <p className="text-neutral-600 text-lg">
            اطلاعات خود را وارد کنید تا درخواست شما ثبت شود
          </p>
        </motion.div>

        <motion.div
          className="bg-surface rounded-3xl shadow-card border border-neutral-100 overflow-hidden"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="p-6 lg:p-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-8">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-primary-100">
                    <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800">
                      اطلاعات شخصی
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-neutral-700"
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
                        className="block w-full px-4 py-3 text-sm text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-300"
                        placeholder="نام خود را وارد کنید"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-neutral-700"
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
                        className="block w-full px-4 py-3 text-sm text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-300"
                        placeholder="نام خانوادگی خود را وارد کنید"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="mobile"
                      className="block text-sm font-medium text-neutral-700"
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
                      className={`block w-full px-4 py-3 text-sm text-neutral-700 bg-neutral-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-300 ${
                        errors.mobile
                          ? "border-error-500 bg-error-50"
                          : "border-neutral-200"
                      }`}
                      placeholder="09123456789"
                      maxLength="11"
                      required
                    />
                    {errors.mobile && requestData.mobile && (
                      <p className="text-sm text-error-500 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        شماره موبایل معتبر نیست
                      </p>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-secondary-100">
                    <div className="w-10 h-10 bg-secondary-500 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800">
                      اطلاعات سرویس
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">
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
                      <label className="block text-sm font-medium text-neutral-700">
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
                      <label className="block text-sm font-medium text-neutral-700">
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
                        className="block text-sm font-medium text-neutral-700"
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
                        className="block w-full px-4 py-3 text-sm text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-300 no-spinner placeholder:text-right"
                        placeholder="تعداد دستگاه را وارد کنید"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-accent-100">
                    <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center">
                      <Image className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800">
                      تصویر (اختیاری)
                    </h3>
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
                              <Plus className="w-8 h-8 text-neutral-400" />
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
                      <div className="relative overflow-hidden rounded-xl border-2 border-neutral-200">
                        <img
                          src={imagePreview}
                          alt="پیش نمایش تصویر"
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 w-8 h-8 bg-error-500 hover:bg-error-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
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

              <div className="space-y-8">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-error-100">
                    <div className="w-10 h-10 bg-error-500 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800">
                      اطلاعات مکانی
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-neutral-700">
                        انتخاب موقعیت <span className="text-error-500">*</span>
                      </label>
                      <div className="h-80 w-full rounded-xl overflow-hidden border-2 border-neutral-200 bg-neutral-50 shadow-inner">
                        <SelectLocation
                          location={location}
                          setLocation={setLocation}
                        />
                      </div>
                      <p className="text-xs text-neutral-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        موقعیت مورد نظر را روی نقشه انتخاب کنید
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-neutral-700"
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
                        className="block w-full px-4 py-3 text-sm text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 hover:border-neutral-300 resize-none"
                        placeholder="آدرس کامل را وارد کنید..."
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              className="mt-8 pt-6 border-t border-neutral-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <button
                onClick={handleSubmit}
                disabled={!validateForm()}
                type="submit"
                className={`w-full px-8 py-4 text-lg font-semibold text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-4 focus:ring-success-200 ${
                  !validateForm()
                    ? "bg-neutral-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 shadow-lg hover:shadow-xl"
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
