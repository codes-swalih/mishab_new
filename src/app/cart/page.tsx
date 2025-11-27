"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopNavOne from "@/components/Header/TopNav/TopNavOne";
import MenuOne from "@/components/Header/Menu/MenuOne";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/CartContext";
import { countdownTime } from "@/store/countdownTime";
import {
  getCouponByCode,
  computeCouponDiscount,
  CouponRecord,
} from "@/firebase/coupons";
import BannerTop from "@/components/Home3/BannerTop";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";

import MenuFurniture from "@/components/Header/Menu/MenuFurniture";
import MenuCategory from "@/components/Furniture/MenuCategory";
import SliderFurniture from "@/components/Slider/SliderFurniture";

const Cart = () => {
  const [timeLeft, setTimeLeft] = useState(countdownTime());
  const router = useRouter();
  const [user, userLoading] = useAuthState(auth);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(countdownTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { cartState, updateCart, removeFromCart } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const itemToUpdate = cartState.cartArray.find(
      (item) => item.id === productId
    );

    if (itemToUpdate) {
      updateCart(
        productId,
        newQuantity,
        itemToUpdate.selectedSize,
        itemToUpdate.selectedColor
      );
    }
  };

  let [totalCart, setTotalCart] = useState<number>(0);
  let [discountCart, setDiscountCart] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponError, setCouponError] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponRecord | null>(null);
  let [applyCode, setApplyCode] = useState<number>(0);

  cartState.cartArray.map(
    (item) =>
      (totalCart += ((item as any).salePrice ?? item.price) * item.quantity)
  );

  const handleApplyCoupon = async () => {
    setCouponError("");
    try {
      const record = await getCouponByCode(couponCode.trim());
      if (!record) {
        setCouponError("Invalid coupon code");
        setDiscountCart(0);
        setAppliedCoupon(null);
        return;
      }
      const { valid, reason, discount } = computeCouponDiscount(
        totalCart,
        record
      );
      if (!valid) {
        setCouponError(reason || "Coupon not applicable");
        setDiscountCart(0);
        setAppliedCoupon(null);
        return;
      }
      setDiscountCart(discount);
      setAppliedCoupon(record);
    } catch (e) {
      setCouponError("Failed to apply coupon");
      setDiscountCart(0);
      setAppliedCoupon(null);
    }
  };

  const handleClearCoupon = () => {
    setAppliedCoupon(null);
    setDiscountCart(0);
    setCouponError("");
  };

  useEffect(() => {
    if (!appliedCoupon) return;
    const { valid, reason, discount } = computeCouponDiscount(
      totalCart,
      appliedCoupon
    );
    if (!valid) {
      setCouponError(reason || "Coupon not applicable");
      setDiscountCart(0);
      return;
    }
    setCouponError("");
    setDiscountCart(discount);
  }, [totalCart, appliedCoupon]);

  if (totalCart < applyCode) {
    applyCode = 0;
    discountCart = 0;
  }

  const redirectToCheckout = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  return (
    <>
      <div id="header" className="relative w-full">
        <BannerTop
          props="bg-black py-3"
          textColor="text-white"
          bgLine="bg-black"
        />
        <MenuFurniture props="bg-white" />
        <Breadcrumb heading="Shopping cart" subHeading="Shopping cart" />
      </div>

      <div className="cart-block md:py-20 py-6 px-4 md:px-0">
        <div className="container">
          <div className="content-main flex hide-scrollbar justify-between max-xl:flex-col gap-y-8">
            <div className="xl:w-2/3 xl:pr-3 w-full">
              <div className="list-product w-full sm:mt-7 mt-3">
                <div className="w-full">
                  {/* DESKTOP TABLE HEADER – hidden on mobile */}
                  <div className="heading bg-surface border px-2 rounded-2xl bora-4 pt-4 pb-4 hidden md:block">
                    <div className="flex">
                      <div className="w-1/2">
                        <div className="text-button text-left">Products</div>
                      </div>
                      <div className="w-1/12">
                        <div className="text-button text-center">Price</div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-button text-center">Quantity</div>
                      </div>
                      <div className="w-1/6">
                        <div className="text-button text-center">
                          Total Price
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="list-product-main w-full mt-3">
                    {cartState.cartArray.length < 1 ? (
                      <p className="text-button pt-3">No product in cart</p>
                    ) : (
                      cartState.cartArray.map((product) => {
                        const unitPrice =
                          (product as any).salePrice ?? product.price;
                        const lineTotal = unitPrice * product.quantity;

                        return (
                          <div
                            key={product.id}
                            className="item flex flex-col md:flex-row md:mt-7 md:pb-7 mt-4 pb-4 border-b border-line w-full"
                          >
                            {/* PRODUCT INFO - Mobile Optimized */}
                            <div className="md:w-1/2 w-full">
                              <div className="flex items-start gap-3 md:gap-4">
                                <div
                                  className="bg-img w-20 h-24 md:w-[100px] md:aspect-[3/4] flex-shrink-0 cursor-pointer"
                                  onClick={() =>
                                    router.push(
                                      `/product/default?id=${product.id}`
                                    )
                                  }
                                >
                                  <Image
                                    src={product.thumbImage[0]}
                                    width={1000}
                                    height={1000}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>

                                <div className="flex flex-col flex-1 min-w-0">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      router.push(
                                        `/product/default?id=${product.id}`
                                      )
                                    }
                                    className="text-left w-1/2 md:w-3/4 text-sm md:text-base font-medium cursor-pointer hover:underline line-clamp-2 md:line-clamp-none"
                                  >
                                    {product.name}
                                  </button>

                                  {/* MOBILE PRICE - Show immediately below name */}
                                  <div className="mt-1 md:hidden">
                                    <span className="text-base font-semibold">
                                      ₹{unitPrice}.00
                                    </span>
                                  </div>

                                  {/* MOBILE REMOVE BUTTON */}
                                  <button
                                    className="mt-2 md:mt-0 inline-flex items-center gap-1 text-xs text-red-500 md:hidden self-start"
                                    onClick={() => removeFromCart(product.id)}
                                  >
                                    <Icon.XCircle className="text-sm" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* DESKTOP COLUMNS */}
                            <div className="hidden md:flex md:w-1/12 items-center justify-center">
                              <div className="text-title text-center">
                                ₹{unitPrice}.00
                              </div>
                            </div>

                            <div className="hidden md:flex md:w-1/6 items-center justify-center">
                              <div className="quantity-block bg-surface md:p-3 p-2 flex items-center justify-between rounded-lg border border-line md:w-[100px] w-20">
                                <Icon.Minus
                                  onClick={() => {
                                    if (product.quantity > 1) {
                                      handleQuantityChange(
                                        product.id,
                                        product.quantity - 1
                                      );
                                    }
                                  }}
                                  className={`text-base ${
                                    product.quantity === 1 ? "disabled" : ""
                                  }`}
                                />
                                <div className="text-button quantity">
                                  {product.quantity}
                                </div>
                                <Icon.Plus
                                  onClick={() =>
                                    handleQuantityChange(
                                      product.id,
                                      product.quantity + 1
                                    )
                                  }
                                  className="text-base"
                                />
                              </div>
                            </div>

                            <div className="hidden md:flex md:w-1/6 items-center justify-center">
                              <div className="text-title text-center">
                                ₹{lineTotal}.00
                              </div>
                            </div>

                            <div className="hidden md:flex md:w-1/12 items-center justify-center">
                              <Icon.XCircle
                                className="text-xl text-red cursor-pointer hover:text-black duration-500"
                                onClick={() => {
                                  removeFromCart(product.id);
                                }}
                              />
                            </div>

                            {/* MOBILE QUANTITY & TOTAL ROW - Improved Layout */}
                            <div className="mt-3 w-1/2 flex md:hidden justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-secondary font-medium">
                                  Qty:
                                </span>
                                <div className="quantity-block bg-surface px-2.5 py-1.5 flex items-center justify-between rounded-lg border border-line w-[90px]">
                                  <Icon.Minus
                                    onClick={() => {
                                      if (product.quantity > 1) {
                                        handleQuantityChange(
                                          product.id,
                                          product.quantity - 1
                                        );
                                      }
                                    }}
                                    className={`text-sm ${
                                      product.quantity === 1
                                        ? "disabled opacity-40"
                                        : "cursor-pointer"
                                    }`}
                                  />
                                  <div className="text-sm font-medium px-2">
                                    {product.quantity}
                                  </div>
                                  <Icon.Plus
                                    onClick={() =>
                                      handleQuantityChange(
                                        product.id,
                                        product.quantity + 1
                                      )
                                    }
                                    className="text-sm cursor-pointer"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col items-end">
                                <span className="text-xs text-secondary font-medium">
                                  Total
                                </span>
                                <span className="text-base font-semibold">
                                  ₹{lineTotal}.00
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY - Mobile Optimized */}
            <div className="xl:w-1/3 xl:pl-12 w-full">
              <div className="checkout-block bg-surface md:p-6 rounded-2xl">
                <div className="text-xl md:text-2xl font-semibold mb-4">
                  Order Summary
                </div>
                <div className="total-block py-4 md:py-5 flex justify-between border-b border-line">
                  <div className="text-base md:text-lg font-medium">
                    Subtotal
                  </div>
                  <div className="text-base md:text-lg font-medium">
                    ₹<span className="total-product">{totalCart}</span>
                    <span>.00</span>
                  </div>
                </div>
                <div className="total-cart-block pt-4 pb-4 flex justify-between">
                  <div className="text-xl md:text-2xl font-bold">Total</div>
                  <div className="text-xl md:text-2xl font-bold">
                    ₹<span className="total-cart">{totalCart}</span>
                    <span>.00</span>
                  </div>
                </div>
                <div className="block-button flex flex-col items-center gap-y-3 md:gap-y-4 mt-4 md:mt-5">
                  <button
                    className="checkout-btn button-main text-center w-full py-3 md:py-4 text-sm md:text-base rounded-lg"
                    onClick={redirectToCheckout}
                  >
                    Process To Checkout
                  </button>
                  <Link
                    className="text-sm md:text-base hover-underline"
                    href={"/shop/breadcrumb1"}
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
