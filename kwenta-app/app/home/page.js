"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && session.user.id) {
      fetchExpenses();
    }
  }, [session]);

  const fetchExpenses = async () => {
    const response = await fetch("/api/expenses");
    const data = await response.json();
    if (!data.error) setExpenses(data);
  };

  const handleExpenseAdded = (updatedExpenses) => {
    setExpenses(updatedExpenses); // Update the expenses state
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Food":
        return "bg-blue-800";
      case "School":
        return "bg-red-800";
      case "Shopping":
        return "bg-gradient-to-r from-yellow-600 to-green-700";
      case "Transportation":
        return "bg-green-800";
      case "Utilities":
        return "bg-purple-800";
      default:
        return "bg-gray-600"; // Default color
    }
  };

  const calculateCategoryTotals = () => {
    const totals = {};

    expenses.forEach((expense) => {
      if (totals[expense.category]) {
        totals[expense.category] += Number(expense.amount);
      } else {
        totals[expense.category] = Number(expense.amount);
      }
    });

    return totals;
  };

  const getSortedCategoryTotals = () => {
    const totals = calculateCategoryTotals();

    const sortedTotals = Object.keys(totals).map((category) => ({
      category,
      total: totals[category],
    }));

    sortedTotals.sort((a, b) => b.total - a.total);

    return sortedTotals;
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setExpenses(expenses.filter((expense) => expense.id !== id)); // Remove the deleted expense
    } else {
      console.log("Error deleting expense");
    }
  };

  const handleEdit = (expense) => {
    const date = new Date(expense.current_date);
  
    // Get the local date in YYYY-MM-DD format
    const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  
    setEditingExpense(expense.id);
    setUpdatedData({
      amount: expense.amount,
      category: expense.category,
      expense_note: expense.expense_note,
      current_date: localDate, // Now correctly preserves local date
    });
  };

  const handleUpdate = async (id) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === id ? { ...expense, ...updatedData } : expense,
        ),
      );
      setEditingExpense(null); // Reset editing state
    } else {
      console.log("Error updating expense");
    }
  };

  if (status === "loading")
    return <p className="p-6 text-blue-500">Loading...</p>;
  if (!session) return null;

  return (
    <h1 className="p-6 text-blue-500">Database connected successfully</h1>
  );
}