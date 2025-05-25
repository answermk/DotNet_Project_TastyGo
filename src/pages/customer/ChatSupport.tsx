import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
};

const ChatSupport: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: 'Hello! Welcome to TastyGo support. How can I help you today?',
      sender: 'agent',
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    
    document.title = 'Chat Support | TastyGo';
  }, []);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    // Simulate agent response
    setTimeout(() => {
      const responses = [
        "Thank you for your message. I'll check that for you right away.",
        "I understand your concern. Let me help you with that.",
        "Thanks for reaching out. Our team is working on your issue.",
        "I appreciate your patience. Your order status will be updated soon.",
        "We value your feedback. I'll make sure this is addressed properly."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-orange-600 text-white">
            <h1 className="text-xl font-bold">Customer Support</h1>
            <p className="text-orange-100 text-sm">We're here to help with your orders and questions</p>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${
                    message.sender === 'user'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 text-right ${
                    message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="mb-4 flex justify-start">
                <div className="rounded-lg px-4 py-2 bg-white border border-gray-200 text-gray-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-end">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                <Paperclip className="h-5 w-5" />
              </button>
              <div className="flex-grow mx-2">
                <textarea
                  className="w-full border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 p-2 resize-none"
                  placeholder="Type your message..."
                  rows={2}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button
                className="p-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={handleSendMessage}
                disabled={newMessage.trim() === ''}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-center">
              Our support team typically responds within 10 minutes during business hours (8 AM - 10 PM).
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">How long does delivery usually take?</h3>
              <p className="mt-1 text-gray-600 text-sm">Delivery times vary by restaurant and location, but typically range from 30-60 minutes. You can see the estimated delivery time for each restaurant before ordering.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">What if my order is late?</h3>
              <p className="mt-1 text-gray-600 text-sm">If your order is significantly delayed, please contact our support team. We'll check with the restaurant and delivery partner and may offer compensation for the inconvenience.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Can I change or cancel my order?</h3>
              <p className="mt-1 text-gray-600 text-sm">You can cancel your order if it hasn't been confirmed by the restaurant yet. Once confirmed, changes or cancellations may not be possible. Please contact support immediately for assistance.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">How do I report an issue with my order?</h3>
              <p className="mt-1 text-gray-600 text-sm">You can report an issue through the chat support or from your order history page. Select the order with the issue and follow the prompts to report a problem.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;