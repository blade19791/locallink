import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Zap, Wrench, Shield, Clock, Star, MapPin } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Plumber', icon: Wrench, color: 'bg-blue-500/10 text-blue-400' },
  { name: 'Electrician', icon: Zap, color: 'bg-amber-500/10 text-amber-400' },
  { name: 'Mechanic', icon: Hammer, color: 'bg-emerald-500/10 text-emerald-400' },
  { name: 'Carpenter', icon: Hammer, color: 'bg-orange-500/10 text-orange-400' },
  { name: 'Cleaning', icon: Shield, color: 'bg-purple-500/10 text-purple-400' },
  { name: 'Painting', icon: Zap, color: 'bg-pink-500/10 text-pink-400' },
];

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/10 blur-[100px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-primary-500/10 text-primary-400 text-xs font-bold tracking-wider uppercase mb-6 border border-primary-500/20">
              Trusted Local Professionals
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-tight">
              Find the perfect help <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">for your local tasks.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Experience the future of local services. Connect with verified experts in your neighborhood within minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SearchBar />
          </motion.div>

          {/* Featured Categories */}
          <div className="mt-20">
            <p className="text-slate-500 text-sm font-medium mb-8">Popular Services</p>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * i }}
                >
                  <Link 
                    to={`/search?service=${cat.name}`}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-primary-500/50 hover:bg-slate-800 transition-all group"
                  >
                    <div className={`p-2 rounded-lg ${cat.color} group-hover:scale-110 transition-transform`}>
                      <cat.icon size={20} />
                    </div>
                    <span className="text-slate-200 font-medium">{cat.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-slate-900 bg-slate-950/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 border border-slate-800 text-primary-400">
                <Shield size={32} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">100% Verified</h3>
              <p className="text-slate-500">Every provider passes our strict verification process.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 border border-slate-800 text-primary-400">
                <Clock size={32} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">Available Now</h3>
              <p className="text-slate-500">Find professionals who are ready to help immediately.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mb-6 border border-slate-800 text-primary-400">
                <Star size={32} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">Top Rated</h3>
              <p className="text-slate-500">Only the best services based on community reviews.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
