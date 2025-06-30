"use client";
import { Card, CardContent } from "@mui/material";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">درباره ما</h1>
            <p className="text-xl text-gray-600">
              بیش از ۱۰ سال تجربه در خدمات لوازم خانگی
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">داستان ما</h2>
              <p className="text-gray-600 leading-relaxed">
                شرکت خدمات لوازم خانگی ما از سال ۱۳۹۳ فعالیت خود را آغاز کرده و
                تا کنون بیش از ۱۰۰۰ مشتری راضی داشته است. ما با استفاده از
                جدیدترین تجهیزات و تکنسین‌های مجرب، خدمات با کیفیت بالا ارائه
                می‌دهیم.
              </p>
              <p className="text-gray-600 leading-relaxed">
                تخصص ما در زمینه تعمیر و نگهداری انواع آبگرمکن، بخاری گازی، کولر
                گازی و سایر لوازم خانگی است. رضایت مشتری اولویت اصلی ما محسوب
                می‌شود.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                چرا ما را انتخاب کنید؟
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 space-x-reverse">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                    ✓
                  </span>
                  <span>بیش از ۱۰ سال تجربه</span>
                </li>
                <li className="flex items-center space-x-3 space-x-reverse">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                    ✓
                  </span>
                  <span>تکنسین‌های مجرب و متخصص</span>
                </li>
                <li className="flex items-center space-x-3 space-x-reverse">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                    ✓
                  </span>
                  <span>گارانتی کار انجام شده</span>
                </li>
                <li className="flex items-center space-x-3 space-x-reverse">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                    ✓
                  </span>
                  <span>پشتیبانی ۲۴ ساعته</span>
                </li>
                <li className="flex items-center space-x-3 space-x-reverse">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                    ✓
                  </span>
                  <span>قیمت‌های رقابتی</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  اطلاعات تماس
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <span className="text-2xl">📞</span>
                    <div>
                      <p className="font-semibold">تلفن ثابت</p>
                      <p className="text-gray-600 ltr" dir="ltr">
                        021-12345678
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <span className="text-2xl">📱</span>
                    <div>
                      <p className="font-semibold">موبایل</p>
                      <p className="text-gray-600 ltr" dir="ltr">
                        0912-345-6789
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <span className="text-2xl">📧</span>
                    <div>
                      <p className="font-semibold">ایمیل</p>
                      <p className="text-gray-600 ltr" dir="ltr">
                        info@homeservice.ir
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  آدرس دفتر
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="font-semibold">آدرس</p>
                      <p className="text-gray-600 leading-relaxed">
                        تهران، خیابان ولیعصر، بالاتر از چهارراه ولیعصر، پلاک
                        ۱۲۳، واحد ۴۵
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <span className="text-2xl">🕒</span>
                    <div>
                      <p className="font-semibold">ساعات کاری</p>
                      <p className="text-gray-600">
                        شنبه تا پنج‌شنبه: ۸:۰۰ - ۲۰:۰۰
                      </p>
                      <p className="text-gray-600">جمعه: ۹:۰۰ - ۱۷:۰۰</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
