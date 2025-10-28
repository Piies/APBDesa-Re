// src/components/IncomeForm.jsx
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config'; // Correct import path

const INCOME_CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F'];

const IncomeForm = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(INCOME_CATEGORIES[0]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    try {
      await addDoc(collection(db, 'incomes'), {
        amount: parseFloat(amount),
        category: category,
        createdAt: new Date(),
      });
      setAmount('');
      setCategory(INCOME_CATEGORIES[0]);
    } catch (err) {
      setError('Failed to log income. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">Log Income</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="income-amount" className="block text-sm font-medium text-slate-600">
            Amount
          </label>
          <input
            id="income-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 1500"
            className="mt-1 scheme-light text-black block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="income-category" className="block text-sm font-medium text-slate-600">
            Category
          </label>
          <select
            id="income-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 text-black block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {INCOME_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category {cat}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Income
        </button>
      </form>
    </div>
  );
};

export default IncomeForm;