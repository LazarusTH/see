import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Wallet, Clock } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="container mx-auto flex items-center justify-between py-6 px-6">
        <div className="text-2xl font-bold text-primary">Cashora</div>
        <div className="space-x-4">
          <Link to="/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button className="cta-button">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section bg-gradient-to-b from-primary/5 to-primary/10 relative overflow-hidden">
        <div className="container mx-auto text-center py-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            Empowering Your Finances with Cashora
          </motion.h1>
          <p className="hero-subtitle">
            Secure, Fast, and Seamless Transactions
          </p>
          <Link to="/signup">
            <Button size="lg" className="cta-button gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Cashora?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{
              icon: Shield,
              title: "Secure Transactions",
              description: "State-of-the-art security measures to protect your financial data."
            }, {
              icon: Wallet,
              title: "Easy Transfers",
              description: "Send and receive money instantly with our streamlined transfer system."
            }, {
              icon: Clock,
              title: "24/7 Access",
              description: "Manage your finances anytime, anywhere with our always-on platform."
            }].map(({ icon: Icon, title, description }, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="feature-card"
              >
                <Icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary text-primary-foreground py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of users who trust Cashora for their financial needs.
        </p>
        <Link to="/signup">
          <Button size="lg" variant="secondary" className="gap-2">
            Create Your Account <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t py-12 text-center">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Cashora. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
