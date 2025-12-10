import React from "react";
import { Shield, Truck, RotateCcw, Award } from "lucide-react";

const TRUST_BADGES = [
  {
    label: "Top Brand",
    description: "Trusted quality & curated selection",
    icon: Award,
    color: "from-amber-400 to-orange-500",
  },
  {
    label: "Secure Payment",
    description: "Safe & encrypted checkout",
    icon: Shield,
    color: "from-emerald-400 to-teal-600",
  },
  {
    label: "Fast Delivery",
    description: "Nationwide quick shipping",
    icon: Truck,
    color: "from-sky-400 to-indigo-500",
  },
  {
    label: "10 Days Return",
    description: "Hassle-free returns",
    icon: RotateCcw,
    color: "from-purple-400 to-pink-500",
  },
];

export default function TrustBadges() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="w-full bg-gradient-to-b from-white to-gray-50 py-6 px-3 md:px-6 rounded-2xl md:shadow-lg"
    >
      <div className="max-w-6xl mx-auto">
        <div className="md:text-center mb-2 md:mb-8">
          <h2
            id="trust-heading"
            className="text-lg md:text-2xl font-extrabold text-gray-900"
          >
            Why Shop With Us?
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-1 hidden md:block">
            Quality, safety and convenience — designed to earn your trust.
          </p>
        </div>

        {/* mobile: horizontal scroll list; desktop: grid */}
        <div className="-mx-3 md:mx-0">
          <div className="space-y-1 md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto no-scrollbar py-2 md:py-0 px-3">
            {TRUST_BADGES.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <article
                  key={idx}
                  className="min-w-[220px] md:min-w-0 md:w-auto bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl p-3 md:p-5 flex items-center md:flex-col gap-3 md:gap-4 shadow-sm hover:shadow-lg transition-shadow duration-250"
                >
                  <div
                    className={`flex-none w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${badge.color} text-white drop-shadow-md`}
                    aria-hidden
                  >
                    <Icon className="w-5 h-5 md:w-7 md:h-7" />
                  </div>

                  <div className="flex-1 md:text-center">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900">
                      {badge.label}
                    </h3>
                    <p className="text-[12px] md:text-sm text-gray-600 mt-1">
                      {badge.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* subtle stats for added trust
        <div className="mt-6 md:mt-8">
          <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-6 justify-center">
            <div className="flex-1 bg-white rounded-lg p-3 md:p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                50K+
              </div>
              <div className="text-sm text-gray-600">Happy customers</div>
            </div>
            <div className="flex-1 bg-white rounded-lg p-3 md:p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                4.8★
              </div>
              <div className="text-sm text-gray-600">Average rating</div>
            </div>
            <div className="flex-1 bg-white rounded-lg p-3 md:p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                99%
              </div>
              <div className="text-sm text-gray-600">Satisfaction rate</div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
