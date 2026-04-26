import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ProviderCard from '../components/ProviderCard';
import { Filter, SlidersHorizontal, ArrowUpDown, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const service = searchParams.get('service') || '';
  const location = searchParams.get('location') || '';
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        let url = `/api/search?service=${encodeURIComponent(service)}`;
        
        // Parse lat/lng if available
        if (location && location.includes(',')) {
          const [lat, lng] = location.split(',').map(c => c.trim());
          url += `&lat=${lat}&lng=${lng}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        
        // Map backend fields to frontend component expectations
        const mappedResults = data.providers.map(p => ({
          id: p.user_id,
          name: p.name,
          service: p.service_name || service, // Handle missing service name if needed
          location: p.location_text,
          rating: parseFloat(p.avg_rating).toFixed(1),
          reviewCount: p.review_count,
          isAvailable: p.is_available,
          distance: p.distance ? parseFloat(p.distance).toFixed(1) : null,
          skills: p.skills || [],
          image: p.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random`
        }));

        setResults(mappedResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [service, location]);

  const filteredResults = results
    .filter(p => !filterAvailable || p.isAvailable)
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') return a.distance - b.distance;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Top Search Bar */}
      <div className="bg-slate-900/50 border-b border-slate-900 py-8 mb-12">
        <div className="container mx-auto px-6">
          <SearchBar initialService={service} initialLocation={location} />
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              {loading ? 'Searching for help...' : `${filteredResults.length} Result${filteredResults.length !== 1 ? 's' : ''} for "${service}"`}
            </h2>
            <p className="text-slate-400">Top rated professionals near you</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
              <button 
                onClick={() => setSortBy('rating')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'rating' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Top Rated
              </button>
              <button 
                onClick={() => setSortBy('distance')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === 'distance' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Nearest
              </button>
            </div>

            <button 
              onClick={() => setFilterAvailable(!filterAvailable)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${filterAvailable ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
            >
              <div className={`w-2 h-2 rounded-full ${filterAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              Available Now
            </button>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass-card animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl" />
                  <div className="flex-grow">
                    <div className="h-6 bg-slate-800 rounded-lg w-3/4 mb-2" />
                    <div className="h-4 bg-slate-800 rounded-lg w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-slate-800 rounded-lg w-full mb-6" />
                <div className="flex gap-3">
                  <div className="h-10 bg-slate-800 rounded-xl flex-grow" />
                  <div className="h-10 bg-slate-800 rounded-xl w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredResults.map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-32 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 rounded-full mb-6 text-slate-600">
              <Filter size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No pros found</h3>
            <p className="text-slate-500 max-w-md mx-auto">We couldn't find any professionals matching your search. Try adjusting your filters or location.</p>
            <button 
              onClick={() => {setFilterAvailable(false); setService('');}} 
              className="mt-8 text-primary-400 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
