
import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Video, Grid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GalleryItem {
  id: string;
  type: string;
  url: string;
  title: string | null;
  created_at: string;
}

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<'all' | 'photo' | 'video'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      console.error("Error loading gallery items:", error);
      toast({
        title: "Error",
        description: "Failed to load gallery items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = galleryItems.filter(item => 
    selectedType === 'all' || item.type === selectedType
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">Loading gallery...</h3>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
            <p className="text-gray-600 mt-2">
              Explore photos and videos from our college events
            </p>
          </div>

          {/* Filters and View Controls */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <Button
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('all')}
                  size="sm"
                >
                  All ({galleryItems.length})
                </Button>
                <Button
                  variant={selectedType === 'photo' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('photo')}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Image className="h-4 w-4" />
                  Photos ({galleryItems.filter(i => i.type === 'photo').length})
                </Button>
                <Button
                  variant={selectedType === 'video' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('video')}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Video className="h-4 w-4" />
                  Videos ({galleryItems.filter(i => i.type === 'video').length})
                </Button>
              </div>
              
              <div className="flex">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Gallery Content */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-gray-500">
                {selectedType === 'all' 
                  ? "No gallery items available yet." 
                  : `No ${selectedType}s available yet.`
                }
              </p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover-card-effect">
                      <div className="aspect-square overflow-hidden">
                        {item.type === 'photo' ? (
                          <img
                            src={item.url}
                            alt={item.title || 'Gallery item'}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover"
                            controls
                            preload="metadata"
                          />
                        )}
                      </div>
                      {item.title && (
                        <CardContent className="p-3">
                          <h3 className="font-medium text-sm truncate">{item.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover-card-effect">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-48 md:h-auto">
                          {item.type === 'photo' ? (
                            <img
                              src={item.url}
                              alt={item.title || 'Gallery item'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={item.url}
                              className="w-full h-full object-cover"
                              controls
                              preload="metadata"
                            />
                          )}
                        </div>
                        <CardContent className="md:w-3/4 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {item.type === 'photo' ? (
                              <Image className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Video className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="text-xs text-gray-500 uppercase">
                              {item.type}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">
                            {item.title || 'Untitled'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Added on {new Date(item.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default GalleryPage;
