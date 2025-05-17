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
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && session.user?.id) {
      fetchExpenses();
    }
  }, [session]);

  const fetchExpenses = async () => {
    const response = await fetch("/api/expenses");
    const data = await response.json();
    if (!data.error) setExpenses(data);
  };

  // ...other functions (handleExpenseAdded, getCategoryColor, etc.) remain unchanged...

  // If not authenticated or still loading, render nothing (redirect will happen)
  if (status !== "authenticated") return null;

  return (
    <div className="p-6">
      <button
        className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        Logout
      </button>
      <h1 className="text-blue-500">Database connected successfully</h1>
    </div>
  );
}