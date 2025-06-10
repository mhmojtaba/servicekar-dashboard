"use client";
import { useState } from "react";
import { SearchX } from "lucide-react";
import { toast } from "react-toastify";

import { useRequests } from "@/providers/RequestsContext";
import { useAuth } from "@/providers/AuthContext";
import RequestCard from "./RequestCard";
import CommentModal from "./CommentModal";
import BillModal from "./BillModal";

export default function RequetsContents() {
  const { mainRequests, isGettingRequest, setSelectedRequest, fetchRequests } =
    useRequests();
  const { token } = useAuth();
  const [showBillModal, setShowBillModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const handleBill = (request) => {
    setSelectedRequest(request);
    setShowBillModal(true);
  };

  const handleComment = (request) => {
    setSelectedRequest(request);
    setShowCommentModal(true);
  };

  const handleCancel = async (request) => {
    try {
      // call api

      toast.success(`درخواست #${request.id} با موفقیت لغو شد`);
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error("خطا در لغو درخواست");
    }
  };

  if (isGettingRequest) {
    return (
      <div className="">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-surface rounded-xl border border-neutral-200 overflow-hidden animate-pulse"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-neutral-200 rounded w-32"></div>
                <div className="h-8 bg-neutral-200 rounded w-24"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-neutral-200 rounded w-20"></div>
                    <div className="h-5 bg-neutral-200 rounded w-32"></div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-neutral-200 rounded w-20"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!mainRequests || mainRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchX className="w-12 h-12 text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-3">
            هیچ درخواستی یافت نشد
          </h3>
          <p className="text-neutral-500 leading-relaxed">
            با فیلترهای انتخاب شده هیچ درخواستی پیدا نشد. لطفاً فیلترها را تغییر
            دهید یا جستجوی جدیدی انجام دهید.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {mainRequests.map((request, index) => (
        <RequestCard
          key={request.id}
          request={request}
          index={index}
          onComment={() => handleComment(request)}
          onBill={() => handleBill(request)}
          onCancel={handleCancel}
        />
      ))}

      {showCommentModal && (
        <CommentModal
          isOpen={showCommentModal}
          onClose={() => setShowCommentModal(false)}
        />
      )}

      {showBillModal && (
        <BillModal
          isOpen={showBillModal}
          onClose={() => setShowBillModal(false)}
        />
      )}
    </div>
  );
}
