import { FileText, Eye, MessageCircle, Heart } from 'lucide-react';

interface KpiCardsProps {
  activeCount: number;
  viewsTotal: number;
  messagesTotal: number;
  favoritesCount: number;
}

export default function KpiCards({ 
  activeCount, 
  viewsTotal, 
  messagesTotal, 
  favoritesCount 
}: KpiCardsProps) {
  const kpis = [
    {
      label: 'Anunțuri Active',
      value: activeCount,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Vizualizări',
      value: viewsTotal,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Mesaje',
      value: messagesTotal,
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Favorite',
      value: favoritesCount,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {kpi.value.toLocaleString()}
                </p>
                {/* TODO: Add sparkline chart here */}
              </div>
              <div className={`w-12 h-12 ${kpi.bgColor} rounded-xl flex items-center justify-center`}>
                <Icon className={`h-6 w-6 ${kpi.color}`} aria-hidden="true" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
