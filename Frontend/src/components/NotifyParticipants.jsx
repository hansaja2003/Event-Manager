import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar'; 
import axios from 'axios';

const NotifyParticipants = () => {
    
    const [events, setEvents] = useState([
        { _id: 'EVT001', title: 'Campus Tech Meetup 2024' },
        { _id: 'EVT002', title: 'Inter-University Hackathon' },
        { _id: 'EVT003', title: 'Annual Sports Meet Notification' }
    ]);

    const [formData, setFormData] = useState({
        eventId: '',
        subject: '',
        message: '',
        priority: 'Normal'
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Form Validation Logic
    const validateForm = () => {
        let newErrors = {};
        if (!formData.eventId) newErrors.eventId = "Please select a target event group.";
        if (!formData.subject.trim()) newErrors.subject = "Subject is required.";
        if (!formData.message.trim()) newErrors.message = "Message body cannot be empty.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        
        console.log("🚀 Dispatching Notification Data:", {
            target_event_id: formData.eventId,
            subject: formData.subject,
            priority: formData.priority,
            message: formData.message,
            timestamp: new Date().toISOString()
        });

        
        setTimeout(() => {
            alert(`✅ Notification sent to all participants of "${events.find(ev => ev._id === formData.eventId)?.title}"`);
            setIsLoading(false);
            
            
            setFormData({ eventId: '', subject: '', message: '', priority: 'Normal' });
        }, 2000);
    };

    return (
        <div className="flex bg-[#0b1121] min-h-screen text-white font-sans">
            
            <AdminSidebar />

            
            <main className="flex-1 ml-72 p-10">
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    
                    <div className="mb-12">
                        <h2 className="text-5xl font-black tracking-tight mb-3">
                            Notify <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">Participants</span>
                        </h2>
                        <p className="text-slate-400 text-lg">Deploy instant email alerts to users registered for your scheduled events.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 bg-[#0f172a]/40 p-12 rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-2xl">
                        
                        {/* Event Selection Dropdown with Delete/Clear Icon */}
                        <div className="relative group">
                            <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-2">Target Event Group</label>
                            <div className="relative">
                                <select 
                                    className={`w-full bg-slate-900/60 border ${errors.eventId ? 'border-red-500' : 'border-slate-800'} p-5 pr-14 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer text-slate-200`}
                                    value={formData.eventId}
                                    onChange={(e) => setFormData({...formData, eventId: e.target.value})}
                                >
                                    <option value="">-- Choose an Event to Broadcast --</option>
                                    {events.map(ev => (
                                        <option key={ev._id} value={ev._id} className="bg-slate-900">{ev.title}</option>
                                    ))}
                                </select>

                                {/* මැජික් Delete/Clear Icon */}
                                {formData.eventId && (
                                    <button
                                        type="button"
                                        onClick={() => setFormData({...formData, eventId: ''})}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-red-500/20 text-slate-500 hover:text-red-500 transition-all"
                                        title="Clear Selection"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            {errors.eventId && <p className="text-red-500 text-xs mt-2 ml-2 font-medium">{errors.eventId}</p>}
                        </div>

                        {/* Email Subject */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-2">Broadcast Subject</label>
                            <input 
                                type="text"
                                className={`w-full bg-slate-900/60 border ${errors.subject ? 'border-red-500' : 'border-slate-800'} p-5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600`}
                                placeholder="Enter a descriptive subject line..."
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            />
                            {errors.subject && <p className="text-red-500 text-xs mt-2 ml-2 font-medium">{errors.subject}</p>}
                        </div>

                        {/* Priority Selector */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-2">Notification Priority</label>
                            <div className="flex gap-4">
                                {['Normal', 'High', 'Urgent'].map(level => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData({...formData, priority: level})}
                                        className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                                            formData.priority === level 
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' 
                                            : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message Body */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-2">Message Payload</label>
                            <textarea 
                                rows="7"
                                className={`w-full bg-slate-900/60 border ${errors.message ? 'border-red-500' : 'border-slate-800'} p-6 rounded-[2rem] outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600 leading-relaxed`}
                                placeholder="Compose your message to registered participants..."
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            ></textarea>
                            {errors.message && <p className="text-red-500 text-xs mt-2 ml-2 font-medium">{errors.message}</p>}
                        </div>

                        {/* Launch Button */}
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-6 rounded-2xl font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center gap-4 group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Send 
                                    <span className="group-hover:translate-x-2 transition-transform">🚀</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default NotifyParticipants;