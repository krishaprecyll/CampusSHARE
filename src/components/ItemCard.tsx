import { Clock } from 'lucide-react';
import { useState } from 'react';

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  condition: string;
  available: boolean;
  rental_fee: number;
  rental_duration_days: number;
  deposit_amount: number;
  owner_id: string;
}

interface ItemCardProps {
  item: Item;
  onRent?: (itemId: string) => void;
}

export default function ItemCard({ item, onRent }: ItemCardProps) {
  const [hovered, setHovered] = useState(false);

  const pesoFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  });

  return (
    <div
      className={`bg-white rounded-2xl shadow-md transition-all duration-300 overflow-hidden group cursor-pointer transform ${
        hovered ? 'hover:-translate-y-1 hover:shadow-2xl' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={item.image_url}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Unavailable Overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-md">
              Currently Rented
            </span>
          </div>
        )}

        {/* Condition Badge */}
        <span className="absolute top-3 right-3 bg-white text-slate-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
          {item.condition}
        </span>
      </div>

      {/* Info Section */}
      <div className="p-5">
        {/* Category */}
        <div className="mb-1">
          <span className="text-xs text-blue-600 font-medium">{item.category}</span>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-1">{item.name}</h3>

        {/* Description */}
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>

        {/* Price & Duration */}
        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <div className="flex items-center text-blue-600 font-bold text-xl">
              <span>{pesoFormatter.format(item.rental_fee)}</span>
            </div>
            <div className="flex items-center text-slate-500 text-xs mt-1">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {item.rental_duration_days} day{item.rental_duration_days !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Rent Button */}
          <button
            disabled={!item.available}
            onClick={() => onRent?.(item.id)}
            aria-label={`Rent ${item.name}`}
            className={`px-5 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
              item.available
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {item.available ? 'Rent Now' : 'Unavailable'}
          </button>
        </div>

        {/* Deposit */}
        {item.deposit_amount > 0 && (
          <div className="mt-3 text-xs text-slate-500">
            Deposit: {pesoFormatter.format(item.deposit_amount)}
          </div>
        )}
      </div>
    </div>
  );
}
