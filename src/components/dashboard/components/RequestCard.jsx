import { useState } from "react";
import Image from "next/image";

import {
  User,
  Phone,
  Calendar,
  Settings,
  MapPin,
  CreditCard,
  FileText,
  Link,
  ZoomIn,
  AlertTriangle,
  X,
} from "lucide-react";

import { useRequests } from "@/providers/RequestsContext";
import ImagePreview from "./ImagePreview";
import { toast } from "react-toastify";

export default function RequestCard({
  request,
  index,
  onBill,
  onComment,
  onCancel,
  target = "dashboard",
}) {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const {
    status_requests,
    array_type_payment,
    service,
    url,
    status_payment_online,
  } = useRequests();

  const selectedStatus = status_requests.find((s) => s.value == request.status);
  const selectedPaymentStatus = array_type_payment.find(
    (s) => s.value == request.type_payment
  );
  const selectedService = service.find((t) => t.id == request.id_service);
  const selectedPaymenOnlineStatus = status_payment_online.find(
    (s) => s.value == request.status_payment
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 8:
        return "bg-success-100 text-success-700 border-success-200";
      case 2:
        return "bg-error-100 text-error-700 border-error-200";
      default:
        return "bg-accent-100 text-accent-700 border-accent-200";
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch (paymentStatus) {
      case 1:
        return "bg-success-100 text-success-700 border-success-200";
      case 0:
        return "bg-error-100 text-error-700 border-error-200";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const handleBill = () => onBill(request);

  const handleComment = () => onComment(request);

  const handleCancelConfirm = () => {
    onCancel(request);
    setShowCancelModal(false);
  };

  const handlePaymentLink = async () => {
    try {
      const paymentUrl = url + request.id;

      if (typeof window !== "undefined" && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(paymentUrl);
        toast.success("لینک پرداخت با موفقیت کپی شد");
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = paymentUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          toast.success("لینک پرداخت با موفقیت کپی شد");
        } else {
          toast.error("خطا در کپی کردن لینک پرداخت");
        }
      }
    } catch (error) {
      console.error("خطا در کپی کردن لینک پرداخت:", error);
    }
  };

  const checkIfInvoiceCompleted = (request) => {
    if (!request) return false;

    try {
      let taskArray = [];
      let partArray = [];

      // Parse tasks
      if (request.tasks && request.tasks !== "") {
        taskArray =
          typeof request.tasks === "string"
            ? JSON.parse(request.tasks)
            : request.tasks;
      }

      // Parse parts
      if (request.parts && request.parts !== "") {
        partArray =
          typeof request.parts === "string"
            ? JSON.parse(request.parts)
            : request.parts;
      }

      return taskArray.length > 0 || partArray.length > 0;
    } catch (error) {
      console.error("Error checking invoice status:", error);
      return false;
    }
  };

  const isInvoiceCompleted = checkIfInvoiceCompleted(request);

  const shouldShowCancelButton =
    request.status != 2 && request.status != 8 && request.status != 9;
  const completedRequest = request.status == 8 || request.status == 9;
  const canceledRequest = request.status == 2;

  return (
    <>
      <div
        className="bg-surface rounded-xl mb-4 border border-neutral-200 shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="bg-gradient-to-r from-primary-50 via-white to-primary-50 px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-text">
                  درخواست #{request.id}
                </h3>
                <p className="text-sm text-neutral-500">
                  {new Date(request.date * 1000).toLocaleDateString("fa-IR")}
                </p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(request.status)}`}
            >
              {selectedStatus?.label}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 flex-1">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2.5 bg-secondary-100 rounded-lg">
                  <User className="w-4 h-4 text-secondary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    نام کاربر
                  </p>
                  <p className="font-medium text-text truncate">
                    {request.first_name} {request.last_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2.5 bg-accent-100 rounded-lg">
                  <Phone className="w-4 h-4 text-accent-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    شماره تماس
                  </p>
                  <p className="font-medium text-text truncate">
                    {request.mobile}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2.5 bg-success-100 rounded-lg">
                  <Settings className="w-4 h-4 text-success-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    سرویس
                  </p>
                  <p className="font-medium text-text truncate">
                    {selectedService?.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2.5 bg-primary-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    تعداد دستگاه
                  </p>
                  <p className="font-medium text-text">
                    {request.device_count}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2.5 bg-error-100 rounded-lg">
                  <CreditCard className="w-4 h-4 text-error-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    وضعیت پرداخت
                  </p>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full border text-xs font-medium ${getPaymentStatusColor(request.type_payment)}`}
                  >
                    {selectedPaymentStatus?.label}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    پرداخت آنلاین
                  </p>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full border text-xs font-medium ${getPaymentStatusColor(request.type_payment_online)}`}
                  >
                    {selectedPaymenOnlineStatus?.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-2.5 bg-neutral-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-neutral-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    آدرس
                  </p>
                  <p
                    className="font-medium text-text text-sm truncate"
                    title={request.address}
                  >
                    {request.address}
                  </p>
                </div>
              </div>
            </div>
            {request.img ? (
              <div className="bg-white rounded-xl border border-neutral-200 p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
                <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">
                  عکس
                </p>
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setIsImagePreviewOpen(true)}
                >
                  <Image
                    src={request.img}
                    alt="عکس"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-200 flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {target === "dashboard" ? (
            <div className="pt-6 border-t border-neutral-100">
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-3">
                    {isInvoiceCompleted ? (
                      <button
                        onClick={handleBill}
                        className="flex items-center justify-center gap-2 h-12 px-8 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-xl border border-neutral-200 transition-all duration-200 text-sm font-medium hover:shadow-sm"
                      >
                        <FileText className="w-4 h-4" />
                        فاکتور
                      </button>
                    ) : null}
                    {completedRequest || canceledRequest ? null : (
                      <button
                        type="button"
                        onClick={handlePaymentLink}
                        className={`flex items-center justify-center gap-2 h-12 px-4 bg-success-50 hover:bg-success-100 text-success-700 rounded-xl border border-success-200 transition-all duration-200 text-sm font-medium hover:shadow-sm ${
                          completedRequest || canceledRequest
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={completedRequest || canceledRequest}
                      >
                        <Link className="w-4 h-4" />
                        لینک پرداخت
                      </button>
                    )}
                    {request.status === 8 && (
                      <button
                        onClick={handleComment}
                        className="flex items-center justify-center gap-2 h-12 px-8 bg-success-50 hover:bg-success-100 text-success-700 rounded-xl border border-success-200 transition-all duration-200 text-sm font-medium hover:shadow-sm"
                      >
                        <Link className="w-4 h-4" />
                        ثبت نظر
                      </button>
                    )}
                  </div>
                  {shouldShowCancelButton && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="flex items-center justify-center gap-2 h-12 px-4 bg-error-50 hover:bg-error-100 text-error-700 rounded-xl border border-error-200 transition-all duration-200 text-sm font-medium hover:shadow-sm w-full sm:w-auto"
                    >
                      لغو درخواست
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <ImagePreview
          isOpen={isImagePreviewOpen}
          onClose={() => setIsImagePreviewOpen(false)}
          imageUrl={request.img}
        />
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-error-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-error-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-800">
                  لغو درخواست
                </h3>
                <p className="text-sm text-neutral-500">
                  درخواست #{request.id}
                </p>
              </div>
            </div>

            <p className="text-neutral-700 mb-6">
              آیا از لغو این درخواست اطمینان دارید؟ این عمل قابل برگشت نیست.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancelConfirm}
                className="flex-1 bg-error-500 hover:bg-error-600 text-white px-4 py-3 rounded-xl font-medium transition-colors"
              >
                بله، لغو کن
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-3 rounded-xl font-medium transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
