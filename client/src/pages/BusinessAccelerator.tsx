import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Rocket, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Lightbulb,
  Zap
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

interface AcceleratorProgram {
  id: string;
  title: string;
  description: string;
  duration: string;
  investment: string;
  equity: string;
  features: string[];
  applications: number;
  funded: number;
  successRate: string;
}

interface Startup {
  id: string;
  name: string;
  description: string;
  category: string;
  logo: string;
  valuation: string;
  status: 'funded' | 'growing' | 'acquired';
}

const BusinessAccelerator = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'portfolio' | 'apply'>('overview');

  const programs: AcceleratorProgram[] = [
    {
      id: 'tech-startup',
      title: 'Tech Startup Accelerator',
      description: 'Intensive 3-month program for early-stage tech startups ready to scale',
      duration: '12 weeks',
      investment: '$100K - $500K',
      equity: '6-8%',
      features: [
        'Weekly mentorship sessions',
        'Access to investor network',
        'Technical infrastructure support',
        'Go-to-market strategy development',
        'Legal and financial guidance'
      ],
      applications: 500,
      funded: 45,
      successRate: '85%'
    },
    {
      id: 'ai-innovation',
      title: 'AI Innovation Lab',
      description: 'Specialized program for AI and machine learning startups',
      duration: '16 weeks',
      investment: '$250K - $1M',
      equity: '8-12%',
      features: [
        'AI research partnership',
        'GPU cluster access',
        'ML engineer mentorship',
        'Data partnership opportunities',
        'AI ethics and compliance guidance'
      ],
      applications: 200,
      funded: 25,
      successRate: '92%'
    },
    {
      id: 'fintech-hub',
      title: 'FinTech Hub',
      description: 'Accelerator focused on financial technology innovations',
      duration: '20 weeks',
      investment: '$150K - $750K',
      equity: '7-10%',
      features: [
        'Regulatory compliance support',
        'Banking partnerships',
        'Security audit assistance',
        'Financial modeling expertise',
        'Market access facilitation'
      ],
      applications: 300,
      funded: 35,
      successRate: '88%'
    }
  ];

  const successStories: Startup[] = [
    {
      id: '1',
      name: 'CloudFlow',
      description: 'AI-powered cloud infrastructure optimization platform',
      category: 'Enterprise SaaS',
      logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=200&fit=crop',
      valuation: '$50M',
      status: 'funded'
    },
    {
      id: '2',
      name: 'MedTech Pro',
      description: 'Telemedicine platform with AI diagnostics',
      category: 'HealthTech',
      logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=200&fit=crop',
      valuation: '$25M',
      status: 'growing'
    },
    {
      id: '3',
      name: 'EcoTrace',
      description: 'Blockchain-based carbon footprint tracking',
      category: 'CleanTech',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
      valuation: '$120M',
      status: 'acquired'
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Funding Access',
      description: 'Connect with our network of VCs, angels, and institutional investors'
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Learn from industry veterans and successful entrepreneurs'
    },
    {
      icon: Target,
      title: 'Market Validation',
      description: 'Validate your product-market fit with real customer feedback'
    },
    {
      icon: Rocket,
      title: 'Rapid Scaling',
      description: 'Accelerate growth with proven frameworks and strategies'
    },
    {
      icon: Award,
      title: 'Technical Excellence',
      description: 'Build robust, scalable solutions with our tech expertise'
    },
    {
      icon: TrendingUp,
      title: 'Growth Analytics',
      description: 'Data-driven insights to optimize your business metrics'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors btn-ghost"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="gradient-text">KolTech</span> Business Accelerator
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Transform your innovative ideas into thriving businesses with our comprehensive 
              accelerator programs, expert mentorship, and extensive funding network.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveTab('apply')}
                className="btn-primary animate-pulse-slow"
              >
                Apply Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button 
                onClick={() => setActiveTab('programs')}
                className="btn-secondary"
              >
                View Programs
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid md:grid-cols-4 gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { number: '200+', label: 'Startups Accelerated', icon: Rocket },
              { number: '$500M+', label: 'Total Funding Raised', icon: DollarSign },
              { number: '85%', label: 'Success Rate', icon: TrendingUp },
              { number: '50+', label: 'Expert Mentors', icon: Users }
            ].map((stat, index) => (
              <div key={index} className="glass-effect-dark p-6 rounded-2xl text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <stat.icon className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="px-6 mb-12">
        <div className="container mx-auto">
          <div className="flex justify-center mb-12">
            <div className="glass-effect-dark rounded-2xl p-2">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'programs', label: 'Programs' },
                { id: 'portfolio', label: 'Portfolio' },
                { id: 'apply', label: 'Apply' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-6 pb-20">
        <div className="container mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid lg:grid-cols-2 gap-12 mb-16">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">Why Choose KolTech Accelerator?</h2>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    Our accelerator program is designed to give startups the best possible chance of success. 
                    We provide not just funding, but comprehensive support across all aspects of building a business.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      'Industry-leading mentorship network',
                      'Access to cutting-edge technology stack',
                      'Proven methodology with 85% success rate',
                      'Global investor network with $2B+ AUM',
                      'Post-acceleration ongoing support'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-accent-green mr-3" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="glass-effect rounded-2xl p-8 mesh-gradient">
                    <Lightbulb className="w-16 h-16 text-white mx-auto mb-6 animate-float" />
                    <h3 className="text-2xl font-bold text-white text-center mb-4">Ready to Transform Your Idea?</h3>
                    <p className="text-white/80 text-center">
                      Join the next generation of successful startups that are reshaping industries with innovation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="glass-effect-dark p-6 rounded-2xl card-hover"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <benefit.icon className="w-12 h-12 text-primary-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Programs Tab */}
          {activeTab === 'programs' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Accelerator Programs</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Choose the program that best fits your startup's stage and industry focus
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {programs.map((program, index) => (
                  <motion.div
                    key={program.id}
                    className="glass-effect-dark rounded-2xl p-8 card-hover"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{program.title}</h3>
                      <p className="text-gray-400 mb-4">{program.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <Clock className="w-5 h-5 text-primary-400 mx-auto mb-1" />
                          <div className="text-sm text-white font-semibold">{program.duration}</div>
                        </div>
                        <div className="text-center">
                          <DollarSign className="w-5 h-5 text-accent-green mx-auto mb-1" />
                          <div className="text-sm text-white font-semibold">{program.investment}</div>
                        </div>
                        <div className="text-center">
                          <TrendingUp className="w-5 h-5 text-accent-purple mx-auto mb-1" />
                          <div className="text-sm text-white font-semibold">{program.equity}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-accent-green mr-3 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-dark-600 pt-4">
                      <div className="grid grid-cols-2 gap-4 text-center text-sm">
                        <div>
                          <div className="text-primary-400 font-bold">{program.applications}</div>
                          <div className="text-gray-500">Applications</div>
                        </div>
                        <div>
                          <div className="text-accent-green font-bold">{program.successRate}</div>
                          <div className="text-gray-500">Success Rate</div>
                        </div>
                      </div>
                    </div>

                    <button className="w-full btn-primary mt-6">
                      Apply to Program
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Success Stories</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Meet some of the innovative companies that have graduated from our accelerator programs
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {successStories.map((startup, index) => (
                  <motion.div
                    key={startup.id}
                    className="glass-effect-dark rounded-2xl p-6 card-hover"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center mb-4">
                      <img 
                        src={startup.logo} 
                        alt={startup.name}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white">{startup.name}</h3>
                        <p className="text-primary-400 text-sm">{startup.category}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 mb-4">{startup.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-accent-green font-bold text-lg">{startup.valuation}</div>
                        <div className="text-gray-500 text-sm">Current Valuation</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        startup.status === 'funded' ? 'bg-accent-green/20 text-accent-green' :
                        startup.status === 'growing' ? 'bg-primary-500/20 text-primary-400' :
                        'bg-accent-purple/20 text-accent-purple'
                      }`}>
                        {startup.status.charAt(0).toUpperCase() + startup.status.slice(1)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Apply Tab */}
          {activeTab === 'apply' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Apply to KolTech Accelerator</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Ready to take your startup to the next level? Submit your application and join our next cohort.
                </p>
              </div>

              <div className="glass-effect-dark rounded-2xl p-8">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                      <input type="text" className="input-primary" placeholder="Your startup name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                      <select className="input-primary">
                        <option>Select Industry</option>
                        <option>Technology</option>
                        <option>FinTech</option>
                        <option>HealthTech</option>
                        <option>AI/ML</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Founder Name</label>
                      <input type="text" className="input-primary" placeholder="Full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input type="email" className="input-primary" placeholder="your@email.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company Description</label>
                    <textarea 
                      className="input-primary h-32 resize-none" 
                      placeholder="Describe your startup, the problem you're solving, and your solution..."
                    ></textarea>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Stage</label>
                      <select className="input-primary">
                        <option>Idea Stage</option>
                        <option>MVP</option>
                        <option>Early Revenue</option>
                        <option>Growth Stage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
                      <select className="input-primary">
                        <option>1-2 people</option>
                        <option>3-5 people</option>
                        <option>6-10 people</option>
                        <option>10+ people</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Funding Needed</label>
                      <select className="input-primary">
                        <option>$50K - $100K</option>
                        <option>$100K - $250K</option>
                        <option>$250K - $500K</option>
                        <option>$500K+</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-center pt-6">
                    <button type="submit" className="btn-primary text-lg px-12 py-4">
                      Submit Application
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                    <p className="text-gray-500 text-sm mt-4">
                      We'll review your application and get back to you within 5 business days.
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessAccelerator;