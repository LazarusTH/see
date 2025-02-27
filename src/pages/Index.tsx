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
        <motion.img 
          src="https://source.unsplash.com/featured/?blackman,finance"
          alt="Financial empowerment"
          className="mt-10 w-full max-w-3xl rounded-lg shadow-lg"
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
            transition={{ delay: index * 0.2 }}
            className="feature-item p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <Icon className="text-orange-500 w-12 h-12 mx-auto mb-4" />
            <p className="text-gray-700 mt-2 font-semibold">{title}</p>
          </motion.div>
        ))}
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us py-16 px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-gray-900 text-center mb-8"
        >
          Why Choose Us?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="feature-item p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <ShieldCheck className="text-orange-500 w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Transactions</h3>
            <p className="text-gray-600">
              We use the latest security measures to protect your financial data.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="feature-item p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <Zap className="text-orange-500 w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Instant Transfers</h3>
            <p className="text-gray-600">
              Send and receive money instantly with our fast and reliable platform.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="feature-item p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <Headphones className="text-orange-500 w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">24/7 Support</h3>
            <p className="text-gray-600">
              Our dedicated support team is available around the clock to assist you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="pricing-plans py-16 px-6 bg-gray-100">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-gray-900 text-center mb-8"
        >
          Pricing Plans
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pricing-plan p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Basic</h3>
            <p className="text-gray-600 mb-4">Free</p>
            <ul className="text-gray-700">
              <li>Limited Transactions</li>
              <li>Basic Support</li>
            </ul>
            <Button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition">
              Get Started
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pricing-plan p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Standard</h3>
            <p className="text-gray-600 mb-4">$9.99/month</p>
            <ul className="text-gray-700">
              <li>Unlimited Transactions</li>
              <li>Priority Support</li>
            </ul>
            <Button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition">
              Get Started
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pricing-plan p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition text-center"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Premium</h3>
            <p className="text-gray-600 mb-4">$19.99/month</p>
            <ul className="text-gray-700">
              <li>Unlimited Transactions</li>
              <li>24/7 Support</li>
              <li>Dedicated Account Manager</li>
            </ul>
            <Button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-orange-600 transition">
              Get Started
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials py-16 px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-gray-900 text-center mb-8"
        >
          Testimonials
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="testimonial p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <p className="text-gray-700 mb-4">
              "This platform has revolutionized the way I manage my finances. It's secure, easy to use, and the support team is always there to help."
            </p>
            <p className="text-gray-800 font-semibold">- John Doe</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="testimonial p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <p className="text-gray-700 mb-4">
              "I've tried other platforms, but this one is by far the best. The instant transfers and fraud protection give me peace of mind."
            </p>
            <p className="text-gray-800 font-semibold">- Jane Smith</p>
          </motion.div>
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
          Ready to Get Started?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-lg text-gray-700 mb-12"
        >
          Sign up for a free trial and experience the future of finance.
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
    </div>
  );
};

export default LandingPage;
