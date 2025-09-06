import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Shield, Recycle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-marketplace.jpg';
export const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const features = [{
    icon: Shield,
    text: "Verified Sellers"
  }, {
    icon: Recycle,
    text: "Sustainable Shopping"
  }, {
    icon: Sparkles,
    text: "Quality Guaranteed"
  }];
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [features.length]);
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(${heroImage})`
    }}>
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95" />
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            <span className="block font-normal">Buy, Sell &</span>
            <span className="block font-normal">
              <span className="text-primary">Save </span>
              <span className="relative">
                Sustainably
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 animate-pulse" />
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 animate-slide-up max-w-3xl mx-auto leading-relaxed">
            Discover unique second-hand treasures while making a positive impact on the planet. 
            Join thousands of eco-conscious shoppers and sellers in the sustainable marketplace revolution.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-scale">
            
            <Button variant="secondary" className="btn-secondary-hero text-lg px-8 py-4" onClick={() => navigate('/login')}>Let's Get Started</Button>
          </div>

          {/* Rotating Features */}
          

          {/* Stats Counter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 animate-slide-up">
            <div className="text-center">
              
              
            </div>
            <div className="text-center">
              
              
            </div>
            <div className="text-center">
              
              
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>;
};