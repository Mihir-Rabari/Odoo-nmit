import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, MapPin, Clock, Star, Shield, Share2, MessageCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock product data - in a real app, this would come from an API
const mockProducts = [
  {
    id: 1,
    title: "Vintage Leather Jacket",
    price: 89,
    originalPrice: 120,
    category: "Fashion",
    location: "New York, NY",
    timeAgo: "2 hours ago",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop",
    seller: {
      name: "Sarah Johnson",
      rating: 4.9,
      verified: true
    },
    condition: "excellent" as const,
    description: `This vintage leather jacket is in excellent condition and has been well-maintained. Perfect for anyone looking for authentic vintage fashion at great prices.

Key Features:
• Genuine leather construction
• Classic vintage styling
• Well-maintained condition
• Authentic vintage piece
• Ready for immediate wear

About the Seller:
Our verified seller has an excellent track record with a 4.9 star rating. All items are accurately described and shipped promptly.`,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&h=800&fit=crop"
    ]
  },
  {
    id: 2,
    title: "Professional Camera Lens",
    price: 450,
    originalPrice: 600,
    category: "Electronics",
    location: "Los Angeles, CA",
    timeAgo: "5 hours ago",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=800&fit=crop",
    seller: {
      name: "Mike Chen",
      rating: 4.8,
      verified: true
    },
    condition: "good" as const,
    description: `Professional camera lens in good condition. Has been used professionally but well-maintained. Perfect for photographers looking for quality equipment at affordable prices.

Key Features:
• Professional grade optics
• Excellent image quality
• Compatible with major camera brands
• Includes lens caps and filter
• Ready for professional use

About the Seller:
Our verified seller is a professional photographer with excellent ratings and fast shipping.`,
    images: [
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop"
    ]
  }
];

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Find product by ID
    const foundProduct = mockProducts.find(p => p.id === parseInt(id || ''));
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/marketplace');
    }
  }, [id, navigate]);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Product not found</h1>
            <Button onClick={() => navigate('/marketplace')} className="mt-4">
              Return to Marketplace
            </Button>
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
                  ${product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
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