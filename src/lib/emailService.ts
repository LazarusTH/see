import { supabase } from './supabase';

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (template: EmailTemplate) => {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: JSON.stringify(template)
    });

    if (error) {
      console.error('Email sending failed:', error);
      // Don't throw error, just log it to prevent transaction failure
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export const emailTemplates = {
  welcomeEmail: (firstName: string) => ({
    subject: 'Welcome to Cashora! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Cashora, ${firstName}!</h1>
        <p>We're excited to have you on board. With Cashora, you can:</p>
        <ul>
          <li>Send and receive money instantly</li>
          <li>Make secure withdrawals</li>
          <li>Track your transactions</li>
          <li>Manage your finances with ease</li>
        </ul>
        <p>If you have any questions, our support team is here to help!</p>
        <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0;">The Cashora Team</p>
        </div>
      </div>
    `
  }),

  transactionConfirmation: (senderName: string, amount: number, recipientEmail: string) => ({
    subject: 'Money Sent Successfully! 💸',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Transaction Confirmation</h1>
        <p>Hi ${senderName},</p>
        <p>Your money transfer has been processed successfully!</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0;">Transaction Details:</h3>
          <p style="margin: 10px 0;">Amount: $${amount.toFixed(2)}</p>
          <p style="margin: 10px 0;">Recipient: ${recipientEmail}</p>
        </div>
        
        <p>Thank you for using Cashora!</p>
        <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0;">The Cashora Team</p>
        </div>
      </div>
    `
  }),

  moneyReceived: (recipientName: string, amount: number, senderEmail: string) => ({
    subject: 'You've Received Money! 💰',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Money Received</h1>
        <p>Hi ${recipientName},</p>
        <p>You have received a money transfer!</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0;">Transaction Details:</h3>
          <p style="margin: 10px 0;">Amount: $${amount.toFixed(2)}</p>
          <p style="margin: 10px 0;">From: ${senderEmail}</p>
        </div>
        
        <p>The money has been added to your Cashora balance.</p>
        <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0;">The Cashora Team</p>
        </div>
      </div>
    `
  }),

  withdrawalRequest: (userName: string, amount: number, bankName: string) => ({
    subject: 'Withdrawal Request Submitted',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Withdrawal Request Received</h1>
        <p>Hi ${userName},</p>
        <p>Your withdrawal request has been submitted and is pending approval.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0;">Withdrawal Details:</h3>
          <p style="margin: 10px 0;">Amount: $${amount.toFixed(2)}</p>
          <p style="margin: 10px 0;">Bank: ${bankName}</p>
        </div>
        
        <p>We'll notify you once your withdrawal request has been processed.</p>
        <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0;">The Cashora Team</p>
        </div>
      </div>
    `
  }),

  adminWithdrawalNotification: (userName: string, amount: number, bankName: string) => ({
    subject: 'New Withdrawal Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Withdrawal Request</h1>
        <p>A new withdrawal request requires your attention.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0;">Request Details:</h3>
          <p style="margin: 10px 0;">User: ${userName}</p>
          <p style="margin: 10px 0;">Amount: $${amount.toFixed(2)}</p>
          <p style="margin: 10px 0;">Bank: ${bankName}</p>
        </div>
        
        <p>Please review and process this request in the admin portal.</p>
        <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0;">The Cashora System</p>
        </div>
      </div>
    `
  }),

  depositConfirmation: (userName: string, amount: number) => ({
    subject: 'Deposit Confirmed! 💰',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Deposit Confirmation</h1>
        <p>Hi ${userName},</p>
        <p>Your deposit has been successfully processed!</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0;">Transaction Details:</h3>
          <p style="margin: 10px 0;">Amount: $${amount.toFixed(2)}</p>
          <p style="margin: 10px 0;">Status: Approved</p>
        </div>
        
        <p>The funds have been added to your account balance.</p>
        <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0;">The Cashora Team</p>
        </div>
      </div>
    `
  }),

  adminDepositNotification: (userName: string, amount: number, receiptUrl: string | null) => ({
    subject: 'New Deposit Request 💳',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Deposit Request</h1>
        <p>A new deposit request requires your attention.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0;">Deposit Details:</h3>
          <p style="margin: 10px 0;">User: ${userName}</p>
          <p style="margin: 10px 0;">Amount: $${amount.toFixed(2)}</p>
          ${receiptUrl ? `<p style="margin: 10px 0;">Receipt: <a href="${receiptUrl}">View Receipt</a></p>` : ''}
        </div>
        
        <p>Please review and process this deposit request in the admin portal.</p>
        <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0;">The Cashora System</p>
        </div>
      </div>
    `
  }),

  withdrawalApproved: (userName: string, amount: number, bankName: string) => ({
    subject: 'Withdrawal Approved ✅',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Withdrawal Approved</h1>
        <p>Hi ${userName},</p>
        <p>Your withdrawal request has been approved and processed!</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0;">Withdrawal Details:</h3>
          <p style="margin: 10px 0;">Amount: $${amount.toFixed(2)}</p>
          <p style="margin: 10px 0;">Bank: ${bankName || 'Your bank'}</p>
          <p style="margin: 10px 0;">Status: Approved</p>
        </div>
        
        <p>The funds should appear in your bank account within 1-3 business days.</p>
        <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5;">
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 5px 0;">The Cashora Team</p>
        </div>
      </div>
    `
  })
};