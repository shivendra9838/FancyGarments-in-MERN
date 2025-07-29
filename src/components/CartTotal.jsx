import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount, giftCard, applyGiftCard, removeGiftCard } = useContext(ShopContext);
  const [promoCode, setPromoCode] = useState('');

  const handleApplyPromo = () => {
    if (promoCode) {
      applyGiftCard(promoCode);
      setPromoCode(''); // Clear the input after applying
    }
  };

  const subtotal = getCartAmount();
  const discount = giftCard.discount > 0 ? (subtotal * giftCard.discount / 100) : 0;
  const total = subtotal + delivery_fee - discount;

  return (
    <div className='w-full'>
      <div className='text-2xl mb-4'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>
      <div className='flex flex-col gap-4 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{currency}{subtotal.toFixed(2)}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{currency}{delivery_fee.toFixed(2)}</p>
        </div>
        <hr />
        {giftCard.discount > 0 && (
          <>
            <div className='flex justify-between text-green-600 items-center'>
              <p>Discount ({giftCard.code})</p>
              <div className='flex items-center gap-2'>
                <p>-{currency}{discount.toFixed(2)}</p>
                <button
                  onClick={removeGiftCard}
                  className='text-red-500 hover:text-red-700 font-bold text-lg'
                  title='Remove Gift Card'
                >
                  &times;
                </button>
              </div>
            </div>
            <hr />
          </>
        )}
        <div className='flex justify-between font-bold text-lg'>
          <p>Total</p>
          <p>{currency}{total.toFixed(2)}</p>
        </div>
      </div>
      <div className='mt-8'>
        <p className='text-gray-600 mb-2'>If you have a gift card, enter it here:</p>
        <div className='flex flex-col sm:flex-row gap-2'>
          <input
            type='text'
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder='Enter Gift Card Code'
            className='flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500'
          />
          <button
            onClick={handleApplyPromo}
            className='px-6 py-2 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors'
          >
            Apply
          </button>
        </div>
        <div className='mt-3 text-xs text-gray-500'>
          <p className='mb-1'>💡 Try these gift card codes:</p>
          <div className='flex flex-wrap gap-2'>
            <button 
              onClick={() => { setPromoCode('WELCOME200'); applyGiftCard('WELCOME200'); setPromoCode(''); }}
              className='bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs hover:bg-pink-200 transition cursor-pointer'
            >
              WELCOME200
            </button>
            <button 
              onClick={() => { setPromoCode('FIRST10'); applyGiftCard('FIRST10'); setPromoCode(''); }}
              className='bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200 transition cursor-pointer'
            >
              FIRST10
            </button>
            <button 
              onClick={() => { setPromoCode('FREEDOM30'); applyGiftCard('FREEDOM30'); setPromoCode(''); }}
              className='bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 transition cursor-pointer'
            >
              FREEDOM30
            </button>
            <button 
              onClick={() => { setPromoCode('SAVE15'); applyGiftCard('SAVE15'); setPromoCode(''); }}
              className='bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs hover:bg-purple-200 transition cursor-pointer'
            >
              SAVE15
            </button>
            <button 
              onClick={() => { setPromoCode('HOLIDAY25'); applyGiftCard('HOLIDAY25'); setPromoCode(''); }}
              className='bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs hover:bg-yellow-200 transition cursor-pointer'
            >
              HOLIDAY25
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartTotal;