import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    title_marathi: string;
    category: string;
    total_time?: string;
    serves?: string;
  };
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const { language, t } = useLanguage();
  
  const displayTitle = language === 'mr' ? recipe.title_marathi : recipe.title;
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card border-border">
      <div className="h-40 bg-gradient-to-br from-heritage-clay to-heritage-sea" />
      
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="font-noto">
            {recipe.category}
          </Badge>
        </div>
        <CardTitle className="font-baloo text-xl line-clamp-2">
          {displayTitle}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {recipe.total_time && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {recipe.total_time}
          </div>
        )}
        {recipe.serves && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            {recipe.serves}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Link to={`/recipe/${recipe.id}`} className="w-full">
          <Button className="w-full" variant="default">
            {t('viewRecipe')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
