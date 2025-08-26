import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Play, Filter, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'web' | 'mobile' | 'ai' | 'design';
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Development' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'ai', label: 'AI Solutions' },
    { id: 'design', label: 'Design' },
  ];

  const projects: Project[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'Modern e-commerce solution with React, Node.js, and AI-powered recommendations',
      category: 'web',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      technologies: ['React', 'Node.js', 'MongoDB', 'AI/ML'],
      liveUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example',
      featured: true,
    },
    {
      id: '2',
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication and real-time transactions',
      category: 'mobile',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      technologies: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL'],
      liveUrl: 'https://app.example.com',
      featured: true,
    },
    {
      id: '3',
      title: 'AI Content Generator',
      description: 'Advanced AI system for generating marketing content using GPT models',
      category: 'ai',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'React'],
      liveUrl: 'https://ai.example.com',
      githubUrl: 'https://github.com/example',
      featured: false,
    },
    {
      id: '4',
      title: 'Corporate Website',
      description: 'Premium corporate website with modern design and advanced animations',
      category: 'web',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      liveUrl: 'https://corporate.example.com',
      featured: false,
    },
    {
      id: '5',
      title: 'Fitness Tracking App',
      description: 'Comprehensive fitness app with workout tracking, nutrition planning, and social features',
      category: 'mobile',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      technologies: ['Flutter', 'Firebase', 'Machine Learning', 'Health APIs'],
      liveUrl: 'https://fitness.example.com',
      featured: true,
    },
    {
      id: '6',
      title: 'Brand Identity System',
      description: 'Complete brand identity design including logo, guidelines, and marketing materials',
      category: 'design',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      technologies: ['Adobe Creative Suite', 'Figma', 'Sketch', 'Principle'],
      featured: false,
    },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesFilter = activeFilter === 'all' || project.category === activeFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const featuredProjects = projects.filter(project => project.featured);

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
              Our <span className="gradient-text">Portfolio</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our collection of cutting-edge projects that showcase innovation, 
              creativity, and technical excellence across various industries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-white mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Featured Projects
          </motion.h2>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="glass-effect-dark rounded-2xl overflow-hidden card-hover group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="bg-accent-green text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span 
                        key={tech}
                        className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded-md text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-gray-500 text-xs">+{project.technologies.length - 3} more</span>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary-400 hover:text-white transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        <Github className="w-4 h-4 mr-1" />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-12 px-6 border-t border-dark-700">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 mb-12">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-primary pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                    activeFilter === category.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* All Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="glass-effect-dark rounded-2xl overflow-hidden card-hover group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-accent-green text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span 
                        key={tech}
                        className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded-md text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary-400 hover:text-white transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        <Github className="w-4 h-4 mr-1" />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-400 text-lg">No projects found matching your criteria.</p>
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="btn-primary mt-4"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div 
            className="max-w-3xl mx-auto glass-effect-dark p-12 rounded-3xl neon-glow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-300 mb-8">
              Let's collaborate to bring your vision to life with cutting-edge technology and innovative design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
              <Link to="/business-accelerator" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Portfolio;