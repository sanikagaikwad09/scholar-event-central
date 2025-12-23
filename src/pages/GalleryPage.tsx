
// import { useState, useEffect } from "react";
// import MainLayout from "@/components/MainLayout";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Image, Video, Grid, List } from "lucide-react";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";

// interface GalleryItem {
//   id: string;
//   type: string;
//   url: string;
//   title: string | null;
//   created_at: string;
// }

// const GalleryPage = () => {
//   const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [selectedType, setSelectedType] = useState<'all' | 'photo' | 'video'>('all');
//   const { toast } = useToast();

//   useEffect(() => {
//     loadGalleryItems();
//   }, []);

//   const loadGalleryItems = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('gallery')
//         .select('*')
//         .order('created_at', { ascending: false });
      
//       if (error) throw error;
//       setGalleryItems(data || []);
//     } catch (error) {
//       console.error("Error loading gallery items:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load gallery items",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredItems = galleryItems.filter(item => 
//     selectedType === 'all' || item.type === selectedType
//   );

//   if (loading) {
//     return (
//       <MainLayout>
//         <div className="container mx-auto px-4 py-8">
//           <div className="text-center py-12">
//             <h3 className="text-lg font-medium text-gray-900">Loading gallery...</h3>
//           </div>
//         </div>
//       </MainLayout>
//     );
//   }

//   return (
//     <MainLayout>
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
//             <p className="text-gray-600 mt-2">
//               Explore photos and videos from our college events
//             </p>
//           </div>

//           {/* Filters and View Controls */}
//           <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
//             <div className="flex flex-col md:flex-row gap-4 justify-between">
//               <div className="flex gap-2">
//                 <Button
//                   variant={selectedType === 'all' ? 'default' : 'outline'}
//                   onClick={() => setSelectedType('all')}
//                   size="sm"
//                 >
//                   All ({galleryItems.length})
//                 </Button>
//                 <Button
//                   variant={selectedType === 'photo' ? 'default' : 'outline'}
//                   onClick={() => setSelectedType('photo')}
//                   size="sm"
//                   className="flex items-center gap-1"
//                 >
//                   <Image className="h-4 w-4" />
//                   Photos ({galleryItems.filter(i => i.type === 'photo').length})
//                 </Button>
//                 <Button
//                   variant={selectedType === 'video' ? 'default' : 'outline'}
//                   onClick={() => setSelectedType('video')}
//                   size="sm"
//                   className="flex items-center gap-1"
//                 >
//                   <Video className="h-4 w-4" />
//                   Videos ({galleryItems.filter(i => i.type === 'video').length})
//                 </Button>
//               </div>
              
//               <div className="flex">
//                 <Button
//                   variant={viewMode === 'grid' ? 'default' : 'outline'}
//                   size="icon"
//                   onClick={() => setViewMode('grid')}
//                   className="rounded-r-none"
//                 >
//                   <Grid className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant={viewMode === 'list' ? 'default' : 'outline'}
//                   size="icon"
//                   onClick={() => setViewMode('list')}
//                   className="rounded-l-none"
//                 >
//                   <List className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Gallery Content */}
//           {filteredItems.length === 0 ? (
//             <div className="text-center py-12">
//               <h3 className="text-lg font-medium text-gray-900">No items found</h3>
//               <p className="mt-1 text-gray-500">
//                 {selectedType === 'all' 
//                   ? "No gallery items available yet." 
//                   : `No ${selectedType}s available yet.`
//                 }
//               </p>
//             </div>
//           ) : (
//             <>
//               {viewMode === 'grid' ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                   {filteredItems.map((item) => (
//                     <Card key={item.id} className="overflow-hidden hover-card-effect">
//                       <div className="aspect-square overflow-hidden">
//                         {item.type === 'photo' ? (
//                           <img
//                             src={item.url}
//                             alt={item.title || 'Gallery item'}
//                             className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//                           />
//                         ) : (
//                           <video
//                             src={item.url}
//                             className="w-full h-full object-cover"
//                             controls
//                             preload="metadata"
//                           />
//                         )}
//                       </div>
//                       {item.title && (
//                         <CardContent className="p-3">
//                           <h3 className="font-medium text-sm truncate">{item.title}</h3>
//                           <p className="text-xs text-gray-500 mt-1">
//                             {new Date(item.created_at).toLocaleDateString()}
//                           </p>
//                         </CardContent>
//                       )}
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {filteredItems.map((item) => (
//                     <Card key={item.id} className="overflow-hidden hover-card-effect">
//                       <div className="flex flex-col md:flex-row">
//                         <div className="md:w-1/4 h-48 md:h-auto">
//                           {item.type === 'photo' ? (
//                             <img
//                               src={item.url}
//                               alt={item.title || 'Gallery item'}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : (
//                             <video
//                               src={item.url}
//                               className="w-full h-full object-cover"
//                               controls
//                               preload="metadata"
//                             />
//                           )}
//                         </div>
//                         <CardContent className="md:w-3/4 p-4">
//                           <div className="flex items-center gap-2 mb-2">
//                             {item.type === 'photo' ? (
//                               <Image className="h-4 w-4 text-gray-500" />
//                             ) : (
//                               <Video className="h-4 w-4 text-gray-500" />
//                             )}
//                             <span className="text-xs text-gray-500 uppercase">
//                               {item.type}
//                             </span>
//                           </div>
//                           <h3 className="text-lg font-semibold mb-2">
//                             {item.title || 'Untitled'}
//                           </h3>
//                           <p className="text-sm text-gray-500">
//                             Added on {new Date(item.created_at).toLocaleDateString('en-US', {
//                               year: 'numeric',
//                               month: 'long',
//                               day: 'numeric'
//                             })}
//                           </p>
//                         </CardContent>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </MainLayout>
//   );
// };

// export default GalleryPage;
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import inaugrationImg from "@/components/images/inaugration.jpeg";
import aimxTechfestImg from "@/components/images/aimx techfest.jpg";
import garbaNightImg from "@/components/images/garba night.jpg";
import makarImg from "@/components/images/makarsankranti.jpg";
import bannerDropImg from "@/components/images/aimx banner drop.jpg";
import shivajiJayantiImg from "@/components/images/shivaji jayanti.jpg";
import shivajiJayanti1Img from "@/components/images/shivaji jayanti 1.jpg";
import shivajiJayanti2Img from "@/components/images/shivaji jayanti 2.jpg";

const galleryItems = [
  // Event images (remote)
  {
    url: inaugrationImg,
    title: "Inauguration Ceremony",
    created_at: "2025-06-01",
    type: "photo",
  },
  {
    url: aimxTechfestImg,
    title: "AIMX-Techfest",
    created_at: "2025-03-18",
    type: "photo",
  },
  {
    url: garbaNightImg,
    title: "Garba Night",
    created_at: "2024-10-20",
    type: "photo",
  },
  {
    url: makarImg,
    title: "Makar Sankranti",
    created_at: "2025-01-14",
    type: "photo",
  },
  {
    url: bannerDropImg,
    title: "Tech Fest Banner Drop",
    created_at: "2025-01-14",
    type: "photo",
  },
  {
    url: aimxTechfestImg,
    title: "AIMX-Techfest",
    created_at: "2025-01-14",
    type: "photo",
  },
  {
    url: shivajiJayantiImg,
    title: "Shivaji Jayanti",
    created_at: "2025-02-18",
    type: "photo",
  },
  {
    url: shivajiJayanti1Img,
    title: "Shivaji Jayanti",
    created_at: "2025-02-18",
    type: "photo",
  },
  {
    url: shivajiJayanti2Img,
    title: "Shivaji Jayanti",
    created_at: "2025-02-18",
    type: "photo",
  },
];

const videoItems = [
  {
    url: "https://www.youtube.com/live/iBpTBWzc4hA?si=aHWCKRqwuN3EVBEQ",
    title: "Event Highlights",
  },
  {
    url: "https://www.youtube.com/live/GsryqG_3bSk?si=FXNZeM2DmwtXL-0W",
    title: "Student Projects",
  },
  {
    url: "https://www.youtube.com/live/ZthJJCWEwu8?si=IzsXMytxltfX8S88",
    title: "Closing Ceremony",
  },
];

const StaticGallery = () => {
  const [activeTab, setActiveTab] = useState("photos");

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Media Gallery</h1>

        <Tabs defaultValue="photos" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-2 w-full md:w-1/2">
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {galleryItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videoItems.map((video, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      src={video.url}
                      title={video.title}
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm">{video.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StaticGallery;
