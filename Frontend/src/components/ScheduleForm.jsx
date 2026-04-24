import React, { useState } from 'react';
import axios from 'axios';
import AdminSidebar from './AdminSidebar'; 

const ScheduleForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'academic',
        description: '',
        startDate: '',
        startTime: '',
        venue: '',
        visibility: 'public'
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            
            const dataToSend = { 
                ...formData, 
                createdBy: "65f1234567890abcdef12345" 
            };

            const response = await axios.post('http://localhost:5000/api/v1/events/create', dataToSend);

            if (response.data) {
                alert("🗓️ Event Scheduled Successfully!");
                
                setFormData({
                    title: '', category: 'academic', description: '',
                    startDate: '', startTime: '', venue: '', visibility: 'public'
                });
            }
        } catch (error) {
            console.error("Error saving event:", error);
            alert("❌ Failed to schedule event. Check backend connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex bg-[#0b1121] min-h-screen text-white">
            <AdminSidebar />
            
            <main className="flex-1 ml-72 p-10 flex flex-col items-center">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                            Schedule <span className="text-blue-500">New Event</span>
                        </h1>
                        <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.3em]">
                            Campus Event Management System
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-[#0f172a]/50 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl space-y-5">
                        {/* Event Title */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Event Title</label>
                            <input 
                                name="title" value={formData.title} onChange={handleChange} required
                                className="w-full bg-[#0b1121] border border-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                placeholder="E.g. Annual Tech Symposium"
                            />
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Start Date</label>
                                <input 
                                    name="startDate" type="date" value={formData.startDate} onChange={handleChange} required
                                    className="w-full bg-[#0b1121] border border-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-400"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Start Time</label>
                                <input 
                                    name="startTime" type="time" value={formData.startTime} onChange={handleChange} required
                                    className="w-full bg-[#0b1121] border border-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Category & Venue */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Category</label>
                                <select 
                                    name="category" value={formData.category} onChange={handleChange}
                                    className="w-full bg-[#0b1121] border border-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-slate-400"
                                >
                                    <option value="academic">Academic</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="sports">Sports</option>
                                    <option value="cultural">Cultural</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Venue</label>
                                <input 
                                    name="venue" value={formData.venue} onChange={handleChange}
                                    className="w-full bg-[#0b1121] border border-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                    placeholder="Main Hall"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Description</label>
                            <textarea 
                                name="description" value={formData.description} onChange={handleChange} required
                                className="w-full h-32 bg-[#0b1121] border border-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                                placeholder="Details about the event..."
                            ></textarea>
                        </div>

                        <button 
                            type="submit" disabled={isLoading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 rounded-full font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                        >
                            {isLoading ? "Scheduling..." : "Broadcast Event 🚀"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ScheduleForm;