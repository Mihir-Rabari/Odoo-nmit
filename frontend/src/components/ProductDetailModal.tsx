import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, MapPin, Clock, Star, Shield, Share2, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailModalProps {
  product: {
    id: number;
    title: string;
    price: number;
    originalPrice?: number;
    category: string;
    location: string;
    timeAgo: string;
    rating: number;
    imageUrl: string;
    seller: {
      name: string;
      rating: number;
      verified: boolean;
    };
    condition: 'excellent' | 'good' | 'fair';
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  isFavorite?: boolean;
}

export const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false
}: ProductDetailModalProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { toast } = useToast();

  if (!product) return null;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-secondary text-secondary-foreground';
      case 'good': return 'bg-primary text-primary-foreground';
      case 'fair': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product.id);
    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart`,
    });
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(product.id);
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

  // Sample additional images - in real app, these would come from the product data
  const images = [
    product.imageUrl,
    product.imageUrl, // Placeholder - would be different images
    product.imageUrl,
  ];

  const sampleDescription = `This ${product.title.toLowerCase()} is in ${product.condition} condition and has been well-maintained. Perfect for anyone looking for quality pre-owned items at great prices. 

Key Features:
• High-quality construction
• Well-maintained condition
• Authentic and verified
• Ready for immediate use

About the Seller:
Our verified seller has an excellent track record with a ${product.seller.rating.toFixed(1)} star rating. All items are accurately described and shipped promptly.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-2">
                {images.map((image, index) => (
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
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge className={getConditionColor(product.condition)}>
                    {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
                  </Badge>
                  <h2 className="text-2xl font-bold text-foreground">
                    {product.title}
                  </h2>
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
            </DialogHeader>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-primary">
                  ${product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
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
                {sampleDescription}
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
      </DialogContent>
    </Dialog>
  );
};