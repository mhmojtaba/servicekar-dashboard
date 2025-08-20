import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <>
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex flex-col md:flex-row md:items-center md:justify-center gap-4">
          <nav className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                currentPage === 1
                  ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                  : "bg-white text-primary-700 hover:bg-primary-50"
              }`}
            >
              قبلی
            </button>

            <button
              onClick={() => onPageChange(1)}
              className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                currentPage === 1
                  ? "bg-primary-500 text-white"
                  : "bg-white text-primary-700 hover:bg-primary-50"
              }`}
            >
              1
            </button>

            {currentPage > 3 && totalPages > 5 && (
              <span className="px-2 text-neutral-400">...</span>
            )}

            {currentPage > 2 && currentPage < totalPages - 1 && (
              <button
                onClick={() => onPageChange(currentPage - 1)}
                className="px-3 py-1 rounded-lg border text-sm font-medium bg-white text-primary-700 hover:bg-primary-50"
              >
                {currentPage - 1}
              </button>
            )}

            {currentPage !== 1 && currentPage !== totalPages && (
              <button
                disabled
                className="px-3 py-1 rounded-lg border text-sm font-medium bg-primary-500 text-white"
              >
                {currentPage}
              </button>
            )}

            {currentPage < totalPages - 1 && totalPages > 3 && (
              <button
                onClick={() => onPageChange(currentPage + 1)}
                className="px-3 py-1 rounded-lg border text-sm font-medium bg-white text-primary-700 hover:bg-primary-50"
              >
                {currentPage + 1}
              </button>
            )}

            {currentPage < totalPages - 2 && totalPages > 5 && (
              <span className="px-2 text-neutral-400">...</span>
            )}

            {totalPages > 1 && (
              <button
                onClick={() => onPageChange(totalPages)}
                className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                  currentPage === totalPages
                    ? "bg-primary-500 text-white"
                    : "bg-white text-primary-700 hover:bg-primary-50"
                }`}
              >
                {totalPages}
              </button>
            )}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                currentPage === totalPages
                  ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                  : "bg-white text-primary-700 hover:bg-primary-50"
              }`}
            >
              بعدی
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Pagination;
