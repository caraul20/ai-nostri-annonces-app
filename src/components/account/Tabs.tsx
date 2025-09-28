'use client';

import { useRouter } from 'next/navigation';
import { FileText, MessageCircle, Heart, Settings } from 'lucide-react';

interface TabsProps {
  activeTab: string;
  unreadCount?: number;
}

export default function Tabs({ activeTab, unreadCount = 0 }: TabsProps) {
  const router = useRouter();

  const tabs = [
    {
      id: 'anunturi',
      label: 'Anunțuri',
      icon: FileText
    },
    {
      id: 'mesaje',
      label: 'Mesaje',
      icon: MessageCircle,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      id: 'favorite',
      label: 'Favorite',
      icon: Heart
    },
    {
      id: 'setari',
      label: 'Setări',
      icon: Settings
    }
  ];

  const handleTabChange = (tabId: string) => {
    const url = tabId === 'anunturi' ? '/account' : `/account?tab=${tabId}`;
    router.push(url);
  };

  return (
    <div className="card">
      <div 
        className="flex space-x-1 overflow-x-auto"
        role="tablist"
        aria-label="Navigare cont"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 rounded-xl text-[15px] font-medium 
                min-h-[44px] whitespace-nowrap transition-colors focus-ring
                ${isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span 
                  className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center"
                  aria-label={`${tab.badge} mesaje necitite`}
                >
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
