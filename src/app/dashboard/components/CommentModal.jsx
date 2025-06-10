import React from "react";
import { useAuth } from "@/providers/AuthContext";
import { addReview } from "@/services/requestsServices";
import { useRequests } from "@/providers/RequestsContext";

const CommentModal = () => {
  const { token } = useAuth();
  const {
    selectedRequest,
    reviews,
    fetchReviews,
    isGettingReviews,
    technician,
  } = useRequests();
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
    onClose();
  };

  const StarRating = () => {
    return (
      <div className="flex items-center justify-center gap-2 my-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 rounded-full p-1 transition-all duration-200"
          >
            <Star
              size={36}
              className={`transition-all duration-200 ${
                star <= (hoveredRating || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 hover:text-yellow-200"
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
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">امتیاز دهی</h3>
                  <p className="text-blue-100 text-sm">به تکنسین امتیاز دهید</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
              >
                <X size={20} />
              </motion.button>
            </div>
          </div>

          <div className="p-6">
            {selectedTechnician && (
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {selectedTechnician.first_name +
                      " " +
                      selectedTechnician.last_name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    کد: {selectedTechnician.id}
                  </p>
                </div>
              </div>
            )}

            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                امتیاز خود را انتخاب کنید
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                از 1 تا 5 ستاره امتیاز دهید
              </p>

              <StarRating />

              <AnimatePresence>
                {(rating > 0 || hoveredRating > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6"
                  >
                    <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      {getRatingText(hoveredRating || rating)}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {rating > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Star
                      className="text-yellow-400 fill-yellow-400"
                      size={20}
                    />
                    <span className="text-blue-700 font-semibold">
                      امتیاز انتخابی: {rating} از 5
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200"
                disabled={isPending}
              >
                انصراف
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isPending || rating === 0}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
