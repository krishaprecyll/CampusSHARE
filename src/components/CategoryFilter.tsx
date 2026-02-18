import { Star, MapPin, Clock, CheckCircle2, MessageCircle } from 'lucide-react';
import { useState, useMemo } from 'react';

interface SafeZoneTransactionProps {
  safeZone: {
    id: string;
    name: string;
    location: string;
    status: string;
  };
  transaction: {
    id: string;
    itemName: string;
    itemCategory: string;
    rentalFee: number;
    rentalDate: string;
    renter: {
      id: string;
      name: string;
      rating: number;
      reviews: number;
      initials: string;
    };
    owner: {
      id: string;
      name: string;
      rating: number;
      reviews: number;
      initials: string;
    };
  };
  onConfirm?: (transactionId: string) => void;
  onMessage?: (transactionId: string) => void;
}

/* Reusable Rating Component */
function Rating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
      <span className="text-xs text-slate-600 font-medium">
        {rating.toFixed(1)} ({reviews})
      </span>
    </div>
  );
}

export default function SafeZoneTransaction({
  safeZone,
  transaction,
  onConfirm,
  onMessage,
}: SafeZoneTransactionProps) {
  const [confirmed, setConfirmed] = useState(false);

  // 🇵🇭 Peso Currency Formatting
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(transaction.rentalFee);
  }, [transaction.rentalFee]);

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm?.(transaction.id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100">
      <div className="p-6">

        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {transaction.itemName}
            </h3>
            <span className="inline-block mt-2 text-[11px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-semibold tracking-wide">
              {transaction.itemCategory}
            </span>
          </div>

          <div className="text-right">
            <p className="text-xl font-bold text-emerald-600">
              {formattedPrice}
            </p>
            <div className="flex items-center justify-end gap-1 text-xs text-slate-500 mt-1">
              <Clock className="h-3 w-3" />
              <span>{transaction.rentalDate}</span>
            </div>
          </div>
        </div>

        {/* Safe Zone Section */}
        <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {safeZone.name}
              </p>
              <p className="text-xs text-slate-600">
                {safeZone.location}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              safeZone.status === 'Active'
                ? 'bg-emerald-100 text-emerald-700 animate-pulse'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {safeZone.status}
          </span>
        </div>

        {/* Participants */}
        <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-6">
          
          {/* Renter */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              Renter
            </p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">
                  {transaction.renter.initials}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {transaction.renter.name}
                </p>
                <Rating
                  rating={transaction.renter.rating}
                  reviews={transaction.renter.reviews}
                />
              </div>
            </div>
          </div>

          {/* Owner */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              Owner
            </p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">
                  {transaction.owner.initials}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {transaction.owner.name}
                </p>
                <Rating
                  rating={transaction.owner.rating}
                  reviews={transaction.owner.reviews}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            type="button"
            disabled={confirmed}
            onClick={handleConfirm}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              confirmed
                ? 'bg-emerald-600 text-white cursor-not-allowed'
                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {confirmed ? 'Confirmed' : 'Confirm Arrival'}
          </button>

          <button
            type="button"
            onClick={() => onMessage?.(transaction.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4" />
            Message
          </button>
        </div>

        {/* Transaction ID */}
        <p className="text-[10px] text-slate-400 mt-5 text-center">
          Transaction ID: {transaction.id}
        </p>
      </div>
    </div>
  );
}
