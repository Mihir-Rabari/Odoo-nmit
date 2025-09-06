import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Package, MessageCircle, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';


export const PurchaseHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's orders from API
  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const orders = await api.getAllOrders();
        setPurchases(orders as any[]);
      } catch (error) {
        console.error('Failed to fetch purchase history:', error);
        toast({
          title: "Error",
          description: "Failed to load purchase history",
          variant: "destructive",
        });
        setPurchases([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, [user, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-secondary text-secondary-foreground';
      case 'shipped': return 'bg-primary text-primary-foreground';
      case 'processing': return 'bg-accent text-accent-foreground';
      case 'pending': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleLeaveReview = (id: number) => {
    console.log('Leave review for purchase:', id);
  };

  const handleContactSeller = (id: number) => {
    console.log('Contact seller for purchase:', id);
  };

  const handleTrackOrder = (trackingNumber: string) => {
    console.log('Track order:', trackingNumber);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Purchase History</h2>
        <p className="text-muted-foreground">Track your orders and manage purchases</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="product-card animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <Card className="feature-card text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No purchases yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Start shopping to see your purchase history here
            </p>
            <Button className="btn-hero">Browse Marketplace</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="product-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={purchase.imageUrl}
                      alt={purchase.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {purchase.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Sold by {purchase.seller}
                        </p>
                      </div>
                      <Badge className={getStatusColor(purchase.status)}>
                        {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-primary">
                          ${purchase.price}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          Purchased {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {purchase.trackingNumber && (
                        <div className="text-sm text-muted-foreground">
                          Tracking: {purchase.trackingNumber}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 min-w-[140px]">
                    {purchase.status === 'delivered' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLeaveReview(purchase.id)}
                        className="w-full"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    )}
                    
                    {purchase.trackingNumber && purchase.status !== 'delivered' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTrackOrder(purchase.trackingNumber)}
                        className="w-full"
                      >
                        <Package className="w-4 h-4 mr-1" />
                        Track
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContactSeller(purchase.id)}
                      className="w-full"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Contact
                    </Button>

                    {purchase.status === 'processing' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Navigate to product page for reordering
                          window.location.href = `/product/${purchase.id}`;
                        }}
                        className="w-full"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Reorder
                      </Button>
                    )}
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