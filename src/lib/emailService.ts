import { supabase } from './supabase';

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export const emailTemplates = {
  welcomeEmail: (firstName: string) => ({
    subject: "Welcome to Cashora!",
    html: `
      <h1>Welcome ${firstName}!</h1>
      <p>Thank you for joining Cashora. We're excited to have you on board.</p>
    `
  }),

  transactionConfirmation: (senderName: string, amount: number, recipientEmail: string) => ({
    subject: "Transaction Confirmation",
    html: `
      <h1>Transaction Successful</h1>
      <p>Dear ${senderName},</p>
      <p>You have successfully sent $${amount.toFixed(2)} to ${recipientEmail}.</p>
    `
  }),

  moneyReceived: (recipientName: string, amount: number, senderEmail: string) => ({
    subject: "You have Received Money!",
    html: `
      <h1>Money Received</h1>
      <p>Dear ${recipientName},</p>
      <p>You have received $${amount.toFixed(2)} from ${senderEmail}.</p>
    `
  }),

  withdrawalRequest: (userName: string, amount: number, bankName: string) => ({
    subject: "Withdrawal Request Submitted",
    html: `
      <h1>Withdrawal Request Received</h1>
      <p>Dear ${userName},</p>
      <p>Your withdrawal request for $${amount.toFixed(2)} to ${bankName} has been submitted.</p>
      <p>We will process your request shortly.</p>
    `
  }),

  adminWithdrawalNotification: (userName: string, amount: number, bankName: string) => ({
    subject: "New Withdrawal Request",
    html: `
      <h1>New Withdrawal Request</h1>
      <p>User ${userName} has requested a withdrawal of $${amount.toFixed(2)} to ${bankName}.</p>
      <p>Please review and process this request.</p>
    `
  }),

  adminDepositNotification: (userName: string, amount: number, receiptUrl: string | null) => ({
    subject: "New Deposit Request",
    html: `
      <h1>New Deposit Request</h1>
      <p>User ${userName} has submitted a deposit of $${amount.toFixed(2)}.</p>
      ${receiptUrl ? `<p>Receipt: <a href="${receiptUrl}">View Receipt</a></p>` : ''}
      <p>Please review and process this request.</p>
    `
  }),

  depositConfirmation: (userName: string, amount: number) => ({
    subject: "Deposit Approved",
    html: `
      <h1>Deposit Approved</h1>
      <p>Dear ${userName},</p>
      <p>Your deposit of $${amount.toFixed(2)} has been approved and added to your account.</p>
    `
  }),

  withdrawalApproved: (userName: string, amount: number, bankName: string) => ({
    subject: "Withdrawal Approved",
    html: `
      <h1>Withdrawal Approved</h1>
      <p>Dear ${userName},</p>
      <p>Your withdrawal request for $${amount.toFixed(2)} to ${bankName} has been approved.</p>
      <p>The funds will be transferred to your account shortly.</p>
    `
  })
};

export const sendEmail = async (template: EmailTemplate) => {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: JSON.stringify(template)
    });

    if (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export const sendEmailWithFallback = async (emailData: EmailTemplate) => {
  const { success, error } = await sendEmail(emailData);
  if (!success) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
  return { success: true };
};