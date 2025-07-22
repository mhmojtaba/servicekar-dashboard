"use client";

import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { getTodayQuote } from "@/services/serviceServices";
import { useAuth } from "@/providers/AuthContext";

const QuoteComponent = () => {
  const { token } = useAuth();
  const [quote, setQuote] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  const { isPending: isGettingQuotes, mutateAsync: mutateGetQuotes } =
    useMutation({
      mutationFn: getTodayQuote,
    });

  const getQuotes = async () => {
    try {
      const { data } = await mutateGetQuotes(token);
      if (data.msg === 0) {
        setQuote(data.quote);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) getQuotes();
  }, [token]);

  if (!isOpen || !quote?.length) return null;

  return (
    <div className="absolute top-26 left-0 w-full h-fit z-10">
      <div className="mx-4 mt-4 md:mt-4 mb-4">
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="relative px-2 py-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-4">
                {isGettingQuotes ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  </div>
                ) : quote ? (
                  <blockquote className="text-white text-base md:text-lg font-medium leading-relaxed mb-3">
                    "{quote?.text}"
                    {quote?.title ? (
                      <cite className="text-white/70 text-xs font-normal not-italic">
                        ({quote?.title})
                      </cite>
                    ) : null}
                  </blockquote>
                ) : (
                  <p className="text-white text-base md:text-lg font-medium leading-relaxed mb-3">
                    هیچ نقل قولی وجود ندارد
                  </p>
                )}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200 flex-shrink-0"
                aria-label="بستن نقل قول"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteComponent;
