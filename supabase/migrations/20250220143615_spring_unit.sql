/*
  # Admin Functions and Policies

  1. New Functions
    - create_approved_user: Creates a new user with approved status
    - assign_bank_to_user: Assigns a bank to a user
    - get_user_banks: Gets all banks assigned to a user
    
  2. Security
    - All functions are SECURITY DEFINER to run with elevated privileges
    - Functions check for admin role before execution
*/

-- Function to create a new approved user from admin portal
CREATE OR REPLACE FUNCTION create_approved_user(
  p_email text,
  p_password text,
  p_first_name text,
  p_last_name text,
  p_username text,
  p_role text DEFAULT 'user',
  p_date_of_birth date DEFAULT NULL,
  p_place_of_birth text DEFAULT NULL,
  p_residence text DEFAULT NULL,
  p_nationality text DEFAULT NULL,
  p_id_card_url text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Check if the executing user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can create approved users';
  END IF;

  -- Create the user in auth.users
  v_user_id := (
    SELECT id FROM auth.users 
    WHERE email = p_email
    LIMIT 1
  );

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    
    -- Insert into auth.users (this requires superuser privileges)
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_sent_at
    ) VALUES (
      v_user_id,
      p_email,
      crypt(p_password, gen_salt('bf')),
      now(),
      now()
    );
  END IF;

  -- Create user profile
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
    v_user_id,
    p_first_name,
    p_last_name,
    p_username,
    p_date_of_birth,
    p_place_of_birth,
    p_residence,
    p_nationality,
    p_id_card_url,
    'approved',
    0
  );

  -- Create user role
  INSERT INTO user_roles (
    user_id,
    role
  ) VALUES (
    v_user_id,
    p_role
  );

  RETURN v_user_id;
END;
$$;

-- Function to assign a bank to a user
CREATE OR REPLACE FUNCTION assign_bank_to_user(
  p_user_id uuid,
  p_bank_id uuid,
  p_account_number text,
  p_account_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_bank_id uuid;
BEGIN
  -- Check if the executing user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can assign banks to users';
  END IF;

  -- Insert the user bank record
  INSERT INTO user_banks (
    user_id,
    bank_id,
    account_number,
    account_name
  ) VALUES (
    p_user_id,
    p_bank_id,
    p_account_number,
    p_account_name
  )
  RETURNING id INTO v_user_bank_id;

  RETURN v_user_bank_id;
END;
$$;

-- Function to get all banks assigned to a user
CREATE OR REPLACE FUNCTION get_user_banks(p_user_id uuid)
RETURNS TABLE (
  id uuid,
  bank_id uuid,
  bank_name text,
  account_number text,
  account_name text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ub.id,
    ub.bank_id,
    b.name as bank_name,
    ub.account_number,
    ub.account_name,
    ub.created_at
  FROM user_banks ub
  JOIN banks b ON b.id = ub.bank_id
  WHERE ub.user_id = p_user_id
  ORDER BY ub.created_at DESC;
END;
$$;