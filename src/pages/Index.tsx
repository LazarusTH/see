import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CreditCard, Clock, Gift } from "lucide-react";

const CashoraLandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">

      {/* Hero Section */}
      <section className="hero text-center py-16 px-6 bg-cover bg-center relative"
        style={{ backgroundImage: 'url(/path/to/your-web3-background.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Empowering Your Finances with Cashora
          </h1>
          <p className="text-lg md:text-xl text-white mb-8">
            Secure, Fast, and Seamless Transactions
          </p>
          <div className="space-x-4">
            <Link to="/signup">
              <Button className="cta-button">Get Started <ArrowRight className="w-5 h-5 ml-2" /></Button>
            </Link>
            <Link to="/signin">
              <Button variant="ghost" className="text-white border-white hover:bg-white hover:text-blue-600">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Cashora Section */}
      <section className="about py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold text-orange-600 mb-4">About Cashora</h2>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Cashora is a powerful platform designed to give you control over your finances. With secure, fast, and seamless transactions, Cashora makes managing your money easier than ever.
        </p>
        <ul className="list-disc text-lg text-left max-w-xl mx-auto mb-8">
          <li>Secure transactions with multi-layer security</li>
          <li>Admin approval for added security</li>
          <li>Real-time tracking for complete transparency</li>
        </ul>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works py-16 bg-gray-100">
        <h2 className="text-3xl font-semibold text-center text-orange-600 mb-8">How It Works</h2>
        <div className="steps grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          <div className="step text-center">
            <h3 className="text-lg font-semibold mb-4">Sign Up & Get Verified</h3>
            <p>Register and complete the verification process to start using Cashora.</p>
          </div>
          <div className="step text-center">
            <h3 className="text-lg font-semibold mb-4">Deposit Funds Securely</h3>
            <p>Fund your Cashora account with ease and security.</p>
          </div>
          <div className="step text-center">
            <h3 className="text-lg font-semibold mb-4">Withdraw & Send Money Easily</h3>
            <p>Send and withdraw money with just a few clicks.</p>
          </div>
          <div className="step text-center">
            <h3 className="text-lg font-semibold mb-4">Track Transactions in Real-Time</h3>
            <p>Keep an eye on all your transactions as they happen.</p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="key-features py-16 px-6">
        <h2 className="text-3xl font-semibold text-center text-orange-600 mb-8">Key Features</h2>
        <div className="features grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="feature text-center">
            <Shield className="mx-auto mb-4 text-orange-600" size={40} />
            <h3 className="text-lg font-semibold">User-friendly Interface</h3>
          </div>
          <div className="feature text-center">
            <CreditCard className="mx-auto mb-4 text-orange-600" size={40} />
            <h3 className="text-lg font-semibold">Secure & Fast Transactions</h3>
          </div>
          <div className="feature text-center">
            <Clock className="mx-auto mb-4 text-orange-600" size={40} />
            <h3 className="text-lg font-semibold">Admin-Controlled Approvals</h3>
          </div>
          <div className="feature text-center">
            <Gift className="mx-auto mb-4 text-orange-600" size={40} />
            <h3 className="text-lg font-semibold">Email Notifications for Every Action</h3>
          </div>
        </div>
      </section>

      {/* Why Choose Cashora Section */}
      <section className="why-choose py-16 bg-gray-100">
        <h2 className="text-3xl font-semibold text-center text-orange-600 mb-8">Why Choose Cashora?</h2>
        <ul className="list-disc text-lg text-left max-w-xl mx-auto mb-8">
          <li>Low transaction fees</li>
          <li>24/7 customer support</li>
          <li>Interactive dashboard & reports</li>
          <li>Personalized settings for limits & fees</li>
        </ul>
      </section>

      {/* User Testimonials Section */}
      <section className="testimonials py-16 px-6">
        <h2 className="text-3xl font-semibold text-center text-orange-600 mb-8">What Our Users Say</h2>
        <div className="testimonials-list grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="testimonial text-center bg-white p-6 shadow-lg rounded-lg">
            <p className="text-lg mb-4">"Cashora has transformed the way I manage my money. Transactions are secure, fast, and hassle-free."</p>
            <div className="flex justify-center items-center">
              <img src="/path/to/avatar.jpg" alt="User Avatar" className="w-12 h-12 rounded-full mr-4" />
              <span className="font-semibold">John Doe</span>
            </div>
          </div>
          <div className="testimonial text-center bg-white p-6 shadow-lg rounded-lg">
            <p className="text-lg mb-4">"I love the real-time tracking feature. I always know where my money is!"</p>
            <div className="flex justify-center items-center">
              <img src="/path/to/avatar.jpg" alt="User Avatar" className="w-12 h-12 rounded-full mr-4" />
              <span className="font-semibold">Jane Smith</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="faqs py-16 px-6">
        <h2 className="text-3xl font-semibold text-center text-orange-600 mb-8">FAQs</h2>
        <div className="faq-item mb-4">
          <h3 className="text-lg font-semibold">How do I deposit money into my Cashora account?</h3>
          <p className="text-lg">You can easily deposit funds into your account using a variety of payment methods. Simply follow the on-screen instructions.</p>
        </div>
        <div className="faq-item mb-4">
          <h3 className="text-lg font-semibold">What are the withdrawal limits?</h3>
          <p className="text-lg">The withdrawal limits depend on your account verification level. Check your settings for more details.</p>
        </div>
        <div className="faq-item mb-4">
          <h3 className="text-lg font-semibold">How does the approval process work?</h3>
          <p className="text-lg">All transactions are subject to admin approval for added security. You will be notified once your transaction is approved.</p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="cta py-16 text-center bg-orange-600 text-white">
        <h2 className="text-3xl font-semibold mb-4">Join Cashora today & take control of your finances!</h2>
        <Link to="/signup">
          <Button className="cta-button">Get Started</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer py-6 text-center bg-gray-200">
        <p className="text-sm">© {new Date().getFullYear()} Cashora. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default CashoraLandingPage;
