"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import productData from "@/data/Product.json";
import { ProductType } from "@/type/ProductType";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useCart } from "@/context/CartContext";
import { countdownTime } from "@/store/countdownTime";
import CountdownTimeType from "@/type/CountdownType";

const ModalCart = () => {
  const [timeLeft, setTimeLeft] = useState(countdownTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countdownTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [activeTab, setActiveTab] = useState<string | undefined>("");
  const { isModalOpen, closeModalCart } = useModalCartContext();
  const { cartState, addToCart, removeFromCart, updateCart } = useCart();

  // Freeze background scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Prevent scrolling on body
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
      document.documentElement.style.overflow = "hidden";
    } else {
      // Restore scrolling
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleAddToCart = (productItem: ProductType) => {
    if (!productItem || !productItem.id) {
      console.warn("Attempted to add invalid product to cart:", productItem);
      return;
    }

    addToCart({
      ...productItem,
      selectedSize: "",
      selectedColor: "",
    });
  };

  const handleActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  let moneyForFreeship = 150;
  const totalCart = cartState.cartArray.reduce(
    (sum, item) =>
      sum + (item.salePrice ?? item.price ?? 0) * (item.quantity || 0),
    0
  );

  const handleDecreaseQty = (productId: string) => {
    const item = cartState.cartArray.find((p) => p.id === productId);
    if (!item) return;
    const nextQty = Math.max(1, (item.quantity || 1) - 1);
    updateCart(
      productId,
      nextQty,
      item.selectedSize || "",
      item.selectedColor || ""
    );
  };

  const handleIncreaseQty = (productId: string) => {
    const item = cartState.cartArray.find((p) => p.id === productId);
    if (!item) return;
    const nextQty = (item.quantity || 1) + 1;
    updateCart(
      productId,
      nextQty,
      item.selectedSize || "",
      item.selectedColor || ""
    );
  };

  if (!isModalOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9999]"
        onClick={closeModalCart}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        <div
          className="fixed top-0 right-0 h-[80vh] w-full max-w-md bg-white md:h-[100vh] shadow-2xl flex flex-col"
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{
            maxHeight: "100vh",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Header - Fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0 bg-white">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <button
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
              onClick={closeModalCart}
            >
              <Icon.X size={16} weight="bold" />
            </button>
          </div>

          {/* Scrollable Product List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cartState.cartArray.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Icon.ShoppingCartSimple
                  size={64}
                  className="text-gray-300 mb-4"
                />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-2">
                  Add items to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartState.cartArray.map((product) => {
                  if (!product || typeof product !== "object") {
                    console.error("Invalid product in cart:", product);
                    return null;
                  }

                  const safeImage =
                    product?.images &&
                    Array.isArray(product.images) &&
                    product.images.length > 0
                      ? product.images[0]
                      : "/images/other/404-img.png";
                  const qty = product?.quantity || 1;
                  const unit = (product?.salePrice ?? product?.price ?? 0) || 0;
                  const itemSubtotal = unit * qty;

                  return (
                    <div
                      key={product.id}
                      className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={safeImage}
                          width={96}
                          height={96}
                          alt={product.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-medium text-sm line-clamp-2 flex-1">
                              {product.name || "Unnamed Product"}
                            </h3>
                            <button
                              className="text-red-500 hover:text-red-700 flex-shrink-0"
                              onClick={() => removeFromCart(product.id)}
                            >
                              <Icon.X size={20} weight="bold" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5">
                            <button
                              className="text-gray-600 hover:text-black font-medium w-6 h-6 flex items-center justify-center"
                              onClick={() => handleDecreaseQty(product.id)}
                            >
                              -
                            </button>
                            <span className="font-semibold text-sm min-w-[20px] text-center">
                              {qty}
                            </span>
                            <button
                              className="text-gray-600 hover:text-black font-medium w-6 h-6 flex items-center justify-center"
                              onClick={() => handleIncreaseQty(product.id)}
                            >
                              +
                            </button>
                          </div>
                          <div className="font-semibold text-base">
                            ₹{itemSubtotal.toLocaleString()}.00
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer - Fixed at Bottom */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Subtotal</span>
                <span className="text-xl font-bold">
                  ₹{totalCart.toLocaleString()}.00
                </span>
              </div>
              <Link
                href="/cart"
                className="block w-full bg-black text-white text-center font-semibold py-3.5 rounded-lg hover:bg-gray-800 transition-colors uppercase text-sm tracking-wide"
                onClick={closeModalCart}
              >
                View Cart
              </Link>
              <button
                onClick={closeModalCart}
                className="w-full text-center text-sm text-gray-600 hover:text-black mt-3 font-medium uppercase tracking-wide"
              >
                Or Continue Shopping
              </button>
            </div>

            {/* Tab Sections */}
            <div
              className={`tab-item note-block ${
                activeTab === "note" ? "active" : "hidden"
              }`}
            >
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center gap-3 cursor-pointer">
                  <Icon.NotePencil size={20} />
                  <span className="text-sm font-medium">Note</span>
                </div>
              </div>
              <div className="px-6 pb-4">
                <textarea
                  name="form-note"
                  id="form-note"
                  rows={4}
                  placeholder="Add special instructions for your order..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                ></textarea>
              </div>
              <div className="px-6 pb-6 space-y-3">
                <button
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
                  onClick={() => setActiveTab("")}
                >
                  Save
                </button>
                <button
                  onClick={() => setActiveTab("")}
                  className="w-full text-center text-sm text-gray-600 hover:text-black font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div
              className={`tab-item note-block ${
                activeTab === "shipping" ? "active" : "hidden"
              }`}
            >
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center gap-3 cursor-pointer">
                  <Icon.Truck size={20} />
                  <span className="text-sm font-medium">
                    Estimate shipping rates
                  </span>
                </div>
              </div>
              <div className="px-6 pb-4 space-y-4">
                <div>
                  <label
                    htmlFor="select-country"
                    className="text-sm text-gray-600 mb-2 block"
                  >
                    Country/region
                  </label>
                  <div className="relative">
                    <select
                      id="select-country"
                      name="select-country"
                      className="w-full py-3 pl-4 pr-10 rounded-lg bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      defaultValue={"Country/region"}
                    >
                      <option value="Country/region" disabled>
                        Country/region
                      </option>
                      <option value="France">France</option>
                      <option value="Spain">Spain</option>
                      <option value="UK">UK</option>
                      <option value="USA">USA</option>
                    </select>
                    <Icon.CaretDown
                      size={12}
                      className="absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="select-state"
                    className="text-sm text-gray-600 mb-2 block"
                  >
                    State
                  </label>
                  <div className="relative">
                    <select
                      id="select-state"
                      name="select-state"
                      className="w-full py-3 pl-4 pr-10 rounded-lg bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      defaultValue={"State"}
                    >
                      <option value="State" disabled>
                        State
                      </option>
                      <option value="Paris">Paris</option>
                      <option value="Madrid">Madrid</option>
                      <option value="London">London</option>
                      <option value="New York">New York</option>
                    </select>
                    <Icon.CaretDown
                      size={12}
                      className="absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="select-code"
                    className="text-sm text-gray-600 mb-2 block"
                  >
                    Postal/Zip Code
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    id="select-code"
                    type="text"
                    placeholder="Postal/Zip Code"
                  />
                </div>
              </div>
              <div className="px-6 pb-6 space-y-3">
                <button
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
                  onClick={() => setActiveTab("")}
                >
                  Calculator
                </button>
                <button
                  onClick={() => setActiveTab("")}
                  className="w-full text-center text-sm text-gray-600 hover:text-black font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div
              className={`tab-item note-block ${
                activeTab === "coupon" ? "active" : "hidden"
              }`}
            >
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center gap-3 cursor-pointer">
                  <Icon.Tag size={20} />
                  <span className="text-sm font-medium">Add A Coupon Code</span>
                </div>
              </div>
              <div className="px-6 pb-4">
                <label
                  htmlFor="select-discount"
                  className="text-sm text-gray-600 mb-2 block"
                >
                  Enter Code
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  id="select-discount"
                  type="text"
                  placeholder="Discount code"
                />
              </div>
              <div className="px-6 pb-6 space-y-3">
                <button
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
                  onClick={() => setActiveTab("")}
                >
                  Apply
                </button>
                <button
                  onClick={() => setActiveTab("")}
                  className="w-full text-center text-sm text-gray-600 hover:text-black font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalCart;
