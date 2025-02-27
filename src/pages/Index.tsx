import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CreditCard, Clock, Gift } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white">
      
      {/* Navigation */}
      <nav className="navbar">
        <div className="text-2xl font-bold text-orange-600">rayna UI</div>
        <div className="hidden md:flex space-x-6">
          <a href="#">About Us</a>
          <a href="#">Products</a>
          <a href="#">Pricing</a>
          <a href="#">Resources</a>
          <a href="#">FAQs</a>
        </div>
        <div className="flex space-x-4">
          <Link to="/signin">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button className="cta-button">Start Free Trial</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero fade-in">
        <span className="text-orange-600 font-medium bg-orange-100 px-3 py-1 rounded-full">
          Taking payments to the next level
        </span>
        <h1 className="mt-4">
          Send, Receive, and <br />
          Transact with Ease.
        </h1>
        <p>
          Launch your business with templates that showcase products, explain
          pricing, and convert users into customers. Professional design for
          attracting investors and clients.
        </p>
        <Link to="/signup">
          <Button className="cta-button">
            Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>

        {/* Features */}
        <div className="features">
          <div className="feature-item">
            <Shield />
            <h3 className="text-lg font-semibold">Fraud Protection</h3>
          </div>
          <div className="feature-item">
            <CreditCard />
            <h3 className="text-lg font-semibold">Instant Transfers</h3>
          </div>
          <div className="feature-item">
            <Clock />
            <h3 className="text-lg font-semibold">24/7 Support</h3>
          </div>
          <div className="feature-item">
            <Gift />
            <h3 className="text-lg font-semibold">Cashback & Rewards</h3>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} rayna UI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
