import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { SellItemForm } from '@/components/SellItemForm';
import { MyListings } from '@/components/MyListings';
import { PurchaseHistory } from '@/components/PurchaseHistory';
import { ProfileSection } from '@/components/ProfileSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Plus, ShoppingBag, User } from 'lucide-react';
export const DashboardPage = () => {
  return <Layout>
      <div className="pt-20 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your listings, sales, and purchases
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="sell" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="sell" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Sell Item</span>
                </TabsTrigger>
                <TabsTrigger value="listings" className="flex items-center space-x-2">
                  <Package className="w-4 h-4" />
                  <span>My Listings</span>
                </TabsTrigger>
                <TabsTrigger value="purchases" className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Purchases</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sell">
                <SellItemForm />
              </TabsContent>

              <TabsContent value="listings">
                <MyListings />
              </TabsContent>

              <TabsContent value="purchases">
                <PurchaseHistory />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>;
};