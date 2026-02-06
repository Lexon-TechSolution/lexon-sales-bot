
import React, { useState, useRef, useEffect } from 'react';
import { Message, Product } from '../types';
import { getSalesResponse } from '../services/gemini';

interface ChatInterfaceProps {
  inventory: Product[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ inventory }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Habari! Karibu Lexon Store. Mimi ni msaidizi wa AI. Unatafuta bidhaa gani leo?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const aiResponseText = await getSalesResponse(input, inventory, history);

    const botMsg: Message = {
      role: 'model',
      text: aiResponseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#e5ddd5] rounded-lg shadow-xl overflow-hidden border border-gray-300">
      {/* Header */}
      <div className="bg-[#075e54] text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">L</div>
        <div>
          <h3 className="font-bold">Lexon AI Support</h3>
          <p className="text-xs text-green-200">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar"
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] px-3 py-2 rounded-lg shadow-sm text-sm relative ${
                msg.role === 'user' 
                  ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none'
              }`}
            >
              {msg.text}
              <div className="text-[10px] text-gray-500 mt-1 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-xs text-gray-500 italic">
              Bot inafikiri...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-[#f0f0f0] p-3 flex gap-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Andika ujumbe..."
          className="flex-1 bg-white border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#075e54]"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-[#075e54] text-white p-2 rounded-full hover:bg-[#128c7e] transition-colors disabled:opacity-50"
        >
          <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
