import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Gavel, Users, TrendingUp, Crown, Sparkles, Star } from "lucide-react";
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
      <div className="min-h-screen">
        <Header currentPath="/" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary/20 border-t-primary mx-auto mb-6"></div>
              <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-foreground font-semibold text-lg">Curating Masterpieces...</p>
            <p className="text-muted-foreground">Preparing your exclusive auction experience</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
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
      <div className="min-h-screen">
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gold-primary/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <Header currentPath="/" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="floating mb-8">
            <Crown className="w-16 h-16 text-luxury-gold mx-auto mb-4" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold hero-text mb-6 leading-tight">
            Exclusive Vintage
            <br />
            <span className="text-luxury-gold">Art Auctions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Immerse yourself in the world's most prestigious vintage art collection. 
            Experience the thrill of real-time bidding on masterpieces that define centuries of artistic excellence.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm font-medium text-primary">
            <Star className="w-4 h-4 fill-current" />
            <span>LIVE AUCTIONS</span>
            <Star className="w-4 h-4 fill-current" />
            <span>AUTHENTICATED PIECES</span>
            <Star className="w-4 h-4 fill-current" />
            <span>GLOBAL COLLECTORS</span>
            <Star className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Active Auctions Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="glass-effect premium-shadow card-hover elegant-border">
            <CardContent className="p-8 text-center">
              <div className="relative mb-4">
                <Gavel className="w-12 h-12 text-luxury-gold mx-auto pulse-glow" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-ping"></div>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">{paintings.length}</h3>
              <p className="text-muted-foreground font-medium tracking-wide">LIVE AUCTIONS</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect premium-shadow card-hover elegant-border">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-luxury-gold mx-auto mb-4 pulse-glow" />
              <h3 className="text-3xl font-bold text-foreground mb-2">{totalBids}</h3>
              <p className="text-muted-foreground font-medium tracking-wide">ACTIVE BIDS</p>
            </CardContent>
          </Card>
          
          <Card className="glass-effect premium-shadow card-hover elegant-border">
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-12 h-12 text-luxury-gold mx-auto mb-4 pulse-glow" />
              <h3 className="text-3xl font-bold text-luxury-gold mb-2">{formatCurrency(totalBidValue)}</h3>
              <p className="text-muted-foreground font-medium tracking-wide">TOTAL VALUE</p>
            </CardContent>
          </Card>
        </div>

        {/* Section Header for Paintings */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Current <span className="text-luxury-gold">Masterpieces</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-gold-primary mx-auto rounded-full"></div>
        </div>

        {/* Paintings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {paintings.map((painting, index) => (
            <div key={painting.id} className={`${index % 3 === 1 ? 'lg:mt-8' : ''} ${index % 3 === 2 ? 'lg:mt-16' : ''}`}>
              <PaintingCard 
                painting={painting} 
                onClick={handlePaintingClick}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20 mb-12">
          <div className="glass-effect premium-shadow rounded-2xl p-12 elegant-border">
            <Sparkles className="w-12 h-12 text-luxury-gold mx-auto mb-6 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
              Join the Elite Circle of Art Collectors
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Experience the sophistication of high-end art auctions with real-time bidding, 
              authenticated masterpieces, and a community of passionate collectors worldwide.
            </p>
          </div>
        </div>
      </div>
      
      <VoiceAssistant />
    </div>
  );
}
