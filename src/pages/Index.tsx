import React from "react";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="bg-[#FAF4ED] min-h-screen flex flex-col items-center">
      {/* Navbar */}
      <nav className="navbar flex justify-between items-center w-full max-w-7xl py-6 px-6 lg:px-12">
        <div className="text-2xl font-bold text-gray-800">rayna ui</div>
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <a href="#">About Us</a>
          <a href="#">Products</a>
          <a href="#">Pricing</a>
          <a href="#">Resources</a>
          <a href="#">FAQs</a>
        </div>
        <div className="flex space-x-4">
          <button className="text-gray-700">Log in</button>
          <Button className="bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600">
            Start Free Trial
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero flex flex-col items-center text-center py-24 px-6">
        <span className="text-sm bg-orange-200 text-orange-700 px-4 py-1 rounded-full mb-4">
          Taking payments to the next level
        </span>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight max-w-3xl">
          Send, Receive, and Transact with Ease.
        </h1>
        <p className="text-lg text-gray-600 mt-4 max-w-2xl">
          Launch your business with templates that showcase products, explain pricing, and convert users into customers.
        </p>
        <Button className="cta-button mt-6">Start Free Trial</Button>
      </header>

      {/* Features Section */}
      <section className="features grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
        <div className="feature-item">
          <span className="text-orange-500 text-3xl">💬</span>
          <p className="text-gray-700 mt-2">24/7 Customer Support</p>
        </div>
        <div className="feature-item">
          <span className="text-orange-500 text-3xl">🎁</span>
          <p className="text-gray-700 mt-2">Cashback & Rewards</p>
        </div>
        <div className="feature-item">
          <span className="text-orange-500 text-3xl">🛡️</span>
          <p className="text-gray-700 mt-2">Fraud Protection</p>
        </div>
        <div className="feature-item">
          <span className="text-orange-500 text-3xl">⚡</span>
          <p className="text-gray-700 mt-2">Instant Transfers</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
