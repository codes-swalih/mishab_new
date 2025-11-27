"use client";

import React from "react";
import TrustBadges from "./TrustBadges";

interface TrustBadgesBarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TrustBadgesBar: React.FC<TrustBadgesBarProps> = ({
  size = "lg",
  className = "",
}) => {
  return (
    <div className={`w-full bg-white ${className} pb-10`}>
      <div className="container">
        <div className="flex items-center justify-center">
          <TrustBadges />
        </div>
      </div>
    </div>
  );
};

export default TrustBadgesBar;
