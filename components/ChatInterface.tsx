import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, MessageSender } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (messageText: string) => void;
  isAvatarTyping: boolean;
  chatTitle: string; 
  isInputDisabled?: boolean;
  perfectionAchieved?: boolean;
  isVoiceActive?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isAvatarTyping, chatTitle, isInputDisabled, perfectionAchieved, isVoiceActive }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isInputDisabled && !isVoiceActive) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const getPlaceholder = () => {
    if (isVoiceActive) return "Voice session is active...";
    if (isInputDisabled) return "Symposium in progress. Pause to message.";
    return `Message ${chatTitle}...`;
  }

  return (
    <div className="mt-6 p-4 border border-slate-700 rounded-md bg-slate-900/50 max-h-[500px] flex flex-col">
      <h3 className="text-lg font-semibold text-purple-300 mb-3 sticky top-0 bg-slate-900/50 py-2 z-10">
        {chatTitle}
      </h3>
      <div className="flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700 mb-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === MessageSender.User ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[70%] p-3 rounded-xl shadow ${
                msg.sender === MessageSender.User
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : msg.sender === MessageSender.Avatar 
                  ? 'bg-purple-700 text-white rounded-bl-none'
                  : 'bg-slate-600 text-slate-300 text-sm italic w-full text-center' 
              }`}
              aria-live={msg.sender === MessageSender.Avatar ? "polite" : undefined}
              aria-atomic={msg.sender === MessageSender.Avatar ? "true" : undefined}
            >
              {msg.imageContext && (
                <div className="mb-2">
                  <p className="text-xs italic opacity-80 text-left">Image context:</p>
                  <img src={msg.imageContext.dataUrl} alt={msg.imageContext.name} className="mt-1 rounded-lg max-w-xs max-h-48 object-contain border border-slate-400/50 bg-black/20" />
                </div>
              )}
              {msg.codeContext && (
                <div className="mb-2 text-left">
                  <p className="text-xs italic opacity-80">Code context:</p>
                  <pre className="mt-1 p-2 bg-slate-900/50 rounded-md text-sm overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                    <code>{msg.codeContext}</code>
                  </pre>
                </div>
              )}
              {msg.urlContext && (
                <div className="mb-2 text-left">
                  <p className="text-xs italic opacity-80">Web context:</p>
                  <a href={msg.urlContext} target="_blank" rel="noopener noreferrer" className="mt-1 p-2 bg-slate-900/50 rounded-md text-sm block truncate text-cyan-400 hover:underline">
                    {msg.urlContext}
                  </a>
                </div>
              )}

              <p className="whitespace-pre-wrap text-left">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === MessageSender.User ? 'text-blue-200' : msg.sender === MessageSender.Avatar ? 'text-purple-200' : 'text-slate-400'} opacity-70`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isAvatarTyping && (
          <div className="flex justify-start">
            <div className="max-w-[70%] p-3 rounded-lg shadow bg-slate-600 text-slate-300 italic rounded-bl-none">
              <p className="animate-pulse">{chatTitle} is formulating a response...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {perfectionAchieved ? (
        <div className="mt-auto border-t border-slate-700 pt-3 text-center">
            <p className="text-yellow-300 font-semibold italic">Communication Perfected. No further input required.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 mt-auto border-t border-slate-700 pt-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={getPlaceholder()}
            className="flex-grow p-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-100 placeholder-gray-400 disabled:opacity-60"
            aria-label={`Message to ${chatTitle}`}
            disabled={isInputDisabled || isAvatarTyping || isVoiceActive}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isAvatarTyping || isInputDisabled || isVoiceActive}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
};