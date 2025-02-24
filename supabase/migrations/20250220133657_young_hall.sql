/*
  # Database Functions for Banking System

  1. Functions
    - create_profile_for_new_user: Creates a new user profile
    - check_transaction_limits: Validates transaction limits
    - update_user_balance: Updates user balance on transaction approval
*/

-- Function to create a new user profile
CREATE OR REPLACE FUNCTION create_profile_for_new_user(
  p_id uuid,
  p_first_name text,
  p_last_name text,
  p_username text,
  p_date_of_birth date,
  p_place_of_birth text,
  p_residence text,
  p_nationality text,
  p_id_card_url text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (
    id,
    first_name,
    last_name,
    username,
    date_of_birth,
    place_of_birth,
    residence,
    nationality,
    id_card_url,
    status,
    balance
  ) VALUES (
    p_id,
    p_first_name,
    p_last_name,
    p_username,
    p_date_of_birth,
    p_place_of_birth,
    p_residence,
    p_nationality,
    p_id_card_url,
    'pending',
    0
  );
END;
$$;

-- Function to get user transaction summary
CREATE OR REPLACE FUNCTION get_user_transaction_summary(
  p_user_id uuid,
  p_transaction_type text,
  p_start_date timestamp,
  p_end_date timestamp
)
RETURNS TABLE (
  total_amount numeric,
  transaction_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(amount), 0) as total_amount,
    COUNT(*) as transaction_count
  FROM transactions
  WHERE user_id = p_user_id
    AND type = p_transaction_type
    AND status = 'approved'
    AND created_at BETWEEN p_start_date AND p_end_date;
END;
$$;

-- Function to check if user has sufficient balance
CREATE OR REPLACE FUNCTION check_sufficient_balance(
  p_user_id uuid,
  p_amount numeric
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_balance numeric;
BEGIN
  SELECT balance INTO v_balance
  FROM profiles
  WHERE id = p_user_id;
  
  RETURN v_balance >= p_amount;
END;
$$;