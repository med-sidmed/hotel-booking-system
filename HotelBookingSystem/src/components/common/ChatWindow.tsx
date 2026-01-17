import React, { useState } from 'react';
import { MessageSquare, Send, X, Minus, Maximize2 } from 'lucide-react';
import type { Message, Conversation } from '../../types';
import { useMessages } from '../../context/MessageContext';
import { useAuth } from '../../context/AuthContext';

export function ChatWindow() {
  const { activeConversation, setActiveConversation, sendMessage, getMessages, conversations } = useMessages();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messageText, setMessageText] = useState('');

  if (!user) return null;

  const messages = activeConversation ? getMessages(activeConversation.id) : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    const receiver = activeConversation.participants.find((p: any) => p.id !== user.id);
    if (receiver) {
      sendMessage(receiver.id, messageText);
      setMessageText('');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#6B5434] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#5B4424] transition-all transform hover:scale-110 active:scale-95 z-50 overflow-visible"
      >
        <MessageSquare size={24} />
        {conversations.some((c: Conversation) => c.unreadCount > 0) && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold">
            !
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-white dark:bg-[#1A1A1A] rounded-xl shadow-2xl z-50 flex flex-col transition-all duration-300 border border-gray-200 dark:border-gray-800 ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
      {/* Header */}
      <div className="p-3 bg-[#6B5434] text-white rounded-t-xl flex items-center justify-between cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <MessageSquare size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold">Conciergerie Luxotel</h3>
            {!isMinimized && <p className="text-[10px] opacity-80">En ligne</p>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1 hover:bg-white/10 rounded">
            {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat List or Messages */}
          {!activeConversation ? (
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vos Conversations</h4>
              {conversations.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <p className="text-sm">Aucune conversation en cours.</p>
                </div>
              ) : (
                conversations.map((conv: Conversation) => {
                  const other = conv.participants.find((p: any) => p.id !== user.id);
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversation(conv)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {other?.avatar ? <img src={other.avatar} alt={other.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white font-bold">{other?.name[0]}</div>}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-bold truncate dark:text-white">{other?.name}</p>
                          <span className="text-[10px] text-gray-400">12:45</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage?.content}</p>
                      </div>
                      {conv.unreadCount > 0 && <div className="w-2 h-2 bg-[#C6A87C] rounded-full"></div>}
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <>
              {/* Back to list */}
              <button 
                onClick={() => setActiveConversation(null)}
                className="px-4 py-2 text-xs font-bold text-[#6B5434] hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-800 flex items-center gap-2"
              >
                ← Retour aux conversations
              </button>

              {/* Message List */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((m: Message) => (
                  <div key={m.id} className={`flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      m.senderId === user.id 
                        ? 'bg-[#6B5434] text-white rounded-br-none' 
                        : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded-bl-none'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-3 border-t dark:border-gray-800 flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-grow bg-gray-100 dark:bg-gray-800 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-[#6B5434] dark:text-white"
                />
                <button type="submit" className="p-2 bg-[#6B5434] text-white rounded-full hover:bg-[#5B4424] transition-colors">
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
}
