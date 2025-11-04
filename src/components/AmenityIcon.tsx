import { Wifi, Wind, Power, Brush, Shirt, UtensilsCrossed, Tv2, ParkingCircle, Dumbbell, ShieldCheck, type LucideProps } from 'lucide-react';

interface AmenityIconProps extends LucideProps {
  name: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  'wifi': Wifi,
  'ac': Wind,
  'power backup': Power,
  'housekeeping': Brush,
  'laundry': Shirt,
  'meals': UtensilsCrossed,
  'common kitchen': UtensilsCrossed,
  'tv': Tv2,
  'parking': ParkingCircle,
  'gym': Dumbbell,
  'security': ShieldCheck,
  'fully furnished': Power, // using Power as a proxy for "fully equipped"
};

export function AmenityIcon({ name, ...props }: AmenityIconProps) {
  const Icon = iconMap[name.toLowerCase()];
  if (!Icon) {
    return null;
  }
  return <Icon {...props} />;
}
