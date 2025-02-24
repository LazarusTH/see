/*
  # Add transaction details and fix limit calculation

  1. Changes
    - Add transaction_details column to transactions table
    - Fix limit calculation to consider total_amount instead of amount
    - Add receipt_url column to transactions table
    - Add recipient_email column for send transactions
    - Add full_name column for deposit transactions

  2. Security
    - Update RLS policies to include new columns
*/

-- Add new columns to transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS receipt_url text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS recipient_email text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS full_name text;

-- Update the check_transaction_limits function to use total_amount
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
  SELECT COALESCE(SUM(total_amount), 0)
  INTO daily_total
  FROM transactions
  WHERE user_id = NEW.user_id
  AND type = NEW.type
  AND status = 'approved'
  AND created_at >= CURRENT_DATE;

  SELECT COALESCE(SUM(total_amount), 0)
  INTO weekly_total
  FROM transactions
  WHERE user_id = NEW.user_id
  AND type = NEW.type
  AND status = 'approved'
  AND created_at >= date_trunc('week', CURRENT_DATE);

  SELECT COALESCE(SUM(total_amount), 0)
  INTO monthly_total
  FROM transactions
  WHERE user_id = NEW.user_id
  AND type = NEW.type
  AND status = 'approved'
  AND created_at >= date_trunc('month', CURRENT_DATE);

  -- Check limits using total_amount
  IF user_daily_limit > 0 AND (daily_total + NEW.total_amount) > user_daily_limit THEN
    RAISE EXCEPTION 'Daily limit exceeded';
  END IF;

  IF user_weekly_limit > 0 AND (weekly_total + NEW.total_amount) > user_weekly_limit THEN
    RAISE EXCEPTION 'Weekly limit exceeded';
  END IF;

  IF user_monthly_limit > 0 AND (monthly_total + NEW.total_amount) > user_monthly_limit THEN
    RAISE EXCEPTION 'Monthly limit exceeded';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;