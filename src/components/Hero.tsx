import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Stat {
  label: string;
  value: number | string;
  suffix?: string;
}

export default function Hero() {
  // Animated counters for stats
  const [activeItems, setActiveItems] = useState(0);
  const [verifiedUsers, setVerifiedUsers] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const duration = 2000; // animation duration in ms
    const fps = 60;
    const steps = duration / (1000 / fps);

    const targetActive = 2500;
    const targetUsers = 850;
    const targetRating = 4.8;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setActiveItems(Math.min(Math.floor((targetActive / steps) * step), targetActive));
      setVerifiedUsers(Math.min(Math.floor((targetUsers / steps) * step), targetUsers));
      setAvgRating(Math.min((targetRating / steps) * step, targetRating));
      if (step >= steps) clearInterval(interval);
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, []);

  const stats: Stat[] = [
    { label: 'Active Items', value: activeItems, suffix: '+' },
    { label: 'Verified Users', value: verifiedUsers, suffix: '+' },
    { label: 'Avg. Rating', value: avgRating.toFixed(1), suffix: '★' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-28 md:py-32">
      {/* Decorative Background Shapes */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 800 600"
          fill="none"
        >
          <circle cx="400" cy="300" r="300" fill="white" fillOpacity="0.05" />
          <circle cx="200" cy="150" r="200" fill="white" fillOpacity="0.05" />
          <circle cx="600" cy="450" r="250" fill="white" fillOpacity="0.05" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Highlight Badge */}
        <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-pulse">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Sharing economy for your campus</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Rent, Share, Save
          <br />
          <span className="text-cyan-200">Within Your Community</span>
        </h1>

        {/* Hero Subtext */}
        <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
          Access what you need, when you need it. From textbooks to tools, electronics to equipment.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 transform hover:-translate-y-1 group">
            Start Browsing
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all">
            List Your Items
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 transition-all duration-500">
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-blue-200 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
    </section>
  );
}
