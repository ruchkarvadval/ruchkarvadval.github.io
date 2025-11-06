import { Navigation } from '@/components/Navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import landingData from '@/data/landing_page_heritage.json';
import landingDataMarathi from '@/data/landing_page_heritage_marathi.json';
import heroKitchen from '@/assets/hero-kitchen.jpg';
import { ChevronRight } from 'lucide-react';

export default function Index() {
  const { language } = useLanguage();
  const data = language === 'mr' ? landingDataMarathi : landingData;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${heroKitchen})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold font-baloo text-primary-foreground mb-6 drop-shadow-lg">
            {data.title}
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 font-noto mb-8 drop-shadow-md">
            {data.subtitle}
          </p>
          <Link to="/recipes">
            <Button size="lg" className="text-lg px-8 py-6 font-baloo shadow-xl">
              {language === 'mr' ? 'प्रवास सुरू करा' : 'Begin Your Journey'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-xl font-noto leading-relaxed text-center">
            {data.content.intro}
          </p>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold font-baloo text-primary">
                {data.content.section1.heading}
              </h2>
              <p className="font-noto text-lg leading-relaxed">
                {data.content.section1.text}
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold font-baloo text-primary">
                {data.content.section2.heading}
              </h2>
              <p className="font-noto text-lg leading-relaxed">
                {data.content.section2.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold font-baloo text-primary mb-6">
            {language === 'mr' 
              ? 'पाककृती संग्रह एक्सप्लोर करा' 
              : 'Explore Our Recipe Collection'}
          </h2>
          <p className="text-lg font-noto mb-8 text-muted-foreground">
            {language === 'mr'
              ? 'वाडवल समाजाच्या प्रत्येक पाककृतीत एक कथा आहे. आमच्या संग्रहात पारंपरिक पाककृती शोधा.'
              : 'Every recipe tells a story. Discover the authentic flavors and traditions passed down through generations.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/recipes">
              <Button size="lg" className="font-baloo">
                {language === 'mr' ? 'पाककृती पहा' : 'View Recipes'}
              </Button>
            </Link>
            <Link to="/heritage">
              <Button size="lg" variant="outline" className="font-baloo">
                {language === 'mr' ? 'वारसा जाणून घ्या' : 'Learn Our Heritage'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="font-baloo text-lg mb-2">रुचकर वाडवल</p>
          <p className="font-noto text-sm opacity-80">
            {language === 'mr' 
              ? 'खाद्यसंस्कृती जी अजूनही चुलीवर जिवंत आहे'
              : 'Where the Coast Remembers Through Taste'}
          </p>
        </div>
      </footer>
    </div>
  );
}
