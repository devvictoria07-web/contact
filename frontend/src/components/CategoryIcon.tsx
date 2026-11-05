import React from 'react';
import {
  Utensils,
  HeartPulse,
  Hammer,
  Briefcase,
  Hotel,
  Car,
  ShoppingCart,
  Laptop,
  GraduationCap,
  Scissors,
  Store,
  Building,
  Wrench,
  Coffee,
} from 'lucide-react';

interface CategoryIconProps {
  name?: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name?.toLowerCase()) {
    case 'utensils':
    case 'restaurante':
    case 'restaurantes y cafeterías':
      return <Utensils className={className} />;
    case 'heartpulse':
    case 'farmacia':
    case 'salud':
    case 'farmacias y salud':
      return <HeartPulse className={className} />;
    case 'hammer':
    case 'construccion':
    case 'ferreterías y construcción':
      return <Hammer className={className} />;
    case 'briefcase':
    case 'servicios profesionales':
      return <Briefcase className={className} />;
    case 'hotel':
    case 'hoteles y turismo':
      return <Hotel className={className} />;
    case 'car':
    case 'talleres y automotriz':
      return <Car className={className} />;
    case 'shoppingcart':
    case 'supermercados y abarrotes':
      return <ShoppingCart className={className} />;
    case 'laptop':
    case 'tecnología y computación':
      return <Laptop className={className} />;
    case 'graduationcap':
    case 'educación y academias':
      return <GraduationCap className={className} />;
    case 'scissors':
    case 'belleza y cuidado personal':
      return <Scissors className={className} />;
    case 'wrench':
      return <Wrench className={className} />;
    case 'coffee':
      return <Coffee className={className} />;
    case 'building':
      return <Building className={className} />;
    case 'store':
      return <Store className={className} />;
    default:
      return <Briefcase className={className} />;
  }
};
