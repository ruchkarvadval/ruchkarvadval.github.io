import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-baloo text-primary">
              रुचकर वाडवल
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-noto hover:text-primary transition-colors">
              {t('home')}
            </Link>
            <Link to="/recipes" className="font-noto hover:text-primary transition-colors">
              {t('recipes')}
            </Link>
            <Link to="/heritage" className="font-noto hover:text-primary transition-colors">
              {t('heritage')}
            </Link>
            <Link to="/contribute" className="font-noto hover:text-primary transition-colors">
              {language === 'mr' ? 'योगदान द्या' : 'Contribute'}
            </Link>
            
            {/* Language Toggle */}
            <div className="flex items-center space-x-2 border border-border rounded-md p-1">
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('en')}
                className="text-xs"
              >
                EN
              </Button>
              <Button
                variant={language === 'mr' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('mr')}
                className="text-xs font-noto"
              >
                मराठी
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <Link
              to="/"
              className="block font-noto hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('home')}
            </Link>
            <Link
              to="/recipes"
              className="block font-noto hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('recipes')}
            </Link>
            <Link
              to="/heritage"
              className="block font-noto hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('heritage')}
            </Link>
            <Link
              to="/contribute"
              className="block font-noto hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {language === 'mr' ? 'योगदान द्या' : 'Contribute'}
            </Link>
            
            <div className="flex items-center space-x-2 pt-2">
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('en')}
              >
                English
              </Button>
              <Button
                variant={language === 'mr' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('mr')}
                className="font-noto"
              >
                मराठी
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
