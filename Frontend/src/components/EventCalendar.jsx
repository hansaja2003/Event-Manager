import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const EventCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/v1/events/public');
                
                if (response.data && response.data.events) {
                    const formatted = response.data.events.map(event => {
                        const eventDate = new Date(event.startDate);
                        const [hours, minutes] = event.startTime.split(':');
                        eventDate.setHours(parseInt(hours), parseInt(minutes));

                        return {
                            id: event._id,
                            title: event.title,
                            start: eventDate,
                            end: new Date(new Date(eventDate).setHours(eventDate.getHours() + 2)),
                            venue: event.venue,
                            category: event.category,
                            description: event.description
                        };
                    });
                    setEvents(formatted);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen pt-28 pb-12 px-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <div className="max-w-7xl mx-auto">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-sm">
                            University Event Schedule
                        </h2>
                        <p className="text-blue-200/70 mt-2 font-medium">
                            Stay ahead with the latest campus activities and academic sessions.
                        </p>
                    </div>
                    
                    <div className="flex gap-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-2xl">
                        <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 ${loading ? 'bg-orange-400' : 'bg-cyan-400'} rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]`}></span>
                            <span className="text-sm text-cyan-50 font-semibold tracking-wide">
                                {loading ? 'Syncing Data...' : 'Live Updates'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input 
                        type="text" 
                        placeholder="Search for an event..." 
                        className="flex-1 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-blue-200 outline-none focus:ring-2 focus:ring-cyan-400 transition-all backdrop-blur-md"
                    />
                    <select className="px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-cyan-400 transition-all backdrop-blur-md">
                        <option className="text-black" value="all">All Categories</option>
                        <option className="text-black" value="sports">Sports</option>
                        <option className="text-black" value="academic">Academic</option>
                    </select>
                </div>

                <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden relative" 
                     style={{ height: '78vh', minHeight: '650px' }}>
                    
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-blue-900 font-bold animate-bounce text-xl">Loading Campus Events...</div>
                        </div>
                    ) : (
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%' }}
                            onSelectEvent={(event) => alert(
                                `📌 Venue: ${event.venue}\n` +
                                `📝 Event: ${event.title}\n` +
                                `📂 Category: ${event.category}\n` +
                                `ℹ️ Info: ${event.description}`
                            )}
                            eventPropGetter={(event) => {
                                let backgroundColor = event.category === 'academic' ? '#3b82f6' : '#10b981';
                                if (event.category === 'sports') backgroundColor = '#f59e0b';
                                return { style: { backgroundColor, borderRadius: '8px', border: 'none', color: 'white' } };
                            }}
                        />
                    )}
                </div>
                
                <p className="text-center text-blue-300/40 text-xs mt-8 font-bold tracking-widest uppercase">
                    Powered by UniNexus Engine • 2026
                </p>
            </div>
        </div>
    );
};

export default EventCalendar;