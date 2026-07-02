import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, ShieldCheck } from 'lucide-react';

export default function MessagesView({ conversations, onSendMessage }) {
  const [activeConvId, setActiveConvId] = useState(conversations[0]?.id || null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeConvId);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(activeConvId, inputText);
    setInputText('');

    // Mock an automatic investor response after 1.5s
    setTimeout(() => {
      let replyText = "Understood. Our team is discussing deployment options and will send the details soon.";
      if (inputText.toLowerCase().includes('call') || inputText.toLowerCase().includes('schedule')) {
        replyText = "Great. I just sent a calendar invitation to your verified email for tomorrow at 2:00 PM UTC.";
      } else if (inputText.toLowerCase().includes('drawdown') || inputText.toLowerCase().includes('risk')) {
        replyText = "Yes, your 4.1% max drawdown is very impressive. Institutional compliance requires it stays below 5.0%.";
      }
      onSendMessage(activeConvId, replyText, 'investor');
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl shadow-sm overflow-hidden flex h-[600px] text-sm">
      
      {/* Sidebar Channels List */}
      <div className="w-1/3 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-bold text-base">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-900/60">
          {conversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-all ${
                  isActive ? 'bg-blue-500/5 dark:bg-zinc-900 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-xl p-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md">
                      {conv.partnerLogo}
                    </span>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-50 truncate w-32">{conv.partnerName}</p>
                      <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Verified Allocator</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">{conv.timestamp}</span>
                </div>
                <p className="text-xs text-zinc-500 truncate mt-2 leading-relaxed">
                  {conv.messages[conv.messages.length - 1]?.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="flex-1 flex flex-col justify-between">
        {activeConv ? (
          <>
            {/* Header info */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl p-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                  {activeConv.partnerLogo}
                </span>
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50">{activeConv.partnerName}</h3>
                  <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Chat Channels
              </div>
            </div>

            {/* Messages bubbles scroll area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-50/30 dark:bg-[#0c0c0f]">
              {activeConv.messages.map((m, index) => {
                const isSelf = m.sender === 'trader';
                return (
                  <div key={index} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm leading-relaxed ${
                      isSelf 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-bl-none border border-zinc-200 dark:border-zinc-800'
                    }`}>
                      <p className="text-xs">{m.text}</p>
                      <span className="block text-[8px] text-right mt-1.5 opacity-60 font-mono">{m.time || 'Just now'}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input footer */}
            <form onSubmit={handleSend} className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
              <input
                type="text"
                placeholder="Type your message here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-zinc-950 dark:text-zinc-100"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-zinc-500 space-y-2">
            <MessageSquare className="w-10 h-10 text-zinc-400" />
            <p>Select a conversation to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}
