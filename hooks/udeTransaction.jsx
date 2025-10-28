import { useCallback, useState } from "react";
import { Alert } from "react-native";
const API_URL = "http://localhost:5001/api";
export const useTransaction = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summery, setSummery] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Hook to fetch transactions for a user for that specific user id
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);
  // Hook to fetch summery for a user based on the users transactions
  const fetchSummery = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summery/${userId}`);
      const data = await response.json();
      setSummery(data);
    } catch (error) {
      console.error("Error fetching summery:", error);
    }
  }, [userId]);
  // Loading state to handle loading of transactions and summery
  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummery()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchTransactions, fetchSummery]);
  // Hook to delete a transaction for a user based on the transaction id
  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error("Failed to delete transaction!, Try again later.");
      loadData();
      Alert.alert("Success", "Transaction deleted successfully.");
    } catch (error) {
      console.error("Error deleting transactions: ", error);
      Alert.alert("Error", error.message);
    }
  };

  return {
    transactions,
    summery,
    isLoading,
    loadData,
    deleteTransaction,
  };
};
