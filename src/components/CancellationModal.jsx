import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CancellationModal = ({ isOpen, onClose, onConfirm, orderId }) => {
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const reasons = [
    'Order created by mistake',
    'Item(s) would not arrive on time',
    'Shipping cost is too high',
    'Found a better price elsewhere',
    'Incorrect address',
    'Other',
  ];

  const handleConfirm = () => {
    const finalReason = reason === 'Other' ? otherReason : reason;
    if (!finalReason) {
      alert('Please select a reason for cancellation.');
      return;
    }
    onConfirm(orderId, finalReason);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <Dialog.Title className="text-xl font-bold mb-4 flex justify-between items-center">
            Cancel Order
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </Dialog.Title>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Please let us know why you are cancelling this order.</p>
            <div className="space-y-2">
              {reasons.map((r) => (
                <label key={r} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="form-radio text-pink-500 focus:ring-pink-500"
                  />
                  {r}
                </label>
              ))}
            </div>
            {reason === 'Other' && (
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Please specify the reason"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows="3"
              />
            )}
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Go Back
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              Confirm Cancellation
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CancellationModal; 