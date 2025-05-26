import { Utensils, MapPin } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'w-8 h-8' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 text-green-600">
        <Utensils className="w-full h-full" />
      </div>
      <div className="absolute inset-0 transform translate-x-1/4 translate-y-1/4 text-orange-500">
        <MapPin className="w-3/4 h-3/4" />
      </div>
    </div>
  );
};

export default Logo;