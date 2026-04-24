import React, { useState, useRef, useEffect } from 'react';
import eventService from '../services/eventService';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

  .ecb-root * { box-sizing: border-box; font-family: 'Inter', sans-serif; }

  /* Floating button */
  .ecb-fab {
    position: fixed; bottom: 28px; right: 28px;
    width: 60px; height: 60px; border-radius: 20px;
    background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
    border: none; cursor: pointer; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 32px rgba(79,70,229,0.45), 0 2px 8px rgba(0,0,0,0.15);
    transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
    outline: none;
  }
  .ecb-fab:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 12px 40px rgba(79,70,229,0.55), 0 4px 12px rgba(0,0,0,0.18);
  }
  .ecb-fab:active { transform: scale(0.96); }
  .ecb-fab-icon {
    width: 26px; height: 26px; transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), opacity 0.2s;
  }
  .ecb-fab-icon svg { width: 100%; height: 100%; }

  /* Notification dot */
  .ecb-notif {
    position: absolute; top: -3px; right: -3px;
    width: 14px; height: 14px; border-radius: 50%;
    background: #EF4444; border: 2px solid #fff;
    animation: ecb-pulse-dot 2s infinite;
  }
  @keyframes ecb-pulse-dot {
    0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
    50%     { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
  }

  /* Chat window */
  .ecb-window {
    position: fixed; bottom: 104px; right: 28px;
    width: 400px; height: 580px;
    border-radius: 24px; overflow: hidden; z-index: 9998;
    display: flex; flex-direction: column;
    background: #ffffff;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08);
    border: 1px solid rgba(255,255,255,0.8);
    animation: ecb-slide-up 0.32s cubic-bezier(.22,1,.36,1);
    transform-origin: bottom right;
  }
  @keyframes ecb-slide-up {
    from { opacity: 0; transform: scale(0.88) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* Header */
  .ecb-header {
    background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
    padding: 18px 20px 16px; flex-shrink: 0;
    position: relative; overflow: hidden;
  }
  .ecb-header::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 120px; height: 120px; border-radius: 50%;
    background: rgba(255,255,255,0.07);
  }
  .ecb-header::after {
    content: ''; position: absolute; bottom: -24px; left: 30px;
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }
  .ecb-header-top { display: flex; align-items: center; justify-content: space-between; }
  .ecb-avatar {
    width: 42px; height: 42px; border-radius: 14px;
    background: rgba(255,255,255,0.2); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; border: 1.5px solid rgba(255,255,255,0.3);
    flex-shrink: 0;
  }
  .ecb-header-info { flex: 1; margin-left: 12px; }
  .ecb-header-name { font-size: 15px; font-weight: 600; color: #fff; margin: 0; letter-spacing: -0.2px; }
  .ecb-header-status { display: flex; align-items: center; gap: 5px; margin-top: 2px; }
  .ecb-status-dot {
    width: 7px; height: 7px; border-radius: 50%; background: #4ADE80;
    animation: ecb-live 2s infinite;
  }
  @keyframes ecb-live {
    0%,100% { opacity: 1; } 50% { opacity: 0.5; }
  }
  .ecb-status-text { font-size: 11.5px; color: rgba(255,255,255,0.75); }
  .ecb-close-btn {
    width: 32px; height: 32px; border-radius: 10px;
    background: rgba(255,255,255,0.15); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.9); font-size: 16px; line-height: 1;
    transition: background 0.15s;
  }
  .ecb-close-btn:hover { background: rgba(255,255,255,0.25); }

  /* Powered by bar */
  .ecb-powered {
    background: rgba(255,255,255,0.12); border-radius: 8px;
    padding: 5px 10px; margin-top: 12px;
    font-size: 10.5px; color: rgba(255,255,255,0.65);
    display: inline-flex; align-items: center; gap: 5px;
  }

  /* Messages area */
  .ecb-messages {
    flex: 1; overflow-y: auto; padding: 18px 16px;
    background: #F8F7FF; scroll-behavior: smooth;
    display: flex; flex-direction: column; gap: 12px;
  }
  .ecb-messages::-webkit-scrollbar { width: 4px; }
  .ecb-messages::-webkit-scrollbar-track { background: transparent; }
  .ecb-messages::-webkit-scrollbar-thumb { background: rgba(79,70,229,0.2); border-radius: 4px; }

  /* Message rows */
  .ecb-row { display: flex; gap: 8px; max-width: 100%; }
  .ecb-row.user { flex-direction: row-reverse; }
  .ecb-bot-avatar {
    width: 30px; height: 30px; border-radius: 10px;
    background: linear-gradient(135deg, #4F46E5, #7C3AED);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0; align-self: flex-end;
  }

  /* Bubbles */
  .ecb-bubble {
    max-width: 78%; padding: 11px 15px; border-radius: 18px;
    font-size: 13.5px; line-height: 1.55; word-break: break-word;
    animation: ecb-pop 0.25s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes ecb-pop {
    from { opacity: 0; transform: scale(0.88) translateY(6px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .ecb-bubble.bot {
    background: #fff; color: #1E1B4B;
    border: 1px solid rgba(79,70,229,0.1);
    border-bottom-left-radius: 6px;
    box-shadow: 0 2px 8px rgba(79,70,229,0.07);
  }
  .ecb-bubble.user {
    background: linear-gradient(135deg, #4F46E5, #6D28D9);
    color: #fff; border-bottom-right-radius: 6px;
    box-shadow: 0 4px 14px rgba(79,70,229,0.3);
  }
  .ecb-bubble p { margin: 0; white-space: pre-line; }

  /* Bold support in bot messages */
  .ecb-bubble.bot b, .ecb-bubble.bot strong {
    color: #4F46E5; font-weight: 600;
  }

  /* Timestamp */
  .ecb-time {
    font-size: 10px; color: #9CA3AF; margin-top: 3px;
    padding: 0 4px; align-self: flex-end;
  }

  /* Typing indicator */
  .ecb-typing {
    display: flex; align-items: center; gap: 4px; padding: 11px 14px;
    background: #fff; border-radius: 18px; border-bottom-left-radius: 6px;
    border: 1px solid rgba(79,70,229,0.1); width: fit-content;
    box-shadow: 0 2px 8px rgba(79,70,229,0.07);
    animation: ecb-pop 0.25s cubic-bezier(.34,1.56,.64,1);
  }
  .ecb-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: linear-gradient(135deg, #4F46E5, #7C3AED);
    animation: ecb-bounce 1.2s infinite ease-in-out;
  }
  .ecb-dot:nth-child(1) { animation-delay: 0s; }
  .ecb-dot:nth-child(2) { animation-delay: 0.18s; }
  .ecb-dot:nth-child(3) { animation-delay: 0.36s; }
  @keyframes ecb-bounce {
    0%,60%,100% { transform: translateY(0); }
    30%          { transform: translateY(-6px); }
  }

  /* Quick replies */
  .ecb-quick-area {
    padding: 10px 14px; border-top: 1px solid rgba(79,70,229,0.07);
    background: #fff; display: flex; gap: 6px; flex-wrap: wrap;
  }
  .ecb-quick-btn {
    font-size: 11.5px; padding: 5px 12px; border-radius: 20px;
    background: rgba(79,70,229,0.06); color: #4F46E5;
    border: 1px solid rgba(79,70,229,0.18); cursor: pointer;
    font-weight: 500; transition: all 0.15s; white-space: nowrap;
    font-family: 'Inter', sans-serif;
  }
  .ecb-quick-btn:hover {
    background: linear-gradient(135deg, #4F46E5, #7C3AED);
    color: #fff; border-color: transparent;
    transform: translateY(-1px); box-shadow: 0 3px 10px rgba(79,70,229,0.3);
  }

  /* Input bar */
  .ecb-input-area {
    padding: 12px 14px 16px; border-top: 1px solid rgba(79,70,229,0.07);
    background: #fff; display: flex; gap: 10px; align-items: center;
  }
  .ecb-input {
    flex: 1; background: #F8F7FF; border: 1.5px solid rgba(79,70,229,0.15);
    border-radius: 14px; padding: 10px 15px; font-size: 13.5px;
    color: #1E1B4B; outline: none; font-family: 'Inter', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s;
    resize: none; height: 42px; line-height: 1.3;
  }
  .ecb-input:focus {
    border-color: #4F46E5;
    box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
  }
  .ecb-input::placeholder { color: #A5B4FC; }
  .ecb-send-btn {
    width: 42px; height: 42px; border-radius: 13px; flex-shrink: 0;
    background: linear-gradient(135deg, #4F46E5, #7C3AED);
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(79,70,229,0.4);
    transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s;
  }
  .ecb-send-btn:hover { transform: scale(1.08) translateY(-1px); box-shadow: 0 6px 18px rgba(79,70,229,0.5); }
  .ecb-send-btn:active { transform: scale(0.94); }
  .ecb-send-btn svg { width: 18px; height: 18px; }

  /* Date separator */
  .ecb-separator {
    display: flex; align-items: center; gap: 10px; margin: 4px 0;
  }
  .ecb-separator-line { flex: 1; height: 1px; background: rgba(79,70,229,0.1); }
  .ecb-separator-label { font-size: 10.5px; color: #9CA3AF; font-weight: 500; }

  /* Event card inside chat */
  .ecb-event-card {
    background: linear-gradient(135deg, rgba(79,70,229,0.06), rgba(124,58,237,0.06));
    border: 1px solid rgba(79,70,229,0.15); border-radius: 12px;
    padding: 10px 12px; margin-top: 6px; cursor: pointer;
    transition: all 0.2s;
  }
  .ecb-event-card:hover { border-color: rgba(79,70,229,0.4); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(79,70,229,0.12); }
  .ecb-event-title { font-size: 13px; font-weight: 600; color: #1E1B4B; margin: 0 0 4px; }
  .ecb-event-meta { display: flex; gap: 10px; font-size: 11.5px; color: #6B7280; }
  .ecb-event-badge {
    font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 6px;
    background: rgba(79,70,229,0.1); color: #4F46E5;
    display: inline-block; margin-top: 5px;
  }

  @media (max-width: 480px) {
    .ecb-window { width: calc(100vw - 24px); right: 12px; bottom: 96px; }
  }
`;

const parseMarkdownBold = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const TypingIndicator = () => (
  <div className="ecb-row">
    <div className="ecb-bot-avatar">🎟️</div>
    <div className="ecb-typing">
      <div className="ecb-dot" />
      <div className="ecb-dot" />
      <div className="ecb-dot" />
    </div>
  </div>
);

const MessageBubble = ({ msg }) => (
  <div className={`ecb-row ${msg.isBot ? 'bot' : 'user'}`}>
    {msg.isBot && <div className="ecb-bot-avatar">🎟️</div>}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isBot ? 'flex-start' : 'flex-end', gap: 2 }}>
      <div className={`ecb-bubble ${msg.isBot ? 'bot' : 'user'}`}>
        <p>{msg.isBot ? parseMarkdownBold(msg.text) : msg.text}</p>
        {msg.events && msg.events.map((ev, i) => (
          <div key={i} className="ecb-event-card">
            <p className="ecb-event-title">{ev.title}</p>
            <div className="ecb-event-meta">
              <span>📅 {ev.date}</span>
              <span>💰 {ev.price}</span>
            </div>
            {ev.spots && <span className="ecb-event-badge">{ev.spots} spots left</span>}
          </div>
        ))}
      </div>
      <span className="ecb-time">{msg.time}</span>
    </div>
  </div>
);

const EventChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNew, setHasNew] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! 👋 I'm your Event Assistant. I can help you discover events, register, manage your QR tickets, or handle payments.",
      isBot: true,
      time: formatTime(),
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleOpen = () => { setIsOpen(true); setHasNew(false); };

  const isAskingForEvents = (msg) => {
    const m = msg.toLowerCase();
    return m.includes('event') &&
      (m.includes('available') || m.includes('upcoming') ||
       m.includes('show') || m.includes('list') ||
       m.includes('what') || m.includes('find'));
  };

  const fetchAndShowEvents = async () => {
    try {
      const response = await eventService.getPublicEvents();
      const events = response?.data?.events || response?.data || [];

      if (events.length === 0) {
        return {
          text: "No events are available right now. Please check back later!",
          events: []
        };
      }

      const eventCards = events.map(ev => ({
        title: ev.title,
        date: ev.startDate ? new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA',
        price: ev.tickets?.length > 0
          ? `LKR ${Math.min(...ev.tickets.map(t => Number(t.price) || 0)).toLocaleString()}`
          : 'Free',
        spots: ev.spotsLeft || null,
      }));

      return {
        text: `Here are ${events.length} available event${events.length > 1 ? 's' : ''} I found:`,
        events: eventCards
      };
    } catch (err) {
      return { text: "Sorry, I couldn't fetch events right now. Please try again shortly.", events: [] };
    }
  };

  const getBotResponse = async (userMessage) => {
    const msg = userMessage.toLowerCase().trim();

    if (isAskingForEvents(userMessage)) return await fetchAndShowEvents();

    if (msg.includes('register') || msg.includes('how to join') || msg.includes('sign up')) {
      return { text: "To register for an event:\n\n1️⃣ Go to the **Events** page\n2️⃣ Click on an event card\n3️⃣ Hit **Register Now**\n4️⃣ Fill in your details & pay if required\n\nYou'll receive a confirmation email instantly!" };
    }
    if (msg.includes('qr') || msg.includes('ticket') || msg.includes('attendance')) {
      return { text: "Your **QR ticket** is available in **My Events** after registration. The organizer will scan it at the venue entrance — no printing needed!" };
    }
    if (msg.includes('payment') || msg.includes('pay') || msg.includes('slip')) {
      return { text: "Upload your **bank payment slip** from the event detail page or **My Events** section. Our team verifies it within 24 hours. 🏦" };
    }
    if (msg.includes('free')) {
      return { text: "Yes! Many events are completely **free** 🎉. Look for events marked **LKR 0** on the Events page." };
    }
    if (msg.includes('cancel') || msg.includes('refund')) {
      return { text: "To cancel a registration, go to **My Events** and select the event. Refund policies vary per event — check the event details page for specifics." };
    }
    if (msg.includes('help') || msg.includes('hello') || msg.includes('hi')) {
      return { text: "Hello! 👋 Here's what I can help you with:\n\n• 🎪 **Browse events** — find upcoming events\n• 📝 **Registration** — how to join events\n• 🎫 **QR tickets** — access your tickets\n• 💳 **Payments** — billing & payment slips\n• ❌ **Cancellations** — refunds & cancellations" };
    }

    return { text: "I'm here to help! Try asking:\n\n• **What events are available?**\n• **How do I register?**\n• **Where is my QR ticket?**\n• **How do I upload a payment slip?**" };
  };

  const sendMessage = async (userMsg) => {
    if (!userMsg.trim()) return;

    const userEntry = { id: Date.now(), text: userMsg, isBot: false, time: formatTime() };
    setMessages(prev => [...prev, userEntry]);
    setInput('');
    setTyping(true);

    await new Promise(r => setTimeout(r, 700 + Math.random() * 600));

    const response = await getBotResponse(userMsg);
    setTyping(false);

    const botEntry = {
      id: Date.now() + 1,
      text: response.text,
      events: response.events || [],
      isBot: true,
      time: formatTime(),
    };
    setMessages(prev => [...prev, botEntry]);
  };

  const handleSend = () => sendMessage(input);

  const quickReplies = [
    "What events are available?",
    "How do I register?",
    "My QR ticket",
    "Payment help",
    "Free events",
  ];

  return (
    <div className="ecb-root">
      <style>{styles}</style>

      {/* FAB */}
      <button className="ecb-fab" onClick={isOpen ? () => setIsOpen(false) : handleOpen} aria-label="Open chat">
        {hasNew && !isOpen && <span className="ecb-notif" />}
        <span className="ecb-fab-icon">
          {isOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ecb-window">

          {/* Header */}
          <div className="ecb-header">
            <div className="ecb-header-top">
              <div className="ecb-avatar">🎟️</div>
              <div className="ecb-header-info">
                <p className="ecb-header-name">Event Assistant</p>
                <div className="ecb-header-status">
                  <span className="ecb-status-dot" />
                  <span className="ecb-status-text">Live · Connected to database</span>
                </div>
              </div>
              <button className="ecb-close-btn" onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <span className="ecb-powered">⚡ Powered by real-time event data</span>
          </div>

          {/* Messages */}
          <div className="ecb-messages">
            <div className="ecb-separator">
              <div className="ecb-separator-line" />
              <span className="ecb-separator-label">Today</span>
              <div className="ecb-separator-line" />
            </div>

            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}

            {typing && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="ecb-quick-area">
            {quickReplies.map((r, i) => (
              <button key={i} className="ecb-quick-btn" onClick={() => sendMessage(r)}>{r}</button>
            ))}
          </div>

          {/* Input */}
          <div className="ecb-input-area">
            <input
              className="ecb-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about events…"
            />
            <button className="ecb-send-btn" onClick={handleSend}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default EventChatbot;