import React from 'react';
import { createRoot } from 'react-dom/client';

function SimpleApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Employee Task Tracker</h1>
      <p>Application is starting...</p>
      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
        <h3>Demo Accounts:</h3>
        <p>Admin: admin@demo.com / password123</p>
        <p>Employee: employee@demo.com / password123</p>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<SimpleApp />);