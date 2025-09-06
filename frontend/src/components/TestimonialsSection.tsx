import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
const testimonials = [{
  id: 1,
  name: "Sarah Chen",
  role: "Sustainable Living Enthusiast",
  location: "San Francisco, CA",
  rating: 5,
  content: "EcoFinds has completely transformed how I shop. I've found incredible vintage pieces while reducing my environmental impact. The seller verification process gives me complete confidence in every purchase.",
  avatar: "SC"
}, {
  id: 2,
  name: "Marcus Rodriguez",
  role: "Vintage Collector",
  location: "Austin, TX",
  rating: 5,
  content: "As both a buyer and seller, EcoFinds provides the perfect platform. The community is fantastic, and I love seeing my pre-loved items find new homes with people who truly appreciate them.",
  avatar: "MR"
}, {
  id: 3,
  name: "Emily Thompson",
  role: "Interior Designer",
  location: "Brooklyn, NY",
  rating: 5,
  content: "I source unique pieces for my clients through EcoFinds regularly. The quality descriptions and photos are incredibly detailed, and the pricing is always fair. It's become an essential tool for my business.",
  avatar: "ET"
}];
export const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  return <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6 font-light">
            What Our
            <span className="text-primary"> Community </span>
            Says
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Join thousands of satisfied customers who've made EcoFinds their go-to sustainable marketplace.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{
            transform: `translateX(-${currentTestimonial * 100}%)`
          }}>
              {testimonials.map((testimonial, index) => <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-card border border-border/20 rounded-2xl p-8 lg:p-12 text-center relative">
                    {/* Quote Icon */}
                    <div className="absolute top-6 left-6 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Quote className="w-6 h-6 text-primary" />
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center items-center space-x-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-primary fill-primary" />)}
                    </div>

                    {/* Content */}
                    <blockquote className="text-lg lg:text-xl text-foreground leading-relaxed mb-8 italic">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-secondary-foreground">
                          {testimonial.avatar}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-foreground">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => <button key={index} onClick={() => setCurrentTestimonial(index)} className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentTestimonial ? 'bg-primary scale-110' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}`} />)}
          </div>
        </div>

        {/* Trust Indicators */}
        
      </div>
    </section>;
};