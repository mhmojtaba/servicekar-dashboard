import { useCallback, useEffect, useState } from "react";
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
import { useServices } from "@/providers/ServicesContext";

const BillModal = ({ onClose }) => {
  const { selectedRequest: data } = useRequests();

  const {
    mainTasks,
    mainParts,
    isGettingTasks,
    isGettingParts,
    getMainTasks,
    getMainParts,
  } = useServices();

  const { toPDF, targetRef } = usePDF({
    method: "save",
    filename: `invoice-${data?.id}.pdf`,
    page: { margin: Margin.MEDIUM, orientation: "portrait", format: "A4" },
  });

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isInvoiceCompleted, setIsInvoiceCompleted] = useState(false);
  const [completedInvoiceData, setCompletedInvoiceData] = useState({});
  const [parsedTasks, setParsedTasks] = useState([]);
  const [parsedParts, setParsedParts] = useState([]);

  const checkInvoiceStatus = useCallback(async () => {
    if (!data) return;

    // Check if invoice is already completed
    let taskArray = [];
    let partArray = [];

    try {
      // Parse tasks
      if (data.tasks && data.tasks !== "") {
        taskArray =
          typeof data.tasks === "string" ? JSON.parse(data.tasks) : data.tasks;
      }

      // Parse parts
      if (data.parts && data.parts !== "") {
        partArray =
          typeof data.parts === "string" ? JSON.parse(data.parts) : data.parts;
      }

      setParsedTasks(taskArray);
      setParsedParts(partArray);

      if (taskArray.length > 0 || partArray.length > 0) {
        setIsInvoiceCompleted(true);
        setCompletedInvoiceData({
          tasks: taskArray,
          parts: partArray,
          customerName: data.first_name + " " + data.last_name || "نامشخص",
          customerPhone: data.mobile,
          customerSignature: data.signature_img,
          deviceCount: data.device_count || 1,
          totalPrice: data.total_price,
          date: new Date(data.date * 1000).toLocaleDateString("fa-IR"),
        });
      } else {
        setIsInvoiceCompleted(false);
      }
    } catch (error) {
      console.error("Error parsing invoice data:", error);
      setIsInvoiceCompleted(false);
    }
  }, [data]);

  useEffect(() => {
    if (data?.id_service) {
      getMainTasks(data.id_service);
      getMainParts(data.id_service);
    }
  }, [data]);

  useEffect(() => {
    if (mainTasks && mainParts) {
      checkInvoiceStatus();
    }
  }, [mainTasks, mainParts, checkInvoiceStatus]);

  const isLoading = isGettingTasks || isGettingParts;

  if (isLoading || !mainTasks || !mainParts) {
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

  const task = parsedTasks
    .map((t) => {
      const task = mainTasks?.find((task) => task.id === t.id);
      return task ? { ...task, quantity: t.quantity } : null;
    })
    .filter((t) => t !== null);

  const part = parsedParts
    .map((p) => {
      const part = mainParts?.find((part) => part.id === p.id);
      return part ? { ...part, quantity: p.quantity } : null;
    })
    .filter((p) => p !== null);

  if (isLoading || !mainTasks || !mainParts) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="bg-surface rounded-2xl shadow-hover w-full max-w-6xl mx-auto relative max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <ShoppingCart className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900">
                فاکتور درخواست شماره {data?.id}
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                آماده برای پرینت و دانلود
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
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
              <p className="text-neutral-600">شرکت خدمات فنی</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-600">نام مشتری:</span>
                  <span className="font-medium">
                    {completedInvoiceData.customerName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-600">
                    شماره موبایل:
                  </span>
                  <span className="font-medium">
                    {completedInvoiceData.customerPhone}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-600">تاریخ:</span>
                  <span className="font-medium">
                    {completedInvoiceData.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-600">
                    تعداد دستگاه:
                  </span>
                  <span className="font-medium">
                    {completedInvoiceData.deviceCount}
                  </span>
                </div>
              </div>
            </div>

            {task.length > 0 && (
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
                      {task.map((t, index) => (
                        <tr key={t.id}>
                          <td className="border border-neutral-300 px-4 py-2">
                            {index + 1}
                          </td>
                          <td className="border border-neutral-300 px-4 py-2">
                            {t.title}
                          </td>
                          <td className="border border-neutral-300 px-4 py-2">
                            {t.quantity}
                          </td>
                          <td className="border border-neutral-300 px-4 py-2">
                            {t.price.toLocaleString()} تومان
                          </td>
                          <td className="border border-neutral-300 px-4 py-2">
                            {(t.quantity * t.price).toLocaleString()} تومان
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {part.length > 0 && (
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
                      {part.map((p, index) => (
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
                            {p?.price.toLocaleString()} تومان
                          </td>
                          <td className="border border-neutral-300 px-4 py-2">
                            {(p?.quantity * p?.price).toLocaleString()} تومان
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="border-t border-neutral-200 pt-4 mb-6">
              <div className="flex justify-between">
                {completedInvoiceData?.customerSignature !== "" ? (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-neutral-700 mb-2">
                      امضای مشتری:
                    </h4>
                    <div className="border border-neutral-300 rounded-lg p-4 bg-neutral-50">
                      <img
                        src={completedInvoiceData?.customerSignature}
                        alt="امضای مشتری"
                        className="max-h-20 mx-auto"
                      />
                    </div>
                  </div>
                ) : null}
                <div className="bg-primary-50 rounded-lg p-4 h-fit">
                  <div className="text-xl font-bold text-primary-800">
                    مبلغ کل: {completedInvoiceData.totalPrice?.toLocaleString()}{" "}
                    تومان
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
