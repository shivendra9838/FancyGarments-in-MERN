import React, { useState, useRef, useEffect } from 'react';
import { assets } from '../assets/assets';
import ishaan from '../assets/ishaan.jpg';
import axios from 'axios';

// Environment variables
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL;
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL;

export default function ChatBot() {
  const [selectedAgent] = useState({
    name: 'Ishaan',
    avatar: ishaan,
    status: 'Available now',
    online: true
  });
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  // Clickable HTML snippets
  const clickableLocation = `<a href="https://maps.google.com/?q=The Souled Store, Civil Line, Prayagraj, 211001" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">📍 The Souled Store<br/>Civil Line, Prayagraj, 211001</a>`;
  const clickablePhone = `<a href="tel:+918318407559" class="text-blue-600 underline">📞 +91 8318407559</a>`;
  const clickableEmail1 = `<a href="mailto:support@fancygarments.com" class="text-blue-600 underline">📧 support@fancygarments.com</a>`;
  const clickableEmail2 = `<a href="mailto:Anupampatel21661@gmail.com" class="text-blue-600 underline">📧 Anupampatel21661@gmail.com</a>`;
  const workingHours = `🕒 Working Hours:<br/>Mon–Fri: 10:00 AM – 8:00 PM<br/>Sat: 10:00 AM – 6:00 PM<br/>Sun: Closed`;

  const handleOpenChat = () => {
    setShowModal(true);
    setMessages([{ sender: 'bot', text: `Hi! I'm ${selectedAgent.name}, your Fancy Garments assistant. How can I help?` }]);
  };

  const addBotMessage = (text, html = false) => {
    setMessages(prev => [...prev, html ? { sender: 'bot', text, html: true } : { sender: 'bot', text }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const lowerInput = input.toLowerCase();
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Instant local responses

    // CEO
    if (/(ceo|boss|leader|head|leadership|managing director)/.test(lowerInput)) {
      addBotMessage('Our company CEOs are Shivendra Tiwari and Ishaan Khullar.');
      return;
    }

    // Founder
    if (/(founder|founded|owner|creator|started by)/.test(lowerInput)) {
      addBotMessage('Our founder is Shivendra Tiwari.');
      return;
    }

    // Location
    if (/(location|address|where is your shop|store location|where are you located|shop address)/.test(lowerInput)) {
      addBotMessage(clickableLocation, true);
      return;
    }

    // Phone
    if (/(phone|mobile|call|contact number|telephone)/.test(lowerInput)) {
      addBotMessage(clickablePhone, true);
      return;
    }

    // Email
    if (/(email|mail|contact email|support email)/.test(lowerInput)) {
      addBotMessage(`${clickableEmail1}<br/>${clickableEmail2}`, true);
      return;
    }

    // Working Hours
    if (/(hours|opening|closing|working time|timing|when are you open)/.test(lowerInput)) {
      addBotMessage(workingHours, true);
      return;
    }

    // Full Contact Info
    if (/(contact|get in touch|reach you|contact info|contact details|customer service|support)/.test(lowerInput)) {
      addBotMessage(
        `${clickableLocation}<br/><br/>${clickablePhone}<br/>${clickableEmail1}<br/>${clickableEmail2}<br/><br/>${workingHours}`,
        true
      );
      return;
    }

    // Otherwise API call
    try {
      const res = await axios.post(
        GROQ_API_URL,
        {
          model: GROQ_MODEL,
          messages: [
            {
              role: 'system',
              content: `
                You are Ishaan, the helpful AI assistant for Fancy Garments online clothing store.
                You must ONLY answer questions related to Fancy Garments — such as:
                - Our products, categories, sizes, prices, stock
                - Shipping, delivery, return, and exchange policies
                - Payment options, order tracking
                - Store location, contact info, working hours
                - Company leadership (CEO, founder)
                If the user asks about anything unrelated to Fancy Garments,
                politely say: "I'm here to help you with Fancy Garments related questions only."
              `
            },
            ...messages.map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
            { role: 'user', content: input }
          ],
          temperature: 0.5,
          max_tokens: 512,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
        }
      );

      const botText = res.data.choices[0].message.content;
      addBotMessage(botText);
    } catch (err) {
      addBotMessage('❌ Sorry, something went wrong. Please try again later.');
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center w-16 h-16 text-2xl animate-bounce"
        title="Chat with Chatbot"
      >
        <img src={assets.chatbot} alt="Chatbot" className="w-10 h-10 object-contain" />
      </button>

      {/* Chat Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={assets.chatbot}
                alt="Chatbot"
                className="w-12 h-12 rounded-full border-2 border-blue-500 bg-white object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold">{selectedAgent.name}</h4>
                <p className="text-sm text-gray-500">{selectedAgent.status}</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="h-64 overflow-y-auto bg-gray-100 rounded-lg p-3 space-y-2 mb-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.html ? (
                    <div
                      className={`px-4 py-2 rounded-lg max-w-xs ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-800'
                      }`}
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  ) : (
                    <div
                      className={`px-4 py-2 rounded-lg max-w-xs ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
