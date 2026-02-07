import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AlertCircle, Search } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Rental {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  item_id: string;
  renter_id: string;
  items?: { name: string };
  users?: { full_name: string };
}

export default function AdminRentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('rentals')
        .select('id, status, start_date, end_date, created_at, item_id, renter_id, items(name), users(full_name)')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setRentals(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rentals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error: updateError } = await supabase
        .from('rentals')
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) throw updateError;
      setRentals(rentals.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rental');
    }
  };

  const filteredRentals = rentals.filter(
    (rental) =>
      rental.items?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.users?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Rental Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by item name or renter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading rentals...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Item</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Renter</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Start Date</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">End Date</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRentals.map((rental) => (
                <tr key={rental.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">{rental.items?.name || 'N/A'}</td>
                  <td className="py-3 px-4 text-slate-600">{rental.users?.full_name || 'N/A'}</td>
                  <td className="py-3 px-4">{new Date(rental.start_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{new Date(rental.end_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <select
                      value={rental.status}
                      onChange={(e) => handleStatusChange(rental.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                        rental.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : rental.status === 'active'
                          ? 'bg-blue-100 text-blue-700'
                          : rental.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRentals.length === 0 && (
            <div className="text-center py-8 text-slate-600">
              No rentals found matching your search.
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-600">
        Showing {filteredRentals.length} of {rentals.length} rentals
      </div>
    </div>
  );
}
