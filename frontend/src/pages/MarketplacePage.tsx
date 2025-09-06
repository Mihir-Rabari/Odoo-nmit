import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, MapPin, Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { api, transformProductToFrontend } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';

// Categories for filtering
const categories = ['All Categories', 'Furniture', 'Electronics', 'Fashion', 'Books', 'Music', 'Home & Garden', 'Sports', 'Toys'];
export const MarketplacePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const backendProducts = await api.getProducts();
        const transformedProducts = backendProducts.map(transformProductToFrontend);
        setAllProducts(transformedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast({
          title: "Error",
          description: "Failed to load products from server.",
          variant: "destructive",
        });
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        // Keep original order (newest first)
        break;
    }
    
    setFilteredProducts(filtered);
  }, [allProducts, searchQuery, selectedCategory, sortBy]);
  const handleAddToCart = (id: string) => {
    const product = allProducts.find(p => p.id === id);
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        seller: product.seller?.name || 'Unknown Seller',
      });
      toast({
        title: "Added to Cart",
        description: `${product.title} has been added to your cart`,
      });
    }
  };
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]);
  };
  const handleProductClick = (product: any) => {
    navigate(`/product/${product.id}`);
  };
  return <Layout>
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Discover
                <span className="text-primary"> Sustainable </span>
                Treasures
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Browse thousands of quality pre-loved items from verified sellers in your area
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input placeholder="Search for items, brands, or categories..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 pr-4 py-4 text-lg input-eco" />
              </div>
              
              {/* Sell Items CTA */}
              
            </div>
          </div>
        </section>

        {/* Filters & Controls */}
        <section className="py-8 border-b border-border/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 input-eco">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 input-eco">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="secondary" className="btn-secondary-hero">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>

              {/* View Controls & Results Count */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} results
                </span>
                
                <div className="flex items-center border border-border/20 rounded-lg p-1">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded transition-colors duration-200 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Grid className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded transition-colors duration-200 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => <div key={i} className="bg-card rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-square bg-muted" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-6 bg-muted rounded w-2/3" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>)}
              </div> : <>
                {filteredProducts.length > 0 ? <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 lg:grid-cols-2'}`}>
                    {filteredProducts.map((product, index) => <div key={product.id} className="animate-fade-in-scale" style={{
                animationDelay: `${index * 50}ms`
              }}>
                        <ProductCard {...product} onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} onCardClick={handleProductClick} isFavorite={favorites.includes(product.id)} />
                      </div>)}
                  </div> : <div className="text-center py-16">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No items found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
              }} className="btn-hero">
                      Clear Filters
                    </Button>
                  </div>}

                {/* Load More Button */}
                {filteredProducts.length >= 6 && <div className="text-center mt-12">
                    <Button className="btn-secondary-hero">
                      Load More Items
                    </Button>
                  </div>}
              </>}
          </div>
        </section>
      </div>

      <ProductDetailModal product={selectedProduct} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false} />
    </Layout>;
};