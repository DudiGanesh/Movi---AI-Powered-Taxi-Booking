
import React, { useState, useRef, useEffect } from 'react';
import { getSupportResponse } from '../services/geminiService';
import LoadingSpinner from './common/LoadingSpinner';

interface SupportModalProps {
  onClose: () => void;
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const SupportModal: React.FC<SupportModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botResponse = await getSupportResponse(input);
    const botMessage: Message = { text: botResponse, sender: 'bot' };
    
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg flex flex-col h-[70vh] border border-gray-700">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-cyan-400">Movi Support</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </header>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-gray-700 text-gray-200 px-4 py-2 rounded-xl inline-flex items-center">
                    <LoadingSpinner className="h-4 w-4 mr-2" /> Typing...
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-400 disabled:bg-gray-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
