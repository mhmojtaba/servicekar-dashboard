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

	const handleGeneratePDF = async () => {
		const element = targetRef.current;
		if (!element || isGeneratingPDF) return;

		setIsGeneratingPDF(true);

		try {
			// Store original styles
			const originalStyles = {
				width: element.style.width,
				maxWidth: element.style.maxWidth,
				transform: element.style.transform,
				transformOrigin: element.style.transformOrigin,
			};

			// Apply PDF-optimized styles
			element.style.width = "210mm";
			element.style.maxWidth = "210mm";
			element.style.transform = "scale(1)";
			element.style.transformOrigin = "top left";

			// Add PDF generation class
			element.classList.add("pdf-generation-mode");

			// Add temporary styles for better PDF rendering
			const tempStyle = document.createElement("style");
			tempStyle.id = "pdf-temp-styles";
			tempStyle.innerHTML = `
        .pdf-generation-mode {
          width: 210mm !important;
          max-width: 210mm !important;
          font-size: 12px !important;
        }
        .pdf-generation-mode .grid {
          display: grid !important;
        }
        .pdf-generation-mode .md\\:grid-cols-2 {
          grid-template-columns: repeat(2, 1fr) !important;
        }
        .pdf-generation-mode table {
          table-layout: fixed !important;
          width: 100% !important;
        }
        .pdf-generation-mode .text-xs {
          font-size: 10px !important;
        }
        .pdf-generation-mode .text-sm {
          font-size: 11px !important;
        }
        .pdf-generation-mode .text-lg {
          font-size: 14px !important;
        }
        .pdf-generation-mode .text-xl {
          font-size: 16px !important;
        }
        .pdf-generation-mode .text-2xl {
          font-size: 18px !important;
        }
        .pdf-generation-mode .px-2 {
          padding-left: 4px !important;
          padding-right: 4px !important;
        }
        .pdf-generation-mode .break-words {
          word-wrap: break-word !important;
          word-break: break-word !important;
        }
        .pdf-generation-mode .block {
          display: inline !important;
        }
        @media print {
          .pdf-generation-mode {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `;
			document.head.appendChild(tempStyle);

			// Wait for styles to apply
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Generate PDF
			await toPDF();

			// Restore original styles
			Object.assign(element.style, originalStyles);
			element.classList.remove("pdf-generation-mode");

			// Remove temporary styles
			const tempStyleElement = document.getElementById("pdf-temp-styles");
			if (tempStyleElement) {
				document.head.removeChild(tempStyleElement);
			}
		} catch (error) {
			console.error("Error generating PDF:", error);
		} finally {
			setIsGeneratingPDF(false);
		}
	};

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
			onClick={(e) => {
				if (!isGeneratingPDF && e.target === e.currentTarget) {
					handleClose();
				}
			}}
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
						disabled={isGeneratingPDF}
						className={`p-2 rounded-xl transition-all duration-200 ${
							isGeneratingPDF
								? "text-neutral-300 cursor-not-allowed"
								: "text-neutral-400 hover:text-error-500 hover:bg-error-50"
						}`}
					>
						<FaTimes size={18} />
					</button>
				</div>

				<div className="p-4 border-b border-neutral-200 bg-neutral-50">
					<div className="flex justify-center">
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
									<table className="w-full table-fixed border-collapse border border-neutral-300">
										<colgroup>
											<col style={{ width: "8%" }} />
											<col style={{ width: "40%" }} />
											<col style={{ width: "10%" }} />
											<col style={{ width: "25%" }} />
											<col style={{ width: "25%" }} />
										</colgroup>
										<thead>
											<tr className="bg-neutral-50">
												<th className="border border-neutral-300 px-2 sm:px-4 py-2 text-right text-[8px] sm:text-sm">
													ردیف
												</th>
												<th className="border border-neutral-300 px-2 sm:px-4 py-2 text-right text-[8px] sm:text-sm">
													عنوان خدمت
												</th>
												<th className="border border-neutral-300 px-2 sm:px-4 py-2 text-right text-[8px] sm:text-sm">
													تعداد
												</th>
												<th className="border border-neutral-300 px-2 sm:px-4 py-2 text-right text-[8px] sm:text-sm">
													قیمت واحد
												</th>
												<th className="border border-neutral-300 px-2 sm:px-4 py-2 text-right text-[8px] sm:text-sm">
													قیمت کل
												</th>
											</tr>
										</thead>
										<tbody>
											{tasks.map((t, index) => (
												<tr key={t.id}>
													<td className="border border-neutral-300 px-2 sm:px-4 py-2 text-[8px] sm:text-sm">
														{index + 1}
													</td>
													<td className="border border-neutral-300 px-2 sm:px-4 py-2 text-[8px] sm:text-sm break-words">
														{t?.title}
													</td>
													<td className="border border-neutral-300 px-2 sm:px-4 py-2 text-[8px] sm:text-sm">
														{t?.quantity}
													</td>
													<td className="border border-neutral-300 px-2 sm:px-4 py-2 text-[8px] sm:text-sm">
														{t?.unit_price?.toLocaleString()} تومان
													</td>
													<td className="border border-neutral-300 px-2 sm:px-4 py-2 text-[8px] sm:text-sm">
														{t?.discount_price ? (
															<div className="flex flex-col justify-center gap-1 text-xs">
																<del className="text-red-500 line-through">
																	{t?.total_price_main?.toLocaleString()} تومان
																</del>
															</div>
														) : null}
														{t?.total_price?.toLocaleString()} تومان
														{t?.used_guarantee_reason && (
															<span className="text-xs text-neutral-500 mr-1 block sm:inline">
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
									<table className="w-full table-fixed border-collapse border border-neutral-300">
										<colgroup>
											<col style={{ width: "8%" }} />
											<col style={{ width: "40%" }} />
											<col style={{ width: "10%" }} />
											<col style={{ width: "25%" }} />
											<col style={{ width: "25%" }} />
										</colgroup>
										<thead>
											<tr className="bg-neutral-50">
												<th className="border border-neutral-300 px-2 sm:px-4 py-2 text-right text-[8px] sm:text-sm">
													ردیف
												</th>
												<th className="border border-neutral-300 px-2 sm:px-4 py-2 text-right text-[8px] sm:text-sm">
													نام قطعه
												</th>
												<th className="border border-neutral-300 px-2 sm:px-4 py-2 text-right text-[8px] sm:text-sm">
													تعداد
												</th>
												<th className="border border-neutral-300 px-2 sm:px-4 py-2 text-right text-[8px] sm:text-sm">
													قیمت واحد
												</th>
												<th className="border border-neutral-300 px-2 sm:px-4 py-2 text-right text-[8px] sm:text-sm">
													قیمت کل
												</th>
											</tr>
										</thead>
										<tbody>
											{parts.map((p, index) => (
												<tr key={p.id}>
													<td className="border border-neutral-300 px-2 sm:px-4 py-2 text-[8px] sm:text-sm">
														{index + 1}
													</td>
													<td className="border border-neutral-300 px-2 sm:px-4 py-2 text-[8px] sm:text-sm break-words">
														{p.title}
													</td>
													<td className="border border-neutral-300 px-2 sm:px-4 py-2 text-[8px] sm:text-sm">
														{p?.quantity}
													</td>
													<td className="border border-neutral-300 px-2 sm:px-4 py-2 text-[8px] sm:text-sm">
														{p?.unit_price.toLocaleString()} تومان
													</td>
													<td className="border border-neutral-300 px-2 sm:px-4 py-2 text-[8px] sm:text-sm">
														{p?.discount_price ? (
															<div className="flex flex-col justify-center gap-1 text-xs">
																<del className="text-red-500 line-through">
																	{p?.total_price_main?.toLocaleString()} تومان
																</del>
															</div>
														) : null}
														{p?.total_price.toLocaleString()} تومان
														{p?.used_guarantee_reason && (
															<span className="text-xs text-neutral-500 mr-1 block sm:inline">
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

						{invoiceData?.manual_discount_price ? (
							<div className="bg-red-50 rounded-lg p-4 h-fit">
								<div className="text-xl font-bold text-primary-800">
									تخفیف: {invoiceData?.manual_discount_price?.toLocaleString()}{" "}
									تومان
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
										{invoiceData?.confirm_message && (
											<div className="text-sm text-neutral-600 mt-2">
												{invoiceData?.confirm_message}
											</div>
										)}
									</div>
								) : null}
								<div className="bg-primary-50 rounded-lg p-4 h-fit">
									<div className=" font-bold text-primary-800 flex flex-col gap-2">
										مبلغ نهایی:
										{invoiceData?.manual_discount_price ? (
											<del className="text-red-600">
												{invoiceData?.total_price_main?.toLocaleString()} تومان
											</del>
										) : null}
										<span className="text-xl font-bold text-green-800">
											{invoiceData?.total_price?.toLocaleString()} تومان
										</span>
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
