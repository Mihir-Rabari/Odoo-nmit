import { useState } from 'react';
import { Heart, MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
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
  onAddToCart?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  onCardClick?: (product: ProductCardProps) => void;
  isFavorite?: boolean;
}

export const ProductCard = ({
  id,
  title,
  price,
  originalPrice,
  category,
  location,
  timeAgo,
  rating,
  imageUrl,
  seller,
  condition,
  onAddToCart,
  onToggleFavorite,
  onCardClick,
  isFavorite = false
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-secondary text-secondary-foreground';
      case 'good': return 'bg-primary text-primary-foreground';
      case 'fair': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(id);
  };

  const handleCardClick = () => {
    const productData = {
      id, title, price, originalPrice, category, location, timeAgo, rating, imageUrl, seller, condition,
      onAddToCart, onToggleFavorite, onCardClick, isFavorite
    };
    onCardClick?.(productData);
  };

  return (
    <div className="product-card group cursor-pointer" onClick={handleCardClick}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay Elements */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <Badge className={getConditionColor(condition)}>
            {condition.charAt(0).toUpperCase() + condition.slice(1)}
          </Badge>
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFavorite 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-black/20 text-white hover:bg-black/40'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Price */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                ${price}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-foreground">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Meta Information */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="bg-muted px-2 py-1 rounded-md text-xs font-medium">
              {category}
            </span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>{location}</span>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center space-x-2 pt-2 border-t border-border/20">
          <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-secondary-foreground">
              {seller.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1">
              <span className="text-xs font-medium text-foreground truncate">
                {seller.name}
              </span>
              {seller.verified && (
                <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-primary-foreground">✓</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="text-xs text-muted-foreground">
                {seller.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full btn-hero opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};