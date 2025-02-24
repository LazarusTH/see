import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Wallet, Clock, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-3xl font-extrabold text-white">Cashora</div>
        <div className="space-x-4">
          <Link to="/signin">
            <Button variant="ghost" className="text-white border border-white">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-blue-500 hover:bg-blue-600">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto text-center py-20 px-6">
        <motion.h1 
          className="text-6xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Secure Financial Solutions <br /> for the Digital Age
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Experience seamless transactions, robust security, and complete financial management with Cashora’s next-gen platform.
        </motion.p>
        <Link to="/signup">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-700 hover:to-blue-800 transition-transform transform hover:scale-105">
            Start Your Journey <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Why Choose Cashora?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div className="p-6 bg-gray-800 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }}>
              <Shield className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-300">State-of-the-art security measures to protect your financial data.</p>
            </motion.div>
            <motion.div className="p-6 bg-gray-800 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }}>
              <Wallet className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Easy Transfers</h3>
              <p className="text-gray-300">Send and receive money instantly with our streamlined system.</p>
            </motion.div>
            <motion.div className="p-6 bg-gray-800 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }}>
              <Clock className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">24/7 Access</h3>
              <p className="text-gray-300">Manage your finances anytime, anywhere with our always-on platform.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-700 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg text-gray-200 mb-8">
          Join thousands of users who trust Cashora for their financial needs.
        </p>
        <Link to="/signup">
          <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-200">
            Create Your Account <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-black py-12 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Cashora. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
