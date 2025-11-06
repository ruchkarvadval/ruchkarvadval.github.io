import { Navigation } from '@/components/Navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import heritageData from '@/data/vadval_heritage.json';
import festivalsData from '@/data/vadval_samaj_festivals.json';

export default function Heritage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-baloo text-primary mb-4">
            {language === 'mr' ? 'आमचा वारसा' : 'Our Heritage'}
          </h1>
          <p className="text-lg text-muted-foreground font-noto max-w-2xl mx-auto">
            {language === 'mr' 
              ? 'पालघर प्रदेशातील आख्यान, किल्ले आणि परंपरा'
              : 'Legends, Forts, and Traditions of the Palghar Region'}
          </p>
        </div>

        <Tabs defaultValue="heritage" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="heritage" className="font-noto">
              {language === 'mr' ? 'वारसा कथा' : 'Heritage Stories'}
            </TabsTrigger>
            <TabsTrigger value="festivals" className="font-noto">
              {language === 'mr' ? 'सण' : 'Festivals'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="heritage">
            <div className="space-y-8">
              {heritageData.palgharHeritage.map((category, catIndex) => (
                <div key={catIndex}>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold font-baloo text-primary mb-2">
                      {language === 'mr' ? category.categoryNameMarathi : category.categoryName}
                    </h2>
                    <p className="text-muted-foreground font-noto">
                      {language === 'mr' ? category.descriptionMarathi : category.description}
                    </p>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    {category.items.map((item, itemIndex) => (
                      <Card key={itemIndex} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <h3 className="text-xl font-bold font-baloo text-heritage-terracotta mb-2">
                            {language === 'mr' ? item.nameMarathi : item.name}
                          </h3>
                          <p className="text-sm text-heritage-earth mb-3">
                            📍 {language === 'mr' ? item.locationMarathi : item.location}
                          </p>
                          <p className="font-noto text-muted-foreground leading-relaxed">
                            {language === 'mr' ? item.summaryMarathi : item.summary}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="festivals">
            <div className="space-y-8">
              {festivalsData.vadvalSamajFestivals.map((category, catIndex) => (
                <div key={catIndex}>
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold font-baloo text-primary mb-2">
                      {category.categoryName}
                    </h2>
                    <p className="text-muted-foreground font-noto">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="grid gap-6">
                    {category.festivals.map((festival, festIndex) => (
                      <Card key={festIndex} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                            <h3 className="text-2xl font-bold font-baloo text-heritage-terracotta">
                              {festival.name}
                            </h3>
                            <Badge variant="secondary" className="font-noto">
                              {festival.month}
                            </Badge>
                          </div>
                          
                          <p className="text-sm font-semibold text-heritage-sea mb-3">
                            {language === 'mr' ? 'केंद्रबिंदू' : 'Focus'}: {festival.focus}
                          </p>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-heritage-earth mb-2">
                                {language === 'mr' ? 'महत्त्व' : 'Significance'}:
                              </h4>
                              <p className="font-noto text-muted-foreground leading-relaxed">
                                {language === 'mr' ? festival.significanceMarathi : festival.significance}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
