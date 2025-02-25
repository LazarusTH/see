import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid } from '@mui/material';
import { supabase } from '../utils/supabaseClient'; // Assuming you've set up Supabase client

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ open, onClose, userId }) => {
  const [userDetails, setUserDetails] = useState<any>({});
  const [userLimits, setUserLimits] = useState<any[]>([]);
  const [userBanks, setUserBanks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch user details
  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Error fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user limits
  const fetchUserLimits = async () => {
    try {
      const { data, error } = await supabase
        .from('user_limits')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      setUserLimits(data);
    } catch (error) {
      console.error("Error fetching user limits:", error);
      alert("Error fetching user limits.");
    }
  };

  // Fetch user banks
  const fetchUserBanks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_banks')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      setUserBanks(data);
    } catch (error) {
      console.error("Error fetching user banks:", error);
      alert("Error fetching user banks.");
    }
  };

  // Fetch all data
  const fetchData = async () => {
    await fetchUserDetails();
    await fetchUserLimits();
    await fetchUserBanks();
  };

  useEffect(() => {
    if (open && userId) {
      fetchData();
    }
  }, [open, userId]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>User Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="User Name"
                  variant="outlined"
                  fullWidth
                  value={userDetails.username || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={userDetails.email || ''}
                  disabled
                />
              </Grid>
            </Grid>

            <h3>User Limits</h3>
            <Grid container spacing={2}>
              {userLimits.length === 0 ? (
                <div>No limits available</div>
              ) : (
                userLimits.map((limit, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      label={`Limit ${index + 1}`}
                      variant="outlined"
                      fullWidth
                      value={limit.limit_value || ''}
                      disabled
                    />
                  </Grid>
                ))
              )}
            </Grid>

            <h3>User Banks</h3>
            <Grid container spacing={2}>
              {userBanks.length === 0 ? (
                <div>No bank accounts available</div>
              ) : (
                userBanks.map((bank, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <TextField
                      label={`Bank ${index + 1}`}
                      variant="outlined"
                      fullWidth
                      value={bank.bank_name || ''}
                      disabled
                    />
                  </Grid>
                ))
              )}
            </Grid>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsModal;
