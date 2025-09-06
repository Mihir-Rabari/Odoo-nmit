import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Sample user listings
const sampleListings = [
  {
    id: 1,
    title: "Vintage Danish Modern Dining Chair",
    price: 145,
    status: "active",
    views: 24,
    likes: 8,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    title: "MacBook Pro 13\" 2019",
    price: 899,
    status: "sold",
    views: 156,
    likes: 32,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    createdAt: "2024-01-08",
  },
  {
    id: 3,
    title: "Designer Leather Handbag",
    price: 180,
    status: "pending",
    views: 45,
    likes: 12,
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    createdAt: "2024-01-12",
  }
];

export const MyListings = () => {
  const [listings, setListings] = useState(sampleListings);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-secondary text-secondary-foreground';
      case 'sold': return 'bg-primary text-primary-foreground';
      case 'pending': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleEdit = (id: number) => {
    console.log('Edit listing:', id);
  };

  const handleDelete = (id: number) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
  };

  const handleView = (id: number) => {
    console.log('View listing:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Listings</h2>
          <p className="text-muted-foreground">Manage your active and past listings</p>
        </div>
        <Button className="btn-hero">Create New Listing</Button>
      </div>

      {listings.length === 0 ? (
        <Card className="feature-card text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No listings yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Start selling by creating your first listing
            </p>
            <Button className="btn-hero">Create Your First Listing</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="product-card">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-xl">
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <Badge className={getStatusColor(listing.status)}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 bg-black/20 backdrop-blur-sm hover:bg-black/40"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(listing.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(listing.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Listing
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(listing.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Listing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {listing.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xl font-bold text-primary">
                        ${listing.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Listed {new Date(listing.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{listing.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{listing.likes} likes</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(listing.id)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(listing.id)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};