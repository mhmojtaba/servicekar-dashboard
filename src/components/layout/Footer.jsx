import Image from "next/image";
import logo from "@/assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src={logo}
                alt="خدمات گستر جزائری"
                width={30}
                height={30}
              />
              <h3 className="text-xl font-bold">خدمات گستر جزائری</h3>
            </div>
            <p className="text-gray-300">
              ارائه خدمات تخصصی تعمیر و نگهداری لوازم خانگی با بیش از 10 سال
              تجربه
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">اطلاعات تماس</h3>
            <div className="space-y-2 text-gray-300">
              <p>📞 تلفن: ۰۳۱۳۳۳۳۳۳۳۳</p>
              <p>📱 موبایل: ۰۹۱۲۳۴۵۶۷۸۹</p>
              <p>📍 آدرس: اصفهان، اتوبان چمران، جنب کوچه51، پلاک ۱۲۳</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">خدمات ما</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• تعمیر آبگرمکن</li>
              <li>• سرویس بخاری گازی</li>
              <li>• تعمیر کولر گازی</li>
              <li>• نگهداری لوازم خانگی</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; ۱۴۰۴ خدمات گستر جزائری. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
