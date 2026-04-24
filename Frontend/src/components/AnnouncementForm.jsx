import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar'; 
import axios from 'axios';

const AnnouncementForm = () => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (!message.trim()) {
        alert("Please enter a message!");
        return;
    }

    setIsLoading(true);

    try {
        // ------
        const response = await axios.post('http://localhost:5000/api/notifications/announcements', {
            title: "Global Update", // 
            message: message
        });

        if (response.data.success) {
            alert("🚀 Announcement Published Successfully!");
            setMessage(''); 
        }
    } catch (error) {
        console.error("Backend Error:", error);
        alert("❌ Error: Could not connect to the server.");
    } finally {
        setIsLoading(false);
    }
};

    return (
        <div className="flex bg-[#0b1121] min-h-screen text-white">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 ml-72 p-10 flex items-center justify-center">
                <div className="w-full max-w-3xl animate-in fade-in zoom-in duration-700">
                    
                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-black text-white mb-3">
                            Global <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-8">Announcement</span>
                        </h1>
                        <p className="text-slate-500 text-sm uppercase tracking-[0.4em] font-bold">
                            Broadcast Node Active
                        </p>
                    </div>

                    <div className="bg-[#0f172a]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
                            <div className="w-full relative group">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-4 ml-4">
                                    Broadcast Message Payload
                                </label>
                                <textarea 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    className="w-full h-56 bg-[#0b1121]/50 border border-slate-800 rounded-[2rem] p-8 text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all text-lg leading-relaxed placeholder:text-slate-800 shadow-inner group-hover:border-slate-700"
                                    placeholder="Compose the global message to all campus users..."
                                ></textarea>
                            </div>

                            {/* ---  --- */}
                            <button 
                                type="submit"
                                disabled={isLoading || !message.trim()}
                                className="px-12 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-full font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 active:scale-95 group"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-3 border-t-transparent border-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Launch Broadcast 
                                        <span className="text-xl group-hover:translate-x-2 transition-transform">🚀</span>
                                    </>
                                )}
                            </button>
                            {/* ------------------------------------------- */}
                        </form>
                    </div>

                    <div className="mt-8 text-center text-slate-700 text-[10px] font-black uppercase tracking-[0.5em]">
                        Admin Authorization Level 01 Required
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AnnouncementForm;