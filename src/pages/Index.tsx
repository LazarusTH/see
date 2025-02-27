import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Gift, Headphones, Zap } from "lucide-react";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="bg-[#FAF4ED] min-h-screen flex flex-col items-center">
      {/* Navbar */}
      <nav className="navbar flex justify-between items-center w-full max-w-7xl py-6 px-6 lg:px-12">
        <div className="text-2xl font-bold text-gray-800">rayna ui</div>
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <a href="#" className="hover:text-orange-500 transition">About Us</a>
          <a href="#" className="hover:text-orange-500 transition">Products</a>
          <a href="#" className="hover:text-orange-500 transition">Pricing</a>
          <a href="#" className="hover:text-orange-500 transition">Resources</a>
          <a href="#" className="hover:text-orange-500 transition">FAQs</a>
        </div>
        <div className="flex space-x-4">
          <button className="text-gray-700 hover:text-orange-500 transition">Log in</button>
          <Button className="bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition">
            Start Free Trial
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero flex flex-col items-center text-center py-24 px-6">
        <motion.span 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="text-sm bg-orange-200 text-orange-700 px-4 py-1 rounded-full mb-4"
        >
          Taking payments to the next level
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-gray-900 leading-tight max-w-3xl"
        >
          Send, Receive, and Transact with Ease.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          className="text-lg text-gray-600 mt-4 max-w-2xl"
        >
          Launch your business with templates that showcase products, explain pricing, and convert users into customers.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <Button className="cta-button mt-6 bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition">
            Start Free Trial
          </Button>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="features grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
        {[{
          icon: Headphones,
          title: "24/7 Customer Support"
        }, {
          icon: Gift,
          title: "Cashback & Rewards"
        }, {
          icon: ShieldCheck,
          title: "Fraud Protection"
        }, {
          icon: Zap,
          title: "Instant Transfers"
        }].map(({ icon: Icon, title }, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="feature-item p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <Icon className="text-orange-500 w-12 h-12 mx-auto mb-4" />
            <p className="text-gray-700 mt-2 font-semibold">{title}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
