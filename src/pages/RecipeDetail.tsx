import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, ChefHat, ArrowLeft } from 'lucide-react';
import recipesData from '@/data/vadval_recipes_full.json';

export default function RecipeDetail() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  
  const recipe = recipesData.recipes.find(r => r.id === id);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center font-noto">Recipe not found</p>
        </div>
      </div>
    );
  }

  const displayTitle = language === 'mr' ? recipe.title_marathi : recipe.title;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Link to="/recipes">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'mr' ? 'परत' : 'Back to Recipes'}
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 font-noto">
              {recipe.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-baloo text-primary mb-4">
              {displayTitle}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {recipe.prep_time && (
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span className="font-noto">{t('prepTime')}: {recipe.prep_time}</span>
                </div>
              )}
              {recipe.cook_time && (
                <div className="flex items-center">
                  <ChefHat className="mr-2 h-4 w-4" />
                  <span className="font-noto">{t('cookTime')}: {recipe.cook_time}</span>
                </div>
              )}
              {recipe.serves && (
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span className="font-noto">{t('servings')}: {recipe.serves}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold font-baloo text-primary mb-4">
                  {t('ingredients')}
                </h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start font-noto">
                      <span className="mr-2 text-heritage-terracotta">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Procedure */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold font-baloo text-primary mb-4">
                  {t('preparation')}
                </h2>
                <ol className="space-y-4">
                  {recipe.procedure.map((step, index) => (
                    <li key={index} className="flex font-noto">
                      <span className="mr-3 font-bold text-heritage-terracotta">
                        {index + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          {recipe.serving_suggestions && (
            <Card className="mt-8">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold font-baloo text-primary mb-2">
                  {language === 'mr' ? 'सर्व्हिंग सूचना' : 'Serving Suggestions'}
                </h3>
                <p className="font-noto">{recipe.serving_suggestions}</p>
              </CardContent>
            </Card>
          )}

          {recipe.context_tips && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold font-baloo text-primary mb-2">
                  {language === 'mr' ? 'संदर्भ आणि टिप्स' : 'Context & Tips'}
                </h3>
                <p className="font-noto text-muted-foreground">{recipe.context_tips}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
