import { useRef, useState } from "react";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import {
  Calendar,
  Download,
  Phone,
  ShoppingCart,
  User,
  Wrench,
  Loader2,
} from "lucide-react";
import logo from "@/assets/images/logo.png";

const options = {
  filename: "invoice.pdf",
  // default is `save`
  method: "save",
  // default is Resolution.MEDIUM = 3, which should be enough, higher values
  // increases the image quality but also the size of the PDF, so be careful
  // using values higher than 10 when having multiple pages generated, it
  // might cause the page to crash or hang.
  resolution: Resolution.HIGH,
  page: {
    // margin is in MM, default is Margin.NONE = 0
    margin: Margin.SMALL,
    // default is 'A4'
    format: "A4",
    // default is 'portrait'
    orientation: "portrait",
  },
  canvas: {
    // default is 'image/jpeg' for better size performance
    mimeType: "image/png",
    qualityRatio: 1,
  },
  // Customize any value passed to the jsPDF instance and html2canvas
  // function. You probably will not need this and things can break,
  // so use with caution.
  overrides: {
    // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
    pdf: {
      compress: true,
    },
    // see https://html2canvas.hertzen.com/configuration for more options
    canvas: {
      useCORS: true,
    },
  },
};

const CompletedInvoiceView = ({ data, taskList, partList, isLoading }) => {
  const targetRef = useRef();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  if (!data) return null;

  if (isLoading || !taskList || !partList) {
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

  const task = data.tasks
    .map((t) => {
      const task = taskList.find((task) => task.id === t.id);
      return task ? { ...task, quantity: t.quantity } : null;
    })
    .filter((t) => t !== null);

  const part = data.parts
    .map((p) => {
      const part = partList.find((part) => part.id === p.id);
      return part ? { ...part, quantity: p.quantity } : null;
    })
    .filter((p) => p !== null);

  const handleGeneratePDF = async () => {
    const element = targetRef.current;
    if (!element || isGeneratingPDF) return;

    setIsGeneratingPDF(true);

    try {
      const originalStyles = {
        width: element.style.width,
        maxWidth: element.style.maxWidth,
        transform: element.style.transform,
        transformOrigin: element.style.transformOrigin,
      };

      element.style.width = "210mm";
      element.style.maxWidth = "210mm";
      element.style.transform = "scale(1)";
      element.style.transformOrigin = "top left";

      element.classList.add("pdf-generation-mode");

      const tempStyle = document.createElement("style");
      tempStyle.id = "pdf-temp-styles";
      tempStyle.innerHTML = `
        .pdf-generation-mode {
          width: 210mm !important;
          max-width: 210mm !important;
          font-size: 14px !important;
        }
        .pdf-generation-mode .grid {
          display: grid !important;
        }
        .pdf-generation-mode .md\\:grid-cols-2 {
          grid-template-columns: repeat(2, 1fr) !important;
        }
        .pdf-generation-mode .overflow-x-auto {
          overflow-x: visible !important;
        }
        .pdf-generation-mode table {
          width: 100% !important;
          font-size: 12px !important;
        }
        .pdf-generation-mode .text-sm {
          font-size: 12px !important;
        }
        .pdf-generation-mode .text-lg {
          font-size: 16px !important;
        }
        .pdf-generation-mode .text-xl {
          font-size: 18px !important;
        }
        .pdf-generation-mode .text-2xl {
          font-size: 22px !important;
        }
      `;
      document.head.appendChild(tempStyle);

      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        await generatePDF(targetRef, {
          ...options,
          canvas: {
            ...options.canvas,
            scale: 2,
            width: 794,
            height: 1123,
          },
          page: {
            ...options.page,
            format: "a4",
            orientation: "portrait",
            margin: Margin.SMALL,
          },
        });
      } finally {
        element.style.width = originalStyles.width;
        element.style.maxWidth = originalStyles.maxWidth;
        element.style.transform = originalStyles.transform;
        element.style.transformOrigin = originalStyles.transformOrigin;

        element.classList.remove("pdf-generation-mode");
        const tempStyleElement = document.getElementById("pdf-temp-styles");
        if (tempStyleElement) {
          document.head.removeChild(tempStyleElement);
        }
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      // You can add a toast notification here if needed
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 max-h-[70vh] relative">
      <div
        className="max-w-4xl mx-auto bg-white rounded-lg border border-neutral-200 p-6"
        ref={targetRef}
      >
        <div className="max-w-4xl mx-auto bg-white rounded-lg border border-neutral-200 p-6 ">
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
                <span className="font-medium">{data.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">شماره موبایل:</span>
                <span className="font-medium">{data.customerPhone}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">تاریخ:</span>
                <span className="font-medium">{data.date}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">تعداد دستگاه:</span>
                <span className="font-medium">{data.deviceCount}</span>
              </div> */}
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
                          {t?.used_guarantee_reason && (
                            <span className="text-xs text-neutral-500 mr-2">
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
                          {p?.used_guarantee_reason && (
                            <span className="text-xs text-neutral-500 mr-2">
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

          <div className="border-t border-neutral-200 pt-4 mb-6">
            <div className="flex justify-between">
              {data?.customerSignature !== "" ? (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">
                    امضای مشتری:
                  </h4>
                  <div className="border border-neutral-300 rounded-lg p-4 bg-neutral-50">
                    <img
                      src={data?.customerSignature}
                      alt="امضای مشتری"
                      className="max-h-20 mx-auto"
                    />
                  </div>
                </div>
              ) : null}
              <div className="bg-primary-50 rounded-lg p-4 h-fit">
                <div className="text-xl font-bold text-primary-800">
                  مبلغ کل: {data.totalPrice.toLocaleString()} تومان
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center absolute top-0 left-0">
        <button
          onClick={handleGeneratePDF}
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
  );
};

export default CompletedInvoiceView;
