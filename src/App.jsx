// src/App.jsx
import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <main className="bg-slate-100 min-h-screen font-sans">
      <div className="w-full container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 text-center">
            APB Desa Prototype
          </h1>
        </header>
        <Dashboard />
      </div>
    </main>
  );
}

export default App;