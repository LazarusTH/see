import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Wallet, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-purple-500 text-white overflow-hidden">
        <nav className="container mx-auto flex justify-between items-center py-6 px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
          >
            Cashora
          </motion.div>
          <div className="space-x-4">
            <Link to="/signin">
              <Button variant="ghost" className="text-white">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-white text-indigo-600">Get Started</Button>
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-6 text-center py-20">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold tracking-tight leading-tight"
          >
            Revolutionizing Digital Finance
          </motion.h1>
          <p className="text-lg opacity-80 mt-4 max-w-2xl mx-auto">
            Secure, seamless, and smart financial solutions for the modern age.
          </p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-6"
          >
            <Link to="/signup">
              <Button size="lg" className="bg-white text-indigo-600 gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Why Choose Cashora?</h2>
          <div className="grid md:grid-cols-3 gap-12 mt-10">
            {[{
              icon: <Shield className="w-12 h-12 text-indigo-600" />, 
              title: "Top-notch Security", 
              description: "Advanced encryption and fraud protection."
            }, {
              icon: <Wallet className="w-12 h-12 text-indigo-600" />, 
              title: "Easy Transfers", 
              description: "Fast and effortless transactions anytime."
            }, {
              icon: <Clock className="w-12 h-12 text-indigo-600" />, 
              title: "24/7 Access", 
              description: "Manage your funds anywhere, anytime."
            }].map((feature, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-100 rounded-lg shadow-lg"
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
                <p className="text-gray-600 mt-2">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-indigo-600 text-white text-center">
        <h2 className="text-3xl font-bold">Join Cashora Today</h2>
        <p className="mt-4 text-lg opacity-90">Secure your financial future with Cashora.</p>
        <Link to="/signup">
          <Button size="lg" variant="secondary" className="mt-6">
            Sign Up Now <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white">Cashora</h3>
            <p className="mt-2">Secure and seamless financial solutions.</p>
          </div>
         
        <div className="text-center mt-8 text-sm">
          © {new Date().getFullYear()} Cashora. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
