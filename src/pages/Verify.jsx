
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

const Verify = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Online");
  
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const method = query.get("method") || "stripe";
    const success = query.get("success"); // only for Stripe
    const orderId = query.get("orderId");

    if (!orderId) {
      setStatus("error");
      return;
    }

    setOrderId(orderId);

    if (method === "cod") {
      // COD does not require verification
      setPaymentMethod("Cash on Delivery");
      setAmount(parseInt(query.get("amount")) || 0);
      setStatus("success");
      return;
    }

    const verify = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/order/verifyStripe`,
          {
            userId: localStorage.getItem("userId"),
            success,
            orderId,
          },
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        if (response.data.success) {
          setStatus("success");
          setAmount(response.data.amount || 0);
          setPaymentMethod("Stripe");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.log("Stripe verification failed:", error);
        toast.error("Verification failed");
        setStatus("error");
      }
    };

    verify();
  }, [location.search, token, backendUrl]);

  const downloadInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Fancy Garments - Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${orderId}`, 20, 40);
    doc.text(`Payment Method: ${paymentMethod}`, 20, 50);
    doc.text(`Amount Paid: ₹${amount.toLocaleString()}`, 20, 60);
    doc.text(`Estimated Delivery: July 14, 2025`, 20, 70);
    doc.text(`Thank you for shopping with us!`, 20, 90);

    doc.save(`Invoice_${orderId}.pdf`);
  };

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold text-gray-600 animate-pulse">
          Verifying payment...
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
          <h1 className="text-3xl font-bold text-green-600 mb-4 text-center">
            🎉 Order Placed Successfully!
          </h1>
          <p className="text-gray-700 text-center mb-6">
            Thank you for your purchase! Your order has been placed successfully.
          </p>

          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <span className="font-semibold">🛒 Order ID:</span> #{orderId}
            </p>
            <p>
              <span className="font-semibold">💳 Payment Method:</span> {paymentMethod}
            </p>
            <p>
              <span className="font-semibold">💰 Amount:</span> ₹{amount.toLocaleString() || "—"}
            </p>
            <p>
              <span className="font-semibold">📦 Estimated Delivery:</span>{" "}
              July 14, 2025
            </p>
          </div>

          <div className="text-gray-600 text-sm mt-4">
            You’ll receive a confirmation email/SMS shortly with all the order
            details. We’ll notify you as soon as your item is shipped.
          </div>

          <div className="text-center mt-6">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>

          <div className="text-center mt-3">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              onClick={downloadInvoice}
            >
              Download Invoice (PDF)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            ❌ Payment Failed
          </h1>
          <p className="text-gray-700">
            Something went wrong with your payment. No money was deducted.
          </p>
          <div className="mt-6">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              onClick={() => navigate("/cart")}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-red-600 text-lg font-semibold">
        Something went wrong. Please try again.
      </p>
    </div>
  );
};

export default Verify;