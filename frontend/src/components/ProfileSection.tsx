import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Edit, Camera, Star, Shield, MapPin, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
});

type ProfileForm = z.infer<typeof profileSchema>;

export const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { user, updateUser } = useAuth();

  if (!user) {
    return null;
  }

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      location: user.location,
      bio: user.bio || '',
    }
  });

  const onSubmit = (data: ProfileForm) => {
    updateUser(data);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleAvatarChange = () => {
    toast({
      title: "Avatar Upload",
      description: "Avatar upload functionality would be implemented here.",
    });
  };

  if (!isEditing) {
    return (
      <Card className="feature-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <span>Profile Information</span>
            </CardTitle>
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="btn-secondary-hero"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-lg">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={handleAvatarChange}
                className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors duration-200"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {user.firstName} {user.lastName}
                </h2>
                {user.verified && (
                  <div className="flex items-center space-x-1">
                    <Shield className="w-5 h-5 text-primary" />
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-center sm:justify-start space-x-4 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="font-medium text-foreground">{user.rating}</span>
                  <span className="text-sm text-muted-foreground">rating</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Member since {user.memberSince}
                </span>
              </div>

              {user.bio && (
                <p className="text-muted-foreground max-w-md">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/20">
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-primary">{user.totalSales}</div>
              <div className="text-sm text-muted-foreground">Items Sold</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-primary">{user.totalPurchases}</div>
              <div className="text-sm text-muted-foreground">Items Purchased</div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 pt-6 border-t border-border/20">
            <h3 className="font-semibold text-foreground">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/10 rounded-lg">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{user.email}</span>
              </div>
              
              {user.phone && (
                <div className="flex items-center space-x-3 p-3 bg-muted/10 rounded-lg">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{user.phone}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-3 p-3 bg-muted/10 rounded-lg">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{user.location}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="feature-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Edit className="w-5 h-5 text-primary" />
          <span>Edit Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4 pb-6 border-b border-border/20">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                onClick={handleAvatarChange}
                variant="outline"
                className="btn-secondary-hero"
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Avatar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" className="input-eco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" className="input-eco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter your email address"
                        className="input-eco"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel"
                        placeholder="Enter your phone number"
                        className="input-eco"
                        {...field}
                      />
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
                    <Input 
                      placeholder="City, State"
                      className="input-eco"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell others about yourself..."
                      className="input-eco min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-4 pt-6">
              <Button
                type="submit"
                className="btn-hero"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="btn-secondary-hero"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};