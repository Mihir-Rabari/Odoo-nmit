import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, DollarSign, MapPin, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categories = [
  'Furniture', 'Electronics', 'Fashion', 'Books', 'Music', 
  'Home & Garden', 'Sports', 'Toys', 'Automotive', 'Collectibles'
];

const conditions = [
  { value: 'excellent', label: 'Excellent', description: 'Like new, minimal signs of use' },
  { value: 'good', label: 'Good', description: 'Well maintained with minor wear' },
  { value: 'fair', label: 'Fair', description: 'Functional with noticeable wear' }
];

const sellItemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description must be less than 1000 characters'),
  category: z.string().min(1, 'Please select a category'),
  condition: z.string().min(1, 'Please select item condition'),
  price: z.number().min(0.01, 'Price must be greater than $0').max(99999, 'Price must be less than $100,000'),
  originalPrice: z.number().optional(),
  location: z.string().min(3, 'Location must be at least 3 characters').max(100, 'Location must be less than 100 characters'),
  images: z.array(z.string()).min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed')
});

type SellItemForm = z.infer<typeof sellItemSchema>;

export const SellItemForm = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<SellItemForm>({
    resolver: zodResolver(sellItemSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      condition: '',
      price: 0,
      originalPrice: undefined,
      location: '',
      images: []
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (selectedImages.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 5 images",
        variant: "destructive"
      });
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setSelectedImages(prev => {
          const newImages = [...prev, imageUrl];
          form.setValue('images', newImages);
          return newImages;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      form.setValue('images', newImages);
      return newImages;
    });
  };

  const onSubmit = (data: SellItemForm) => {
    console.log('Form submitted:', data);
    toast({
      title: "Item listed successfully!",
      description: "Your item has been added to the marketplace",
    });
    
    // Reset form
    form.reset();
    setSelectedImages([]);
  };

  return (
    <Card className="feature-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Tag className="w-5 h-5 text-primary" />
          <span>Sell Your Item</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-4">
              <FormLabel>Images (Required)</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-border/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {selectedImages.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-border/40 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 transition-colors duration-200">
                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground text-center">
                      Add Image
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {form.formState.errors.images && (
                <p className="text-sm text-destructive">{form.formState.errors.images.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="What are you selling?" className="input-eco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="input-eco">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your item in detail..."
                      className="input-eco min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Condition */}
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="input-eco">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {conditions.map(condition => (
                          <SelectItem key={condition.value} value={condition.value}>
                            <div>
                              <div className="font-medium">{condition.label}</div>
                              <div className="text-xs text-muted-foreground">{condition.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="input-eco pl-10"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Original Price */}
              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Price (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="input-eco pl-10"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input 
                        placeholder="City, State"
                        className="input-eco pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full btn-hero"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Listing Item...' : 'List Item for Sale'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};