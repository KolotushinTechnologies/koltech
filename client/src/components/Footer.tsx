import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-700">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">KolTech</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Инновационная платформа для разработки веб-сайтов, мобильных приложений и AI-решений. 
              Мы создаем будущее технологий уже сегодня.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@koltech.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Быстрые ссылки</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Главная
              </Link>
              <Link to="/portfolio" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Портфолио
              </Link>
              <Link to="/business-accelerator" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Бизнес-акселератор
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Услуги</h3>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Веб-разработка</p>
              <p className="text-gray-400 text-sm">Мобильные приложения</p>
              <p className="text-gray-400 text-sm">AI-решения</p>
              <p className="text-gray-400 text-sm">Консалтинг</p>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 KolTech. Все права защищены. Создано для инновационного будущего.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;