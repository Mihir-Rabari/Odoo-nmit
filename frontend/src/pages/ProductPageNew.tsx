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

  const handleAddToCart = () => {
    if (!product || !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to cart",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    addToCart({
      id: product._id,
      title: product.name,
      price: product.price,
      imageUrl: product.imageUrl || '',
      seller: 'Sample Seller',
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite 
        ? "Product removed from your favorites" 
        : "Product added to your favorites",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard",
      });
    }
  };

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/marketplace')}
          className="mb-6 hover:bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-muted">
              <img
                src={product.imageUrl || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=800&fit=crop'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-2">
                  {product.category}
                </Badge>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {product.name}
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
              </div>
            </div>

            {/* Stock Status */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleAddToCart} 
                className="w-full btn-hero"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              {!user && (
                <p className="text-sm text-muted-foreground text-center">
                  <span>Please </span>
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-primary hover:underline"
                  >
                    log in
                  </button>
                  <span> to purchase this item</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
