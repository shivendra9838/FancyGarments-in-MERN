import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

// Each category has:
//   label   - display text
//   image   - thumbnail image
//   gender  - filters by product.category (Men / Women / Kids / '')
//   type    - filters by product.productType (tops / jeans / shirts etc.)
//   hot     - shows "Hot" badge
const categories = [
  { label: 'Tops',        image: assets.top1,      gender: 'Women', type: 'tops'        },
  { label: 'Jeans',       image: assets.p_img43,   gender: '',      type: 'jeans'       },
  { label: 'Shirts',      image: assets.p_img39,   gender: 'Men',   type: 'shirts'      },
  { label: 'Dresses',     image: assets.dress,     gender: 'Women', type: 'dresses'     },
  { label: 'Shorts',      image: assets.short,     gender: 'Men',   type: 'shorts'      },
  { label: 'Skirts',      image: assets.p_img9,    gender: 'Women', type: 'skirts'      },
  { label: 'New Arrival', image: assets.p_img52,   gender: '',      type: 'new',        hot: true },
  { label: 'Men',         image: assets.p_img11,   gender: 'Men',   type: ''            },
  { label: 'Women',       image: assets.p_img1,    gender: 'Women', type: ''            },
  { label: 'T-Shirts',    image: assets.p_img2_2,  gender: '',      type: 'tshirts'     },
  { label: 'Trousers',    image: assets.p_img7,    gender: '',      type: 'trousers'    },
  { label: 'Trackpants',  image: assets.p_img10,   gender: '',      type: 'trackpants'  },
];

const ShopByCategory = () => {
  const navigate = useNavigate();

  const handleClick = (cat) => {
    const params = new URLSearchParams();
    if (cat.type === 'new') {
      params.set('newArrival', 'true');
    } else {
      if (cat.gender) params.set('gender', cat.gender);
      if (cat.type)   params.set('productType', cat.type);
    }
    navigate(`/collection?${params.toString()}`);
  };

  const CategoryCard = ({ cat, size = 'md' }) => (
    <div
      className={`group cursor-pointer flex flex-col items-center ${size === 'sm' ? 'flex-shrink-0 w-24' : 'w-full'}`}
      onClick={() => handleClick(cat)}
    >
      <div className="relative flex items-center justify-center mb-2">
        <img
          src={cat.image}
          alt={cat.label}
          className={`object-cover rounded-full border-2 border-gray-200 shadow bg-white
            group-hover:border-pink-400 group-hover:scale-105 transition-all duration-200
            ${size === 'sm' ? 'w-20 h-20' : 'w-20 h-20 sm:w-24 sm:h-24'}`}
        />
        {cat.hot && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-bounce shadow">
            🔥 Hot
          </span>
        )}
      </div>
      <span className="font-semibold text-center text-xs sm:text-sm mt-1 whitespace-nowrap group-hover:text-pink-600 transition-colors">
        {cat.label}
      </span>
    </div>
  );

  return (
    <div className="my-8 sm:my-12">
      <div className="text-center mb-6 sm:mb-8">
        <span className="inline-block text-xl sm:text-2xl font-bold mb-1">🛍️ Shop by Category</span>
        <p className="text-gray-500 text-xs sm:text-sm">Explore our key segments and find your style</p>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="sm:hidden flex overflow-x-auto gap-4 px-2 pb-3 scrollbar-hide">
        {categories.map((cat) => (
          <CategoryCard key={cat.label} cat={cat} size="sm" />
        ))}
      </div>

      {/* Desktop / Tablet: responsive grid */}
      <div className="hidden sm:grid grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
        {categories.map((cat) => (
          <CategoryCard key={cat.label} cat={cat} size="md" />
        ))}
      </div>
    </div>
  );
};

export default ShopByCategory;