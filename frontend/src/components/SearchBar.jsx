import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ initialService = '', initialLocation = '' }) => {
  const [service, setService] = useState(initialService);
  const [location, setLocation] = useState(initialLocation);
  const [suggestions, setSuggestions] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const suggestionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleServiceChange = async (e) => {
    const value = e.target.value;
    setService(value);
    
    if (value.length > 1) {
      try {
        // Debounced API call would go here
        const response = await fetch(`/api/services/suggestions?q=${value}`);
        const data = await response.json();
        const suggestionsArray = Array.isArray(data.suggestions) ? data.suggestions : [];
        setSuggestions(suggestionsArray);
        setShowSuggestions(suggestionsArray.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationDetection = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude},${longitude}`);
          setIsLocating(false);
        },
        (error) => {
          console.error('Error detecting location:', error);
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!service) return;
    navigate(`/search?service=${encodeURIComponent(service)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative z-20">
      <form 
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row gap-3 bg-slate-900/80 backdrop-blur-xl p-3 border border-slate-700/50 rounded-2xl shadow-2xl"
      >
        <div className="flex-grow relative" ref={suggestionRef}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="What service do you need?"
            className="w-full bg-slate-800/50 border-none rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
            value={service}
            onChange={handleServiceChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-50">
              {suggestions.map((s, i) => (
                <button
                  key={s.id || i}
                  className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-none"
                  onClick={() => {
                    setService(s.name);
                    setShowSuggestions(false);
                  }}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-grow md:max-w-[280px] relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <MapPin size={20} />
          </div>
          <input
            type="text"
            placeholder="Location"
            className="w-full bg-slate-800/50 border-none rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            type="button"
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-400 transition-colors ${isLocating ? 'animate-spin' : ''}`}
            onClick={handleLocationDetection}
            disabled={isLocating}
            title="Use my location"
          >
            {isLocating ? <Loader2 size={18} /> : <Navigation size={18} />}
          </button>
        </div>

        <button type="submit" className="btn-primary md:w-auto w-full py-3 px-8 text-base">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
