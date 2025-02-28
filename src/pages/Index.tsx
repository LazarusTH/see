
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { 
  ArrowRight, 
  Check, 
  CreditCard, 
  BarChart3, 
  DollarSign, 
  Shield, 
  Clock, 
  Star,
  ArrowUpRight,
  Bell,
  LineChart,
  Globe,
  Users,
  Search
} from "lucide-react";

// Inline CSS for fonts and additional styles
const inlineStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Archivo:wght@400;500;600;700&display=swap');
  
  body {
    font-family: 'Poppins', sans-serif;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Archivo', sans-serif;
  }
  
  .advantage-card {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    z-index: 1;
  }
  
  .advantage-card:hover {
    transform: translateY(-8px);
  }
  
  .advantage-card::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: #F4F53D;
    opacity: 0.1;
    transition: all 0.5s ease;
    z-index: -1;
  }
  
  .advantage-card:hover::before {
    height: 100%;
  }
  
  .feature-box {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .feature-box:hover {
    transform: translateY(-5px);
  }
  
  .feature-box::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 0;
    top: 0;
    left: 0;
    background-color: #F4F53D;
    transition: all 0.3s ease;
  }
  
  .feature-box:hover::after {
    height: 100%;
  }
  
  .card-btn {
    position: relative;
    overflow: hidden;
    z-index: 1;
  }
  
  .card-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    transition: all 0.4s ease;
    z-index: -1;
  }
  
  .card-btn:hover::before {
    left: 0;
  }
  
  .integration-card {
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }
  
  .integration-card:hover {
    border-color: #F4F53D;
    box-shadow: 0 10px 25px rgba(244, 245, 61, 0.2);
  }
  
  .quote-icon {
    opacity: 0.2;
    transition: all 0.5s ease;
  }
  
  .testimonial-card:hover .quote-icon {
    opacity: 0.4;
    transform: rotate(10deg);
  }
  
  .shine-effect {
    position: relative;
    overflow: hidden;
  }
  
  .shine-effect::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right, 
      rgba(255, 255, 255, 0) 0%, 
      rgba(255, 255, 255, 0.3) 50%, 
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    animation: shine 6s infinite linear;
  }
  
  @keyframes shine {
    from {
      transform: translateX(-100%) rotate(30deg);
    }
    to {
      transform: translateX(100%) rotate(30deg);
    }
  }
`;

const Index = () => {
  // Animation on scroll using Intersection Observer
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: featuresRef, inView: featuresInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: advantagesRef, inView: advantagesInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: platformRef, inView: platformInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: mobileRef, inView: mobileInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: savingsRef, inView: savingsInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: testimonialRef, inView: testimonialInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: footerRef, inView: footerInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Component for animated numbers
  const AnimatedCounter = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(count);
    const startTime = useRef<number | null>(null);
    
    useEffect(() => {
      if (advantagesInView) {
        const animateCount = (timestamp: number) => {
          if (!startTime.current) startTime.current = timestamp;
          const progress = timestamp - startTime.current;
          const increment = Math.floor((end / duration) * progress);
          
          if (progress < duration) {
            setCount(Math.min(increment, end));
            requestAnimationFrame(animateCount);
          } else {
            setCount(end);
          }
        };
        
        requestAnimationFrame(animateCount);
      }
    }, [advantagesInView, end, duration]);
    
    return <>{count}</>;
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Inject the inline styles */}
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
      
      {/* Header/Navigation */}
      <header className="w-full py-6 px-4 md:px-8 lg:px-12 fixed top-0 left-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-brand-yellow rounded-md"></div>
            <span className="font-bold text-xl">Cashora</span>
          </div>
          
          <nav className="hidden md:flex gap-8">
            <a href="#features" className="font-medium hover:text-black/70 transition-colors">Features</a>
            <a href="#benefits" className="font-medium hover:text-black/70 transition-colors">Benefits</a>
            <a href="#platform" className="font-medium hover:text-black/70 transition-colors">Platform</a>
            <a href="#testimonials" className="font-medium hover:text-black/70 transition-colors">Testimonials</a>
          </nav>
          
          <div className="flex gap-4">
            <a href="#signin" className="hidden md:block secondary-button">Log in</a>
            <a href="#signup" className="primary-button">Get Started</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`pt-32 pb-16 md:py-32 px-4 md:px-8 transition-opacity duration-1000 ${heroInView ? 'opacity-100' : 'opacity-0'}`}
        id="home"
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 text-center md:text-left animate-slide-up">
              <div className="inline-block bg-brand-yellow-light px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse-slow">
                Smart Financial Management
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Archivo, sans-serif', letterSpacing: '-0.5px' }}>
                Manage Finances With Ease And Security
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                Cashora is an innovative financial management platform that provides a secure, efficient way to handle all your transactions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="#signup" className="primary-button group">
                  Get Started <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </a>
                <a href="#features" className="secondary-button">
                  Learn More
                </a>
              </div>
              
              <div className="flex items-center gap-8 mt-12 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-3xl font-bold flex items-center">
                    <AnimatedCounter end={50} />k<span className="text-brand-yellow">+</span>
                  </div>
                  <p className="text-sm text-gray-500">Active Users</p>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold flex items-center">
                    <AnimatedCounter end={100} />k<span className="text-brand-yellow">+</span>
                  </div>
                  <p className="text-sm text-gray-500">Transactions</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 animate-float">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-brand-yellow rounded-full opacity-30"></div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-brand-yellow rounded-full opacity-20"></div>
                <img 
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600&auto=format&fit=crop" 
                  alt="Cashora dashboard interface" 
                  className="w-full h-auto rounded-2xl shadow-xl mx-auto max-w-sm shine-effect"
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-20 opacity-80">
            <img src="https://placehold.co/120x40/f5f5f5/333333?text=Partner+1" alt="Partner logo" className="h-8" />
            <img src="https://placehold.co/120x40/f5f5f5/333333?text=Partner+2" alt="Partner logo" className="h-8" />
            <img src="https://placehold.co/120x40/f5f5f5/333333?text=Partner+3" alt="Partner logo" className="h-8" />
            <img src="https://placehold.co/120x40/f5f5f5/333333?text=Partner+4" alt="Partner logo" className="h-8" />
            <img src="https://placehold.co/120x40/f5f5f5/333333?text=Partner+5" alt="Partner logo" className="h-8" />
          </div>
        </div>
      </section>

      {/* Benefits Section - Enhanced Cards */}
      <section 
        id="benefits"
        ref={advantagesRef}
        className={`section-spacing px-4 md:px-8 transition-all duration-1000 ${advantagesInView ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto text-center">
          <h2 className="section-title" style={{ fontFamily: 'Archivo, sans-serif' }}>Key Benefits of Cashora</h2>
          <p className="section-subtitle">
            Experience the advantages that make Cashora the ideal platform for your financial management needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Enhanced Card 1 */}
            <div className="advantage-card bg-brand-yellow rounded-2xl p-6 shadow-lg text-left animate-slide-up transition-transform" style={{animationDelay: "100ms"}}>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white rounded-full">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold" style={{ fontFamily: 'Archivo, sans-serif' }}>Secure Transactions</h3>
              </div>
              <p className="text-black/80 mb-6">
                Every transaction is processed with the highest levels of security, keeping your sensitive financial information safe.
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  <span className="inline-block px-2 py-1 bg-white/50 rounded-full text-xs font-medium">End-to-End</span>
                  <span className="inline-block px-2 py-1 bg-white/50 rounded-full text-xs font-medium">Encrypted</span>
                </div>
                <button className="card-btn flex items-center gap-1 text-sm font-semibold bg-white px-3 py-1.5 rounded-full hover:bg-white/90 transition-all">
                  Learn more <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
            
            {/* Enhanced Card 2 */}
            <div className="advantage-card bg-white rounded-2xl p-6 border border-gray-100 shadow-lg text-left animate-slide-up transition-transform" style={{animationDelay: "200ms"}}>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-yellow rounded-full">
                  <Bell size={24} />
                </div>
                <h3 className="text-xl font-bold" style={{ fontFamily: 'Archivo, sans-serif' }}>Real-Time Monitoring</h3>
              </div>
              <p className="text-black/70 mb-6">
                Stay updated on every transaction with real-time monitoring and instant email notifications.
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">Instant</span>
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">Alerts</span>
                </div>
                <button className="card-btn flex items-center gap-1 text-sm font-semibold bg-brand-yellow px-3 py-1.5 rounded-full hover:bg-brand-yellow/90 transition-all">
                  See Demo <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
            
            {/* Enhanced Card 3 */}
            <div className="advantage-card bg-white rounded-2xl p-6 border border-gray-100 shadow-lg text-left animate-slide-up transition-transform" style={{animationDelay: "300ms"}}>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-yellow rounded-full">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-xl font-bold" style={{ fontFamily: 'Archivo, sans-serif' }}>Interactive Dashboards</h3>
              </div>
              <p className="text-black/70 mb-6">
                Access comprehensive dashboards with visual analytics to track your financial activities with ease.
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">Visual</span>
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">Analytics</span>
                </div>
                <button className="card-btn flex items-center gap-1 text-sm font-semibold bg-brand-yellow px-3 py-1.5 rounded-full hover:bg-brand-yellow/90 transition-all">
                  View Demo <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
            
            {/* Enhanced Card 4 */}
            <div className="advantage-card bg-white rounded-2xl p-6 border border-gray-100 shadow-lg text-left animate-slide-up transition-transform" style={{animationDelay: "400ms"}}>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-yellow rounded-full">
                  <Globe size={24} />
                </div>
                <h3 className="text-xl font-bold" style={{ fontFamily: 'Archivo, sans-serif' }}>Multilingual Support</h3>
              </div>
              <p className="text-black/70 mb-6">
                Access Cashora in your preferred language with our comprehensive multilingual support.
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">Global</span>
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">Accessible</span>
                </div>
                <button className="card-btn flex items-center gap-1 text-sm font-semibold bg-brand-yellow px-3 py-1.5 rounded-full hover:bg-brand-yellow/90 transition-all">
                  Languages <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section - Enhanced */}
      <section 
        id="features" 
        ref={featuresRef}
        className={`section-spacing px-4 md:px-8 transition-all duration-1000 ${featuresInView ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto">
          <div className="yellow-card flex flex-col md:flex-row items-center justify-between overflow-hidden">
            <div className="w-full md:w-1/2 text-left animate-slide-right relative z-10" style={{animationDelay: "100ms"}}>
              <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>Comprehensive Financial Management</h2>
              <p className="text-black/80 mb-8">
                Cashora provides you with all the tools you need to efficiently manage your finances and make informed decisions.
              </p>
              
              <div className="space-y-6">
                <div className="feature-box bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm flex items-start gap-4 transition-transform">
                  <div className="p-2 bg-brand-yellow rounded-full shrink-0 mt-1">
                    <Check size={18} className="text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ fontFamily: 'Archivo, sans-serif' }}>Efficient Fund Management</h4>
                    <p className="text-sm text-gray-700">Easily manage deposits, withdrawals, and transfers with customizable limits</p>
                    <a href="#" className="text-xs font-semibold text-black mt-2 inline-flex items-center hover:underline">
                      Try it now <ArrowUpRight size={12} className="ml-1" />
                    </a>
                  </div>
                </div>
                
                <div className="feature-box bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm flex items-start gap-4 transition-transform">
                  <div className="p-2 bg-brand-yellow rounded-full shrink-0 mt-1">
                    <Check size={18} className="text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ fontFamily: 'Archivo, sans-serif' }}>Email Notifications</h4>
                    <p className="text-sm text-gray-700">Receive instant updates about all your transaction activities via email</p>
                    <a href="#" className="text-xs font-semibold text-black mt-2 inline-flex items-center hover:underline">
                      Learn more <ArrowUpRight size={12} className="ml-1" />
                    </a>
                  </div>
                </div>
                
                <div className="feature-box bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm flex items-start gap-4 transition-transform">
                  <div className="p-2 bg-brand-yellow rounded-full shrink-0 mt-1">
                    <Check size={18} className="text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ fontFamily: 'Archivo, sans-serif' }}>Comprehensive Reporting</h4>
                    <p className="text-sm text-gray-700">Track all your financial activity with detailed transaction histories</p>
                    <a href="#" className="text-xs font-semibold text-black mt-2 inline-flex items-center hover:underline">
                      View reports <ArrowUpRight size={12} className="ml-1" />
                    </a>
                  </div>
                </div>
                
                <div className="feature-box bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm flex items-start gap-4 transition-transform">
                  <div className="p-2 bg-brand-yellow rounded-full shrink-0 mt-1">
                    <Check size={18} className="text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ fontFamily: 'Archivo, sans-serif' }}>Customer Support with AI Chatbox</h4>
                    <p className="text-sm text-gray-700">Get immediate assistance with our AI-powered support system</p>
                    <a href="#" className="text-xs font-semibold text-black mt-2 inline-flex items-center hover:underline">
                      Chat now <ArrowUpRight size={12} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center mt-12 md:mt-0 animate-float">
              <div className="grid grid-cols-2 gap-4 relative">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-brand-yellow rounded-full opacity-20"></div>
                
                <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <h4 className="font-bold mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>Quick Transfer</h4>
                  <p className="text-sm text-gray-600 mb-4">Send funds instantly to any account</p>
                  <button className="text-xs font-semibold px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    Transfer Now
                  </button>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <h4 className="font-bold mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>Set Limits</h4>
                  <p className="text-sm text-gray-600 mb-4">Control spending with withdrawal limits</p>
                  <button className="text-xs font-semibold px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    Set Limits
                  </button>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <h4 className="font-bold mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>Transaction Alerts</h4>
                  <p className="text-sm text-gray-600 mb-4">Stay informed with real-time alerts</p>
                  <button className="text-xs font-semibold px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    Set Alerts
                  </button>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <h4 className="font-bold mb-2" style={{ fontFamily: 'Archivo, sans-serif' }}>Financial Reports</h4>
                  <p className="text-sm text-gray-600 mb-4">Access detailed activity reports</p>
                  <button className="text-xs font-semibold px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Section - Enhanced Cards */}
      <section 
        id="platform" 
        ref={platformRef}
        className={`section-spacing px-4 md:px-8 transition-all duration-1000 ${platformInView ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto text-center">
          <h2 className="section-title" style={{ fontFamily: 'Archivo, sans-serif' }}>Intuitive Platform For Everyone</h2>
          <p className="section-subtitle">
            Experience Cashora's user-friendly interface designed to make financial management effortless.
          </p>
          
          <div className="relative w-full max-w-5xl mx-auto animate-scale-in">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-brand-yellow rounded-full opacity-20"></div>
            <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-brand-yellow rounded-full opacity-30"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop" 
              alt="Cashora dashboard interface" 
              className="w-full h-auto rounded-2xl shadow-xl border border-gray-100 shine-effect"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            <div className="integration-card p-4 bg-white rounded-xl shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
              <img src="https://placehold.co/40x40/fffd38/000000?text=D" alt="Dashboard logo" className="w-10 h-10 rounded-md" />
              <div className="text-left">
                <span className="font-medium block" style={{ fontFamily: 'Archivo, sans-serif' }}>Interactive Dashboards</span>
                <span className="text-xs text-gray-500">Track everything</span>
              </div>
              <button className="ml-3 p-1.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowUpRight size={16} />
              </button>
            </div>
            
            <div className="integration-card p-4 bg-white rounded-xl shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
              <img src="https://placehold.co/40x40/fffd38/000000?text=M" alt="Mobile logo" className="w-10 h-10 rounded-md" />
              <div className="text-left">
                <span className="font-medium block" style={{ fontFamily: 'Archivo, sans-serif' }}>Mobile Friendly</span>
                <span className="text-xs text-gray-500">Access anywhere</span>
              </div>
              <button className="ml-3 p-1.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowUpRight size={16} />
              </button>
            </div>
            
            <div className="integration-card p-4 bg-white rounded-xl shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
              <img src="https://placehold.co/40x40/fffd38/000000?text=A" alt="AI logo" className="w-10 h-10 rounded-md" />
              <div className="text-left">
                <span className="font-medium block" style={{ fontFamily: 'Archivo, sans-serif' }}>AI Chat Support</span>
                <span className="text-xs text-gray-500">Instant help</span>
              </div>
              <button className="ml-3 p-1.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowUpRight size={16} />
              </button>
            </div>
            
            <div className="integration-card p-4 bg-white rounded-xl shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
              <img src="https://placehold.co/40x40/fffd38/000000?text=R" alt="Reports logo" className="w-10 h-10 rounded-md" />
              <div className="text-left">
                <span className="font-medium block" style={{ fontFamily: 'Archivo, sans-serif' }}>Detailed Reports</span>
                <span className="text-xs text-gray-500">Full analytics</span>
              </div>
              <button className="ml-3 p-1.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section 
        ref={mobileRef}
        className={`section-spacing px-4 md:px-8 transition-all duration-1000 ${mobileInView ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 relative animate-float">
              <div className="absolute top-1/4 -left-8 w-16 h-16 bg-brand-yellow rounded-full opacity-30"></div>
              <img 
                src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600&auto=format&fit=crop" 
                alt="Cashora mobile app interface" 
                className="mx-auto z-10 relative max-w-xs shine-effect"
              />
              <div className="absolute bottom-1/4 -right-6 w-12 h-12 bg-brand-yellow rounded-full opacity-40"></div>
            </div>
            
            <div className="w-full md:w-1/2 animate-slide-right" style={{animationDelay: "200ms"}}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>Mobile-First Financial Management</h2>
              <p className="text-lg text-gray-600 mb-8">
                Access all Cashora features on the go with our responsive, mobile-friendly design that adapts to any device.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-yellow rounded-full mt-1">
                    <Check size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1" style={{ fontFamily: 'Archivo, sans-serif' }}>Easy Mobile Access</h4>
                    <p className="text-gray-600">Manage your finances from any device with our responsive interface.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-yellow rounded-full mt-1">
                    <Check size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1" style={{ fontFamily: 'Archivo, sans-serif' }}>Seamless Experience</h4>
                    <p className="text-gray-600">Enjoy the same powerful features whether on desktop or mobile.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-brand-yellow rounded-full mt-1">
                    <Check size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1" style={{ fontFamily: 'Archivo, sans-serif' }}>Biometric Security</h4>
                    <p className="text-gray-600">Protect your account with fingerprint or face recognition on mobile.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 flex gap-4">
                <img src="https://placehold.co/140x42/000000/ffffff?text=App+Store" alt="App Store" className="h-12 hover:opacity-80 transition-opacity cursor-pointer" />
                <img src="https://placehold.co/140x42/000000/ffffff?text=Google+Play" alt="Google Play" className="h-12 hover:opacity-80 transition-opacity cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Section */}
      <section 
        ref={savingsRef}
        className={`section-spacing px-4 md:px-8 transition-all duration-1000 ${savingsInView ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-md flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 animate-slide-right" style={{animationDelay: "100ms"}}>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-brand-yellow rounded-md">
                  <LineChart size={20} />
                </div>
                <span className="font-bold" style={{ fontFamily: 'Archivo, sans-serif' }}>Comprehensive Analytics</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>Make Informed Financial Decisions</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our detailed transaction histories and analytics help you track patterns and make better financial choices.
              </p>
              
              <button className="primary-button mt-4">
                Explore Analytics
              </button>
            </div>
            
            <div className="w-full md:w-1/2 animate-slide-up" style={{animationDelay: "300ms"}}>
              <div className="relative">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute -top-4 -right-4 w-10 h-10 bg-brand-yellow rounded-full opacity-40"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop" 
                      alt="Analytics dashboard" 
                      className="w-full max-w-sm rounded-xl shadow-lg relative z-10 shine-effect"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm w-[45%] hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="font-bold text-lg" style={{ fontFamily: 'Archivo, sans-serif' }}>100%</div>
                    <p className="text-sm text-gray-600">Transaction Visibility</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm w-[45%] hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="font-bold text-lg" style={{ fontFamily: 'Archivo, sans-serif' }}>24/7</div>
                    <p className="text-sm text-gray-600">Activity Monitoring</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section 
        id="testimonials"
        ref={testimonialRef}
        className={`section-spacing px-4 md:px-8 transition-all duration-1000 ${testimonialInView ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
      >
        <div className="container mx-auto text-center">
          <h2 className="section-title" style={{ fontFamily: 'Archivo, sans-serif' }}>What Our Users Say</h2>
          <p className="section-subtitle">
            Discover why people love using Cashora for their financial management needs.
          </p>
          
          <div className="testimonial-card bg-white rounded-2xl p-8 md:p-12 shadow-md max-w-5xl mx-auto relative animate-scale-in hover:shadow-lg transition-all">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-brand-yellow rounded-full opacity-20 z-0"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-full md:w-1/3 relative">
                <div className="relative">
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-brand-yellow rounded-full opacity-40"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop" 
                    alt="Client portrait" 
                    className="w-40 h-40 rounded-full object-cover object-center mx-auto border-4 border-white shadow-md"
                  />
                </div>
                
                <div className="mt-4 text-center">
                  <h4 className="font-bold text-xl" style={{ fontFamily: 'Archivo, sans-serif' }}>David Chen</h4>
                  <p className="text-gray-600">Small Business Owner</p>
                  <div className="flex justify-center mt-2">
                    <Star className="fill-brand-yellow text-brand-yellow" size={18} />
                    <Star className="fill-brand-yellow text-brand-yellow" size={18} />
                    <Star className="fill-brand-yellow text-brand-yellow" size={18} />
                    <Star className="fill-brand-yellow text-brand-yellow" size={18} />
                    <Star className="fill-brand-yellow text-brand-yellow" size={18} />
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-2/3 text-left">
                <svg className="w-12 h-12 text-brand-yellow quote-icon mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                
                <p className="text-lg text-gray-700 mb-6">
                  Cashora has revolutionized how I manage my business finances. The real-time monitoring and detailed reports give me complete visibility into my cash flow. The platform is intuitive, secure, and the mobile app lets me stay on top of transactions even when I'm on the go.
                </p>
                
                <div className="flex gap-4">
                  <button className="secondary-button text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  <button className="primary-button text-sm flex items-center">
                    Next
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className={`section-spacing px-4 md:px-8 transition-all duration-1000 ${ctaInView ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
        id="signup"
      >
        <div className="container mx-auto">
          <div className="bg-brand-yellow rounded-2xl p-8 md:p-12 text-center max-w-5xl mx-auto relative overflow-hidden animate-scale-in shine-effect">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10" style={{ fontFamily: 'Archivo, sans-serif' }}>Take Control of Your Finances Today</h2>
            <p className="text-lg text-black/80 mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of satisfied users who are managing their finances securely and efficiently with Cashora.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button className="bg-black text-white font-medium py-3 px-8 rounded-full transition-all duration-300 
                      hover:bg-black/80 active:bg-black/90 active:scale-95 group">
                Create Account
                <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </button>
              <button className="bg-white text-black font-medium py-3 px-8 rounded-full border border-transparent transition-all duration-300 
                      hover:bg-transparent hover:border-white active:scale-95">
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sign In Section */}
      <section 
        id="signin"
        className="py-12 px-4 md:px-8 hidden"
      >
        <div className="container mx-auto">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: 'Archivo, sans-serif' }}>Sign In to Cashora</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-yellow focus:border-brand-yellow" placeholder="Enter your email" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-yellow focus:border-brand-yellow" placeholder="Enter your password" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-brand-yellow rounded border-gray-300" />
                  <label className="ml-2 text-sm text-gray-600">Remember me</label>
                </div>
                <a href="#" className="text-sm text-brand-yellow hover:underline">Forgot password?</a>
              </div>
              <button type="submit" className="w-full bg-brand-yellow text-black font-medium py-2 px-4 rounded-lg hover:brightness-105 transition-all">Sign In</button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account? <a href="#signup" className="text-brand-yellow hover:underline">Sign up</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        ref={footerRef}
        className={`py-16 px-4 md:px-8 bg-white transition-all duration-1000 ${footerInView ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 bg-brand-yellow rounded-md"></div>
                <span className="font-bold text-xl" style={{ fontFamily: 'Archivo, sans-serif' }}>Cashora</span>
              </div>
              <p className="text-gray-600 mb-6">
                An innovative financial management platform providing secure, efficient ways to handle all your transactions.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Webinars</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6" style={{ fontFamily: 'Archivo, sans-serif' }}>Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-black transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">© 2023 Cashora. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-black transition-colors">English</a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors">USD</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index; 
