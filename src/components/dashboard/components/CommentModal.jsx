import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, User, X, MessageCircle } from "lucide-react";

import { useAuth } from "@/providers/AuthContext";
import { addReview } from "@/services/requestsServices";
import { useRequests } from "@/providers/RequestsContext";

const CommentModal = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const { selectedRequest, fetchReviews } = useRequests();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [hoveredRating, setHoveredRating] = useState(0);

  const { isPending, mutateAsync: mutateAddReview } = useMutation({
    mutationFn: addReview,
  });

  useEffect(() => {
    if (selectedRequest) {
      fetchReviews();
    }
  }, [selectedRequest]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("لطفا امتیاز خود را انتخاب کنید");
      return;
    }

    try {
      const data = {
        token,
        rating: rating,
        text: comment,
        order_id: selectedRequest.id,
      };

      const { data: response } = await mutateAddReview(data);

      if (response.msg === 0) {
        toast.success(response.msg_text || "امتیاز با موفقیت ثبت شد");
        handleClose();
      } else {
        throw new Error(response.msg_text || "خطا در ثبت امتیاز");
      }
    } catch (error) {
      toast.error(error.message || "خطا در ارسال امتیاز");
      console.error("Rating error:", error);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment("");
    onClose();
  };

  const StarRating = () => {
    return (
      <div className="flex items-center justify-center gap-1 my-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none p-2 transition-all duration-300 ease-out"
          >
            <Star
              size={32}
              className={`transition-all duration-300 ${
                star <= (hoveredRating || rating)
                  ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                  : "text-gray-300 hover:text-amber-200"
              }`}
            />
          </motion.button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating) => {
    const texts = {
      1: "ضعیف",
      2: "متوسط",
      3: "خوب",
      4: "عالی",
      5: "فوق‌العاده",
    };
    return texts[rating] || "";
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-8 py-6">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute top-4 left-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200"
            >
              <X size={20} />
            </motion.button>

            <div className="text-center text-white pt-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4"
              >
                <Award size={28} className="text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">امتیاز و نظر شما</h2>
              <p className="text-white/90 text-sm leading-relaxed">
                تجربه خود را با ما به اشتراک بگذارید
              </p>
            </div>
          </div>

          <div className="px-8 py-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                چقدر از کیفیت خدمات ما رضایت دارید؟
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                از 1 تا 5 ستاره امتیاز دهید
              </p>

              <StarRating />

              <AnimatePresence mode="wait">
                <motion.div
                  key={hoveredRating || rating}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6 h-10"
                >
                  {(rating > 0 || hoveredRating > 0) && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200">
                      <Star
                        size={16}
                        className="text-amber-500 fill-amber-500"
                      />
                      {getRatingText(hoveredRating || rating)}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Comment Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700">
                <MessageCircle size={18} className="text-indigo-600" />
                <label htmlFor="comment" className="font-medium">
                  نظر شما (اختیاری)
                </label>
              </div>
              <div className="relative">
                <textarea
                  id="comment"
                  placeholder="نظر خود را در مورد کیفیت خدمات بنویسید..."
                  className="w-full min-h-[120px] p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="absolute bottom-3 left-3 text-xs text-gray-400">
                  {comment.length}/500
                </div>
              </div>
            </div>

            {/* Selected Rating Display */}
            <AnimatePresence>
              {rating > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                    <span className="text-indigo-700 font-semibold text-sm">
                      امتیاز شما: {rating} از 5
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100">
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 rounded-2xl font-medium transition-all duration-200 hover:shadow-sm"
                disabled={isPending}
              >
                انصراف
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isPending || rating === 0}
                className="flex-1 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isPending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>در حال ارسال...</span>
                  </>
                ) : (
                  <>
                    <Award size={18} />
                    <span>ثبت امتیاز</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommentModal;
