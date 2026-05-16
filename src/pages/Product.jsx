import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import { ReviewSection } from "../components/ReviewSection";
import { FaHeart, FaRegHeart, FaShareAlt, FaTruck, FaUndo, FaShieldAlt, FaCheckCircle, FaWhatsapp, FaFacebookF, FaEnvelope, FaLink, FaTimes } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "react-toastify";

const TABS = [
  { id: "desc", label: "Description" },
  { id: "specs", label: "Specifications" },
  { id: "care", label: "Material & Care" },
  { id: "shipping", label: "Shipping & Returns" },
  { id: "reviews", label: "Reviews" },
];

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart, addToWishlist, removeFromWishlist, wishlist, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("desc");
  const [imgZoom, setImgZoom] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const isWishlisted = wishlist.some(w => w.productId === productId);

  useEffect(() => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.images[0]);
      setSize("");
      setActiveTab("desc");
      window.scrollTo(0, 0);
    }
  }, [productId, products]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = productData ? `Check out ${productData.name} on Fancy Garments!` : '';

  const shareOptions = [
    { label: 'WhatsApp',  icon: <FaWhatsapp />,  color: 'bg-green-500 hover:bg-green-600',  action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank') },
    { label: 'Facebook',  icon: <FaFacebookF />, color: 'bg-blue-600 hover:bg-blue-700',    action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank') },
    { label: 'X (Twitter)', icon: <FaXTwitter />,  color: 'bg-black hover:bg-gray-800',       action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank') },
    { label: 'Email',     icon: <FaEnvelope />,  color: 'bg-red-500 hover:bg-red-600',      action: () => window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`, '_blank') },
    { label: 'Copy Link', icon: <FaLink />,      color: 'bg-gray-600 hover:bg-gray-700',    action: () => { navigator.clipboard.writeText(shareUrl); toast.success('Link copied!'); setShowSharePopup(false); } },
  ];

  const handleBuyNow = () => {
    if (!size) { toast.error("Select a size first"); return; }
    addToCart(productData._id, size);
    navigate("/cart");
  };

  // Skeleton loading
  if (!productData) {
    return (
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-10 animate-pulse">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 flex gap-3">
            <div className="w-1/5 space-y-2">{[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-200 rounded-xl" />)}</div>
            <div className="w-4/5 aspect-square bg-gray-200 rounded-2xl" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="h-10 bg-gray-200 rounded w-1/4" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const discountPct = 15;
  const originalPrice = Math.round(productData.price / (1 - discountPct / 100));

  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-6 sm:py-10 bg-white dark:bg-gray-900 min-h-screen">

      {/* ── Product Main ── */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">

        {/* ── Images ── */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 lg:w-[55%]">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:w-[72px] sm:max-h-[500px] scrollbar-hide">
            {productData.images.map((img, i) => (
              <img key={i} src={img} alt="" onClick={() => setImage(img)}
                className={`w-16 h-16 sm:w-[68px] sm:h-[68px] object-cover rounded-lg cursor-pointer border-2 transition-all flex-shrink-0 hover:opacity-80
                  ${image === img ? 'border-pink-500 shadow-md' : 'border-gray-200 dark:border-gray-700'}`} />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-sm cursor-crosshair group"
            onMouseEnter={() => setImgZoom(true)} onMouseLeave={() => setImgZoom(false)} onMouseMove={handleMouseMove}>
            <img src={image} alt={productData.name}
              className={`w-full aspect-square object-cover transition-transform duration-300 ${imgZoom ? 'scale-150' : 'scale-100'}`}
              style={imgZoom ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}} />
            {productData.isNewArrival && (
              <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">🆕 NEW</span>
            )}
          </div>
        </div>

        {/* ── Product Info ── */}
        <div className="lg:w-[45%] lg:sticky lg:top-28 lg:self-start space-y-5">

          {/* Title & badges */}
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1 uppercase tracking-wider font-medium">
              <span>{productData.category}</span> / <span>{productData.subCategory}</span>
              {productData.productType && <> / <span className="text-pink-500">{productData.productType}</span></>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">{productData.name}</h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{currency}{productData.price}</span>
            <span className="text-lg text-gray-400 line-through">{currency}{originalPrice}</span>
            <span className="text-sm font-bold text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">{discountPct}% OFF</span>
          </div>
          <p className="text-xs text-gray-400">Inclusive of all taxes</p>

          {/* Stock badge */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-600">In Stock</span>
          </div>

          {/* Size Selection */}
          <div>
            <p className="font-semibold text-sm text-gray-700 dark:text-gray-200 mb-2">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((s, i) => (
                <button key={i} onClick={() => setSize(s)}
                  className={`min-w-[44px] h-11 px-4 rounded-xl font-semibold text-sm border-2 transition-all duration-200
                    ${s === size
                      ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white scale-105 shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-pink-400 hover:text-pink-500'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={() => addToCart(productData._id, size)}
              className="flex-1 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg">
              🛒 ADD TO CART
            </button>
            <button onClick={handleBuyNow}
              className="flex-1 py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg">
              ⚡ BUY NOW
            </button>
          </div>

          {/* Wishlist & Share */}
          <div className="flex gap-3">
            <button onClick={() => isWishlisted ? removeFromWishlist(productId) : addToWishlist(productData)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all
                ${isWishlisted ? 'border-pink-500 text-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:border-pink-400 hover:text-pink-500'}`}>
              {isWishlisted ? <FaHeart /> : <FaRegHeart />} {isWishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>
            <div className="relative">
              <button onClick={() => setShowSharePopup(prev => !prev)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-gray-200 dark:border-gray-600 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-all">
                <FaShareAlt /> Share
              </button>

              {/* Share Popup */}
              {showSharePopup && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowSharePopup(false)} />
                  {/* Popup */}
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50 w-[260px] animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-sm text-gray-800 dark:text-white">Share this product</p>
                      <button onClick={() => setShowSharePopup(false)} className="text-gray-400 hover:text-gray-600 transition"><FaTimes /></button>
                    </div>
                    <div className="flex gap-3 justify-center">
                      {shareOptions.map(opt => (
                        <button key={opt.label} onClick={() => { opt.action(); if (opt.label !== 'Copy Link') setShowSharePopup(false); }}
                          className={`w-11 h-11 rounded-full ${opt.color} text-white flex items-center justify-center text-lg transition-transform hover:scale-110 shadow-md`}
                          title={opt.label}>
                          {opt.icon}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                      <input readOnly value={shareUrl} className="flex-1 bg-transparent text-xs text-gray-600 dark:text-gray-300 outline-none truncate" />
                      <button onClick={() => { navigator.clipboard.writeText(shareUrl); toast.success('Copied!'); }}
                        className="text-xs font-bold text-pink-500 hover:text-pink-600 whitespace-nowrap">Copy</button>
                    </div>
                    {/* Arrow */}
                    <div className="absolute -bottom-2 left-6 sm:left-10 w-4 h-4 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 rotate-45" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-3">
            {[
              { icon: <FaCheckCircle className="text-green-500" />, text: "100% Original" },
              { icon: <FaTruck className="text-blue-500" />, text: "Free Delivery" },
              { icon: <FaUndo className="text-orange-500" />, text: "7-Day Returns" },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
                <span className="text-lg">{b.icon}</span>
                <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs Section ── */}
      <div className="mt-12 sm:mt-16">
        {/* Tab Headers */}
        <div className="flex overflow-x-auto gap-1 border-b border-gray-200 dark:border-gray-700 scrollbar-hide">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-6 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2
                ${activeTab === tab.id ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-6 sm:py-8 min-h-[200px]">

          {activeTab === "desc" && (
            <div className="max-w-3xl space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p className="text-base">{productData.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {["Premium quality fabric", "Breathable & comfortable", "Modern slim fit design", "Perfect for daily & casual wear", "Easy machine wash", "Color-fast & durable"].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm"><span className="text-green-500 text-xs">✔</span> {f}</div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-lg">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Brand", "Fancy Garments"],
                    ["Category", productData.category],
                    ["Sub Category", productData.subCategory],
                    ["Type", productData.productType || "—"],
                    ["Available Sizes", productData.sizes.join(", ")],
                    ["Fit", "Regular Fit"],
                    ["Occasion", "Casual / Daily Wear"],
                  ].map(([k, v], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}>
                      <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 w-1/3">{k}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "care" && (
            <div className="max-w-2xl space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {[
                ["🧵 Fabric", "High-quality cotton blend — soft, durable, and skin-friendly."],
                ["🧼 Washing", "Machine wash cold with similar colors. Do not bleach."],
                ["🌡️ Drying", "Tumble dry on low or hang dry. Do not wring."],
                ["🔥 Ironing", "Iron on medium heat. Do not iron on print / embroidery."],
                ["📦 Storage", "Store in a cool, dry place. Fold neatly to avoid creases."],
              ].map(([title, desc], i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <span className="text-lg">{title.split(" ")[0]}</span>
                  <div><p className="font-semibold text-gray-700 dark:text-gray-200">{title.split(" ").slice(1).join(" ")}</p><p className="text-gray-500 mt-0.5">{desc}</p></div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="max-w-2xl space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex gap-3 items-start p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <FaTruck className="text-blue-500 text-xl mt-0.5" />
                <div><p className="font-semibold text-gray-800 dark:text-gray-100">Free Delivery</p><p>Orders above ₹999 qualify for free standard delivery (3-5 business days).</p></div>
              </div>
              <div className="flex gap-3 items-start p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                <FaUndo className="text-orange-500 text-xl mt-0.5" />
                <div><p className="font-semibold text-gray-800 dark:text-gray-100">Easy Returns</p><p>7-day hassle-free returns. Product must be unworn with original tags.</p></div>
              </div>
              <div className="flex gap-3 items-start p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <FaShieldAlt className="text-green-500 text-xl mt-0.5" />
                <div><p className="font-semibold text-gray-800 dark:text-gray-100">Secure Checkout</p><p>100% secure payment. Cash on Delivery available.</p></div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && <ReviewSection productId={productId} />}
        </div>
      </div>

      {/* ── Related Products ── */}
      <div className="mt-10 sm:mt-14">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">You May Also Like</h2>
        <RelatedProducts subCategory={productData.subCategory} currentProductId={productData._id} />
      </div>

      {/* ── Mobile Sticky Bottom Bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex gap-3 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <button onClick={() => addToCart(productData._id, size)}
          className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm">
          🛒 Add to Cart
        </button>
        <button onClick={handleBuyNow}
          className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-sm">
          ⚡ Buy Now
        </button>
      </div>
      <div className="lg:hidden h-16" /> {/* spacer for sticky bar */}
    </div>
  );
};

export default Product;
