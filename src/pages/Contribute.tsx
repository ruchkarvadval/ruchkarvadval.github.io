import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Contribute() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    titleMarathi: '',
    titleEnglish: '',
    region: '',
    ingredients: '',
    procedure: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.titleMarathi || !formData.titleEnglish || !formData.region || 
        !formData.ingredients || !formData.procedure) {
      toast({
        title: language === 'mr' ? 'कृपया सर्व फील्ड भरा' : 'Please fill all fields',
        description: language === 'mr' 
          ? 'सर्व आवश्यक माहिती प्रदान करा'
          : 'Please provide all required information',
        variant: 'destructive',
      });
      return;
    }

    // Show success message
    toast({
      title: language === 'mr' ? 'धन्यवाद!' : 'Thank you!',
      description: language === 'mr' 
        ? 'तुमची पाककृती पुनरावलोकनासाठी सबमिट केली आहे.'
        : 'Your recipe has been submitted for review.',
    });

    // Reset form
    setFormData({
      titleMarathi: '',
      titleEnglish: '',
      region: '',
      ingredients: '',
      procedure: '',
    });
    setSelectedImage(null);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-baloo text-primary mb-4">
            {language === 'mr' ? 'पाककृती योगदान द्या' : 'Contribute a Recipe'}
          </h1>
          <p className="text-lg text-muted-foreground font-noto max-w-2xl mx-auto">
            {language === 'mr' 
              ? 'आपल्या कुटुंबाचा पाककला वारसा समुदायासोबत शेअर करा.'
              : 'Share your family\'s culinary heritage with the community.'}
          </p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="font-baloo text-2xl text-primary">
              {language === 'mr' ? 'पाककृती माहिती' : 'Recipe Information'}
            </CardTitle>
            <CardDescription className="font-noto">
              {language === 'mr' 
                ? 'कृपया तुमची पाककृती मराठी आणि इंग्रजी दोन्हीमध्ये प्रदान करा'
                : 'Please provide your recipe in both Marathi and English'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipe Names */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titleMarathi" className="font-noto">
                    {language === 'mr' ? 'पाककृतीचे नाव (मराठी)' : 'Recipe Name (Marathi)'}
                  </Label>
                  <Input
                    id="titleMarathi"
                    placeholder={language === 'mr' ? 'कोळंबीची खिचडी' : 'Kolambichi Khichadi'}
                    value={formData.titleMarathi}
                    onChange={(e) => handleChange('titleMarathi', e.target.value)}
                    className="font-noto"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleEnglish" className="font-noto">
                    {language === 'mr' ? 'पाककृतीचे नाव (इंग्रजी)' : 'Recipe Name (English)'}
                  </Label>
                  <Input
                    id="titleEnglish"
                    placeholder="Kolambichi Khichadi"
                    value={formData.titleEnglish}
                    onChange={(e) => handleChange('titleEnglish', e.target.value)}
                    className="font-noto"
                    required
                  />
                </div>
              </div>

              {/* Region/Village */}
              <div className="space-y-2">
                <Label htmlFor="region" className="font-noto">
                  {language === 'mr' ? 'प्रदेश / गाव' : 'Region / Village'}
                </Label>
                <Input
                  id="region"
                  placeholder={language === 'mr' ? 'वसई' : 'Vasai'}
                  value={formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  className="font-noto"
                  required
                />
              </div>

              {/* Ingredients */}
              <div className="space-y-2">
                <Label htmlFor="ingredients" className="font-noto">
                  {language === 'mr' ? 'साहित्य' : 'Ingredients'}
                </Label>
                <Textarea
                  id="ingredients"
                  placeholder={language === 'mr' 
                    ? 'प्रत्येक साहित्य वेगळ्या ओळीत लिहा.\n\nउदा. कोळंबी (Shrimp) - 250g'
                    : 'List each ingredient on a new line.\n\ne.g. कोळंबी (Shrimp) - 250g'}
                  value={formData.ingredients}
                  onChange={(e) => handleChange('ingredients', e.target.value)}
                  className="min-h-[150px] font-noto"
                  required
                />
                <p className="text-sm text-muted-foreground font-noto">
                  {language === 'mr' 
                    ? 'प्रत्येक साहित्य वेगळ्या ओळीत लिहा.'
                    : 'List each ingredient on a new line.'}
                </p>
              </div>

              {/* Preparation Steps */}
              <div className="space-y-2">
                <Label htmlFor="procedure" className="font-noto">
                  {language === 'mr' ? 'तयारीची पायऱ्या' : 'Preparation Steps'}
                </Label>
                <Textarea
                  id="procedure"
                  placeholder={language === 'mr'
                    ? 'प्रत्येक पायरी वेगळ्या ओळीत लिहा.\n\n१. कोळंबी स्वच्छ करा आणि devein करा...'
                    : 'List each step on a new line.\n\n1. Clean and devein the shrimp...'}
                  value={formData.procedure}
                  onChange={(e) => handleChange('procedure', e.target.value)}
                  className="min-h-[200px] font-noto"
                  required
                />
                <p className="text-sm text-muted-foreground font-noto">
                  {language === 'mr' 
                    ? 'प्रत्येक पायरी वेगळ्या ओळीत लिहा.'
                    : 'List each step on a new line.'}
                </p>
              </div>

              {/* Recipe Image */}
              <div className="space-y-2">
                <Label htmlFor="image" className="font-noto">
                  {language === 'mr' ? 'पाककृती फोटो' : 'Recipe Image'}
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                  className="font-noto"
                />
                <p className="text-sm text-muted-foreground font-noto">
                  {language === 'mr' 
                    ? 'पर्यायी: आपल्या डिशचा फोटो अपलोड करा.'
                    : 'Optional: Upload a photo of your dish.'}
                </p>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-heritage-turmeric hover:bg-heritage-turmeric/90 text-heritage-earth font-noto font-semibold"
              >
                {language === 'mr' ? 'पुनरावलोकनासाठी सबमिट करा' : 'Submit for Review'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
