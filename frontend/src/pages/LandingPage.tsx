import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Sample product data
const featuredProducts = [{
  id: 1,
  title: "Vintage Danish Modern Dining Chair",
  price: 145,
  originalPrice: 200,
  category: "Furniture",
  location: "San Francisco, CA",
  timeAgo: "2 days ago",
  rating: 4.8,
  imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
  seller: {
    name: "Sarah Chen",
    rating: 4.9,
    verified: true
  },
  condition: "excellent" as const
}, {
  id: 2,
  title: "MacBook Pro 13\" 2019 - Excellent Condition",
  price: 899,
  originalPrice: 1299,
  category: "Electronics",
  location: "Austin, TX",
  timeAgo: "1 day ago",
  rating: 4.9,
  imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
  seller: {
    name: "Marcus Tech",
    rating: 4.8,
    verified: true
  },
  condition: "excellent" as const
}, {
  id: 3,
  title: "Designer Leather Handbag - Coach",
  price: 180,
  originalPrice: 350,
  category: "Fashion",
  location: "Brooklyn, NY",
  timeAgo: "3 hours ago",
  rating: 4.7,
  imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
  seller: {
    name: "Emily Style",
    rating: 4.9,
    verified: true
  },
  condition: "good" as const
}, {
  id: 4,
  title: "Rare Vinyl Collection - Classic Rock",
  price: 320,
  category: "Music",
  location: "Portland, OR",
  timeAgo: "5 hours ago",
  rating: 4.9,
  imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop",
  seller: {
    name: "Music Collector",
    rating: 4.8,
    verified: true
  },
  condition: "excellent" as const
}];
export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (id: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Cart functionality would be implemented here
    console.log('Added to cart:', id);
  };

  const handleToggleFavorite = (id: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Favorite functionality would be implemented here
    console.log('Toggled favorite:', id);
  };
  return <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      
      {/* Featured Products Section */}
      
      
      <TestimonialsSection />
    </div>;
};