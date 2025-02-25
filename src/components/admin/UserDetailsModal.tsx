import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { toast } from "react-toastify";

const UserDetailsModal = ({ user, onClose }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  const fetchUserDetails = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Fetch user profile from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(`
          id, first_name, last_name, username, date_of_birth, place_of_birth,
          residence, nationality, id_card_url, status, role, balance, created_at,
          email
        `)
        .eq("id", user.id)
        .single();

      if (profileError) throw new Error(profileError.message);
      if (!profileData) throw new Error("User profile not found");

      // Fetch user bank information
      const { data: userBankData, error: userBankError } = await supabase
        .from("user_banks")
        .select(`
          bank_id, assigned_at
        `)
        .eq("user_id", user.id)
        .single(); // expects only one row

      if (userBankError) throw new Error(userBankError.message);
      if (!userBankData) throw new Error("User bank information not found");

      // Fetch bank details using bank_id from user_banks
      const { data: bankData, error: bankError } = await supabase
        .from("banks")
        .select(`name`)
        .eq("id", userBankData?.bank_id) // bank_id from user_banks
        .single();

      if (bankError) throw new Error(bankError.message);
      if (!bankData) throw new Error("Bank data not found");

      // Fetch user limits information
      const { data: userLimitsData, error: userLimitsError } = await supabase
        .from("user_limits")
        .select(`
          daily_limit, weekly_limit, monthly_limit, transaction_type
        `)
        .eq("user_id", user.id)
        .single(); // expects only one row

      if (userLimitsError) throw new Error(userLimitsError.message);
      if (!userLimitsData) throw new Error("User limits not found");

      // Fetch other necessary data (e.g., fees, transactions)
      const { data: feesData, error: feesError } = await supabase
        .from("fees")
        .select(`
          fee_value, fee_type, transaction_type
        `)
        .eq("user_id", user.id)
        .single();

      if (feesError) throw new Error(feesError.message);

      const { data: transactionsData, error: transactionsError } = await supabase
        .from("transactions")
        .select(`
          id, amount, fee, total_amount, transaction_details, type, status,
          receipt_url, recipient_email, recipient_username, account_name,
          account_number, full_name, account_holder_name, created_at
        `)
        .eq("user_id", user.id);

      if (transactionsError) throw new Error(transactionsError.message);

      // Set state with all fetched data
      setUserDetails({
        profile: profileData,
        bank: bankData,
        userBank: userBankData,
        userLimits: userLimitsData,
        fees: feesData,
        transactions: transactionsData,
      });

    } catch (error) {
      toast.error(error.message || "Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userDetails) {
    return <div>No user details found</div>;
  }

  return (
    <div className="modal">
      <div className="modal-header">
        <h2>User Details</h2>
        <button onClick={onClose}>&times;</button>
      </div>
      <div className="modal-body">
        <div>
          <h3>Profile Information</h3>
          <p><strong>Name:</strong> {userDetails.profile.first_name} {userDetails.profile.last_name}</p>
          <p><strong>Email:</strong> {userDetails.profile.email}</p>
          <p><strong>Username:</strong> {userDetails.profile.username}</p>
          <p><strong>Status:</strong> {userDetails.profile.status}</p>
          <p><strong>Balance:</strong> {userDetails.profile.balance}</p>
          <p><strong>Role:</strong> {userDetails.profile.role}</p>
        </div>
        <div>
          <h3>Bank Information</h3>
          <p><strong>Bank:</strong> {userDetails.bank.name}</p>
          <p><strong>Assigned At:</strong> {userDetails.userBank.assigned_at}</p>
        </div>
        <div>
          <h3>User Limits</h3>
          <p><strong>Daily Limit:</strong> {userDetails.userLimits.daily_limit}</p>
          <p><strong>Weekly Limit:</strong> {userDetails.userLimits.weekly_limit}</p>
          <p><strong>Monthly Limit:</strong> {userDetails.userLimits.monthly_limit}</p>
          <p><strong>Transaction Type:</strong> {userDetails.userLimits.transaction_type}</p>
        </div>
        <div>
          <h3>Fees</h3>
          {userDetails.fees ? (
            <>
              <p><strong>Fee Value:</strong> {userDetails.fees.fee_value}</p>
              <p><strong>Fee Type:</strong> {userDetails.fees.fee_type}</p>
              <p><strong>Transaction Type:</strong> {userDetails.fees.transaction_type}</p>
            </>
          ) : (
            <p>No fee data available.</p>
          )}
        </div>
        <div>
          <h3>Transactions</h3>
          {userDetails.transactions.length > 0 ? (
            <ul>
              {userDetails.transactions.map((transaction) => (
                <li key={transaction.id}>
                  <p><strong>Amount:</strong> {transaction.amount}</p>
                  <p><strong>Status:</strong> {transaction.status}</p>
                  <p><strong>Details:</strong> {transaction.transaction_details}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      </div>
      <div className="modal-footer">
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UserDetailsModal;
