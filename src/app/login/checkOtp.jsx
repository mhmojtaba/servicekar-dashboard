import { useState, useEffect, useRef } from "react";
import Button from "@/common/button";
import { ArrowRightIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

function OTPInput({
  numInputs = 4,
  onComplete,
  checkOtpTimer,
  isChecking,
  sendOtpTimer,
  backHandler,
  resendOtp,
}) {
  const [otpValues, setOtpValues] = useState(Array(numInputs).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(0, 1);
    setOtpValues(newOtpValues);

    if (value && index < numInputs - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (index === numInputs - 1 && value) {
      inputRefs.current.forEach((input) => input.blur());
      if (onComplete) {
        onComplete(newOtpValues.join(""));
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pastedData.length > 0) {
      const newOtpValues = [...otpValues];
      for (let i = 0; i < numInputs && i < pastedData.length; i++) {
        newOtpValues[i] = pastedData[i];
      }
      setOtpValues(newOtpValues);

      const lastFilledIndex = Math.min(pastedData.length, numInputs) - 1;
      if (lastFilledIndex === numInputs - 1) {
        inputRefs.current.forEach((input) => input.blur());
        if (onComplete) {
          onComplete(newOtpValues.join(""));
        }
      } else {
        inputRefs.current[lastFilledIndex + 1]?.focus();
      }
    }
    e.preventDefault();
  };

  return (
    <div className=" p-2 transition-all duration-3000">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 mb-5">
          <ShieldCheckIcon className="h-10 w-10 text-primary-600" />
        </div>

        <h2 className="text-2xl font-bold text-neutral-800 mb-3">تایید کد</h2>
        <p className="text-neutral-500 text-sm">
          کد تایید ارسال شده به موبایل خود را وارد کنید
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          onClick={backHandler}
        >
          <ArrowRightIcon className="h-4 w-4 ml-1" />
          ویرایش شماره
        </button>

        <button
          className={`text-sm font-medium ${
            sendOtpTimer > 0
              ? "text-neutral-400 cursor-not-allowed"
              : "text-primary-600 hover:text-primary-700"
          } transition-colors`}
          onClick={sendOtpTimer > 0 ? null : resendOtp}
          disabled={sendOtpTimer > 0}
        >
          {sendOtpTimer > 0
            ? `${sendOtpTimer} ثانیه تا ارسال مجدد`
            : "ارسال مجدد کد"}
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onComplete && otpValues.join("").length === numInputs) {
            onComplete(otpValues.join(""));
          }
        }}
      >
        <div
          className="flex justify-center gap-3 mb-8"
          style={{ direction: "ltr" }}
        >
          {Array.from({ length: numInputs }).map((_, index) => (
            <div key={index} className="w-14 h-14">
              <input
                type="tel"
                maxLength={1}
                value={otpValues[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-full h-full text-center text-xl font-bold bg-neutral-50 border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all duration-200"
                style={{ direction: "ltr" }}
              />
            </div>
          ))}
        </div>

        <Button
          type="submit"
          variant={checkOtpTimer > 0 ? "secondary" : "primary"}
          children={
            checkOtpTimer > 0 ? `${checkOtpTimer} ثانیه تا تلاش مجدد` : "ورود"
          }
          isLoading={isChecking}
          valid={otpValues.join("").length === numInputs && checkOtpTimer === 0}
          className="w-full py-4 text-base font-semibold rounded-xl transition-all duration-300 hover:shadow-hover"
        />
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-500">
          کد را دریافت نکردید؟
          <button
            onClick={sendOtpTimer > 0 ? null : resendOtp}
            disabled={sendOtpTimer > 0}
            className={`${
              sendOtpTimer > 0
                ? "text-neutral-400 cursor-not-allowed"
                : "text-primary-600 hover:text-primary-700"
            } mx-1 font-medium transition-colors`}
          >
            ارسال مجدد
          </button>
        </p>
      </div>
    </div>
  );
}

export default OTPInput;
