import { Clock } from 'lucide-react';

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
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-slate-900 bg-opacity-60 flex items-center justify-center">
            <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-semibold text-sm">
              Currently Rented
            </span>
          </div>
        )}
        <span className="absolute top-3 right-3 bg-white text-slate-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
          {item.condition}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-blue-600 font-medium">{item.category}</span>
        </div>

        <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-1">{item.name}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <div className="flex items-center text-blue-600 font-bold text-xl">
              <span>₱</span>
              <span>{item.rental_fee.toFixed(2)}</span>
            </div>
            <div className="flex items-center text-slate-500 text-xs mt-1">
              <Clock className="h-3 w-3 mr-1" />
              <span>{item.rental_duration_days} day{item.rental_duration_days !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <button
            disabled={!item.available}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              item.available
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {item.available ? 'Rent Now' : 'Unavailable'}
          </button>
        </div>

        {item.deposit_amount > 0 && (
          <div className="mt-3 text-xs text-slate-500">
            Deposit: ₱{item.deposit_amount.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
