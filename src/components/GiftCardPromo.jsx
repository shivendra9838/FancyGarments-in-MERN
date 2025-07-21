import React from 'react';
import { useNavigate } from 'react-router-dom';

const GiftCardPromo = () => {
  const navigate = useNavigate();
  // Use a modern gift card SVG icon
  const giftCardIcon = (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="60" rx="12" fill="#F472B6"/>
      <rect y="30" width="90" height="30" rx="12" fill="#FDE68A"/>
      <circle cx="25" cy="45" r="10" fill="#F9A8D4"/>
      <rect x="45" y="40" width="30" height="10" rx="3" fill="#F472B6"/>
      <rect x="60" y="20" width="15" height="8" rx="2" fill="#F9A8D4"/>
    </svg>
  );

  const handleSendGiftCard = (e) => {
    e.preventDefault();
    // Scroll to or navigate to the gift card section (could be a modal or a page)
    // For now, navigate to /giftcards or scroll to #giftcards
    if (document.getElementById('giftcards-section')) {
      document.getElementById('giftcards-section').scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#giftcards');
    }
  };

  return (
    <div className="my-12 flex flex-col md:flex-row items-center justify-center gap-8 bg-gradient-to-r from-pink-50 via-yellow-50 to-pink-100 rounded-2xl shadow-lg p-8 border-b-4 border-pink-200">
      <div className="mb-4 md:mb-0 md:mr-8 flex items-center justify-center">
        {giftCardIcon}
      </div>
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl font-bold mb-2 text-pink-700">Surprise your loved ones!</h2>
        <p className="text-gray-600 mb-4">Send a <span className="font-semibold text-pink-600">Fancy Garments Gift Card</span> and make their day special. Perfect for birthdays, celebrations, and more!</p>
        <button
          onClick={handleSendGiftCard}
          className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow transition"
        >
          Send a Gift Card
        </button>
      </div>
    </div>
  );
};

export default GiftCardPromo; 