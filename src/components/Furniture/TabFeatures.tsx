"use client";
import * as Icon from "@phosphor-icons/react/dist/ssr";
import React, { useState, useEffect, useCallback } from "react";
import "swiper/css/bundle";
import Product from "../Product/Product";
import { ProductType } from "@/type/ProductType";
import { ref, get } from "firebase/database";
import { database } from "@/firebase/config";
import {
  FirebaseProductType,
  convertFirebaseToUIProduct,
} from "@/type/FirebaseProductType";

interface Props {
  start: number;
  limit: number;
}

const TabFeatures: React.FC<Props> = ({ start, limit }) => {
  const [bestSellers, setBestSellers] = useState<ProductType[]>([]);
  const [onSale, setOnSale] = useState<ProductType[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Test Firebase connection on component mount
  useEffect(() => {
    const testFirebase = async () => {
      try {
        console.log("🧪 Testing Firebase connection...");
        const testRef = ref(database, "/");
        const snapshot = await get(testRef);
        console.log(
          "✅ Firebase connected! Root data keys:",
          Object.keys(snapshot.val() || {})
        );
      } catch (err) {
        console.error("❌ Firebase connection failed:", err);
      }
    };
    testFirebase();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try Firebase first
      const productsRef = ref(database, "/products");
      const snapshot = await get(productsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(
          "🔥 Raw Firebase data received:",
          Object.keys(data).length,
          "products"
        );

        const productsList = Object.entries(data)
          .map(
            ([id, value]): FirebaseProductType => ({
              id,
              ...(value as Omit<FirebaseProductType, "id">),
            })
          )
          .filter((product) => {
            const status = product.status?.toLowerCase();
            return (
              !status ||
              status === "enabled" ||
              status === "true" ||
              status === "active"
            );
          });

        console.log(
          "✅ Enabled products after filtering:",
          productsList.length
        );

        // Filter best sellers
        const bestSellerProducts = productsList.filter(
          (product) => product.bestSeller === true
        );
        const bestSellerUI = bestSellerProducts.map((product) =>
          convertFirebaseToUIProduct(product)
        );
        setBestSellers(bestSellerUI.slice(start, start + limit));
        console.log("✅ Best sellers loaded:", bestSellerUI.length);

        // Filter on sale
        const onSaleProducts = productsList.filter(
          (product) => product.onSale === true
        );
        const onSaleUI = onSaleProducts.map((product) =>
          convertFirebaseToUIProduct(product)
        );
        setOnSale(onSaleUI.slice(start, start + limit));
        console.log("✅ On sale loaded:", onSaleUI.length);

        // Filter new arrivals
        const newArrivalProducts = productsList.filter(
          (product) => product.newArrivals === true
        );
        const newArrivalUI = newArrivalProducts.map((product) =>
          convertFirebaseToUIProduct(product)
        );
        setNewArrivals(newArrivalUI.slice(start, start + limit));
        console.log("✅ New arrivals loaded:", newArrivalUI.length);
      } else {
        throw new Error("No Firebase data");
      }
    } catch (error) {
      console.log("Firebase failed, using demo products");
      console.error("Firebase error details:", error);

      // Create demo products
      const createDemoProducts = (category: string, count: number = 2) => {
        return Array.from({ length: count }, (_, i) => ({
          id: `demo-${category}-${i + 1}`,
          name: `Demo Product ${i + 1} - ${category}`,
          price: 1200 + i * 600,
          originPrice: 1200 + i * 600,
          salePrice: category === "on sale" ? 900 + i * 400 : 1200 + i * 600,
          thumbImage: ["/images/product/1000x1000.png"],
          images: ["/images/product/1000x1000.png"],
          description: `Demo product for ${category}`,
          category: "furniture",
          trending: category === "best sellers",
          new: category === "new arrivals",
          sale: category === "on sale",
          stockStatus: "in_stock",
          slug: `demo-product-${category}-${i + 1}`,
          sku: `DEMO-${category.toUpperCase()}-${i + 1}`,
          quantity: 20,
          sold: 10,
          type: "physical",
          status: "enabled",
          isActive: true,
          variation: [],
          sizes: [],
          rate: 5,
          review: 0,
          gender: "",
          brand: "",
          action: "add to cart",
          quantityPurchase: 1,
        }));
      };

      setBestSellers(createDemoProducts("best sellers", 4));
      setOnSale(createDemoProducts("on sale", 4));
      setNewArrivals(createDemoProducts("new arrivals", 4));
    } finally {
      setLoading(false);
    }
  }, [start, limit]);

  useEffect(() => {
    console.log("🚀 Fetching all products...");
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <div className="tab-features-block md:pt-20 pt-10">
        <div className="container">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-secondary">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-features-block md:pt-20 pt-10">
        <div className="container">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-4">{error}</div>
              <button
                onClick={fetchProducts}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Best Sellers Section */}
      <div className="best-sellers-section md:pt-20 pt-8">
        <div className="container">
          <div className=" flex items-center justify-between w-full">
            <div className="heading3">Best Sellers</div>
            <div className=" flex items-center gap-2">
              <h1 className=" text-xs text-gray-400">see all</h1>
              <div className=" w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs ">
                <h1>
                  <Icon.ArrowRight />
                </h1>
              </div>
            </div>
          </div>

          {bestSellers.length > 0 ? (
            <div className="list-product grid lg:grid-cols-4 grid-cols-2 md:gap-[30px] gap-5 md:mt-10 mt-6">
              {bestSellers.map((prd, index) => (
                <Product
                  key={prd.id || index}
                  data={prd}
                  type="grid"
                  style="style-1"
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center md:mt-10 mt-6 py-10">
              <p className="text-secondary text-lg">No best sellers found</p>
            </div>
          )}
        </div>
      </div>

      {/* On Sale Section */}
      <div className="on-sale-section md:pt-20 pt-8">
        <div className="container">
          <div className=" flex items-center justify-between w-full">
            <div className="heading3">On Sale</div>
            <div className=" flex items-center gap-2">
              <h1 className=" text-xs text-gray-400">see all</h1>
              <div className=" w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs ">
                <h1>
                  <Icon.ArrowRight />
                </h1>
              </div>
            </div>
          </div>

          {onSale.length > 0 ? (
            <div className="list-product grid lg:grid-cols-4 grid-cols-2 md:gap-[30px] gap-5 md:mt-10 mt-6">
              {onSale.map((prd, index) => (
                <Product
                  key={prd.id || index}
                  data={prd}
                  type="grid"
                  style="style-1"
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center md:mt-10 mt-6 py-10">
              <p className="text-secondary text-lg">No sale items found</p>
            </div>
          )}
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="new-arrivals-section md:pt-20 pt-8 md:pb-20 pb-10">
        <div className="container">
          <div className=" flex items-center justify-between w-full">
            <div className="heading3">New Arrivals</div>
            <div className=" flex items-center gap-2">
              <h1 className=" text-xs text-gray-400">see all</h1>
              <div className=" w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs ">
                <h1>
                  <Icon.ArrowRight />
                </h1>
              </div>
            </div>
          </div>

          {newArrivals.length > 0 ? (
            <div className="list-product grid lg:grid-cols-4 grid-cols-2 md:gap-[30px] gap-5 md:mt-10 mt-6">
              {newArrivals.map((prd, index) => (
                <Product
                  key={prd.id || index}
                  data={prd}
                  type="grid"
                  style="style-1"
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center md:mt-10 mt-6 py-10">
              <p className="text-secondary text-lg">No new arrivals found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TabFeatures;
