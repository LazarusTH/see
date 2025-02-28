import React from 'react';
import { motion } from 'framer-motion';

const App = () => {
  // Inline styles for each section
  const heroSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 20px',
    backgroundColor: '#111',
    color: '#fff',
    textAlign: 'center',
  };

  const heroTitleStyle = {
    fontSize: '3.5rem',
    color: 'yellow',
  };

  const heroSubtitleStyle = {
    fontSize: '1.5rem',
    color: '#fff',
    marginBottom: '20px',
  };

  const heroStatsStyle = {
    fontSize: '1.2rem',
    color: '#fff',
    margin: '10px 0',
  };

  const ctaBtnStyle = {
    padding: '15px 25px',
    backgroundColor: 'yellow',
    border: 'none',
    color: 'black',
    cursor: 'pointer',
    fontSize: '1.2rem',
    borderRadius: '5px',
  };

  const featuresSectionStyle = {
    padding: '80px 20px',
    backgroundColor: '#f4f4f4',
    textAlign: 'center',
  };

  const featuresTitleStyle = {
    fontSize: '2.5rem',
    marginBottom: '40px',
  };

  const featuresCardsStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '30px',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '30%',
    textAlign: 'center',
  };

  const featureIconStyle = {
    fontSize: '3rem',
    color: 'yellow',
    marginBottom: '20px',
  };

  const testimonialSectionStyle = {
    padding: '50px 20px',
    backgroundColor: '#111',
    color: '#fff',
    textAlign: 'center',
  };

  const testimonialTitleStyle = {
    fontSize: '2.5rem',
    marginBottom: '30px',
  };

  const testimonialCardStyle = {
    backgroundColor: '#fff',
    color: '#000',
    padding: '30px',
    width: '50%',
    margin: '0 auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const footerSectionStyle = {
    backgroundColor: '#111',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
  };

  return (
    <div className="App">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={heroSectionStyle}
      >
        <h1 style={heroTitleStyle}>Manage Your All Daily Transaction</h1>
        <p style={heroSubtitleStyle}>Fintech that works for you.</p>
        <div style={heroStatsStyle}>250k+ Users | 200k+ Transactions</div>
        <p style={heroStatsStyle}>See Our Amazing Features Below</p>
        <button style={ctaBtnStyle}>Get Started</button>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={featuresSectionStyle}
      >
        <h2 style={featuresTitleStyle}>See Our Advantages</h2>
        <div style={featuresCardsStyle}>
          <div style={cardStyle}>
            <div style={featureIconStyle}>💼</div>
            <h3>Manage Finances</h3>
            <p>Track your daily transactions with ease.</p>
          </div>
          <div style={cardStyle}>
            <div style={featureIconStyle}>📊</div>
            <h3>Advanced Analytics</h3>
            <p>Get insights and make informed decisions.</p>
          </div>
          <div style={cardStyle}>
            <div style={featureIconStyle}>📱</div>
            <h3>Mobile Access</h3>
            <p>Access your finances anytime, anywhere.</p>
          </div>
        </div>
      </motion.div>

      {/* Testimonial Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={testimonialSectionStyle}
      >
        <h2 style={testimonialTitleStyle}>What Our Clients Say</h2>
        <div style={testimonialCardStyle}>
          <p>"Excellent service and easy to use. My finances have never been better!"</p>
          <h4>- Client Name</h4>
          <div>⭐⭐⭐⭐⭐</div>
        </div>
      </motion.div>

      {/* Footer Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={footerSectionStyle}
      >
        <p>&copy; 2025 Your Company. All Rights Reserved.</p>
      </motion.div>
    </div>
  );
};

export default App;
