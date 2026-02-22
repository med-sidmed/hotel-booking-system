import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip, 
  Smile,
  Circle,
  Plus,
  Users
} from 'lucide-react';
import { useMessages } from '../../context/MessageContext';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../api/booking.service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function MessagesView() {
  const { user } = useAuth();
  const { conversations, activeConversation, setActiveConversation, sendMessage, getMessages } = useMessages();
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatList, setShowNewChatList] = useState(false);
  const [guests, setGuests] = useState<{ id: string | number, name: string, hotelId: string | number }[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(false);
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = location.state as { startWith?: { id: string | number; name: string; hotelId: string | number } };
    if (state?.startWith && user) {
      const existing = conversations.find(c => 
        c.participants.some(p => p.id === state.startWith?.id) && 
        c.hotelId === state.startWith?.hotelId
      );
      if (existing) {
        setActiveConversation(existing);
      } else {
        // Create a temporary "pending" conversation to show in UI
        setActiveConversation({
          id: 'NEW',
          participants: [
            { id: user.id, name: user.name, role: user.role },
            { id: state.startWith.id, name: state.startWith.name, role: user.role === 'OWNER' ? 'USER' : 'OWNER' }
          ],
          unreadCount: 0,
          hotelId: state.startWith.hotelId
        });
      }
    }
  }, [location.state, conversations, user, setActiveConversation]);

  useEffect(() => {
    if (user?.role === 'OWNER') {
      const fetchGuests = async () => {
        setIsLoadingGuests(true);
        try {
          const bookings = await bookingService.getOwnerBookings();
          // Extract unique guests
          const uniqueGuests = Array.from(new Set(bookings.map(b => b.user))).map(userId => {
            const booking = bookings.find(b => b.user === userId);
            return {
              id: userId as string | number,
              name: booking?.guest_name || 'Client',
              hotelId: booking?.hotelId || (booking as any)?.hotel || ''
            };
          });
          setGuests(uniqueGuests);
        } catch (err) {
          console.error('Failed to fetch guests:', err);
        } finally {
          setIsLoadingGuests(false);
        }
      };
      fetchGuests();
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation, getMessages(activeConversation?.id || '')]);

  if (!user) return null;

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => p.id !== user.id);
    return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    const otherPartner = activeConversation.participants.find(p => p.id !== user.id);
    if (otherPartner) {
        const receiverId = otherPartner.id;
        const hotelId = activeConversation.hotelId;
        sendMessage(receiverId, messageText, hotelId);
        setMessageText('');
    }
  };

  const activeMessages = activeConversation ? getMessages(activeConversation.id) : [];

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white dark:bg-[#121212] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Sidebar - Conversation List */}
      <div className="w-80 border-r dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-[#1A1A1A]">
        <div className="p-4 border-b dark:border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold dark:text-white">Conversations</h2>
            {user.role === 'OWNER' && (
              <button 
                onClick={() => setShowNewChatList(!showNewChatList)}
                className={`p-1.5 rounded-lg transition-colors ${
                  showNewChatList ? 'bg-[#C6A87C] text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title="Nouvelle discussion"
              >
                <Plus size={18} />
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-[#C6A87C] text-sm dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {showNewChatList && user.role === 'OWNER' ? (
            <div className="py-2">
              <div className="px-4 py-2 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Users size={12} />
                Vos Clients
              </div>
              {isLoadingGuests ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500">Chargement...</div>
              ) : guests.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500">Aucun client trouvé</div>
              ) : (
                guests.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(guest => (
                  <button
                    key={guest.id}
                    onClick={() => {
                      setActiveConversation({
                        id: 'NEW',
                        participants: [
                          { id: user.id, name: user.name, role: user.role },
                          { id: guest.id, name: guest.name, role: 'USER' }
                        ],
                        unreadCount: 0,
                        hotelId: guest.hotelId
                      });
                      setShowNewChatList(false);
                    }}
                    className="w-full p-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <img 
                      src={`https://ui-avatars.com/api/?name=${guest.name}&background=C6A87C&color=fff`} 
                      alt={guest.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="text-left truncate">
                      <div className="font-bold text-sm dark:text-white truncate">{guest.name}</div>
                      <div className="text-xs text-gray-400 truncate">Client</div>
                    </div>
                  </button>
                ))
              )}
              <div className="mt-2 border-t dark:border-gray-800 pt-2">
                <button 
                  onClick={() => setShowNewChatList(false)}
                  className="w-full px-4 py-2 text-xs text-[#C6A87C] hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-center font-bold"
                >
                  Retour aux discussions
                </button>
              </div>
            </div>
          ) : (
            filteredConversations.map((conv) => {
            const other = conv.participants.find(p => p.id !== user.id);
            const isActive = activeConversation?.id === conv.id;
            
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv)}
                className={`w-full p-4 flex items-center gap-3 transition-colors ${
                  isActive 
                    ? 'bg-white dark:bg-gray-800 shadow-sm border-l-4 border-l-[#C6A87C]' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className="relative">
                  <img 
                    src={other?.avatar || `https://ui-avatars.com/api/?name=${other?.name}`} 
                    alt={other?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700"
                  />
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C6A87C] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm dark:text-white truncate">{other?.name}</h3>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-gray-400">
                        {format(new Date(conv.lastMessage.timestamp), 'HH:mm', { locale: fr })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {conv.lastMessage?.content || "Démarrer une conversation"}
                  </p>
                </div>
              </button>
            );
          })
        )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#121212]">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <img 
                  src={activeConversation.participants.find(p => p.id !== user.id)?.avatar || `https://ui-avatars.com/api/?name=${activeConversation.participants.find(p => p.id !== user.id)?.name}`} 
                  alt="Active chat"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold dark:text-white">
                    {activeConversation.participants.find(p => p.id !== user.id)?.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <Circle className="text-green-500 fill-green-500" size={8} />
                    <span className="text-xs text-gray-400 font-medium">En ligne</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-[#C6A87C] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Phone size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-[#C6A87C] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Video size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-[#C6A87C] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 dark:bg-[#121212]">
              {activeMessages.map((msg) => {
                const isMine = msg.senderId === user.id;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] group ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                        isMine 
                          ? 'bg-[#C6A87C] text-white rounded-tr-none' 
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {format(new Date(msg.timestamp), 'HH:mm', { locale: fr })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-[#1A1A1A]">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button type="button" className="p-2 text-gray-400 hover:text-[#C6A87C] rounded-lg">
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Écrivez votre message..."
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#C6A87C] text-sm dark:text-white outline-none"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C6A87C]">
                    <Smile size={20} />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-3 bg-[#C6A87C] text-white rounded-xl hover:bg-[#B5966A] transition-all shadow-lg shadow-[#C6A87C]/20 disabled:opacity-50 disabled:scale-100 active:scale-95"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 dark:bg-[#121212]">
            <div className="w-20 h-20 bg-[#C6A87C]/10 rounded-full flex items-center justify-center text-[#C6A87C] mb-4">
              <Send size={40} />
            </div>
            <h3 className="text-xl font-bold dark:text-white mb-2">Vos Messages</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Sélectionnez une conversation pour commencer à discuter ou posez une question sur une chambre spécifique.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
