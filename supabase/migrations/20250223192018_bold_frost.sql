/*
  # Fix transaction limits and add dashboard features
  
  1. Changes
    - Fix transaction limit calculation to consider total amounts correctly
    - Add functions for dashboard analytics
    
  2. Security
    - Maintain existing RLS policies
*/

-- Fix the check_transaction_limits function
CREATE OR REPLACE FUNCTION check_transaction_limits()
RETURNS trigger AS $$
DECLARE
  daily_total numeric;
  weekly_total numeric;
  monthly_total numeric;
  user_daily_limit numeric;
  user_weekly_limit numeric;
  user_monthly_limit numeric;
BEGIN
  -- Get user limits
  SELECT 
    COALESCE(daily_limit, 0),
    COALESCE(weekly_limit, 0),
    COALESCE(monthly_limit, 0)
  INTO 
    user_daily_limit,
    user_weekly_limit,
    user_monthly_limit
  FROM user_limits
  WHERE user_id = NEW.user_id
  AND transaction_type = NEW.type
  LIMIT 1;

  -- Calculate totals including the total_amount
  SELECT COALESCE(SUM(amount), 0)
  INTO daily_total
  FROM transactions
  WHERE user_id = NEW.user_id
  AND type = NEW.type
  AND status = 'approved'
  AND created_at >= CURRENT_DATE;

  SELECT COALESCE(SUM(amount), 0)
  INTO weekly_total
  FROM transactions
  WHERE user_id = NEW.user_id
  AND type = NEW.type
  AND status = 'approved'
  AND created_at >= date_trunc('week', CURRENT_DATE);

  SELECT COALESCE(SUM(amount), 0)
  INTO monthly_total
  FROM transactions
  WHERE user_id = NEW.user_id
  AND type = NEW.type
  AND status = 'approved'
  AND created_at >= date_trunc('month', CURRENT_DATE);

  -- Check if new transaction would exceed limits
  IF user_daily_limit > 0 AND (daily_total + NEW.amount) > user_daily_limit THEN
    RAISE EXCEPTION 'Daily limit of % would be exceeded. Current total: %', user_daily_limit, daily_total;
  END IF;

  IF user_weekly_limit > 0 AND (weekly_total + NEW.amount) > user_weekly_limit THEN
    RAISE EXCEPTION 'Weekly limit of % would be exceeded. Current total: %', user_weekly_limit, weekly_total;
  END IF;

  IF user_monthly_limit > 0 AND (monthly_total + NEW.amount) > user_monthly_limit THEN
    RAISE EXCEPTION 'Monthly limit of % would be exceeded. Current total: %', user_monthly_limit, monthly_total;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user dashboard stats
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_id uuid)
RETURNS TABLE (
  total_sent numeric,
  total_withdrawn numeric,
  total_deposits numeric,
  transaction_count bigint
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN type = 'send' THEN amount ELSE 0 END), 0) as total_sent,
    COALESCE(SUM(CASE WHEN type = 'withdrawal' THEN amount ELSE 0 END), 0) as total_withdrawn,
    COALESCE(SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END), 0) as total_deposits,
    COUNT(*) as transaction_count
  FROM transactions
  WHERE transactions.user_id = $1
  AND status = 'approved';
END;
$$;

-- Create function to get admin dashboard stats
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
  total_transactions bigint,
  total_deposits numeric,
  total_withdrawals numeric,
  total_sent numeric,
  total_users bigint,
  total_fees numeric
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_transactions,
    COALESCE(SUM(CASE WHEN type = 'deposit' THEN amount ELSE 0 END), 0) as total_deposits,
    COALESCE(SUM(CASE WHEN type = 'withdrawal' THEN amount ELSE 0 END), 0) as total_withdrawals,
    COALESCE(SUM(CASE WHEN type = 'send' THEN amount ELSE 0 END), 0) as total_sent,
    (SELECT COUNT(*) FROM profiles) as total_users,
    COALESCE(SUM(fee), 0) as total_fees
  FROM transactions
  WHERE status = 'approved';
END;
$$;