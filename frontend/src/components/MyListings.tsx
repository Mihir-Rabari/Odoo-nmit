import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const MyListings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's products from API
  useEffect(() => {
    const fetchUserListings = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const allProducts = await api.getProducts();
        // Filter products by current user (seller)
        const userProducts = allProducts.filter((product: any) => 
          product.seller && product.seller._id === user._id
        );
        
        // Transform to match listing format
        const transformedListings = userProducts.map((product: any) => ({
          id: product._id,
          title: product.name,
          price: product.price,
          status: product.stock > 0 ? "active" : "sold",
          views: Math.floor(Math.random() * 100) + 10, // Mock views for now
          likes: Math.floor(Math.random() * 20) + 1, // Mock likes for now
          imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
          createdAt: product.createdAt,
        }));
        
        setListings(transformedListings);
      } catch (error) {
        console.error('Failed to fetch user listings:', error);
        toast({
          title: "Error",
          description: "Failed to load your listings",
          variant: "destructive",
        });
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserListings();
  }, [user, toast]);

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

  const handleDelete = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setListings(prev => prev.filter(listing => listing.id !== id));
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete listing:', error);
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    }
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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="product-card animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-6 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : listings.length === 0 ? (
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