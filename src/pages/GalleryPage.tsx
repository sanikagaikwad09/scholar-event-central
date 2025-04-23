
import React, { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

// Sample gallery data
const galleryData = [
  {
    id: 1,
    title: "Tech Symposium 2024",
    date: "May 20, 2024",
    category: "Technology",
    type: "image",
    url: "https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 2,
    title: "Cultural Festival Performance",
    date: "June 15, 2024",
    category: "Cultural",
    type: "image",
    url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 3,
    title: "Career Fair Booths",
    date: "April 12, 2024",
    category: "Career",
    type: "image",
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 4,
    title: "Sports Tournament Finals",
    date: "May 25, 2024",
    category: "Sports",
    type: "image",
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 5,
    title: "Research Symposium Presentations",
    date: "June 10, 2024",
    category: "Academic",
    type: "image",
    url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 6,
    title: "Alumni Networking Event",
    date: "July 5, 2024",
    category: "Networking",
    type: "image",
    url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 7,
    title: "Hackathon Winners",
    date: "May 31, 2024",
    category: "Technology",
    type: "image",
    url: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 8,
    title: "Volunteer Day Activities",
    date: "April 22, 2024",
    category: "Community",
    type: "image",
    url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 9,
    title: "Student Art Exhibition",
    date: "March 15, 2024",
    category: "Cultural",
    type: "image",
    url: "https://images.unsplash.com/photo-1531913764164-f85c52d7e3a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 10,
    title: "Leadership Workshop",
    date: "February 28, 2024",
    category: "Academic",
    type: "image",
    url: "https://images.unsplash.com/photo-1558403194-611308249627?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 11,
    title: "Campus Orchestra Performance",
    date: "January 20, 2024",
    category: "Cultural",
    type: "image",
    url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 12,
    title: "Environmental Cleanup Day",
    date: "April 18, 2024",
    category: "Community",
    type: "image",
    url: "https://images.unsplash.com/photo-1591808216259-284a279997cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
];

// Video data for the Videos tab
const videoData = [
  {
    id: 101,
    title: "Opening Ceremony Highlights",
    date: "May 15, 2024",
    category: "Cultural",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1597423244036-ef5020e83f3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    url: "#", // In a real app, this would be a video URL
  },
  {
    id: 102,
    title: "Tech Talk: Future of AI",
    date: "May 16, 2024",
    category: "Technology",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    url: "#",
  },
  {
    id: 103,
    title: "Dance Competition Finals",
    date: "June 7, 2024",
    category: "Cultural",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    url: "#",
  },
  {
    id: 104,
    title: "Sports Tournament Highlights",
    date: "May 24, 2024",
    category: "Sports",
    type: "video",
    thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    url: "#",
  },
];

// Categories for filtering
const categories = [
  "All Categories",
  "Technology",
  "Cultural",
  "Career",
  "Sports",
  "Academic",
  "Networking",
  "Community"
];

const GalleryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedImage, setSelectedImage] = useState<any>(null);

  // Filter gallery items based on search query and category
  const filterItems = (items: any[]) => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const filteredImages = filterItems(galleryData);
  const filteredVideos = filterItems(videoData);

  // Open image modal
  const openImageModal = (image: any) => {
    setSelectedImage(image);
  };

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Media Gallery</h1>
            <p className="text-gray-600 mt-2">
              Browse photos and videos from past campus events
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search gallery..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Gallery Content */}
          <Tabs defaultValue="photos" className="mb-12">
            <TabsList className="mb-6">
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            <TabsContent value="photos">
              {filteredImages.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">No photos found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredImages.map((image) => (
                    <div 
                      key={image.id} 
                      className="relative group overflow-hidden rounded-lg h-60 cursor-pointer hover-card-effect"
                      onClick={() => openImageModal(image)}
                    >
                      <img 
                        src={image.url} 
                        alt={image.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white font-medium">{image.title}</h3>
                        <p className="text-white/80 text-sm">{image.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="videos">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900">No videos found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="relative group rounded-lg overflow-hidden hover-card-effect">
                      <div className="aspect-video relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-full bg-white/80 w-12 h-12 flex items-center justify-center group-hover:bg-white transition-colors">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="24" 
                              height="24" 
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-purple-600"
                            >
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-lg">{video.title}</h3>
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>{video.date}</span>
                          <span>{video.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={closeImageModal}
        >
          <div 
            className="relative max-w-4xl max-h-[80vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
              onClick={closeImageModal}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title} 
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
            <div className="bg-white p-4 rounded-b-lg">
              <h3 className="font-medium text-lg">{selectedImage.title}</h3>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{selectedImage.date}</span>
                <span>{selectedImage.category}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default GalleryPage;
