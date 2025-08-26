import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Smartphone, Brain, Rocket, Users, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
              Building the
              <span className="gradient-text block mt-2 animate-float">Future of Technology</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
              KolTech is an innovative platform for developing websites, mobile applications,
              and AI solutions. We transform your ideas into revolutionary digital products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                to="/register"
                className="btn-primary flex items-center justify-center neon-glow animate-pulse-slow"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/portfolio"
                className="btn-secondary"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 tech-pattern">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive IT services to bring your ambitious projects to life
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: 'Web Development',
                description: 'Modern websites and web applications using cutting-edge technologies',
                color: 'from-primary-500 to-primary-600'
              },
              {
                icon: Smartphone,
                title: 'Mobile Applications',
                description: 'Native and cross-platform mobile apps for iOS and Android',
                color: 'from-accent-purple to-accent-pink'
              },
              {
                icon: Brain,
                title: 'AI Solutions',
                description: 'Intelligent systems and machine learning for business automation',
                color: 'from-accent-green to-primary-500'
              }
            ].map((service, index) => (
              <div
                key={index}
                className="glass-effect-dark p-8 rounded-2xl card-hover group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:animate-float`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-dark-800 to-dark-900">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl font-bold text-white mb-6">About KolTech</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                We are a team of information technology experts united by a common goal -
                creating innovative solutions that change the world for the better.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Our KolTechLine platform brings together clients, freelancers, and startups,
                creating an ecosystem for implementing the boldest technological ideas.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { number: '500+', label: 'Projects' },
                  { number: '100+', label: 'Clients' },
                  { number: '50+', label: 'Experts' }
                ].map((stat, index) => (
                  <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="text-2xl font-bold gradient-text">{stat.number}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-fade-in">
              <div className="w-full h-96 glass-effect rounded-2xl flex items-center justify-center mesh-gradient">
                <div className="text-center">
                  <Rocket className="w-24 h-24 text-white mx-auto mb-4 animate-float" />
                  <p className="text-white font-semibold text-lg">Innovation in Action</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto glass-effect-dark p-12 rounded-3xl animate-scale-in neon-glow">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-300 mb-8">
              Join KolTechLine and get access to the best specialists and innovative solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary"
              >
                Get Started
              </Link>
              <Link
                to="/auth"
                className="btn-secondary"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;