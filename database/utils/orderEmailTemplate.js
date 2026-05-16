/**
 * Order Confirmation Email Template — Fancy Garments
 * Premium dark-gradient HTML email (Amazon/Flipkart/Myntra style)
 */
export const generateOrderConfirmationEmail = ({ customerName, orderId, items, totalAmount, paymentMethod, address, estimatedDelivery, frontendUrl }) => {
  const itemRows = items.map(item => `
    <tr>
      <td style="padding:12px 8px;border-bottom:1px solid #30363d;">
        <table cellpadding="0" cellspacing="0" width="100%"><tr>
          <td width="60" style="vertical-align:top;">
            <img src="${item.image || 'https://placehold.co/60x60/1a1a2e/fff?text=FG'}" alt="${item.name}" width="56" height="56" style="border-radius:10px;object-fit:cover;border:1px solid #30363d;" />
          </td>
          <td style="padding-left:12px;vertical-align:top;">
            <p style="margin:0 0 4px 0;font-weight:600;color:#fff;font-size:14px;">${item.name}</p>
            <p style="margin:0;color:#8b949e;font-size:12px;">Size: ${item.size || 'N/A'} &nbsp;|&nbsp; Qty: ${item.quantity}</p>
          </td>
          <td style="vertical-align:top;text-align:right;white-space:nowrap;">
            <p style="margin:0;font-weight:700;color:#a855f7;font-size:15px;">₹${(item.price * item.quantity).toLocaleString()}</p>
          </td>
        </tr></table>
      </td>
    </tr>
  `).join('');

  const addr = address || {};
  const addressText = [addr.street, addr.city, addr.state, addr.zipcode, addr.country].filter(Boolean).join(', ');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="width:100%;table-layout:fixed;background-color:#0d1117;padding:30px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#161b22;margin:0 auto;max-width:600px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.5);border:1px solid #30363d;overflow:hidden;">
      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899);padding:28px 20px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;letter-spacing:2px;">FANCY GARMENTS</h1>
          <p style="color:rgba(255,255,255,0.85);margin:6px 0 0 0;font-size:13px;font-weight:400;">Premium Fashion & Apparel</p>
        </td>
      </tr>

      <!-- Success Badge -->
      <tr>
        <td style="padding:30px 30px 10px 30px;text-align:center;">
          <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#10b981);margin:0 auto 16px auto;line-height:60px;font-size:30px;">✓</div>
          <h2 style="color:#fff;margin:0 0 6px 0;font-size:22px;">Order Confirmed! 🎉</h2>
          <p style="color:#8b949e;margin:0;font-size:14px;">Thank you for shopping with Fancy Garments</p>
        </td>
      </tr>

      <!-- Greeting -->
      <tr>
        <td style="padding:20px 30px 0 30px;">
          <p style="color:#c9d1d9;font-size:15px;line-height:1.6;margin:0;">
            Hi <strong style="color:#fff;">${customerName}</strong> 👋,<br>
            Your order has been successfully placed. We're preparing it with care!
          </p>
        </td>
      </tr>

      <!-- Order Info Card -->
      <tr>
        <td style="padding:20px 30px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(99,102,241,0.08);border:1px solid rgba(168,85,247,0.3);border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:14px 16px;border-bottom:1px solid rgba(168,85,247,0.2);">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                  <td><span style="color:#8b949e;font-size:12px;">ORDER ID</span><br><strong style="color:#fff;font-size:14px;font-family:monospace;">${orderId}</strong></td>
                  <td style="text-align:right;"><span style="color:#8b949e;font-size:12px;">PAYMENT</span><br><strong style="color:#22c55e;font-size:14px;">${paymentMethod}</strong></td>
                </tr></table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 16px;">
                <table width="100%" cellpadding="0" cellspacing="0"><tr>
                  <td><span style="color:#8b949e;font-size:12px;">ESTIMATED DELIVERY</span><br><strong style="color:#fff;font-size:14px;">${estimatedDelivery || '3-5 Business Days'}</strong></td>
                  <td style="text-align:right;"><span style="color:#8b949e;font-size:12px;">TOTAL</span><br><strong style="color:#a855f7;font-size:18px;">₹${Number(totalAmount).toLocaleString()}</strong></td>
                </tr></table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Items -->
      <tr>
        <td style="padding:0 30px;">
          <p style="color:#fff;font-size:14px;font-weight:700;margin:0 0 10px 0;text-transform:uppercase;letter-spacing:1px;">🛍️ Order Items</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #30363d;border-radius:10px;overflow:hidden;">
            ${itemRows}
          </table>
        </td>
      </tr>

      <!-- Shipping Address -->
      <tr>
        <td style="padding:20px 30px;">
          <p style="color:#fff;font-size:14px;font-weight:700;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:1px;">📦 Shipping Address</p>
          <div style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.25);border-radius:10px;padding:14px 16px;">
            <p style="color:#c9d1d9;font-size:14px;margin:0;line-height:1.6;">
              <strong style="color:#fff;">${addr.firstName || ''} ${addr.lastName || ''}</strong><br>
              ${addressText}<br>
              ${addr.phone ? '📞 ' + addr.phone : ''}
            </p>
          </div>
        </td>
      </tr>

      <!-- Status Timeline -->
      <tr>
        <td style="padding:10px 30px 20px 30px;">
          <p style="color:#fff;font-size:14px;font-weight:700;margin:0 0 14px 0;text-transform:uppercase;letter-spacing:1px;">📍 Order Status</p>
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="text-align:center;">
              <div style="display:inline-block;width:40px;height:40px;border-radius:50%;background:#22c55e;line-height:40px;font-size:18px;color:#fff;">✓</div>
              <p style="color:#22c55e;font-size:11px;margin:4px 0 0 0;font-weight:600;">Confirmed</p>
            </td>
            <td style="text-align:center;">
              <div style="display:inline-block;width:40px;height:40px;border-radius:50%;background:#30363d;line-height:40px;font-size:16px;">📦</div>
              <p style="color:#8b949e;font-size:11px;margin:4px 0 0 0;">Packed</p>
            </td>
            <td style="text-align:center;">
              <div style="display:inline-block;width:40px;height:40px;border-radius:50%;background:#30363d;line-height:40px;font-size:16px;">🚚</div>
              <p style="color:#8b949e;font-size:11px;margin:4px 0 0 0;">Shipped</p>
            </td>
            <td style="text-align:center;">
              <div style="display:inline-block;width:40px;height:40px;border-radius:50%;background:#30363d;line-height:40px;font-size:16px;">🏠</div>
              <p style="color:#8b949e;font-size:11px;margin:4px 0 0 0;">Delivered</p>
            </td>
          </tr></table>
        </td>
      </tr>

      <!-- CTA Buttons -->
      <tr>
        <td style="padding:10px 30px 25px 30px;text-align:center;">
          <a href="${frontendUrl || 'http://localhost:5173'}/orders" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;text-decoration:none;padding:13px 32px;border-radius:10px;font-weight:700;font-size:14px;letter-spacing:0.5px;margin-right:10px;">Track Order</a>
          <a href="${frontendUrl || 'http://localhost:5173'}/collection" style="display:inline-block;background:#30363d;color:#c9d1d9;text-decoration:none;padding:13px 32px;border-radius:10px;font-weight:600;font-size:14px;letter-spacing:0.5px;">Continue Shopping</a>
        </td>
      </tr>

      <!-- Delivery Note -->
      <tr>
        <td style="padding:0 30px 20px 30px;text-align:center;">
          <p style="color:#8b949e;font-size:13px;margin:0;line-height:1.5;">
            🚛 Your order will be delivered within <strong style="color:#a855f7;">${estimatedDelivery || '3-5 business days'}</strong>.<br>
            You can track your order anytime in the <a href="${frontendUrl || 'http://localhost:5173'}/orders" style="color:#6366f1;text-decoration:none;font-weight:600;">Orders section</a>.
          </p>
        </td>
      </tr>

      <!-- Support -->
      <tr>
        <td style="padding:0 30px 20px 30px;text-align:center;">
          <div style="background:rgba(255,255,255,0.03);border:1px solid #30363d;border-radius:10px;padding:14px;">
            <p style="color:#8b949e;font-size:12px;margin:0;">Need help? Contact us at<br><a href="mailto:fancygarment98@gmail.com" style="color:#a855f7;text-decoration:none;font-weight:600;">fancygarment98@gmail.com</a></p>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:16px 20px;text-align:center;font-size:11px;color:#8b949e;border-top:1px solid #30363d;">
          &copy; 2026 Fancy Garments. All rights reserved.<br>Premium Fashion & Apparel
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
};

/**
 * Order Status Update Email
 */
export const generateStatusUpdateEmail = ({ customerName, orderId, newStatus, frontendUrl }) => {
  const statusEmojis = { 'Packed': '📦', 'Shipped': '🚚', 'Out for Delivery': '🏃', 'Delivered': '✅', 'Cancelled': '❌' };
  const emoji = statusEmojis[newStatus] || '📋';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="width:100%;background-color:#0d1117;padding:30px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#161b22;margin:0 auto;max-width:600px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.5);border:1px solid #30363d;overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899);padding:24px 20px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;letter-spacing:2px;">FANCY GARMENTS</h1>
      </td></tr>
      <tr><td style="padding:30px;text-align:center;">
        <div style="font-size:48px;margin-bottom:12px;">${emoji}</div>
        <h2 style="color:#fff;margin:0 0 8px 0;font-size:20px;">Order ${newStatus}</h2>
        <p style="color:#8b949e;margin:0 0 20px 0;font-size:14px;">Hi <strong style="color:#fff;">${customerName}</strong>, your order status has been updated.</p>
        <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(168,85,247,0.3);border-radius:10px;padding:14px;margin-bottom:20px;">
          <span style="color:#8b949e;font-size:12px;">ORDER ID</span><br>
          <strong style="color:#fff;font-family:monospace;font-size:14px;">${orderId}</strong>
        </div>
        <p style="color:#c9d1d9;font-size:14px;line-height:1.6;">Your order is now <strong style="color:#a855f7;">${newStatus}</strong>.</p>
        <a href="${frontendUrl || 'http://localhost:5173'}/orders" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;text-decoration:none;padding:12px 30px;border-radius:10px;font-weight:700;font-size:14px;margin-top:16px;">View Order</a>
      </td></tr>
      <tr><td style="padding:16px 20px;text-align:center;font-size:11px;color:#8b949e;border-top:1px solid #30363d;">&copy; 2026 Fancy Garments. All rights reserved.</td></tr>
    </table>
  </div>
</body>
</html>
  `;
};

/**
 * Order Cancellation Email
 */
export const generateOrderCancellationEmail = ({ customerName, orderId, items, paymentMethod, refundStatus, frontendUrl }) => {
  const itemRows = items.map(item => `
    <tr>
      <td style="padding:12px 8px;border-bottom:1px solid #30363d;">
        <table cellpadding="0" cellspacing="0" width="100%"><tr>
          <td width="60" style="vertical-align:top;">
            <img src="${item.image || 'https://placehold.co/60x60/1a1a2e/fff?text=FG'}" alt="${item.name}" width="56" height="56" style="border-radius:10px;object-fit:cover;border:1px solid #30363d;" />
          </td>
          <td style="padding-left:12px;vertical-align:top;">
            <p style="margin:0 0 4px 0;font-weight:600;color:#fff;font-size:14px;">${item.name}</p>
            <p style="margin:0;color:#8b949e;font-size:12px;">Qty: ${item.quantity}</p>
          </td>
        </tr></table>
      </td>
    </tr>
  `).join('');

  const refundMessage = refundStatus === 'Pending' 
    ? `Your refund will be processed to your original payment method within <strong style="color:#ef4444;">5-7 business days</strong>.`
    : `No payment was charged for this Cash on Delivery order.`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="width:100%;background-color:#0d1117;padding:30px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#161b22;margin:0 auto;max-width:600px;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.5);border:1px solid #30363d;overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#6366f1,#a855f7,#ec4899);padding:24px 20px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;letter-spacing:2px;">FANCY GARMENTS</h1>
      </td></tr>
      <tr><td style="padding:30px 30px 10px 30px;text-align:center;">
        <div style="width:60px;height:60px;border-radius:50%;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);margin:0 auto 16px auto;line-height:60px;font-size:30px;color:#ef4444;">✕</div>
        <h2 style="color:#fff;margin:0 0 6px 0;font-size:22px;">Order Cancelled</h2>
        <p style="color:#8b949e;margin:0;font-size:14px;">Your order has been successfully cancelled.</p>
      </td></tr>
      <tr><td style="padding:20px 30px 0 30px;">
        <p style="color:#c9d1d9;font-size:15px;line-height:1.6;margin:0;">
          Hi <strong style="color:#fff;">${customerName}</strong> 👋,<br>
          We've cancelled your order as requested. We hope to see you shopping with us again soon!
        </p>
      </td></tr>
      <tr><td style="padding:20px 30px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.2);border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:14px 16px;border-bottom:1px solid rgba(239,68,68,0.1);">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td><span style="color:#8b949e;font-size:12px;">ORDER ID</span><br><strong style="color:#fff;font-size:14px;font-family:monospace;">${orderId}</strong></td>
                <td style="text-align:right;"><span style="color:#8b949e;font-size:12px;">PAYMENT METHOD</span><br><strong style="color:#fff;font-size:14px;">${paymentMethod}</strong></td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 16px;">
              <p style="color:#c9d1d9;font-size:13px;line-height:1.5;margin:0;">
                <strong style="color:#ef4444;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Refund Status</strong><br>
                ${refundMessage}
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 30px;">
        <p style="color:#fff;font-size:14px;font-weight:700;margin:0 0 10px 0;text-transform:uppercase;letter-spacing:1px;">🛍️ Cancelled Items</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #30363d;border-radius:10px;overflow:hidden;">
          ${itemRows}
        </table>
      </td></tr>
      <tr><td style="padding:25px 30px;text-align:center;">
        <a href="${frontendUrl || 'http://localhost:5173'}/collection" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;text-decoration:none;padding:13px 32px;border-radius:10px;font-weight:700;font-size:14px;letter-spacing:0.5px;">Continue Shopping</a>
      </td></tr>
      <tr><td style="padding:0 30px 20px 30px;text-align:center;">
        <div style="background:rgba(255,255,255,0.03);border:1px solid #30363d;border-radius:10px;padding:14px;">
          <p style="color:#8b949e;font-size:12px;margin:0;">Need help? Contact us at<br><a href="mailto:fancygarment98@gmail.com" style="color:#a855f7;text-decoration:none;font-weight:600;">fancygarment98@gmail.com</a></p>
        </div>
      </td></tr>
      <tr><td style="padding:16px 20px;text-align:center;font-size:11px;color:#8b949e;border-top:1px solid #30363d;">&copy; 2026 Fancy Garments. All rights reserved.</td></tr>
    </table>
  </div>
</body>
</html>
  `;
};
