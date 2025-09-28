'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, ArrowLeft, Send, User, Search } from 'lucide-react';
import { useChatInbox } from '@/hooks/useChatInbox';
import Link from 'next/link';

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { chats, unreadTotal } = useChatInbox(user?.id);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Acum';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}z`;
    return date.toLocaleDateString('ro-RO');
  };

  const filteredChats = chats.filter(chat =>
    chat.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    // TODO: Implement real message sending
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/account">
                <button className="p-2 hover:bg-gray-100 rounded-lg lg:hidden">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Mesaje
                  {unreadTotal > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadTotal}
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-600">
                  Conversațiile tale cu ceilalți utilizatori
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List */}
          <div className={`bg-white rounded-2xl border overflow-hidden ${selectedChat ? 'hidden lg:block' : ''}`}>
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Caută conversații..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="overflow-y-auto h-full">
              {filteredChats.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm ? 'Niciun rezultat' : 'Niciun mesaj încă'}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm 
                      ? 'Încearcă un alt termen de căutare'
                      : 'Conversațiile tale vor apărea aici'
                    }
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        selectedChat === chat.id ? 'bg-green-50 border-r-2 border-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {chat.otherUser.photoURL ? (
                            <img 
                              src={chat.otherUser.photoURL} 
                              alt={chat.otherUser.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-gray-900 truncate">
                              {chat.otherUser.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(chat.lastMessage.timestamp)}
                              </span>
                              {chat.unreadCount > 0 && (
                                <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                  {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {chat.lastMessage.text}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className={`lg:col-span-2 bg-white rounded-2xl border overflow-hidden flex flex-col ${!selectedChat ? 'hidden lg:flex' : ''}`}>
            {selectedChatData ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {selectedChatData.otherUser.photoURL ? (
                        <img 
                          src={selectedChatData.otherUser.photoURL} 
                          alt={selectedChatData.otherUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {selectedChatData.otherUser.name}
                      </h3>
                      <p className="text-sm text-gray-500">Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    {/* Sample messages */}
                    <div className="flex justify-start">
                      <div className="max-w-xs lg:max-w-md">
                        <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                          <p className="text-sm">{selectedChatData.lastMessage.text}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-2">
                          {formatTimeAgo(selectedChatData.lastMessage.timestamp)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="max-w-xs lg:max-w-md">
                        <div className="bg-green-600 text-white rounded-2xl px-4 py-2">
                          <p className="text-sm">Mulțumesc pentru informații!</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-2 text-right">
                          Acum
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-white">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Scrie un mesaj..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="btn-primary px-4 py-2 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Selectează o conversație
                  </h3>
                  <p className="text-gray-600">
                    Alege o conversație din lista din stânga pentru a începe să scrii
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
