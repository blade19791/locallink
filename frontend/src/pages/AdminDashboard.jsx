import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check, X, AlertCircle, Search, ExternalLink, Plus, Edit2, Trash2, Save } from 'lucide-react';

const AdminDashboard = () => {
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '' });

  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
    } else {
      fetchProviders();
    }
  }, [activeTab]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'pending' ? '/api/admin/providers/pending' : '/api/admin/providers';
      const response = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Failed to fetch providers');
      const data = await response.json();
      setProviders(data.providers || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const response = await fetch(`/api/admin/providers/${id}/${action}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error(`Failed to ${action} provider`);
      fetchProviders();
    } catch (error) {
      console.error(`Error ${action}ing provider:`, error);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const method = editingService ? 'PUT' : 'POST';
    const url = editingService ? `/api/admin/services/${editingService.id}` : '/api/admin/services';
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(serviceForm)
      });
      if (response.ok) {
        setIsServiceModalOpen(false);
        setEditingService(null);
        setServiceForm({ name: '', description: '' });
        fetchServices();
      }
    } catch (error) {
       console.error('Error saving service:', error);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Are you sure? This will remove this service category from the platform.')) return;
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const openServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({ name: service.name, description: service.description || '' });
    } else {
      setEditingService(null);
      setServiceForm({ name: '', description: '' });
    }
    setIsServiceModalOpen(true);
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-slate-950">
      <div className="container mx-auto max-w-6xl">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="text-primary-400" />
              Admin Center
            </h1>
            <p className="text-slate-400">Manage platform services and provider applications.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {activeTab === 'services' && (
              <button 
                onClick={() => openServiceModal()}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} /> Add Service
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-900 mb-10">
          {[
            { id: 'pending', label: 'Pending Approval' },
            { id: 'active', label: 'Active Providers' },
            { id: 'services', label: 'Service Categories' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-bold tracking-wider uppercase transition-all relative ${activeTab === tab.id ? 'text-primary-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
              {tab.label}
              {tab.id === 'pending' && providers.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-md bg-primary-600 text-[10px] text-white">
                  {providers.length}
                </span>
              )}
              {activeTab === tab.id && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400" />}
            </button>
          ))}
        </div>

        <div className="glass-card overflow-hidden">
          {activeTab === 'services' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Service Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Description</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/10">
                   {services.map(service => (
                     <tr key={service.id} className="group hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-6 text-sm font-bold text-white">{service.name}</td>
                        <td className="px-6 py-6 text-sm text-slate-400 italic max-w-md truncate">{service.description || 'No description'}</td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => openServiceModal(service)}
                               className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                             >
                               <Edit2 size={16} />
                             </button>
                             <button 
                               onClick={() => deleteService(service.id)}
                               className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                             >
                               <Trash2 size={16} />
                             </button>
                          </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Provider</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Service</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Location</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date Joined</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/10">
                  <AnimatePresence>
                    {providers.map((provider) => (
                      <motion.tr 
                        key={provider.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="group hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                              {provider.name ? provider.name[0] : '?'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{provider.name}</p>
                              <p className="text-xs text-slate-500">{provider.phone || provider.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-sm text-slate-300 font-medium">{provider.service}</td>
                        <td className="px-6 py-6 text-sm text-slate-400">{provider.location || 'Not specified'}</td>
                        <td className="px-6 py-6 text-sm text-slate-400">
                          {new Date(provider.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {activeTab === 'pending' && (
                              <button 
                                onClick={() => handleAction(provider.id, 'approve')}
                                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/20"
                                title="Approve"
                              >
                                <Check size={18} />
                              </button>
                            )}
                            <button 
                              onClick={() => handleAction(provider.id, 'reject')}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                              title={activeTab === 'pending' ? 'Reject' : 'Delete'}
                            >
                              <X size={18} />
                            </button>
                            <button 
                               onClick={() => window.location.href = `/provider/${provider.id}`}
                               className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
                            >
                              <ExternalLink size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
          
          {!loading && ((activeTab === 'services' && services.length === 0) || (activeTab !== 'services' && providers.length === 0)) && (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4 text-slate-700">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-widest text-xs opacity-50 mb-4">
                No items found
              </h3>
              <p className="text-slate-500">All caught up!</p>
            </div>
          )}
        </div>

        {/* Service Modal */}
        {isServiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleServiceSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Service Name</label>
                  <input 
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-all"
                    placeholder="e.g., Carpenter"
                    value={serviceForm.name}
                    onChange={e => setServiceForm({...serviceForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-primary-500 outline-none transition-all resize-none"
                    placeholder="Brief description of the service..."
                    value={serviceForm.description}
                    onChange={e => setServiceForm({...serviceForm, description: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2">
                  <Save size={18} />
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </form>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;

