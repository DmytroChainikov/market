import star_collored from "../assets/icons/star_collored.png";
function ProductMini({ product }) {
    return (
        <div className="w-full sm:w-[230px] p-3 border rounded-lg hover:shadow-[0px_0px_5px_2px] hover:shadow-primary-lavender transition duration-300 ease-in-out flex-col flex justify-between">
            <div className="relative">
                <div className="w-full h-[204px] flex items-center justify-center">
                    <img
                        src={product.images_path[0]}
                        alt="img"
                        className="rounded-xl w-full max-h-[204px] object-contain"
                    />
                </div>
                <div className="absolute top-0 right-0 bg-gray-200 text-gray-700 text-xs border border-black font-semibold rounded-lg p-1">
                    <p>{product.category}</p>
                </div>
            </div>
            <div className="mt-3">
                <h3 className="text-base font-semibold" title={product.name}>
                    {product.name.length > 20
                        ? product.name.slice(0, 20) + "..."
                        : product.name}
                </h3>
                <div className="flex items-center gap-1 text-sm mt-1">
                    <img src={star_collored} alt="star" className="w-4 h-4" />
                    <p>5.0 (1k Reviews)</p>
                </div>
                <div className="flex justify-between items-center mt-3">
                    <button className="bg-accent-purple text-white px-4 py-2 rounded-md text-sm">
                        Add to cart
                    </button>
                    <p className="text-lg font-semibold">
                        {product.price}
                        <span> грн.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ProductMini;
