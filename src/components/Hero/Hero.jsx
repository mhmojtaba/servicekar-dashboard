"use client";
import { useEffect } from "react";
import Link from "next/link";

import Button from "@/common/button";
import ImageCarousel from "@/components/ImageCarousel";
import ServiceCard from "@/components/ServiceCard";

const Hero = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll(".animate-on-scroll");
    animateElements.forEach((el) => observer.observe(el));

    return () => {
      animateElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-slide-in-right">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 !leading-normal">
                خدمات تخصصی
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-blue-800">
                  لوازم خانگی
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                تعمیر و نگهداری آبگرمکن، بخاری گازی و سایر لوازم خانگی با کیفیت
                بالا و قیمت مناسب
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/request">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-l from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-float"
                >
                  درخواست خدمات
                </Button>
              </Link>
              <Link href="/about-us">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-4 rounded-xl border-2 hover:bg-gray-50 transition-all duration-300"
                >
                  درباره ما
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">۱۰+</div>
                <div className="text-gray-600">سال تجربه</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">۱۰۰۰+</div>
                <div className="text-gray-600">مشتری راضی</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">۲۴/۷</div>
                <div className="text-gray-600">پشتیبانی</div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in">
            <ImageCarousel />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">خدمات ما</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ما با استفاده از بهترین تجهیزات و تکنسین‌های مجرب، خدمات با کیفیت
              ارائه می‌دهیم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="animate-on-scroll">
              <ServiceCard
                icon="🔧"
                title="تعمیر آبگرمکن"
                description="تعمیر و سرویس انواع آبگرمکن برقی و گازی با گارانتی"
                delay={0.1}
              />
            </div>
            <div className="animate-on-scroll">
              <ServiceCard
                icon="🔥"
                title="سرویس بخاری گازی"
                description="نگهداری و تعمیر بخاری‌های گازی با رعایت کامل ایمنی"
                delay={0.2}
              />
            </div>
            <div className="animate-on-scroll">
              <ServiceCard
                icon="❄️"
                title="تعمیر کولر گازی"
                description="سرویس و تعمیر انواع کولر گازی اسپلیت و کانالی"
                delay={0.3}
              />
            </div>
            <div className="animate-on-scroll">
              <ServiceCard
                icon="⚡"
                title="تعمیرات برقی"
                description="رفع مشکلات برقی لوازم خانگی توسط متخصصان مجرب"
                delay={0.4}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-l from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center animate-on-scroll">
          <h2 className="text-4xl font-bold mb-6">
            آماده خدمت‌رسانی به شما هستیم
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            برای دریافت خدمات تخصصی و با کیفیت، همین حالا با ما تماس بگیرید
          </p>
          <Link href="/request">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              درخواست خدمات
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Hero;
