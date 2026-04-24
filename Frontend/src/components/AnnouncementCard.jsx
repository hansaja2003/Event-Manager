import React from 'react';

const AnnouncementCard = ({ title, message, date }) => {
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
          {formattedDate}
        </span>
      </div>
      
      <p className="text-slate-600 leading-relaxed mb-6 font-medium">
        {message}
      </p>
      
      <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-tighter">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
        </span>
        Official System Broadcast
      </div>
    </div>
  );
};

export default AnnouncementCard;