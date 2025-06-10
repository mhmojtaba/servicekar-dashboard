import Button from "@/common/button";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { IoWarningOutline } from "react-icons/io5";

const SendOtp = ({
  phoneNumber,
  onChange,
  isLoading,
  onSubmit,
  error,
  timer,
}) => {
  return (
    <div className=" rounded-2xl p-2 transition-all duration-300 ">
      <form className="w-full" onSubmit={onSubmit}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 mb-5">
            <PhoneIcon className="h-10 w-10 text-primary-600" />
          </div>

          <h2 className="text-2xl font-bold text-neutral-800 mb-3">
            ورود به سرویس کار
          </h2>
          <p className="text-neutral-500 text-sm">
            برای ورود به اصفهان سرویس کار، شماره موبایل خود را وارد کنید
          </p>
        </div>
        <div className="mb-6">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            شماره موبایل
          </label>

          <div className="relative">
            <input
              style={{ direction: "ltr" }}
              onChange={onChange}
              type="text"
              id="phone"
              maxLength={11}
              value={phoneNumber}
              name="phoneNumber"
              placeholder="09xxxxxxxxx"
              className={`
                w-full px-4 py-3.5 rounded-xl indent-4
                bg-neutral-50 border-2 
                focus:ring-2 focus:ring-primary-200 focus:outline-none
                transition-all duration-200
                text-left text-lg
                ${error ? "border-error-400 focus:border-error-500" : "border-neutral-200 focus:border-primary-400"}
              `}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-neutral-400">🇮🇷</span>
            </div>
          </div>
          {error && (
            <div className="mt-2 text-sm text-error-600 flex items-center">
              <IoWarningOutline className="ml-1" size={18} />
              {error}
            </div>
          )}
        </div>

        <Button
          variant={timer > 0 ? "secondary" : "primary"}
          className="w-full py-4 text-base font-semibold mt-6 rounded-xl transition-all duration-300 hover:shadow-hover"
          valid={phoneNumber.length > 10 && timer === 0}
          error={error}
          type="submit"
          children={
            timer > 0 ? `${timer} ثانیه تا ارسال مجدد` : "دریافت کد تایید"
          }
          isLoading={isLoading}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-500">
            با ورود به سیستم، شما
            <a
              href="#"
              className="text-primary-600 hover:text-primary-700 mx-1 font-medium"
            >
              شرایط و قوانین
            </a>{" "}
            استفاده از سرویس کار را می‌پذیرید
          </p>
        </div>
      </form>
    </div>
  );
};

export default SendOtp;
