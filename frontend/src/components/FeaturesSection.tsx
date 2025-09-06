import { useEffect, useRef, useState } from 'react';
import { Shield, Leaf, Users, Star, TrendingUp, Heart } from 'lucide-react';
const features = [{
  icon: Shield,
  title: "Verified Sellers",
  description: "Every seller goes through our rigorous verification process to ensure authenticity and reliability.",
  color: "primary"
}, {
  icon: Leaf,
  title: "Sustainable Shopping",
  description: "Reduce waste and carbon footprint by giving pre-loved items a new life with conscious consumers.",
  color: "secondary"
}, {
  icon: Users,
  title: "Community Driven",
  description: "Join a passionate community of eco-conscious buyers and sellers making a difference together.",
  color: "accent"
}, {
  icon: Star,
  title: "Quality Guaranteed",
  description: "Our detailed item descriptions and photos ensure you know exactly what you're purchasing.",
  color: "primary"
}, {
  icon: TrendingUp,
  title: "Fair Pricing",
  description: "Dynamic pricing suggestions help sellers price competitively while maximizing value.",
  color: "secondary"
}, {
  icon: Heart,
  title: "Impact Tracking",
  description: "See the environmental impact of your purchases and celebrate your contribution to sustainability.",
  color: "accent"
}];
export const FeaturesSection = () => {
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          setVisibleFeatures(prev => [...new Set([...prev, index])]);
        }
      });
    }, {
      threshold: 0.2
    });
    const featureElements = sectionRef.current?.querySelectorAll('.feature-card');
    featureElements?.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <section ref={sectionRef} className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6 font-normal">
            Why Choose
            <span className="text-primary"> EcoFinds</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            We're not just another marketplace. We're a movement towards sustainable consumption, 
            connecting conscious consumers with quality pre-loved items.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
          const Icon = feature.icon;
          const isVisible = visibleFeatures.includes(index);
          return <div key={index} data-index={index} className={`feature-card transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{
            transitionDelay: `${index * 100}ms`
          }}>
                <div className="relative group">
                  {/* Icon Container */}
                  

                  {/* Content */}
                  <h3 className="text-xl text-foreground mb-3 group-hover:text-primary transition-colors duration-300 font-medium">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${feature.color === 'primary' ? 'bg-primary/5' : feature.color === 'secondary' ? 'bg-secondary/5' : 'bg-accent/5'}`} />
                </div>
              </div>;
        })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          
        </div>
      </div>
    </section>;
};