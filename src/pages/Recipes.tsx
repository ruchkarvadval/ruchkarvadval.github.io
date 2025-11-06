import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { RecipeCard } from '@/components/RecipeCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import recipesData from '@/data/vadval_recipes_full.json';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Recipes() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(recipesData.recipes.map(r => r.category)))];

  const filteredRecipes = recipesData.recipes.filter(recipe => {
    const matchesSearch = language === 'mr' 
      ? recipe.title_marathi.toLowerCase().includes(searchQuery.toLowerCase())
      : recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || recipe.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-baloo text-primary mb-4">
            {language === 'mr' ? 'पाककृती संग्रह' : 'Recipe Collection'}
          </h1>
          <p className="text-lg text-muted-foreground font-noto max-w-2xl mx-auto">
            {language === 'mr' 
              ? 'वाडवल समाजाच्या पारंपरिक पाककृती शोधा'
              : 'Explore traditional recipes from the Vadval community'}
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={language === 'mr' ? 'पाककृती शोधा...' : 'Search recipes...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 font-noto"
          />
        </div>

        {/* Category Filter */}
        <Tabs value={categoryFilter} onValueChange={setCategoryFilter} className="mb-8">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="font-noto">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-noto">
              {language === 'mr' ? 'कोणतीही पाककृती सापडली नाही' : 'No recipes found'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
