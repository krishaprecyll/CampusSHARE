import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Shield, Clock, TrendingUp, Package, Users, Star, User, LogOut, ChevronDown } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import ItemCard from '../components/ItemCard';
import CategoryFilter from '../components/CategoryFilter';
import Hero from '../components/Hero';
import Stats from '../components/Stats';

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

export default function PublicHome() {
  const { user, logout } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState<Item[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const mockItems: Item[] = [
      {
        id: '1',
        name: 'Professional Camera Kit',
        description: 'Canon EOS R6 with 24-70mm lens, perfect for photography projects',
        category: 'Electronics',
        image_url: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
        condition: 'Excellent',
        available: true,
        rental_fee: 45.00,
        rental_duration_days: 3,
        deposit_amount: 200.00,
        owner_id: '1'
      },
      {
        id: '2',
        name: 'Mountain Bike',
        description: 'Trek X-Caliber 8, 29-inch wheels, great for trails',
        category: 'Sports',
        image_url: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800',
        condition: 'Good',
        available: true,
        rental_fee: 25.00,
        rental_duration_days: 1,
        deposit_amount: 100.00,
        owner_id: '2'
      },
      {
        id: '3',
        name: 'Camping Tent (4-Person)',
        description: 'Spacious tent with rainfly, perfect for weekend adventures',
        category: 'Outdoor',
        image_url: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=800',
        condition: 'Good',
        available: true,
        rental_fee: 20.00,
        rental_duration_days: 2,
        deposit_amount: 50.00,
        owner_id: '3'
      },
      {
        id: '4',
        name: 'Textbook: Calculus III',
        description: 'Latest edition, excellent condition with practice problems',
        category: 'Books',
        image_url: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=800',
        condition: 'Like New',
        available: true,
        rental_fee: 15.00,
        rental_duration_days: 30,
        deposit_amount: 40.00,
        owner_id: '4'
      },
      {
        id: '5',
        name: 'Electric Guitar & Amp',
        description: 'Fender Stratocaster with Marshall amplifier',
        category: 'Music',
        image_url: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800',
        condition: 'Excellent',
        available: true,
        rental_fee: 35.00,
        rental_duration_days: 7,
        deposit_amount: 150.00,
        owner_id: '5'
      },
      {
        id: '6',
        name: 'Power Drill Set',
        description: 'DeWalt cordless drill with complete bit set',
        category: 'Tools',
        image_url: 'https://images.pexels.com/photos/5691618/pexels-photo-5691618.jpeg?auto=compress&cs=tinysrgb&w=800',
        condition: 'Good',
        available: true,
        rental_fee: 18.00,
        rental_duration_days: 2,
        deposit_amount: 60.00,
        owner_id: '6'
      },
      {
        id: '7',
        name: 'Formal Dress',
        description: 'Navy blue evening gown, size 6, perfect for formal events',
        category: 'Clothing',
        image_url: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800',
        condition: 'Excellent',
        available: true,
        rental_fee: 30.00,
        rental_duration_days: 1,
        deposit_amount: 80.00,
        owner_id: '7'
      },
      {
        id: '8',
        name: 'Gaming Console (PS5)',
        description: 'PlayStation 5 with two controllers and popular games',
        category: 'Electronics',
        image_url: 'https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?auto=compress&cs=tinysrgb&w=800',
        condition: 'Excellent',
        available: false,
        rental_fee: 40.00,
        rental_duration_days: 7,
        deposit_amount: 300.00,
        owner_id: '8'
      }
    ];

    setItems(mockItems);
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">UniBorrow</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#browse" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">Browse</a>
              <a href="#how-it-works" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">How It Works</a>
              <a href="#safe-zones" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">Safe Zones</a>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                List an Item
              </button>

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                    {user?.profile_picture_url ? (
                      <img
                        src={user.profile_picture_url}
                        alt={user.full_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <span className="font-medium">{user?.full_name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2">
                    <div className="px-4 py-3 border-b border-slate-200">
                      <p className="text-sm font-semibold text-slate-900">{user?.full_name}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm">My Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <Hero />

      <Stats />

      <section id="browse" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse Available Items</h2>
          <p className="text-slate-600 mb-6">Rent from fellow students, save money, and reduce waste</p>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for items..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No items found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </section>

      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">How UniBorrow Works</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            A simple, secure way to rent and share items within your university community
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Browse Items</h3>
              <p className="text-slate-600 text-sm">Search our catalog of available items from verified students</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Book & Pay</h3>
              <p className="text-slate-600 text-sm">Choose your rental period and complete secure payment</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Safe Zone Pickup</h3>
              <p className="text-slate-600 text-sm">Meet at designated safe zones across campus</p>
            </div>

            <div className="text-center">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Return & Review</h3>
              <p className="text-slate-600 text-sm">Return the item and leave a review to build trust</p>
            </div>
          </div>
        </div>
      </section>

      <section id="safe-zones" className="py-20 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Campus Safe Zones</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Meet at verified locations across campus for safe and convenient exchanges
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <MapPin className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Student Union</h3>
              <p className="text-slate-600 text-sm mb-3">Main lobby, near information desk</p>
              <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Active</span>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <MapPin className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Library Entrance</h3>
              <p className="text-slate-600 text-sm mb-3">Main entrance, security desk area</p>
              <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Active</span>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <MapPin className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Recreation Center</h3>
              <p className="text-slate-600 text-sm mb-3">Front desk, monitored area</p>
              <span className="inline-block bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Active</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Trust & Safety First</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            All users are verified with university credentials. Ratings and reviews help maintain a trustworthy community.
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-200 mx-auto mb-2" />
              <p className="text-white font-semibold">Verified Students</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-blue-200 mx-auto mb-2" />
              <p className="text-white font-semibold">Secure Payments</p>
            </div>
            <div className="text-center">
              <Star className="h-8 w-8 text-blue-200 mx-auto mb-2" />
              <p className="text-white font-semibold">Rating System</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-6 w-6 text-blue-400" />
                <h3 className="text-white font-bold text-lg">UniBorrow</h3>
              </div>
              <p className="text-sm">Share resources, build community, save money.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Browse Items</a></li>
                <li><a href="#" className="hover:text-white transition-colors">List an Item</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community Guidelines</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2024 UniBorrow. Built for university communities.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
