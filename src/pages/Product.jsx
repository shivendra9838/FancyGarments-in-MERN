import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import RelatedProducts from "../components/RelatedProducts";


const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.images[0]);
      window.scrollTo(0, 0);
    }
  }, [productId, products]);


  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border-t-2 pt-10">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex flex-1 gap-4">
          <div className="flex flex-col gap-2 w-1/5">
            {productData.images.map((item, index) => (
              <img
                key={index}
                onClick={() => setImage(item)}
                className={`w-full cursor-pointer border-2 ${image === item ? 'border-red-500' : 'border-transparent'}`}
                src={item}
                alt=""
              />
            ))}
          </div>
          <div className="w-4/5">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-medium text-2xl">{productData.name}</h1>
          <div className="flex items-center gap-1">
            <img src={assets.star_icon} alt="" className="w-4 h-4" />
            <img src={assets.star_icon} alt="" className="w-4 h-4" />
            <img src={assets.star_icon} alt="" className="w-4 h-4" />
            <img src={assets.star_icon} alt="" className="w-4 h-4" />
            <img src={assets.star_dull_icon} alt="" className="w-4 h-4" />
            <p className="pl-2">(123)</p>
          </div>
          <p className="mt-2 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-2 text-gray-500">{productData.description}</p>
          <div className="my-4">
            <p className="font-semibold mb-2">Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 rounded-md ${item === size ? "bg-red-500 text-white" : "bg-gray-100"}`}
                  key={index}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => addToCart(productData._id, size)} className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700">
            ADD TO CART
          </button>
          <hr className="my-8" />
          <div className="text-sm text-gray-500 space-y-2">
            <p><strong>100% Original product.</strong></p>
            <p><strong>Cash on delivery is available.</strong></p>
            <p><strong>Easy 7-day return and exchange policy.</strong></p>
          </div>
        </div>
      </div>
      <div className='mt-20'>
        <div className="border-t border-b">
          <b className="border-r px-5 py-3 text-sm inline-block">Description</b>
          <p className="inline-block px-5 py-3 text-sm">Reviews(123)</p>
        </div>
        <div className="px-6 py-6 text-sm text-gray-500">
          <p>{productData.description}</p>
        </div>
      </div>
      <div className="my-14">
        <div className="font-medium text-3xl text-center mb-8">
          <Title text1={'RELATED'} text2={'PRODUCTS'} />
        </div>
        <RelatedProducts subCategory={productData.subCategory} currentProductId={productData._id} />
      </div>
    </div>
  );
};

export default Product;
