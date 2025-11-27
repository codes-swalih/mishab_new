"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/type/ProductType";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/context/CartContext";
import { useModalCartContext } from "@/context/ModalCartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useModalWishlistContext } from "@/context/ModalWishlistContext";
import {
  addToFirebaseWishlist,
  removeFromFirebaseWishlist,
} from "@/firebase/wishlist";
import { FirebaseProductType } from "@/type/FirebaseProductType";
import { useModalQuickviewContext } from "@/context/ModalQuickviewContext";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/config";

interface ProductProps {
  data: ProductType;
  type: string;
  style: string;
}

const Product: React.FC<ProductProps> = ({ data, type, style }) => {
  const [user, loading] = useAuthState(auth);
  const [activeColor, setActiveColor] = useState<string>("");
  const [activeSize, setActiveSize] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const { addToCart } = useCart();
  const { openModalCart } = useModalCartContext();
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist();
  const { openQuickview } = useModalQuickviewContext();
  const router = useRouter();

  const handleAddToCart = () => {
    if (data.quantity === 0) return;
    addToCart({
      ...data,
      selectedSize: activeSize,
      selectedColor: activeColor,
    });
    openModalCart();
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      if (wishlistState.wishlistArray.some((item) => item.id === data.id)) {
        await removeFromFirebaseWishlist(user.uid, data.id);
        removeFromWishlist(data.id);
      } else {
        const firebaseProduct: FirebaseProductType = {
          id: data.id,
          name: data.name,
          price: data.price,
          salePrice: data.price,
          thumbnail: data.thumbImage[0],
          productType: "physical" as const,
          vendor: "admin",
          inventoryType: "simple",
          status: "enabled",
          stockStatus: "in_stock",
          stockQuantity: data.quantity,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sku: data.id,
          slug: data.name.toLowerCase().replace(/\s+/g, "-"),
          new: false,
          bestSeller: false,
          onSale: false,
          newArrivals: false,
          trending: false,
          featured: false,
        };
        await addToFirebaseWishlist(user.uid, firebaseProduct);
        addToWishlist(data);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      alert("Failed to update wishlist. Please try again.");
    }
  };

  const handleDetailProduct = (productId: string) => {
    router.push(`/product/default?id=${productId}`);
  };

  const displayPrice = (data as any).salePrice ?? data.price;
  const originalPrice = data.originPrice || data.price;
  const percentSale =
    originalPrice > displayPrice
      ? Math.floor(100 - (displayPrice / originalPrice) * 100)
      : 0;
  const isWishlisted = wishlistState.wishlistArray.some(
    (item) => item.id === data.id
  );
  const isOutOfStock = data.quantity === 0;

  return (
    <>
      {type === "grid" ? (
        <div className={`product-item grid-type ${style}`}>
          {/* Modern Product Card */}
          <div
            onClick={() => handleDetailProduct(data.id)}
            className="group relative rounded-2xl overflow-hidden drop-shadow-lg hover:shadow-2xl p-2 md:p-4 bg-gray-100 transition-all duration-300 cursor-pointer"
          >
            {/* Product Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-xl ">
              {/* Discount Badge - Top Left */}
              {percentSale > 0 && (
                <div className="absolute top-3 left-3 z-10">
                  <div className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                    -{percentSale}%
                  </div>
                </div>
              )}

              {/* Wishlist Icon - Top Right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist();
                }}
                className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
                aria-label="Add to wishlist"
              >
                <Icon.Heart
                  size={18}
                  weight={isWishlisted ? "fill" : "regular"}
                  className={`transition-colors duration-200 ${
                    isWishlisted ? "text-red-500" : "text-gray-700"
                  }`}
                />
              </button>

              {/* Product Image */}
              <div className="relative w-full h-full">
                {!imageLoaded && (
                  <div className="absolute inset-0  animate-pulse" />
                )}
                {activeColor ? (
                  <Image
                    src={
                      data.variation.find((item) => item.color === activeColor)
                        ?.image ?? data.thumbImage[0]
                    }
                    width={500}
                    height={400}
                    alt={data.name}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      imageLoaded
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                    } group-hover:scale-105`}
                    onLoad={() => setImageLoaded(true)}
                    unoptimized={true}
                  />
                ) : (
                  (data.thumbImage || [data.images?.[0]]).map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      width={500}
                      height={400}
                      alt={data.name}
                      className={`w-full h-full  object-cover transition-all duration-500 ${
                        imageLoaded
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95"
                      } group-hover:scale-105`}
                      onLoad={() => setImageLoaded(true)}
                      unoptimized={true}
                    />
                  ))
                )}
              </div>

              {/* Out of Stock Overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-base md:text-lg px-4 py-2 bg-black/70 rounded-lg">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Product Info Container */}
            <div className=" md:space-y-2  pt-2 md:pt-5 h-auto">
              {/* Product Title - Single Line */}
              <h3
                className="
    text-sm md:text-base font-semibold text-gray-900
    line-clamp-1 md:line-clamp-3
     md:min-h-[4.5rem]
    group-hover:text-blue-600 transition-colors duration-200
  "
              >
                {data.name}
              </h3>

              {/* Rating Stars */}
              {data.rating && (
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Icon.Star
                        key={i}
                        size={14}
                        weight={i < data.rating! ? "fill" : "regular"}
                        className={`${
                          i < data.rating! ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({data.rating})</span>
                </div>
              )}

              {/* Pricing Section */}
              <div className="flex items-center gap-2 flex-wrap min-h-[2rem]">
                {/* Selling Price */}
                <span className=" md:text-2xl font-bold text-gray-900">
                  ₹{displayPrice}
                </span>

                {/* Original Price with Strikethrough */}
                {originalPrice > displayPrice && (
                  <>
                    <span className="text-sm md:text-base text-gray-400 line-through">
                      ₹{originalPrice}
                    </span>

                    {/* Discount Percentage Badge */}
                    {/* <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                      {percentSale}% OFF
                    </span> */}
                  </>
                )}
              </div>

              {/* Color Variations */}
              {data.variation && data.variation.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {data.variation.slice(0, 4).map((item, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveColor(item.color);
                      }}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 border ${
                        activeColor === item.color
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:border-black"
                      }`}
                    >
                      {item.color}
                    </button>
                  ))}
                  {data.variation.length > 4 && (
                    <span className="text-xs text-gray-500">
                      +{data.variation.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                disabled={isOutOfStock}
                className={`w-full flex items-center justify-center gap-2 py-1.5 md:py-2.5 rounded-xl font-semibold text-sm md:text-base transition-all duration-200 mt-3 ${
                  isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#202020] text-white hover:from-blue-700 hover:to-blue-800 active:scale-98 shadow-md hover:shadow-xl"
                }`}
              >
                <Icon.Plus size={12} />
                <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
              </button>
            </div>
          </div>
        </div>
      ) : type === "list" ? (
        // List view - keeping original structure with improvements
        <div className="product-item list-type">
          <div className="product-main cursor-pointer flex lg:items-center sm:justify-between gap-7 max-lg:gap-5 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4">
            <div
              onClick={() => handleDetailProduct(data.id)}
              className="product-thumb relative overflow-hidden rounded-2xl block max-sm:w-1/2"
            >
              <div className="product-img w-full aspect-[3/4] rounded-2xl overflow-hidden">
                {(data.thumbImage || [data.images?.[0]]).map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    width={500}
                    height={500}
                    priority={true}
                    alt={data.name}
                    className="w-full h-full object-cover duration-700 hover:scale-105"
                    unoptimized={true}
                  />
                ))}
              </div>
            </div>
            <div className="flex sm:items-center gap-7 max-lg:gap-4 max-lg:flex-wrap max-lg:w-full max-sm:flex-col max-sm:w-1/2">
              <div className="product-infor max-sm:w-full flex-1">
                <h3
                  onClick={() => handleDetailProduct(data.id)}
                  className="product-name text-xl font-bold inline-block duration-300 hover:text-blue-600"
                >
                  {data.name}
                </h3>

                {data.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Icon.Star
                          key={i}
                          size={16}
                          weight={i < data.rating! ? "fill" : "regular"}
                          className={`${
                            i < data.rating!
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({data.rating})
                    </span>
                  </div>
                )}

                <div className="product-price-block flex items-center gap-2 flex-wrap mt-3">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{displayPrice}
                  </div>
                  {data.originPrice && (
                    <>
                      <div className="text-base text-gray-400 line-through">
                        ₹{data.originPrice}
                      </div>
                      <div className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        -{percentSale}%
                      </div>
                    </>
                  )}
                </div>

                {isOutOfStock && (
                  <div className="mt-2">
                    <span className="text-sm text-red-500 font-semibold">
                      Stock finished
                    </span>
                  </div>
                )}
              </div>

              <div className="action flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  disabled={isOutOfStock}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isOutOfStock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  <Icon.Plus size={20} weight="bold" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist();
                  }}
                  className="w-12 h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-all duration-200"
                >
                  <Icon.Heart
                    size={20}
                    weight={isWishlisted ? "fill" : "regular"}
                    className={isWishlisted ? "text-red-500" : "text-gray-700"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : type === "marketplace" ? (
        // Marketplace view with modern styling
        <div
          className="product-item style-marketplace bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
          onClick={() => handleDetailProduct(data.id)}
        >
          <div className="relative w-full">
            <Image
              className="w-full aspect-square object-cover"
              width={500}
              height={500}
              src={data.thumbImage[0]}
              alt={data.name}
              unoptimized={true}
            />

            {percentSale > 0 && (
              <div className="absolute top-3 left-3">
                <div className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                  -{percentSale}%
                </div>
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToWishlist();
              }}
              className="absolute top-3 right-3 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all"
            >
              <Icon.Heart
                size={18}
                weight={isWishlisted ? "fill" : "regular"}
                className={isWishlisted ? "text-red-500" : "text-gray-700"}
              />
            </button>
          </div>

          <div className="p-4 space-y-2">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
              {data.name}
            </h3>

            {data.rating && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Icon.Star
                    key={i}
                    size={14}
                    weight={i < data.rating! ? "fill" : "regular"}
                    className={
                      i < data.rating! ? "text-yellow-400" : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">
                  ({data.rating})
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ₹{displayPrice}
              </span>
              {originalPrice > displayPrice && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{originalPrice}
                  </span>
                  {/* <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    {percentSale}% OFF
                  </span> */}
                </>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center gap-2 py-2.5 md:py-5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              }`}
            >
              <Icon.Plus size={16} weight="bold" />
              <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Product;
