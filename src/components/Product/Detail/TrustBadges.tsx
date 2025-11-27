import React from "react";
import { Shield, Truck, RotateCcw, Award } from "lucide-react";

const TRUST_BADGES = [
  {
    label: "Top Brand",
    description: "Trusted Quality",
    icon: Award,
    color: "from-amber-500 to-orange-500",
  },
  {
    label: "Secure Payment",
    description: "100% Protected",
    icon: Shield,
    color: "from-green-500 to-emerald-500",
  },
  {
    label: "Fast Delivery",
    description: "Quick Shipping",
    icon: Truck,
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "10 Days Return",
    description: "Easy Returns",
    icon: RotateCcw,
    color: "from-purple-500 to-pink-500",
  },
];

export default function TrustBadges() {
  return (
    <div className="w-full bg-white md:bg-gradient-to-b md:from-gray-50 md:to-white py-3 md:py-8 px-3 md:px-4 rounded-2xl md:shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Header – desktop only to save vertical space on mobile */}
        <div className="hidden md:block text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Why Shop With Us?
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Your satisfaction is our top priority
          </p>
        </div>

        {/* Mobile: compact horizontal row  |  Desktop: 4-column grid */}
        <div
          className="  grid grid-cols-2 gap-3
  md:grid-cols-4 md:gap-6
"
        >
          {TRUST_BADGES.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="
                  group relative flex items-center gap-3 bg-white
                  rounded-xl px-3 py-2 shadow-sm border border-gray-100
                  flex-shrink-0 md:min-w-[170px]
                  hover:shadow-md hover:-translate-y-0.5
                  transition-all duration-300
                  md:flex-col md:text-center md:rounded-2xl md:p-6 md:flex-shrink
                "
              >
                {/* Gradient background on hover – desktop only */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex items-center gap-3 md:flex-col md:items-center md:text-center w-full">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gray-100 md:bg-white flex items-center justify-center">
                      <Icon
                        className="w-5 h-5 md:w-8 md:h-8 text-black"
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <h3 className="text-xs md:text-base font-semibold text-gray-900">
                      {badge.label}
                    </h3>
                    <p className="text-[10px] md:text-sm text-gray-600">
                      {badge.description}
                    </p>
                  </div>

                  {/* Decorative dot – desktop only */}
                  <div
                    className={`
                      hidden md:block mt-4 w-1.5 h-1.5 rounded-full
                      bg-gradient-to-br ${badge.color}
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                    `}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Bar – desktop only */}
        <div className="hidden md:block mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">50K+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">4.8★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">99%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
