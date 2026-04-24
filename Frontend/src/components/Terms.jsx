import React from 'react';
import Navbar from '../components/Navbar';

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-slate-900 mb-10">Terms and Conditions</h1>
        
        <div className="prose prose-slate max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using EventManager, you agree to be bound by these Terms and Conditions.</p>

          <h2>2. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password.</p>

          <h2>3. Event Creation and Management</h2>
          <p>Organizers are solely responsible for the accuracy of event information and compliance with all applicable laws.</p>

          <h2>4. Payments and Refunds</h2>
          <p>All payments are processed securely. Refunds are subject to the organizer's refund policy.</p>

          <h2>5. Intellectual Property</h2>
          <p>All content on EventManager is protected by copyright and trademark laws.</p>

          <h2>6. Limitation of Liability</h2>
          <p>EventManager is provided "as is" without any warranties. We are not liable for any damages arising from use of the platform.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;