/*
  # Banks and Banking System

  1. New Tables
    - `banks`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_banks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `bank_id` (uuid, references banks)
      - `account_number` (text)
      - `account_name` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text) - 'deposit', 'withdrawal', 'send'
      - `amount` (numeric)
      - `status` (text) - 'pending', 'approved', 'rejected'
      - `bank_id` (uuid, references banks)
      - `transaction_details` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create banks table
CREATE TABLE IF NOT EXISTS banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_banks table
CREATE TABLE IF NOT EXISTS user_banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  bank_id uuid REFERENCES banks(id) ON DELETE CASCADE,
  account_number text NOT NULL,
  account_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, bank_id, account_number)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'send')),
  amount numeric NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  bank_id uuid REFERENCES banks(id) ON DELETE CASCADE,
  transaction_details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Banks policies
CREATE POLICY "Allow admins full access to banks" ON banks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Allow users to view banks" ON banks
  FOR SELECT USING (true);

-- User banks policies
CREATE POLICY "Allow users to view their own bank accounts" ON user_banks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow admins full access to user banks" ON user_banks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Transactions policies
CREATE POLICY "Allow users to view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow admins full access to transactions" ON transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Functions for transaction management
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

  -- Calculate totals
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

  -- Check limits
  IF user_daily_limit > 0 AND (daily_total + NEW.amount) > user_daily_limit THEN
    RAISE EXCEPTION 'Daily limit exceeded';
  END IF;

  IF user_weekly_limit > 0 AND (weekly_total + NEW.amount) > user_weekly_limit THEN
    RAISE EXCEPTION 'Weekly limit exceeded';
  END IF;

  IF user_monthly_limit > 0 AND (monthly_total + NEW.amount) > user_monthly_limit THEN
    RAISE EXCEPTION 'Monthly limit exceeded';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_transaction_limits_trigger
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  WHEN (NEW.status = 'approved')
  EXECUTE FUNCTION check_transaction_limits();

-- Function to update user balance on transaction approval
CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    IF NEW.type = 'deposit' THEN
      UPDATE profiles 
      SET balance = balance + NEW.amount
      WHERE id = NEW.user_id;
    ELSIF NEW.type IN ('withdrawal', 'send') THEN
      UPDATE profiles 
      SET balance = balance - NEW.amount
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_balance_on_transaction
  AFTER UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_balance();