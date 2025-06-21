import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Gavel, Users, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import PaintingCard from "@/components/painting-card";
import VoiceAssistant from "@/components/voice-assistant";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { PaintingWithBidCount } from "@shared/schema";

export default function HomePage() {
  const [, setLocation] = useLocation();

  const { data: paintings, isLoading, error } = useQuery<PaintingWithBidCount[]>({
    queryKey: ['/api/auctions'],
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const handlePaintingClick = (painting: PaintingWithBidCount) => {
    setLocation(`/auction/${painting.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentPath="/" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground font-medium">Loading auctions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentPath="/" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive font-medium">Failed to load auctions</p>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  if (!paintings || paintings.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentPath="/" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground font-medium">No auctions available</p>
            <p className="text-muted-foreground">Check back later for new paintings</p>
          </div>
        </div>
      </div>
    );
  }

  const totalBidValue = paintings.reduce((sum, p) => sum + parseFloat(p.currentBid), 0);
  const totalBids = paintings.reduce((sum, p) => sum + (p.bidCount || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header currentPath="/" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Live Vintage Art Auctions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and bid on exceptional vintage paintings from renowned artists. 
            Experience the thrill of real-time auctions from the comfort of your home.
          </p>
        </div>

        {/* Active Auctions Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card shadow-md">
            <CardContent className="p-6 text-center">
              <Gavel className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-foreground">{paintings.length}</h3>
              <p className="text-muted-foreground">Active Auctions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-md">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-foreground">{totalBids}</h3>
              <p className="text-muted-foreground">Total Bids</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card shadow-md">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-foreground">{formatCurrency(totalBidValue)}</h3>
              <p className="text-muted-foreground">Total Bid Value</p>
            </CardContent>
          </Card>
        </div>

        {/* Paintings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paintings.map(painting => (
            <PaintingCard 
              key={painting.id} 
              painting={painting} 
              onClick={handlePaintingClick}
            />
          ))}
        </div>
      </div>
      
      <VoiceAssistant />
    </div>
  );
}
