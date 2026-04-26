import React from 'react';
import { Star, MapPin, CheckCircle2, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProviderCard = ({ provider }) => {
  return (
    <div className="glass-card flex flex-col group h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
             {provider.image ? (
               <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
             ) : (
               <span className="text-2xl font-bold text-slate-600">{provider.name[0]}</span>
             )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">{provider.name}</h3>
            <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
              <span className="text-primary-400 font-semibold">{provider.service}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {provider.rating} ({provider.reviewCount})
              </span>
            </div>
          </div>
        </div>
        {provider.isAvailable && (
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available Now
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
        <MapPin size={16} />
        <span>{provider.location}</span>
        {provider.distance && (
           <>
             <span>•</span>
             <span className="flex items-center gap-1">
               <Navigation size={14} />
               {provider.distance} km
             </span>
           </>
        )}
      </div>

      {provider.skills && (
        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
          {provider.skills.map(skill => (
            <span key={skill} className="px-2 py-1 rounded-lg bg-slate-800/50 text-slate-400 text-[10px] border border-slate-700/50">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Link 
          to={`/providers/${provider.id}`} 
          className="btn-secondary flex-grow py-2.5 text-sm"
        >
          View Profile
        </Link>
        <Link 
          to={`/providers/${provider.id}?book=true`}
          className="btn-primary py-2.5 px-4 text-sm whitespace-nowrap"
        >
          Hire Now
        </Link>
      </div>

    </div>
  );
};

export default ProviderCard;
