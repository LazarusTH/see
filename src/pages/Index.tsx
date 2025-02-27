import React from "react";
import { Button } from "@/components/ui/button"; // Ensure this import is correct for your setup
import { ShieldCheck, Gift, Headphones, Zap } from "lucide-react";
import { motion } from "framer-motion";

// Background variants for smooth transition
const backgroundVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1 } },
};

const LandingPage = () => {
  return (
    <motion.div
      variants={backgroundVariants}
      initial="initial"
      animate="animate"
      className="relative bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex flex-col items-center overflow-hidden"
    >      
    {/* Background - Subtle Patterns or Gradients */}
      
      <div className="absolute inset-0 w-full h-full bg-[url('/grid.svg')] opacity-10 z-0" />

      <div className="relative z-10 w-full">
        {/* Navbar */}
        <nav className="navbar flex justify-between items-center w-full max-w-7xl py-6 px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl font-bold text-gray-800"
          >
            rayna ui
          </motion.div>
          <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <motion.a
              href="#"
              className="hover:text-orange-500 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              About Us
            </motion.a>
             <motion.a
              href="#"
              className="hover:text-orange-500 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Products
            </motion.a>
            
          </div>
          <div className="flex space-x-4">
            <button className="text-gray-700 hover:text-orange-500 transition">Log in</button>
            <Button className="bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition">Start Free Trial</Button>
          </div>
        </nav>

      </div>

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
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
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
        > <Button className="cta-button mt-6 bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition">
        Start Free Trial
      </Button>
        </motion.div>
        <motion.img 
          src="https://source.unsplash.com/featured/?blackman,finance"
          alt="Financial empowerment"
          className="mt-10 w-full max-w-3xl rounded-lg shadow-lg "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}

          
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
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
            transition={{ delay: index * 0.2, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" }}
            whileTap={{ scale: 0.95 }}

            
            className="feature-item p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <Icon className="text-orange-500 w-12 h-12 mx-auto mb-4" />
            <p className="text-gray-700 mt-2 font-semibold">{title}</p>
          </motion.div>
        ))}
      </section>

      {/* About Us Section */}
      <section className="about-us py-16 px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-gray-900 text-center mb-8"
          
        >
          About Cashora
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.img
            src="https://source.unsplash.com/featured/?finance,management"
            alt="About Cashora"
            className="rounded-lg shadow-lg "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}

          />
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-700 mb-4">
              Cashora is a financial management and transaction platform that empowers individuals and businesses to take control of their finances. We provide a secure, easy-to-use, and innovative solution for managing your money.
            </p>
            <p className="text-gray-700">
              Our mission is to revolutionize the way people interact with their finances, making it more accessible, transparent, and efficient.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Makes Us Apart Section */}
      <section className="what-makes-us-apart py-16 px-6 bg-gray-100">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-gray-900 text-center mb-8"
          

        >
          What Makes Us Apart?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" }}
            whileTap={{ scale: 0.95 }}

            className="feature-item p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <ShieldCheck className="text-orange-500 w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure and Reliable</h3>
            <p className="text-gray-600">
              We prioritize the security and reliability of our platform, ensuring your financial data is always protected.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            className="feature-item p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <Zap className="text-orange-500 w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovative Solutions</h3>
            <p className="text-gray-600">
              We are constantly innovating to provide you with the best financial management tools.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" }}
            whileTap={{ scale: 0.95 }}

            className="feature-item p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <Headphones className="text-orange-500 w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer-Centric Approach</h3>
            <p className="text-gray-600">
              We are committed to providing exceptional customer service and support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Financial Management Section */}
      <section className="financial-management py-16 px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-gray-900 text-center mb-8"
          
        >
          Take Control of Your Finances
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Manage Your Money with Ease
            </h3>
            <p className="text-gray-700 mb-4">
              Our platform provides you with the tools you need to manage your finances effectively. Track your spending, create budgets, and set financial goals.
            </p>
            <Button className="bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition">
              Learn More
            </Button>
          </motion.div>
          <motion.img
            src="https://source.unsplash.com/featured/?financial,planning"
            alt="Financial Management"
            className="rounded-lg shadow-lg "
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
          />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta py-24 px-6 bg-orange-100 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-gray-900 mb-8"
          
        >
          Ready to Transform Your Finances?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-lg text-gray-700 mb-12"
          
        >
          Sign up for a free trial and experience the power of Cashora.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          
        >
          <Button className="cta-button bg-orange-500 text-white px-8 py-3 rounded-full shadow-md hover:bg-orange-600 transition">
            Start Free Trial
          </Button>
        </motion.div>
        

      </section>

      {/* Footer Section */}
      <footer className="footer py-6 px-6 text-center text-gray-600">
        Copyright © {new Date().getFullYear()} Cashora. All rights reserved.
      </footer>
    </motion.div>
    
  );
};

export default LandingPage;
      </footer>
