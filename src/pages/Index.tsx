import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Wallet, Clock, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[20rem] h-[20rem] bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[25rem] h-[25rem] bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 animate-fade-in">
            Luminos
          </div>
          <div className="space-x-4">
            <Link to="/signin">
              <Button variant="ghost" className="text-white/80 hover:text-white transition-all duration-300">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300">Join Now</Button>
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 animate-fade-in-up">
            Unleash Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Financial Future</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto animate-fade-in-up delay-200">
            Dive into a world of effortless transactions, ironclad security, and limitless possibilities with Luminos.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 gap-2 transform hover:scale-105 transition-all duration-300">
              Ignite Your Journey <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16 animate-fade-in-up">What Makes Luminos Shine?</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="group p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-indigo-400 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up">
                <Shield className="w-14 h-14 text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold mb-3">Fortress-Level Security</h3>
                <p className="text-white/70">
                  Your assets are guarded by cutting-edge encryption and proactive defense systems.
                </p>
              </div>
              <div className="group p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-purple-400 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up delay-100">
                <Wallet className="w-14 h-14 text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold mb-3">Lightning Transfers</h3>
                <p className="text-white/70">
                  Move money across the globe in the blink of an eye with zero hassle.
                </p>
              </div>
              <div className="group p-8 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 hover:border-indigo-400 transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up delay-200">
                <Clock className="w-14 h-14 text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold mb-3">Always On, Always Yours</h3>
                <p className="text-white/70">
                  Access your finances 24/7 from any corner of the universe.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 bg-gradient-to-r from-indigo-800 to-purple-800">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8 animate-fade-in-up">Ready to Glow?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-100">
              Join a constellation of visionaries already thriving with Luminos.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-100 gap-2 transform hover:scale-105 transition-all duration-300">
                Light Up Your Account <Sparkles className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-16 border-t border-white/10">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-10">
              <div className="animate-fade-in-up">
                <h3 className="text-xl font-semibold mb-4">Luminos</h3>
                <p className="text-sm text-white/70">
                  Illuminating the path to financial freedom with innovation and trust.
                </p>
              </div>
              <div className="animate-fade-in-up delay-100">
                <h3 className="text-xl font-semibold mb-4">Explore</h3>
                <ul className="space-y-3 text-sm text-white/70">
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Security</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Plans</a></li>
                </ul>
              </div>
              <div className="animate-fade-in-up delay-200">
                <h3 className="text-xl font-semibold mb-4">Help</h3>
                <ul className="space-y-3 text-sm text-white/70">
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Support</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div className="animate-fade-in-up delay-300">
                <h3 className="text-xl font-semibold mb-4">Legal</h3>
                <ul className="space-y-3 text-sm text-white/70">
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Compliance</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/60 animate-fade-in-up delay-400">
              © {new Date().getFullYear()} Luminos. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
