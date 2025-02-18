import React, { useState, useEffect, useCallback, use } from "react";
import CategoryButton from "../components/categoryButton";
import ProductMini from "../components/productMini";
import HomeIcon from "@mui/icons-material/Home";
import api from "../api/axios";
const MainPage = () => {
    const [goods, setGoods] = useState([]);
    useEffect(() => {
        api.get("/goods/get_goods", {
            params: { limit: 5 },
            headers: { skipAuth: true },
        }).then((res) => {
            setGoods(res.data);
            console.log("res.data", res.data);
        });
    }, []);
    const chunkArray = (array, chunkSize) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    // Розбиваємо на групи по 5
    const goodsChunks = chunkArray(goods, 5);
    return (
        <>
            <div className="flex items-end justify-center h-[calc(100vh-440px)] main_page border-b-1 shadow-[0px_4px_6.9px_0px_rgba(0,0,0,0.25)]">
                <div className="side_container flex-grow"></div>
                <div className="flex justify-between w-[1200px] bg-white rounded-t-xl p-5 overflow-x-auto gap-4">
                    <CategoryButton
                        category={{ id: 1, name: "Home", img: HomeIcon }}
                    />
                    <CategoryButton
                        category={{ id: 1, name: "Home", img: HomeIcon }}
                    />
                    <CategoryButton
                        category={{ id: 1, name: "Home", img: HomeIcon }}
                    />
                    <CategoryButton
                        category={{ id: 1, name: "Home", img: HomeIcon }}
                    />
                    <CategoryButton
                        category={{ id: 1, name: "Home", img: HomeIcon }}
                    />
                    <CategoryButton
                        category={{ id: 1, name: "Home", img: HomeIcon }}
                    />
                    <CategoryButton
                        category={{ id: 1, name: "Home", img: HomeIcon }}
                    />
                    <CategoryButton
                        category={{ id: 1, name: "Home", img: HomeIcon }}
                    />
                    <CategoryButton
                        category={{ id: 1, name: "Home", img: HomeIcon }}
                    />
                </div>
                <div className="side_container flex-grow"></div>
            </div>
            <div className="mt-5 h-[800px] max-w-[1200px] mx-auto w-[100%]">
                {goodsChunks.map((chunk, index) => (
                    <div>
                        <div>
                            <h2 className="text-3xl mt-5 mb-2">{chunk[0].goods_type}</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {chunk.map((idx) => (
                              <ProductMini product={idx} />
                                
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
export default MainPage;
