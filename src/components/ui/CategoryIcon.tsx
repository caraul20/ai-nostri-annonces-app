'use client';

import { 
  Home, 
  Building2, 
  House, 
  Car, 
  CarFront, 
  Bike, 
  Smartphone, 
  Phone, 
  Laptop, 
  TreePine, 
  Armchair, 
  Shirt, 
  Dumbbell, 
  Trophy,
  LucideIcon
} from 'lucide-react';

// Maparea iconițelor pentru categorii și subcategorii
const ICON_MAP: { [key: string]: LucideIcon } = {
  // Categorii principale
  'imobiliare': Home,
  'vehicule': Car,
  'electronice': Smartphone,
  'casa-gradina': TreePine,
  'moda': Shirt,
  'sport': Dumbbell,
  
  // Subcategorii Imobiliare
  'apartamente-vanzare': Building2,
  'apartamente-inchiriere': Building2,
  'case-vanzare': House,
  'case-inchiriere': House,
  'terenuri': TreePine,
  'spatii-comerciale': Building2,
  
  // Subcategorii Vehicule
  'masini': CarFront,
  'motociclete': Bike,
  'biciclete': Bike,
  'piese-auto': Car,
  'camioane': Car,
  
  // Subcategorii Electronice
  'telefoane': Phone,
  'laptopuri': Laptop,
  'tv-audio': Smartphone,
  'console-jocuri': Smartphone,
  'camere-foto': Smartphone,
  
  // Subcategorii Casă & Grădină
  'mobilier': Armchair,
  'decoratiuni': Home,
  'unelte-gradina': TreePine,
  'electrocasnice': Home,
  
  // Subcategorii Modă
  'haine-femei': Shirt,
  'haine-barbati': Shirt,
  'haine-copii': Shirt,
  'incaltaminte': Shirt,
  'accesorii': Shirt,
  
  // Subcategorii Sport
  'echipamente-fitness': Dumbbell,
  'echipamente-fotbal': Trophy,
  'echipamente-tenis': Trophy,
  'biciclete-sport': Bike,
  'echipamente-iarna': Trophy
};

interface CategoryIconProps {
  iconKey: string;
  className?: string;
  size?: number;
}

export default function CategoryIcon({ iconKey, className = '', size = 24 }: CategoryIconProps) {
  const IconComponent = ICON_MAP[iconKey] || Home; // Fallback la Home dacă nu găsește iconița
  
  return (
    <IconComponent 
      size={size} 
      className={`text-gray-600 ${className}`}
    />
  );
}
