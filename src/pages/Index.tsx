import React from "react";
import { Link } from "react-router-dom"; // If using React Router

const Index: React.FC = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <header className="hero">
        <h1>Welcome to Cashora</h1>
        <p>Your gateway to seamless financial solutions</p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn primary">Sign Up</Link>
          <Link to="/signin" className="btn secondary">Sign In</Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Cashora?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>Fast & Secure</h3>
            <p>Experience lightning-fast transactions with top-tier security.</p>
          </div>
          <div className="feature-item">
            <h3>User-Friendly</h3>
            <p>Our platform is designed for ease of use and convenience.</p>
          </div>
          <div className="feature-item">
            <h3>24/7 Support</h3>
            <p>We are here to assist you anytime, anywhere.</p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Cashora. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
