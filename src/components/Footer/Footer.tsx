import React from "react";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          {/* Company Info - Full Width */}
          <div className="mb-10 pb-10 border-b border-gray-800">
            <Link href={"/"} className="inline-block mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">Oak & Aura</h2>
            </Link>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <Icon.Envelope size={18} className="mt-0.5 flex-shrink-0" />
                <span>smeraasinnovate@gmail.com</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon.Phone size={18} className="mt-0.5 flex-shrink-0" />
                <span>+91 8590318931</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon.MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>9F, Sunpaul Blueberry, Kakkanad, Ernakulam</span>
              </div>
            </div>
          </div>

          {/* Links Grid - Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb">
            {/* Information */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500">
                Information
              </h3>
              <nav className="flex flex-col space-y-2.5">
                <Link
                  href="/pages/about"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/pages/contact"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/blog"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/pages/become-a-seller"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Become a Seller
                </Link>
                <Link
                  href="/my-account"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  My Account
                </Link>
              </nav>
            </div>

            {/* Quick Shop */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500">
                Quick Shop
              </h3>
              <nav className="flex flex-col space-y-2.5">
                <Link
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Women
                </Link>
                <Link
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Men
                </Link>
                <Link
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clothes
                </Link>
              </nav>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500">
                Policies
              </h3>
              <nav className="flex flex-col space-y-2.5">
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/return-policy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Return Policy
                </Link>
              </nav>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-500">
                Support
              </h3>
              <nav className="flex flex-col space-y-2.5">
                <Link
                  href="/shipping-info"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
                <Link
                  href="/cancellation-policy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancellation
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-gray-500">
              © 2024 Oak & Aura. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <Link
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
              >
                <Icon.FacebookLogo size={18} weight="fill" />
              </Link>
              <Link
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
              >
                <Icon.InstagramLogo size={18} weight="fill" />
              </Link>
              <Link
                href="https://www.twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
              >
                <Icon.TwitterLogo size={18} weight="fill" />
              </Link>
              <Link
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
              >
                <Icon.YoutubeLogo size={18} weight="fill" />
              </Link>
              <Link
                href="https://www.pinterest.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
              >
                <Icon.PinterestLogo size={18} weight="fill" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
