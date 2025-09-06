import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Leaf, Search, Settings, LogOut, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartModal } from '@/components/CartModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProfileSection } from '@/components/ProfileSection';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();
  const {
    cartItems,
    cartItemCount,
    updateQuantity,
    removeItem
  } = useCart();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const isActive = (path: string) => location.pathname === path;
  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };
  if (!isAuthenticated || !user) {
    return null; // Or show a login prompt
  }
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-lg border-b border-border/20' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EcoMarket</span>
          </Link>

          {/* Desktop Navigation */}
          

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            

            {/* Profile Section */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-1 rounded-full hover:bg-accent transition-colors duration-200">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="end">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback className="text-sm">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {user.firstName} {user.lastName}
                        </span>
                        {user.verified && <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-primary" />
                            <Badge variant="secondary" className="text-xs px-1 py-0">Verified</Badge>
                          </div>}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <span className="text-xs font-medium text-foreground">{user.rating}</span>
                        <span className="text-xs text-muted-foreground">rating</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold text-primary">{user.totalSales}</div>
                      <div className="text-xs text-muted-foreground">Items Sold</div>
                    </div>
                    <div className="text-center p-2 bg-muted/20 rounded-lg">
                      <div className="text-lg font-bold text-primary">{user.totalPurchases}</div>
                      <div className="text-xs text-muted-foreground">Purchased</div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 w-full px-2 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors duration-200">
                    <User className="w-4 h-4" />
                    Sell Item
                  </button>
                  <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-3 w-full px-2 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors duration-200">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button onClick={logout} className="flex items-center gap-3 w-full px-2 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors duration-200">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Cart */}
            

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-foreground hover:text-primary transition-colors duration-200">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && <div className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-lg">
            <nav className="py-4 space-y-2">
              <Link to="/marketplace" className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                Products
              </Link>
              <Link to="/dashboard" className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                Sell Items
              </Link>
              <button onClick={() => {
            handleAuthClick();
            setIsMobileMenuOpen(false);
          }} className="w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200">
                {isAuthenticated ? 'Dashboard' : 'Sign In'}
              </button>
            </nav>
          </div>}
      </div>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} />

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ProfileSection />
        </DialogContent>
      </Dialog>
    </header>;
};