"use client";
import { useEffect, useState } from "react";
import { usePDF, Margin } from "react-to-pdf";
import {
  Calendar,
  Download,
  Phone,
  ShoppingCart,
  User,
  Wrench,
  Loader2,
} from "lucide-react";
import { FaTimes } from "react-icons/fa";
import { useRequests } from "@/providers/RequestsContext";
import logo from "@/assets/images/logo.png";

const BillModal = ({ onClose }) => {
  const {
    selectedRequest,
    setSelectedRequest,
    invoiceData,
    fetchInvoiceData,
    invoiceItems,
    isGettingInvoiceData,
  } = useRequests();

  const { toPDF, targetRef } = usePDF({
    method: "save",
    filename: `invoice-${selectedRequest?.id}.pdf`,
    page: { margin: Margin.MEDIUM, orientation: "portrait", format: "A4" },
  });

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (selectedRequest?.id) {
      fetchInvoiceData(selectedRequest.id);
    }
  }, [selectedRequest]);

  const tasks = invoiceItems.filter((item) => item.type === "task");
  const parts = invoiceItems.filter((item) => item.type === "part");

  const customerName = invoiceData.first_name + " " + invoiceData.last_name;

  if (isGettingInvoiceData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary-500 mx-auto mb-3" />
          <p className="text-sm text-neutral-600">
            در حال بارگذاری اطلاعات فاکتور...
          </p>
        </div>
      </div>
    );
  }

  if (!isGettingInvoiceData && !invoiceData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm">
        <div className="bg-surface rounded-2xl shadow-hover p-8 mx-4 max-w-md w-full border border-neutral-200">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
            <p className="text-neutral-600">در حال آماده‌سازی فاکتور...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleClose = () => {
    setSelectedRequest(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div className="bg-surface rounded-2xl shadow-hover w-full max-w-6xl mx-auto relative max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <ShoppingCart className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900">
                فاکتور درخواست شماره {selectedRequest?.id}
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                آماده برای پرینت و دانلود
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-neutral-400 hover:text-error-500 hover:bg-error-50 rounded-xl transition-all duration-200"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-4 border-b border-neutral-200 bg-neutral-50 hidden md:block">
          <div className="flex justify-center">
            <button
              onClick={toPDF}
              disabled={isGeneratingPDF}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                isGeneratingPDF
                  ? "bg-primary-400 cursor-not-allowed"
                  : "bg-primary-500 hover:bg-primary-600"
              } text-white shadow-lg`}
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>در حال تولید PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>دانلود PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div
            className="max-w-4xl mx-auto bg-white rounded-lg border border-neutral-200 p-6"
            ref={targetRef}
          >
            <div className="text-center mb-6 pb-4 border-b border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                فاکتور خدمات
              </h2>
              <div className="flex items-center gap-2 justify-center">
                <img
                  src={logo.src}
                  alt="logo"
                  className="w-10 h-14 object-cover"
                />
                <p className="text-neutral-600">شرکت خدمات گستر جزائری </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-600">نام مشتری:</span>
                  <span className="font-medium">{customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-600">
                    شماره موبایل:
                  </span>
                  <span className="font-medium">{invoiceData.mobile}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-600">تاریخ:</span>
                  <span className="font-medium">
                    {new Date(invoiceData.date * 1000).toLocaleDateString(
                      "fa-IR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-600">
                    تعداد دستگاه:
                  </span>
                  <span className="font-medium">
                    {invoiceData.device_count}
                  </span>
                </div> */}
              </div>
            </div>

            {tasks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  خدمات ارائه شده
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-neutral-300">
                    <thead>
                      <tr className="bg-neutral-50">
                        <th className="border border-neutral-300 px-4 py-2 text-right">
                          ردیف
                        </th>
                        <th className="border border-neutral-300 px-4 py-2 text-right">
                          عنوان خدمت
                        </th>
                        <th className="border border-neutral-300 px-4 py-2 text-right">
                          تعداد
                        </th>
                        <th className="border border-neutral-300 px-4 py-2 text-right">
                          قیمت واحد
                        </th>
                        <th className="border border-neutral-300 px-4 py-2 text-right">
                          قیمت کل
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((t, index) => (
                        <tr key={t.id}>
                          <td className="border border-neutral-300 px-4 py-2">
                            {index + 1}
                          </td>
                          <td className="border border-neutral-300 px-4 py-2">
                            {t?.title}
                          </td>
                          <td className="border border-neutral-300 px-4 py-2">
                            {t?.quantity}
                          </td>
                          <td className="border border-neutral-300 px-4 py-2">
                            {t?.unit_price?.toLocaleString()} تومان
                          </td>
                          <td className="border border-neutral-300 px-4 py-2">
                            {t?.total_price?.toLocaleString()} تومان
                            {t?.used_guarantee_reason && (
                              <span className="text-xs text-neutral-500 mr-1">
                                ({t?.used_guarantee_reason})
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {parts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  قطعات استفاده شده
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-neutral-300">
                    <thead>
                      <tr className="bg-neutral-50">
                        <th className="border border-neutral-300 px-4 py-2 text-right">
                          ردیف
                        </th>
                        <th className="border border-neutral-300 px-4 py-2 text-right">
                          نام قطعه
                        </th>
                        <th className="border border-neutral-300 px-4 py-2 text-right">
                          تعداد
                        </th>
                        <th className="border border-neutral-300 px-4 py-2 text-right">
                          قیمت واحد
                        </th>
                        <th className="border border-neutral-300 px-4 py-2 text-right">
                          قیمت کل
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.map((p, index) => (
                        <tr key={p.id}>
                          <td className="border border-neutral-300 px-4 py-2">
                            {index + 1}
                          </td>
                          <td className="border border-neutral-300 px-4 py-2">
                            {p.title}
                          </td>
                          <td className="border border-neutral-300 px-4 py-2">
                            {p?.quantity}
                          </td>
                          <td className="border border-neutral-300 px-4 py-2">
                            {p?.unit_price.toLocaleString()} تومان
                          </td>
                          <td className="border border-neutral-300 px-4 py-2">
                            {p?.total_price.toLocaleString()} تومان
                            {p?.used_guarantee_reason && (
                              <span className="text-xs text-neutral-500 mr-1">
                                ({p?.used_guarantee_reason})
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {invoiceData?.discount_percent ? (
              <div className="bg-primary-50 rounded-lg p-4 h-fit">
                <div className="text-xl font-bold text-primary-800">
                  {invoiceData?.discount_percent}% تخفیف در جشنواره{" "}
                  {invoiceData?.discount_reason_title}
                </div>
              </div>
            ) : null}

            <div className="border-t border-neutral-200 pt-4 mb-6">
              <div className="flex justify-between">
                {invoiceData?.signature_img !== "" ? (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">
                      امضای مشتری:
                    </h4>
                    <div className="border border-neutral-300 rounded-lg p-4 bg-neutral-50">
                      <img
                        src={invoiceData?.signature_img}
                        alt="امضای مشتری"
                        className="max-h-20 mx-auto"
                      />
                    </div>
                  </div>
                ) : null}
                <div className="bg-primary-50 rounded-lg p-4 h-fit">
                  <div className="text-xl font-bold text-primary-800">
                    مبلغ کل: {invoiceData?.total_price?.toLocaleString()} تومان
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillModal;
