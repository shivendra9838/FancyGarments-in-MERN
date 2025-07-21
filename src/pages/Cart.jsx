
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  useEffect(() => {
    const tempData = [];
    for (const i in cartItems) {
      for (const j in cartItems[i]) {
        if (cartItems[i][j] > 0) {
          tempData.push({
            _id: i,
            size: j,
            quantity: cartItems[i][j],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>
      <div>
        {
          cartData.map((item) => {
            const productData = products.find((i) => i._id === item._id);
            if (!productData) return null;

            return (
              <div
                key={`${item._id}-${item.size}`}
                className='py-4 border-t border-b text-gray-700 grid grid-cols-1 md:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
              >
                <div className='flex items-start gap-6'>
                  <img className='w-20' src={productData.images[0]} alt={productData.name} />
                  <div>
                    <p className='text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-3 py-1 border bg-slate-50'>{item.size}</p>
                    </div>
                  </div>
                </div>

                <input
                  type="number"
                  onChange={(e) =>
                    e.target.value === '' || e.target.value === '0'
                      ? 0
                      : updateQuantity(item._id, item.size, Number(e.target.value))
                  }
                  className='border w-14 px-2 py-1'
                  min={1}
                  defaultValue={item.quantity}
                />

                <img
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  src={assets.bin_icon}
                  className='cursor-pointer w-5 mr-4'
                  alt="delete"
                />
              </div>
            );
          })
        }

        <div className='flex flex-col md:flex-row justify-between my-20 gap-12'>
          <div className='flex-1'>
            {/* This space can be used for related products or other content if desired */}
          </div>
          <div className='w-full md:w-[450px]'>
            <CartTotal />
            <div className='w-full text-end mt-8'>
              <Link to='/place-order'>
                <button className='bg-black text-white text-sm px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors'>
                  PROCEED TO CHECKOUT
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
