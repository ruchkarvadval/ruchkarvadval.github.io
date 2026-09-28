import { useState, useEffect, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase, type Recipe, type RecipeImport } from "@/lib/supabase";
import {
  ClipboardList,
  BookOpen,
  Plus,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Clock,
  SkipForward,
} from "lucide-react";

const STATUS_STYLES: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  transcript_ready: { label: "Ready", icon: Clock, color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  in_review: { label: "In Review", icon: ClipboardList, color: "bg-amber-500/10 text-amber-700 border-amber-200" },
  completed: { label: "Done", icon: CheckCircle2, color: "bg-green-500/10 text-green-700 border-green-200" },
  skipped: { label: "Skipped", icon: SkipForward, color: "bg-gray-500/10 text-gray-600 border-gray-200" },
};

export default function Admin() {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [imports, setImports] = useState<RecipeImport[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<"queue" | "recipes">("queue");

  const loadData = useCallback(async () => {
    setLoadingData(true);

    const { data: importData, error: importError } = await supabase
      .from("recipe_imports")
      .select("*")
      .order("created_at", { ascending: false });

    if (importError) {
      toast({ title: "Failed to load imports", description: importError.message, variant: "destructive" });
    }

    const { data: recipeData, error: recipeError } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (recipeError) {
      toast({ title: "Failed to load recipes", description: recipeError.message, variant: "destructive" });
    }

    setImports(importData ?? []);
    setRecipes(recipeData ?? []);
    setLoadingData(false);
  }, [toast]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, loadData]);

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out" });
  };

  const handleSkip = async (id: string) => {
    const { error } = await supabase
      .from("recipe_imports")
      .update({ status: "skipped" })
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Marked as skipped" });
      loadData();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-noto text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const queueItems = imports.filter((i) => i.status !== "completed" && i.status !== "skipped");
  const completedItems = imports.filter((i) => i.status === "completed");
  const skippedItems = imports.filter((i) => i.status === "skipped");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-baloo text-primary">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground font-noto mt-1">
              Signed in as {user.email}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-4 py-2 font-noto text-sm font-medium border-b-2 transition-colors ${
              activeTab === "queue"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Transcript Queue ({queueItems.length})
          </button>
          <button
            onClick={() => setActiveTab("recipes")}
            className={`px-4 py-2 font-noto text-sm font-medium border-b-2 transition-colors ${
              activeTab === "recipes"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Recipes ({recipes.length})
          </button>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-12">
            <p className="font-noto text-muted-foreground">Loading...</p>
          </div>
        ) : activeTab === "queue" ? (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold font-baloo text-primary">{queueItems.length}</p>
                  <p className="text-sm text-muted-foreground font-noto">In Queue</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold font-baloo text-green-600">{completedItems.length}</p>
                  <p className="text-sm text-muted-foreground font-noto">Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold font-baloo text-gray-500">{skippedItems.length}</p>
                  <p className="text-sm text-muted-foreground font-noto">Skipped</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-2xl font-bold font-baloo text-heritage-terracotta">{recipes.length}</p>
                  <p className="text-sm text-muted-foreground font-noto">Total Recipes</p>
                </CardContent>
              </Card>
            </div>

            {/* Queue Items */}
            {queueItems.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="font-noto text-muted-foreground">
                    No transcripts waiting. Run the extraction scripts to add more.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {queueItems.map((item) => {
                  const statusInfo = STATUS_STYLES[item.status] ?? STATUS_STYLES.transcript_ready;
                  return (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={statusInfo.color}>
                                <statusInfo.icon className="mr-1 h-3 w-3" />
                                {statusInfo.label}
                              </Badge>
                              {item.subtitle_lang && (
                                <span className="text-xs text-muted-foreground font-noto">
                                  {item.subtitle_lang === "mr" ? "Marathi" : item.subtitle_lang === "en" ? "English" : item.subtitle_lang}
                                </span>
                              )}
                            </div>
                            <h3 className="font-baloo text-lg text-primary truncate">{item.video_title}</h3>
                            <p className="text-sm text-muted-foreground font-noto mt-1 line-clamp-2">
                              {item.transcript.slice(0, 200)}...
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            <Link to={`/admin/recipe/new?import=${item.id}`}>
                              <Button size="sm">
                                Create Recipe
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSkip(item.id)}
                            >
                              <SkipForward className="mr-1 h-4 w-4" />
                              Skip
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold font-baloo text-primary flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                All Recipes
              </h2>
              <Link to="/admin/recipe/new">
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  New Recipe
                </Button>
              </Link>
            </div>

            {recipes.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="font-noto text-muted-foreground">
                    No recipes yet. Create one from a transcript or add manually.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {recipes.map((recipe) => (
                  <Card key={recipe.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <Link to={`/admin/recipe/${recipe.id}`} className="block">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-baloo text-lg text-primary hover:underline">{recipe.title}</h3>
                          <Badge variant="secondary" className="font-noto shrink-0">{recipe.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-noto">{recipe.title_marathi}</p>
                        <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                          {recipe.prep_time && <span>{recipe.prep_time}</span>}
                          {recipe.cook_time && <span>{recipe.cook_time}</span>}
                          {recipe.serves && <span>Serves: {recipe.serves}</span>}
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
