import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How do I register for an event?",
      a: "Browse events, click on any event card, and click 'Register Now'. Fill the required details and complete payment if applicable."
    },
    {
      q: "How do I pay for an event?",
      a: "After registration, upload your bank payment slip through the event page or My Events section."
    },
    {
      q: "Where can I find my QR ticket?",
      a: "Your QR ticket is available in 'My Events' after successful registration."
    },
    {
      q: "Can I create my own event?",
      a: "Yes! Log in as an organizer and go to 'Create Event' from the dashboard."
    },
    {
      q: "Is there a refund policy?",
      a: "Refund policies are set by individual event organizers. Please check the event description."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-slate-600 mb-12">Find answers to common questions about EventManager.</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-lg">{faq.q}</span>
                <span className="text-2xl text-slate-400">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="px-8 pb-8 text-slate-600 leading-relaxed border-t">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;