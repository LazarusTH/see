import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Wallet, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-orange-300">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-orange-600">Cashora</div>
        <div className="space-x-4">
          <Link to="/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Get Started</Button>
          </Link>
        </div>
      </nav>
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6 py-20 text-center"
      >
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Send, Receive, and Transact with Ease.
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Launch your business with templates that showcase products, explain pricing, and convert users into customers.
        </p>
        <Link to="/signup">
          <Button size="lg" className="gap-2 bg-orange-500 hover:bg-orange-600 text-white">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
      
      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Cashora?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-gray-100 rounded-lg shadow-md border">
              <Shield className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">State-of-the-art security measures to protect your financial data.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-gray-100 rounded-lg shadow-md border">
              <Wallet className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Transfers</h3>
              <p className="text-gray-600">Send and receive money instantly with our streamlined system.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-gray-100 rounded-lg shadow-md border">
              <Clock className="w-12 h-12 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Access</h3>
              <p className="text-gray-600">Manage your finances anytime, anywhere.</p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-orange-500 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of users who trust Cashora.</p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="gap-2 bg-white text-orange-500 hover:bg-gray-100">
              Create Your Account <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
