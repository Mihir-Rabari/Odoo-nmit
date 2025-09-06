import { Link } from 'react-router-dom';
import { Leaf, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export const Footer = () => {
  return <footer className="bg-card border-t border-border/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              
              <span className="text-xl text-foreground font-medium">EcoFinds</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              The sustainable marketplace connecting eco-conscious buyers and sellers. 
              Making second-hand shopping stylish, secure, and simple.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <nav className="space-y-2">
              <Link to="/marketplace" className="block text-muted-foreground hover:text-primary transition-colors duration-200 link-underline">
                Browse Marketplace
              </Link>
              <Link to="/sell" className="block text-muted-foreground hover:text-primary transition-colors duration-200 link-underline">
                Sell Your Items
              </Link>
              <Link to="/categories" className="block text-muted-foreground hover:text-primary transition-colors duration-200 link-underline">
                Categories
              </Link>
              <Link to="/how-it-works" className="block text-muted-foreground hover:text-primary transition-colors duration-200 link-underline">
                How It Works
              </Link>
              <Link to="/sustainability" className="block text-muted-foreground hover:text-primary transition-colors duration-200 link-underline">
                Our Impact
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Support</h3>
            <nav className="space-y-2">
              <Link to="/help" className="block text-muted-foreground hover:text-primary transition-colors duration-200 link-underline">
                Help Center
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors duration-200 link-underline">
                Contact Us
              </Link>
              <Link to="/shipping" className="block text-muted-foreground hover:text-primary transition-colors duration-200 link-underline">
                Shipping Info
              </Link>
              <Link to="/returns" className="block text-muted-foreground hover:text-primary transition-colors duration-200 link-underline">
                Returns & Refunds
              </Link>
              <Link to="/safety" className="block text-muted-foreground hover:text-primary transition-colors duration-200 link-underline">
                Safety Guidelines
              </Link>
            </nav>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Stay Connected</h3>
            <p className="text-muted-foreground">
              Get the latest deals and sustainability tips delivered to your inbox.
            </p>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Input placeholder="Your email" className="flex-1 input-eco" />
                <Button className="btn-hero">
                  Subscribe
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>hello@ecofinds.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>1-800-ECO-FIND</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 EcoFinds. All rights reserved. Building a sustainable future, one purchase at a time.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};