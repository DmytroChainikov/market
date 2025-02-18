import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useParams, Link } from "react-router-dom";
import { LightgalleryProvider, LightgalleryItem } from "react-lightgallery";
import "lightgallery/css/lightgallery.css";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import star_collored from "../assets/icons/star_collored.png";
import add_heart from "../assets/icons/heart.png";
import add_to_cart from "../assets/icons/add-to-cart.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const GoodsPage = () => {
    const navigate = useNavigate();
    const [goods, setGoods] = useState({});
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.user.user);
    useEffect(() => {
        const fetchGoods = async () => {
            setLoading(true);
            try {
                const endpoint = user
                    ? "/goods/get_goods_by_id"
                    : "/goods/get_goods_by_id_unauthorized";
                const headers = user ? {} : { skipAuth: true };

                const response = await api.get(endpoint, {
                    params: { goods_id: id },
                    headers,
                });

                setGoods(response.data);
            } catch (error) {
                console.error("Помилка завантаження товару:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGoods();
    }, [id]);

    async function addToCart() {
        if (user !== null) {
            try {
                await api.post("/cart/add", {
                    goods_id: goods.id,
                    quantity: 1,
                });
            } catch (error) {
                navigate("/cart");
            }
        } else {
            navigate("/login");
        }
    }
    async function addToFavorite() {
        if (user !== null) {
            try {
                await api.put(`/goods/favorite?goods_id=${goods.id}`);

            } catch (error) {
                navigate("/favorite");
            }
        } else {
            navigate("/login");
        }
    }

    if (loading) {
        return <div></div>;
    }

    return (
        <>
            <div className="fixed h-[69px] border w-full shadow-[0px_4px_6.9px_0px_rgba(0,0,0,0.25)]"></div>
            <div className="min-h-[100vh] flex flex-col justify-center items-center">
                <div className="h-[69px]"></div>
                <div className="w-full max-w-[1200px] flex-grow mt-5 px-[20px]">
                    <div>
                        <Link to="/">Домашня</Link> -&gt;{" "}
                        <Link to="#">{goods.category}</Link> -&gt;{" "}
                        <Link to="#">{goods.goods_type}</Link>
                    </div>
                    <div className="flex md:flex-row gap-5 justify-between">
                        <div className="flex gap-10 p-5">
                            <div className="flex flex-col gap-2 max-h-full justify-between">
                                {goods.images_path
                                    ?.slice(1, 5)
                                    .map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt=""
                                            className="cursor-pointer max-h-[90px] max-w-[90px] object-contain"
                                        />
                                    ))}
                            </div>

                            {/* Основне зображення */}
                            <div className="flex flex-col justify-center items-center">
                                <LightgalleryProvider
                                    plugins={[lgThumbnail, lgZoom]} // Підключені плагіни
                                    dynamic={true} // Динамічне завантаження
                                >
                                    {/* Основне зображення */}
                                    <LightgalleryItem
                                        group="goods-gallery"
                                        src={goods.images_path[0]}
                                    >
                                        <img
                                            src={goods.images_path?.[0]}
                                            alt=""
                                            className="max-h-[420px] max-w-[420px] cursor-pointer"
                                        />
                                    </LightgalleryItem>

                                    {/* Додаткові зображення для галереї */}
                                    {goods.images_path?.map((image, index) => (
                                        <LightgalleryItem
                                            key={index}
                                            group="goods-gallery"
                                            src={image}
                                        >
                                            <img
                                                src={image}
                                                alt=""
                                                style={{ display: "none" }} // Приховати додаткові зображення
                                            />
                                        </LightgalleryItem>
                                    ))}
                                </LightgalleryProvider>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col">
                            <h1 className="text-2xl font-bold pt-5">
                                {goods.name}
                            </h1>
                            <div className="text-lg font-bold text-gray-500">
                                <div className="flex items-center gap-1 mt-1">
                                    <img
                                        src={star_collored}
                                        alt="star"
                                        className="w-5 h-5"
                                    />
                                    <p>5.0 (1k Reviews)</p>
                                    <p>| 5k+ sold</p>
                                </div>
                            </div>
                            <div className="text-3xl font-bold my-6">
                                {goods.price} грн.
                            </div>
                            <div className="w-full h-[1px] bg-accent-purple shadow-[0px_0px_5px_2px] shadow-primary-lavender"></div>
                            <div className="mt-5 flex-grow flex flex-col justify-end">
                                <div className="mb-3">
                                    delivery: <span>from 1 to 3 days</span>
                                </div>
                                <div className="flex gap-5">
                                    <button className="w-1/2 bg-accent-purple font-bold text-xl text-white px-4 py-2 rounded-md shadow-[0px_0px_5px_2px] shadow-primary-lavender">
                                        Buy now
                                    </button>
                                    <div className="w-1/2 flex gap-5">
                                        <button
                                            onClick={addToFavorite}
                                            className="bg-white text-accent-purple px-4 py-2 rounded-md text-sm shadow-[0px_0px_5px_2px] shadow-primary-lavender"
                                        >
                                            <img
                                                src={add_heart}
                                                className="max-h-[30px]"
                                            />
                                        </button>
                                        <button
                                            onClick={addToCart}
                                            className="bg-white text-accent-purple px-4 py-2 rounded-md text-sm shadow-[0px_0px_5px_2px] shadow-primary-lavender"
                                        >
                                            <img
                                                src={add_to_cart}
                                                className="max-h-[30px]"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GoodsPage;
