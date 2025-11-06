import { Navigation } from '@/components/Navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import landingData from '@/data/landing_page_heritage.json';
import landingDataMarathi from '@/data/landing_page_heritage_marathi.json';
import coastalVillage from '@/assets/coastal-village.jpg';
import foodArrangement from '@/assets/food-arrangement.jpg';

export default function Heritage() {
  const { language } = useLanguage();
  const data = language === 'mr' ? landingDataMarathi : landingData;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-baloo text-primary mb-4 text-center">
            {data.title}
          </h1>
          <p className="text-xl text-center text-muted-foreground font-noto max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        {/* Intro */}
        <div className="mb-16">
          <p className="text-lg font-noto leading-relaxed max-w-4xl mx-auto">
            {data.content.intro}
          </p>
        </div>

        {/* Section 1 */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-bold font-baloo text-primary mb-4">
              {data.content.section1.heading}
            </h2>
            <p className="text-lg font-noto leading-relaxed">
              {data.content.section1.text}
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src={coastalVillage} 
              alt="Coastal village landscape"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 items-center">
          <div className="rounded-lg overflow-hidden shadow-lg order-2 md:order-1">
            <img 
              src={foodArrangement} 
              alt="Traditional food arrangement"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold font-baloo text-primary mb-4">
              {data.content.section2.heading}
            </h2>
            <p className="text-lg font-noto leading-relaxed">
              {data.content.section2.text}
            </p>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-baloo text-primary mb-4 text-center">
            {data.content.section3.heading}
          </h2>
          <p className="text-lg font-noto leading-relaxed max-w-4xl mx-auto">
            {data.content.section3.text}
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-baloo text-primary mb-4 text-center">
            {data.content.section4.heading}
          </h2>
          <p className="text-lg font-noto leading-relaxed max-w-4xl mx-auto">
            {data.content.section4.text}
          </p>
        </div>
      </main>
    </div>
  );
}
