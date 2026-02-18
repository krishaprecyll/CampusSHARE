import { TrendingUp, DollarSign, Leaf, Users } from 'lucide-react';

export default function Stats() {
  const pesoFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
  });

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Saved by Students */}
          <div className="text-center transform transition-all hover:scale-105 duration-300">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              {pesoFormatter.format(125000)}
            </div>
            <p className="text-slate-600 text-sm md:text-base">Saved by Students</p>
          </div>

          {/* Successful Rentals */}
          <div className="text-center transform transition-all hover:scale-105 duration-300">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">5,200+</div>
            <p className="text-slate-600 text-sm md:text-base">Successful Rentals</p>
          </div>

          {/* CO₂ Emissions Saved */}
          <div className="text-center transform transition-all hover:scale-105 duration-300">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <Leaf className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">3.2 tons</div>
            <p className="text-slate-600 text-sm md:text-base">CO₂ Emissions Saved</p>
          </div>

          {/* Satisfaction Rate */}
          <div className="text-center transform transition-all hover:scale-105 duration-300">
            <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <Users className="h-8 w-8 text-cyan-600" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">98%</div>
            <p className="text-slate-600 text-sm md:text-base">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
