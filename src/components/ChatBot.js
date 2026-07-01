import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, User, Bot, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi there! 👋 I\'m the Got-Stock assistant. I can help you navigate the site, find information about shipping, returns, selling, and more. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Knowledge Base & Navigation Rules
  const processInput = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Navigation / Pages
    if (lowerInput.includes('sell') || lowerInput.includes('vendor') || lowerInput.includes('merchant')) {
      return {
        text: "Interested in selling with us? That's great! You can register as a seller or learn more about our platform.",
        actions: [
          { label: "Become a Seller", link: "/become-seller" },
          { label: "Seller Registration", link: "/seller/register" },
          { label: "Seller Login", link: "/seller-login" }
        ]
      };
    }
    
    if (lowerInput.includes('shop') || lowerInput.includes('buy') || lowerInput.includes('product') || lowerInput.includes('browse')) {
      return {
        text: "You can browse our full collection of products in the Shop.",
        actions: [
          { label: "Go to Shop", link: "/shop" },
          { label: "View Categories", link: "/#categories" } // Approximate
        ]
      };
    }

    // Customer Service
    if (lowerInput.includes('return') || lowerInput.includes('refund') || lowerInput.includes('exchange')) {
      return {
        text: "For information about returns and refunds, please check our policy page.",
        actions: [
          { label: "Returns & Refunds", link: "/returns-refunds" }
        ]
      };
    }

    if (lowerInput.includes('shipping') || lowerInput.includes('delivery') || lowerInput.includes('cost') || lowerInput.includes('ship')) {
      return {
        text: "We offer various shipping options. Free shipping is available on orders over $50!",
        actions: [
          { label: "Shipping Info", link: "/shipping-info" },
          { label: "Track Order", link: "/track-order" }
        ]
      };
    }

    if (lowerInput.includes('track') || lowerInput.includes('order') || lowerInput.includes('status')) {
      return {
        text: "You can track your order status directly on our site.",
        actions: [
          { label: "Track My Order", link: "/track-order" },
          { label: "My Account", link: "/account" }
        ]
      };
    }

    if (lowerInput.includes('contact') || lowerInput.includes('support') || lowerInput.includes('help') || lowerInput.includes('email') || lowerInput.includes('phone')) {
      return {
        text: "Our support team is here to help! You can reach us via our Contact page.",
        actions: [
          { label: "Contact Us", link: "/contact-us" },
          { label: "Help Centre", link: "/help-centre" }
        ]
      };
    }
    
    if (lowerInput.includes('login') || lowerInput.includes('sign in') || lowerInput.includes('account')) {
      return {
        text: "Please select your account type to login:",
        actions: [
          { label: "Customer Login", link: "/customer-login" },
          { label: "Seller Login", link: "/seller-login" },
          { label: "Admin Login", link: "/admin-login" }
        ]
      };
    }

    if (lowerInput.includes('size') || lowerInput.includes('fit') || lowerInput.includes('measure')) {
        return {
            text: "Need help with sizing? Check out our size guide.",
            actions: [
                { label: "Size Guide", link: "/size-guide" }
            ]
        };
    }

    // Fallback
    return {
      text: "I'm not quite sure about that. For detailed inquiries, please visit our Help Centre or Contact Us.",
      actions: [
        { label: "Visit Help Centre", link: "/help-centre" },
        { label: "Contact Support", link: "/contact-us" }
      ]
    };
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate processing delay
    setTimeout(() => {
      const response = processInput(userMessage.text);
      setMessages(prev => [...prev, { type: 'bot', text: response.text, actions: response.actions }]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleActionClick = (link) => {
    navigate(link);
    // Optional: Minimize chat on navigation
    // setIsOpen(false); 
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-b from-[#FF3CFE] to-black hover:opacity-90 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-fade-in-up flex items-center gap-2 group"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap pl-0 group-hover:pl-2 font-semibold">
            Chat with us
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] sm:w-[380px] max-h-[600px] flex flex-col border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-b from-[#FF3CFE] to-black p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Got-Stock Assistant</h3>
                <p className="text-xs text-brand-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full block"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded transition">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            className="flex-1 p-4 overflow-y-auto bg-gray-50 h-[400px]" 
            ref={scrollRef}
          >
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 ${
                    msg.type === 'user' 
                      ? 'bg-brand-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    
                    {/* Action Buttons */}
                    {msg.actions && (
                      <div className="mt-3 flex flex-col gap-2">
                        {msg.actions.map((action, actionIdx) => (
                          <button
                            key={actionIdx}
                            onClick={() => handleActionClick(action.link)}
                            className="flex items-center justify-between w-full text-xs bg-gray-50 hover:bg-brand-50 text-gray-700 hover:text-brand-700 px-3 py-2 rounded-lg border border-gray-200 transition-colors group"
                          >
                            {action.label}
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3 shadow-sm flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 focus-visible:ring-brand-500"
              />
              <Button 
                onClick={handleSend}
                size="icon"
                className="bg-brand-600 hover:bg-brand-700 text-white"
                disabled={!inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Got-Stock Assistant can make mistakes. Contact support for critical issues.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
