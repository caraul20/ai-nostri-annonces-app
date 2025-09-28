import { MessageCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChatWithDetails } from '@/server/repo/messages';

interface ChatInboxProps {
  chats: ChatWithDetails[];
}

export default function ChatInbox({ chats }: ChatInboxProps) {
  const router = useRouter();
  
  const handleChatClick = (chatId: string) => {
    // Navigate to messages page with selected chat
    router.push(`/messages?chat=${chatId}`);
  };
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Acum';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}z`;
    return date.toLocaleDateString('ro-RO');
  };

  if (chats.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="h-8 w-8 text-gray-400" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Niciun mesaj încă
        </h3>
        <p className="text-gray-600">
          Conversațiile tale vor apărea aici când cineva îți va scrie.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Mesaje ({chats.length})
        </h2>
        <button
          onClick={() => router.push('/messages')}
          className="btn-secondary text-sm"
        >
          Vezi toate
        </button>
      </div>

      <div className="space-y-3">
        {chats.filter(chat => chat.id).map((chat) => (
          <div 
            key={chat.id}
            onClick={() => handleChatClick(chat.id!)}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
            role="button"
            tabIndex={0}
            aria-label={`Conversație cu ${chat.otherUser.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleChatClick(chat.id!);
              }
            }}
          >
            {/* Avatar */}
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              {chat.otherUser.photoURL ? (
                <img 
                  src={chat.otherUser.photoURL} 
                  alt={chat.otherUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-gray-400" aria-hidden="true" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 truncate">
                  {chat.otherUser.name}
                </h3>
                <div className="flex items-center space-x-2">
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(chat.lastMessage.timestamp)}
                    </span>
                  )}
                  {chat.unreadCount > 0 && (
                    <span 
                      className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center"
                      aria-label={`${chat.unreadCount} mesaje necitite`}
                    >
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {chat.lastMessage?.text || 'Fără mesaje'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* TODO: Add pagination if more than 20 chats */}
      {chats.length >= 20 && (
        <div className="mt-6 text-center">
          <button className="btn-secondary">
            Încarcă mai multe conversații
          </button>
        </div>
      )}
    </div>
  );
}
