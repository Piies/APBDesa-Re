// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import IncomeForm from './IncomeForm';
import ExpenseForm from './ExpenseForm';

// Define categories
const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F'];

const Dashboard = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Fetch data
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

  // 1. General Totals
  const totalIncome = incomes.reduce((acc, income) => acc + parseFloat(income.amount), 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);

  // 2. Income Breakdown
  const incomeByCategory = incomes.reduce((acc, income) => {
    const { category, amount } = income;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(amount);
    return acc;
  }, {});

  // 3. Expense Allocation (Customizable Logic)
  const expenseAllocation = expenses.reduce((acc, expense) => {
    const { categories, amount } = expense;
    // --- THIS IS THE CUSTOMIZABLE LOGIC ---
    // If an expense has categories, sort them alphabetically and assign the
    // full amount to the first category in the list.
    if (categories && categories.length > 0) {
      const primaryCategory = [...categories].sort()[0]; // Sort and take the first
      if (!acc[primaryCategory]) {
        acc[primaryCategory] = 0;
      }
      acc[primaryCategory] += parseFloat(amount);
    }
    // --- END OF CUSTOMIZABLE LOGIC ---
    return acc;
  }, {});

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

      {/* --- BREAKDOWN TABLES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Income Breakdown Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Income Breakdown</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="p-3 font-medium text-slate-600">Category</th>
                <th className="p-3 font-medium text-slate-600">Total Income</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map(category => (
                <tr key={category} className="border-b border-slate-200 last:border-b-0">
                  <td className="p-3 text-slate-800">Category {category}</td>
                  <td className="p-3 text-slate-800 font-mono">
                    ${(incomeByCategory[category] || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* NEW: Expense Allocation Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Expense Allocation</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="p-3 font-medium text-slate-600">Category</th>
                <th className="p-3 font-medium text-slate-600">Allocated Expenses</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map(category => (
                <tr key={category} className="border-b border-slate-200 last:border-b-0">
                  <td className="p-3 text-slate-800">Category {category}</td>
                  <td className="p-3 text-slate-800 font-mono">
                    ${(expenseAllocation[category] || 0).toFixed(2)}
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