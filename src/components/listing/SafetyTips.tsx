'use client';

import { Shield } from 'lucide-react';

export default function SafetyTips() {
  const safetyTips = [
    'Întâlnește-te în locuri publice și sigure',
    'Nu trimite bani în avans sau prin transfer',
    'Verifică produsul înainte de plată',
    'Folosește metode de plată sigure',
    'Fii atent la ofertele prea bune',
    'Raportează anunțurile suspecte'
  ];

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
          <Shield className="h-4 w-4 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-yellow-800">
          Sfaturi pentru siguranță
        </h3>
      </div>
      
      <ul className="space-y-3">
        {safetyTips.map((tip, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-yellow-700">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-6 pt-4 border-t border-yellow-200">
        <p className="text-xs text-yellow-600 text-center">
          Ai Nostri nu este responsabil pentru tranzacțiile între utilizatori
        </p>
      </div>
    </div>
  );
}
