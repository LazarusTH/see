import React from 'react';
import { motion } from 'framer-motion';

const App = () => {
  // Inline styles for Navbar
  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '30px 50px',
    backgroundColor: '#fff',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  };

  const navbarLogoStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#FFEB3B', // Yellow color
  };

  const navbarLinksStyle = {
    display: 'flex',
    gap: '30px',
    listStyle: 'none',
  };

  const navbarLinkStyle = {
    fontSize: '1.1rem',
    color: '#333',
    cursor: 'pointer',
    fontWeight: '500',
  };

  const buttonStyle = {
    backgroundColor: '#FFEB3B', // Yellow color
    border: 'none',
    padding: '12px 24px',
    color: 'black',
    cursor: 'pointer',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  };

  // Inline styles for Hero Section
  const heroSectionStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '150px 50px 100px',
    backgroundColor: '#111',
    color: '#fff',
    marginTop: '80px',
  };

  const heroTextStyle = {
    width: '50%',
  };

  const heroTitleStyle = {
    fontSize: '4rem',
    fontWeight: '700',
    color: '#FFEB3B',
    lineHeight: '1.2',
    marginBottom: '20px',
  };

  const heroSubtitleStyle = {
    fontSize: '1.3rem',
    color: '#fff',
    fontWeight: '400',
    marginBottom: '30px',
    lineHeight: '1.6',
  };

  const heroStatsStyle = {
    fontSize: '1.3rem',
    color: '#fff',
    marginBottom: '30px',
    fontWeight: '400',
  };

  const buttonsContainerStyle = {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
  };

  const heroImageStyle = {
    width: '45%',
    backgroundImage: 'url(https://via.placeholder.com/350x550)', // Replace with actual image URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '500px',
    borderRadius: '15px',
  };

  return (
    <div className="App">
      {/* Navbar Section */}
      <div style={navbarStyle}>
        <div style={navbarLogoStyle}>Fluent</div>
        <ul style={navbarLinksStyle}>
          <li style={navbarLinkStyle}>Home</li>
          <li style={navbarLinkStyle}>About Us</li>
          <li style={navbarLinkStyle}>Services</li>
          <li style={navbarLinkStyle}>Compare</li>
          <li style={navbarLinkStyle}>Contact Us</li>
          <li style={navbarLinkStyle}>Pages</li>
        </ul>
        <div>
          <button style={buttonStyle}>Sign In</button>
          <button style={{ ...buttonStyle, marginLeft: '15px' }}>Sign Up</button>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={heroSectionStyle}
      >
        <div style={heroTextStyle}>
          <h1 style={heroTitleStyle}>Manage Your All Daily Transaction</h1>
          <p style={heroSubtitleStyle}>
            With Finnen, you can transfer your money in a second. We also provide you with secure transfer, don't need any frustrations! Sometimes, I'm really impressed with my own product.
          </p>
          <div style={heroStatsStyle}>280k+ Users use the app | 220k+ People trust us</div>
          <div style={buttonsContainerStyle}>
            <button style={{ ...buttonStyle, backgroundColor: '#333' }}>Download App</button>
            <button style={{ ...buttonStyle, backgroundColor: 'transparent', color: '#fff' }}>Learn More</button>
          </div>
        </div>
        <div style={heroImageStyle}></div>
      </motion.div>
    </div>
  );
};

export default App;
