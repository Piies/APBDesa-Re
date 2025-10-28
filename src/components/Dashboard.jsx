// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import IncomeForm from './IncomeForm';
import ExpenseForm from './ExpenseForm';

// Define categories for consistent ordering in the UI
const INCOME_CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F'];

const Dashboard = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Fetch data in real-time with onSnapshot
  useEffect(() => {
    const unsubscribeIncomes = onSnapshot(collection(db, "incomes"), (snapshot) => {
      const incomesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIncomes(incomesData);
    });

    const unsubscribeExpenses = onSnapshot(collection(db, "expenses"), (snapshot) => {
      const expensesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(expensesData);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribeIncomes();
      unsubscribeExpenses();
    };
  }, []);

  // --- CALCULATION LOGIC ---

  // Calculate total income and expenses
  const totalIncome = incomes.reduce((acc, income) => acc + parseFloat(income.amount), 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);

  // Calculate income broken down by category
  const incomeByCategory = incomes.reduce((acc, income) => {
    const { category, amount } = income;
    // If the accumulator doesn't have this category yet, initialize it
    if (!acc[category]) {
      acc[category] = 0;
    }
    // Add the amount to the corresponding category
    acc[category] += parseFloat(amount);
    return acc;
  }, {}); // Start with an empty object

  return (
    <div className="space-y-8">
      {/* --- FORMS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <IncomeForm />
        <ExpenseForm />
      </div>

      {/* --- FINANCIAL OVERVIEW TABLE --- */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Financial Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="p-3 text-lg font-medium text-slate-600">Metric</th>
                <th className="p-3 text-lg font-medium text-slate-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-3 text-slate-800">Total Income</td>
                <td className="p-3 text-green-600 font-bold">${totalIncome.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="p-3 text-slate-800">Total Predicted Expenses</td>
                <td className="p-3 text-red-600 font-bold">${totalExpenses.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- NEW: INCOME BREAKDOWN TABLE --- */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Income Breakdown by Category</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="p-3 text-lg font-medium text-slate-600">Category</th>
                <th className="p-3 text-lg font-medium text-slate-600">Total Income</th>
              </tr>
            </thead>
            <tbody>
              {INCOME_CATEGORIES.map(category => (
                <tr key={category} className="border-b border-slate-200 last:border-b-0">
                  <td className="p-3 text-slate-800">Category {category}</td>
                  {/* Use the calculated 'incomeByCategory' object, defaulting to 0 if a category has no income */}
                  <td className="p-3 text-slate-800 font-mono">
                    ${(incomeByCategory[category] || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;