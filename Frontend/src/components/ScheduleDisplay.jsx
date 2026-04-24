import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const ScheduleEvents = () => {
    const [formData, setFormData] = useState({
        title: '',
        startDate: '',
        startTime: '',
        venue: '',
        category: 'academic',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/v1/events/create', formData);
            toast.success("Event Scheduled Successfully! 📅");
            setFormData({ title: '', startDate: '', startTime: '', venue: '', category: 'academic', description: '' });
        } catch (error) {
            toast.error("Failed to schedule event.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex font-sans">
            <Toaster position="top-right" />
            <AdminSidebar />
            
            <main className="ml-72 flex-1 p-12 overflow-y-auto">
                <header className="mb-10 animate-fade-in">
                    <p className="text-blue-500 text-xs font-black uppercase tracking-widest mb-2">Event Management</p>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Schedule New <span className="text-cyan-400">Activity</span></h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Form Section */}
                    <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-3 ml-2">Event Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all" placeholder="e.g. Annual Tech Symposium" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-3 ml-2">Date</label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none appearance-none" />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-3 ml-2">Time</label>
                                    <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-3 ml-2">Venue / Location</label>
                                <input type="text" name="venue" value={formData.venue} onChange={handleChange} required
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none" placeholder="Main Auditorium" />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-xs font-bold uppercase mb-3 ml-2">Event Category</label>
                                <select name="category" value={formData.category} onChange={handleChange}
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none">
                                    <option value="academic">Academic</option>
                                    <option value="sports">Sports</option>
                                    <option value="cultural">Cultural</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs">
                                {loading ? 'Processing...' : 'Confirm & Schedule Event'}
                            </button>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="flex flex-col justify-center">
                        <div className="p-4 border-l-4 border-blue-500 mb-6">
                            <h3 className="text-white font-bold text-xl">Live Preview</h3>
                            <p className="text-slate-500 text-sm">This is how students will see the event info.</p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                            
                            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter mb-6 inline-block">
                                {formData.category || 'Category'}
                            </span>
                            
                            <h2 className="text-3xl font-black text-white mb-4 leading-tight">
                                {formData.title || 'Your Event Title Here'}
                            </h2>

                            <div className="space-y-3 mt-8">
                                <div className="flex items-center gap-3 text-blue-100">
                                    <span className="text-xl">📍</span>
                                    <span className="font-medium">{formData.venue || 'TBD'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-blue-100">
                                    <span className="text-xl">📅</span>
                                    <span className="font-medium">{formData.startDate || 'YYYY-MM-DD'} | {formData.startTime || '00:00'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ScheduleEvents;