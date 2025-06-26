"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { heroItems } from "@/constants/heroItems";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroItems.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heroItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroItems.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentItem = heroItems[currentSlide];
  const colors: Record<string, string> = {
    item1:
      "bg-gradient-to-l from-orange-300 to-pink-400 dark:from-orange-900 dark:to-pink-900",
    item2:
      "bg-gradient-to-l from-green-200 to-emerald-500 dark:from-green-700 dark:to-emerald-900",
    item3:
      "bg-gradient-to-l from-yellow-100 to-orange-300 dark:from-yellow-600 dark:to-orange-600",
  };

  return (
    <section
      className={cn("relative overflow-hidden", colors[currentItem.color])}
    >
      <div className="container mx-auto py-10 px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className={cn("space-y-3", currentItem.textColor)}>
            <div className="text-sm font-medium bg-white/10 inline-block px-3 py-1 rounded-full">
              {currentItem.badge}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight whitespace-pre-line">
              {currentItem.title}
            </h1>
            <p className="text-sm md:text-base opacity-80 whitespace-pre-line">
              {currentItem.description}
            </p>
            <div className="pt-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-[#1A1B4B] hover:bg-white/90 dark:bg-white dark:text-[#1A1B4B]"
              >
                <Link href={currentItem.buttonLink}>
                  {currentItem.buttonText}
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center md:justify-end relative">
            <div className="relative">
              {/* 라벨 */}
              <div className="absolute -top-30 right-48 space-y-2 z-10 transform rotate-3">
                {currentItem.labels.map((label, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg px-5 py-1 rounded-full font-bold text-sm whitespace-nowrap hover:scale-105 transition-transform"
                  >
                    {label}
                  </div>
                ))}
              </div>
              {/* 마스코트 이미지 */}
              <div className="w-40 h-40 md:w-48 md:h-48 relative">
                <img
                  src={
                    currentItem.image ||
                    "https://source.unsplash.com/random/200x200"
                  }
                  alt={currentItem.imageAlt}
                  width={200}
                  height={200}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center justify-center mt-4 gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            {heroItems.map((_, index) => (
              <button
                key={index}
                className={`w-6 h-6 flex items-center justify-center text-xs rounded-full ${
                  currentSlide === index
                    ? "bg-white text-[#1A1B4B] font-bold"
                    : "text-white/70 hover:text-white"
                }`}
                onClick={() => goToSlide(index)}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
