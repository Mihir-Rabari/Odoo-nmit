import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { formatPrice } from '@/lib/currency';
import { useToast } from '@/hooks/use-toast';

// Product type matching backend API
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock: number;
}

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        navigate('/marketplace');
        return;
      }

      try {
        setLoading(true);
        const backendProduct = await apiClient.getProduct(id);
        setProduct(backendProduct);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, toast]);

  if (loading || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading product...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-secondary text-secondary-foreground';
      case 'good': return 'bg-primary text-primary-foreground';
      case 'fair': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart`,
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite 
        ? `${product.title} has been removed from your favorites`
        : `${product.title} has been added to your favorites`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Product link has been copied to clipboard",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 p-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-primary' 
                        : 'border-border/20 hover:border-border/40'
                    }`}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Badge className={getConditionColor(product.condition)}>
                  {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
                </Badge>
                <h1 className="text-3xl font-bold text-foreground">
                  {product.title}
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isFavorite 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <Badge variant="secondary">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                    </Badge>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-medium text-foreground">
                  {product.rating.toFixed(1)} rating
                </span>
              </div>
            </div>

            {/* Meta Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Listed {product.timeAgo}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="bg-muted px-2 py-1 rounded-md font-medium">
                  {product.category}
                </span>
              </div>
            </div>

            <Separator />

            {/* Seller Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Seller Information</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-secondary-foreground">
                    {product.seller.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">
                      {product.seller.name}
                    </span>
                    {product.seller.verified && (
                      <div className="flex items-center space-x-1">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="text-xs text-primary font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                    <span className="text-xs text-muted-foreground">
                      {product.seller.rating.toFixed(1)} seller rating
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button onClick={handleAddToCart} className="w-full btn-hero">
                Add to Cart
              </Button>
              <Button variant="secondary" className="w-full btn-secondary-hero">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};