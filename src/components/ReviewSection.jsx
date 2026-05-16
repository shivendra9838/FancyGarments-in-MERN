import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { FaStar, FaRegStar, FaThumbsUp, FaTrash, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const StarRating = ({ rating, onRate, size = 'text-xl' }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={() => onRate?.(s)} className={`${size} transition-transform hover:scale-110 ${s <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        {s <= rating ? <FaStar /> : <FaRegStar />}
      </button>
    ))}
  </div>
);

const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-6 text-right font-medium">{star}★</span>
      <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-gray-500 text-xs">{count}</span>
    </div>
  );
};

const ReviewSection = ({ productId }) => {
  const { backendUrl, token, userData } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ total: 0, avg: 0, breakdown: [] });
  const [loading, setLoading] = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/review/list`, { productId });
      if (res.data.success) {
        setReviews(res.data.reviews);
        setSummary(res.data.summary);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { if (productId) fetchReviews(); }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) { toast.error('Please login to leave a review'); return; }
    if (myRating === 0) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      const res = await axios.post(`${backendUrl}/api/review/add`, { productId, rating: myRating, comment: myComment }, { headers: { token } });
      if (res.data.success) {
        toast.success(res.data.message);
        setMyRating(0); setMyComment(''); setShowForm(false);
        fetchReviews();
      } else { toast.error(res.data.message); }
    } catch (e) { toast.error('Failed to submit review'); }
    setSubmitting(false);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete your review?')) return;
    try {
      const res = await axios.post(`${backendUrl}/api/review/delete`, { reviewId }, { headers: { token } });
      if (res.data.success) { toast.success('Review deleted'); fetchReviews(); }
      else toast.error(res.data.message);
    } catch (e) { toast.error('Failed to delete'); }
  };

  const handleHelpful = async (reviewId) => {
    if (!token) { toast.error('Login to vote'); return; }
    try {
      const res = await axios.post(`${backendUrl}/api/review/helpful`, { reviewId }, { headers: { token } });
      if (res.data.success) fetchReviews();
    } catch (e) { toast.error('Failed'); }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const d = Math.floor(diff / 86400000);
    if (d > 30) return new Date(date).toLocaleDateString();
    if (d > 0) return `${d}d ago`;
    const h = Math.floor(diff / 3600000);
    if (h > 0) return `${h}h ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-20 bg-gray-200 rounded" />
        <div className="h-20 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl">
        <div className="flex flex-col items-center justify-center min-w-[120px]">
          <span className="text-5xl font-bold text-gray-800 dark:text-white">{summary.avg}</span>
          <StarRating rating={Math.round(summary.avg)} size="text-lg" />
          <span className="text-sm text-gray-500 mt-1">{summary.total} review{summary.total !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex-1 space-y-1.5">
          {summary.breakdown.map(b => <RatingBar key={b.star} star={b.star} count={b.count} total={summary.total} />)}
        </div>
      </div>

      {/* Write Review Button / Form */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="px-6 py-2.5 bg-black dark:bg-white dark:text-black text-white rounded-full font-semibold text-sm hover:opacity-80 transition">
          ✍️ Write a Review
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl space-y-4 shadow-sm">
          <p className="font-semibold text-gray-700 dark:text-gray-200">Your Rating</p>
          <StarRating rating={myRating} onRate={setMyRating} size="text-3xl" />
          <textarea value={myComment} onChange={e => setMyComment(e.target.value)} placeholder="Share your experience with this product..." rows={3}
            className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-pink-400 outline-none resize-none bg-white dark:bg-gray-900 dark:text-white" />
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-pink-500 text-white rounded-full font-semibold text-sm hover:bg-pink-600 transition disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full font-semibold text-sm hover:bg-gray-300 transition">Cancel</button>
          </div>
        </form>
      )}

      {/* Review List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-5xl">📝</span>
          <p className="mt-3 text-gray-500 font-medium">No reviews yet</p>
          <p className="text-sm text-gray-400">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r._id} className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    {r.userName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">{r.userName}</span>
                      {r.verifiedPurchase && (
                        <span className="flex items-center gap-0.5 text-xs text-green-600 font-medium"><FaCheckCircle className="text-[10px]" /> Verified</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{timeAgo(r.createdAt)}</span>
                  </div>
                </div>
                <StarRating rating={r.rating} size="text-sm" />
              </div>
              {r.comment && <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{r.comment}</p>}
              <div className="mt-3 flex items-center gap-4">
                <button onClick={() => handleHelpful(r._id)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-pink-500 transition font-medium">
                  <FaThumbsUp /> Helpful ({r.helpful?.length || 0})
                </button>
                {userData && r.userId === userData._id && (
                  <button onClick={() => handleDelete(r._id)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition font-medium">
                    <FaTrash /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { ReviewSection, StarRating };
