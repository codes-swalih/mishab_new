"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import { TestimonialType } from "@/type/TestimonialType";
import { ref, get } from "firebase/database";
import { database } from "@/firebase/config";
import { Star } from "lucide-react";

interface Props {
  limit?: number;
}

const Testimonial: React.FC<Props> = ({ limit = 10 }) => {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);

      const testimonialsRef = ref(database, "/testimonials");
      const snapshot = await get(testimonialsRef);

      if (snapshot.exists()) {
        const testimonialsData: TestimonialType[] = [];
        snapshot.forEach((childSnapshot) => {
          testimonialsData.push({
            id: childSnapshot.key!,
            ...childSnapshot.val(),
          });
        });

        testimonialsData.sort((a, b) => {
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          return timeB - timeA;
        });
        setTestimonials(testimonialsData);
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || testimonials.length === 0) {
    return null;
  }

  return (
    <div className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className=" mb-2 md:mb-12">
          <h2 className="text-2xl md:text-4xl text-center font-bold text-gray-900 mb-1">
            Customer Reviews
          </h2>
          <div className="flex items-center justify-center gap-2">
            {/* <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div> */}
            <span className="text-sm md:text-base text-gray-600">
              4.9 ({testimonials.length} reviews)
            </span>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="max-w-4xl mx-auto relative">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 40,
              },
            }}
            navigation={{
              nextEl: ".testimonial-next",
              prevEl: ".testimonial-prev",
            }}
            modules={[Navigation, Autoplay]}
            className="!pb-12"
          >
            {testimonials.slice(0, limit).map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 h-full flex flex-col">
                  {/* Star Rating */}

                  {/* Review Text */}
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-2 flex-grow">
                    {testimonial.description}
                  </p>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.imageUrl || "/images/avatar/1.png"}
                        width={48}
                        height={48}
                        alt={
                          testimonial.altText || testimonial.name || "Customer"
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm md:text-base">
                        {testimonial.name}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        Verified Customer
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons - Hidden on mobile */}
          <div className="hidden md:block">
            <button className="testimonial-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all z-10">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="testimonial-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all z-10">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
