import React, { useState, useEffect, useCallback } from "react";
import CategoryButton from "../components/categoryButton";
import HomeIcon from "@mui/icons-material/Home";
import star_collored from "../assets/icons/star_collored.png";
const MainPage = () => {
  return (
    <>
      <div className="flex items-end justify-center h-[calc(100vh-400px)] main_page border-b-1 shadow-[0px_4px_6.9px_0px_rgba(0,0,0,0.25)]">
        <div className="side_container flex-grow"></div>
        <div className="flex justify-between w-[1200px] bg-white rounded-t-xl p-5 overflow-x-auto gap-4">
          <CategoryButton category={{ id: 1, name: "Home", img: HomeIcon }} />
          <CategoryButton category={{ id: 1, name: "Home", img: HomeIcon }} />
          <CategoryButton category={{ id: 1, name: "Home", img: HomeIcon }} />
          <CategoryButton category={{ id: 1, name: "Home", img: HomeIcon }} />
          <CategoryButton category={{ id: 1, name: "Home", img: HomeIcon }} />
          <CategoryButton category={{ id: 1, name: "Home", img: HomeIcon }} />
          <CategoryButton category={{ id: 1, name: "Home", img: HomeIcon }} />
          <CategoryButton category={{ id: 1, name: "Home", img: HomeIcon }} />
          <CategoryButton category={{ id: 1, name: "Home", img: HomeIcon }} />
        </div>
        <div className="side_container flex-grow"></div>
      </div>
      <div className="mt-5 h-[800px] max-w-[1200px] mx-auto w-[100%]">
        <div>
          <div>
            <h2 className="text-3xl mb-2">For cooking</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="w-full sm:w-[230px] p-3 border rounded-lg hover:shadow-[0px_0px_5px_2px] hover:shadow-primary-lavender transition duration-300 ease-in-out">
              <div className="relative">
                <img
                  src="./image.png"
                  alt="img"
                  className="rounded-xl w-full"
                />
                <div className="absolute top-2 right-2 bg-gray-200 text-gray-700 text-xs border border-black font-semibold rounded-lg p-1">
                  <p>Cook</p>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-base font-semibold">Stainless Steel ...</h3>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <img src={star_collored} alt="star" className="w-4 h-4" />
                  <p>5.0 (1k Reviews)</p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <button className="bg-accent-purple text-white px-4 py-2 rounded-md text-sm">
                    Add to cart
                  </button>
                  <p className="text-lg font-semibold">
                    100<span>$</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-[230px] p-3 border rounded-lg hover:shadow-[0px_0px_5px_2px] hover:shadow-primary-lavender transition duration-300 ease-in-out">
              <div className="relative">
                <img
                  src="./image.png"
                  alt="img"
                  className="rounded-xl w-full"
                />
                <div className="absolute top-2 right-2 bg-gray-200 text-gray-700 text-xs border border-black font-semibold rounded-lg p-1">
                  <p>Cook</p>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-base font-semibold">Stainless Steel ...</h3>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <img src={star_collored} alt="star" className="w-4 h-4" />
                  <p>5.0 (1k Reviews)</p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <button className="bg-accent-purple text-white px-4 py-2 rounded-md text-sm">
                    Add to cart
                  </button>
                  <p className="text-lg font-semibold">
                    100<span>$</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-[230px] p-3 border rounded-lg hover:shadow-[0px_0px_5px_2px] hover:shadow-primary-lavender transition duration-300 ease-in-out">
              <div className="relative">
                <img
                  src="./image.png"
                  alt="img"
                  className="rounded-xl w-full"
                />
                <div className="absolute top-2 right-2 bg-gray-200 text-gray-700 text-xs border border-black font-semibold rounded-lg p-1">
                  <p>Cook</p>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-base font-semibold">Stainless Steel ...</h3>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <img src={star_collored} alt="star" className="w-4 h-4" />
                  <p>5.0 (1k Reviews)</p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <button className="bg-accent-purple text-white px-4 py-2 rounded-md text-sm">
                    Add to cart
                  </button>
                  <p className="text-lg font-semibold">
                    100<span>$</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-[230px] p-3 border rounded-lg hover:shadow-[0px_0px_5px_2px] hover:shadow-primary-lavender transition duration-300 ease-in-out">
              <div className="relative">
                <img
                  src="./image.png"
                  alt="img"
                  className="rounded-xl w-full"
                />
                <div className="absolute top-2 right-2 bg-gray-200 text-gray-700 text-xs border border-black font-semibold rounded-lg p-1">
                  <p>Cook</p>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-base font-semibold">Stainless Steel ...</h3>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <img src={star_collored} alt="star" className="w-4 h-4" />
                  <p>5.0 (1k Reviews)</p>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <button className="bg-accent-purple text-white px-4 py-2 rounded-md text-sm">
                    Add to cart
                  </button>
                  <p className="text-lg font-semibold">
                    100<span>$</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MainPage;
