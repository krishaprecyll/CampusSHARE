import { TrendingUp, DollarSign, Leaf, Users } from 'lucide-react';

export default function Stats() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-7 w-7 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">₱125k+</div>
            <p className="text-slate-600 text-sm">Saved by Students</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-7 w-7 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">5,200+</div>
            <p className="text-slate-600 text-sm">Successful Rentals</p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-7 w-7 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">3.2 tons</div>
            <p className="text-slate-600 text-sm">CO₂ Emissions Saved</p>
          </div>

          <div className="text-center">
            <div className="bg-cyan-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-7 w-7 text-cyan-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">98%</div>
            <p className="text-slate-600 text-sm">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
