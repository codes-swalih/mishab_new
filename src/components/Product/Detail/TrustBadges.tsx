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
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-8 px-4 rounded-2xl shadow-lg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Why Shop With Us?
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Your satisfaction is our top priority
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {TRUST_BADGES.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-1"
              >
                {/* Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Icon Container */}
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full  p- mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <Icon
                        className={`w-8 h-8 md:w-10 md:h-10 text-black`}
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1">
                    {badge.label}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    {badge.description}
                  </p>

                  {/* Decorative Dot */}
                  <div
                    className={`mt-4 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional: Stats Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                50K+
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                Happy Customers
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                4.8★
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                Average Rating
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                99%
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
