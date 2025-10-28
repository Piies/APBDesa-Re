// src/components/ExpenseForm.jsx
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config'; // Correct import path

const EXPENSE_CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F'];

const ExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (selectedCategories.length === 0) {
      setError('Please select at least one category.');
      return;
    }

    try {
      await addDoc(collection(db, 'expenses'), {
        amount: parseFloat(amount),
        categories: selectedCategories,
        createdAt: new Date(),
      });
      setAmount('');
      setSelectedCategories([]);
    } catch (err) {
      setError('Failed to log expense. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">Log Predicted Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="expense-amount" className="block text-sm font-medium text-slate-600">
            Amount
          </label>
          <input
            id="expense-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 300"
            className="mt-1 scheme-light text-black block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600">Applicable Categories</label>
          <div className="mt-2 grid grid-cols-3 gap-4">
            {EXPENSE_CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={handleCheckboxChange}
                  className="scheme-light text-rose-600 focus:ring-rose-500"
                />
                <span className="text-slate-700">Category {cat}</span>
              </label>
            ))}
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;