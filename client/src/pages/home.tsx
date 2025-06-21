import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Zap, Users, TrendingUp, Crown, Activity, Hexagon, Database, Radio } from "lucide-react";
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
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-neon-purple/20 border-t-neon-purple mx-auto mb-6 cyber-glow"></div>
              <Activity className="w-6 h-6 text-neon-purple absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-foreground font-semibold text-lg text-neon">Initializing Neural Network...</p>
            <p className="text-muted-foreground">Scanning digital art matrix</p>
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
      {/* Cyber Background Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 matrix-bg opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 neon-gradient rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 cyber-gradient rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gradient-to-b from-transparent via-neon-blue to-transparent opacity-30"></div>
      </div>

      <Header currentPath="/" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="floating mb-8">
            <Hexagon className="w-20 h-20 text-neon mx-auto mb-4 pulse-neon" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold hero-text mb-6 leading-tight">
            Digital Art
            <br />
            <span className="text-neon">Neural Marketplace</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Enter the future of art collecting through our AI-powered auction matrix. 
            Experience real-time neural bidding on authenticated digital masterpieces in the cyber realm.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm font-medium">
            <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full cyber-border">
              <Radio className="w-4 h-4 text-neon-green animate-pulse" />
              <span className="text-cyber">LIVE FEED</span>
            </div>
            <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full cyber-border">
              <Database className="w-4 h-4 text-neon-blue" />
              <span className="text-cyber">VERIFIED</span>
            </div>
            <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full cyber-border">
              <Activity className="w-4 h-4 text-plasma-pink animate-pulse" />
              <span className="text-cyber">NEURAL NET</span>
            </div>
          </div>
        </div>

        {/* Cyber Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="glass-card premium-shadow cyber-card-hover neon-border">
            <CardContent className="p-8 text-center relative">
              <div className="absolute inset-0 neon-gradient opacity-5 rounded-lg"></div>
              <div className="relative mb-4">
                <Zap className="w-12 h-12 text-neon mx-auto pulse-neon" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-neon-green rounded-full animate-ping"></div>
              </div>
              <h3 className="text-3xl font-bold text-neon mb-2">{paintings.length}</h3>
              <p className="text-muted-foreground font-medium tracking-wider uppercase text-sm">ACTIVE NODES</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card premium-shadow cyber-card-hover neon-border">
            <CardContent className="p-8 text-center relative">
              <div className="absolute inset-0 cyber-gradient opacity-5 rounded-lg"></div>
              <Users className="w-12 h-12 text-cyber mx-auto mb-4 pulse-cyber" />
              <h3 className="text-3xl font-bold text-cyber mb-2">{totalBids}</h3>
              <p className="text-muted-foreground font-medium tracking-wider uppercase text-sm">NEURAL BIDS</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card premium-shadow cyber-card-hover neon-border">
            <CardContent className="p-8 text-center relative">
              <div className="absolute inset-0 plasma-gradient opacity-5 rounded-lg"></div>
              <TrendingUp className="w-12 h-12 text-luxury-gold mx-auto mb-4 pulse-neon" />
              <h3 className="text-3xl font-bold text-luxury-gold mb-2">{formatCurrency(totalBidValue)}</h3>
              <p className="text-muted-foreground font-medium tracking-wider uppercase text-sm">QUANTUM VALUE</p>
            </CardContent>
          </Card>
        </div>

        {/* Section Header for Paintings */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Digital <span className="text-neon">Art Matrix</span>
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent mx-auto"></div>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-blue to-transparent mx-auto mt-1"></div>
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

        {/* Cyber CTA Section */}
        <div className="text-center mt-20 mb-12">
          <div className="glass-card premium-shadow rounded-2xl p-12 cyber-border relative overflow-hidden">
            <div className="absolute inset-0 neon-gradient opacity-5"></div>
            <div className="relative z-10">
              <Crown className="w-12 h-12 text-neon mx-auto mb-6 pulse-neon floating" />
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                Access the Elite <span className="text-neon">Cyber Collective</span>
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join the most exclusive digital art auction network powered by neural intelligence. 
                Experience next-generation bidding with authenticated blockchain masterpieces.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                  <span className="text-cyber">AI VERIFIED</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
                  <span className="text-cyber">BLOCKCHAIN SECURED</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-plasma-pink rounded-full animate-pulse"></div>
                  <span className="text-cyber">QUANTUM ENCRYPTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <VoiceAssistant />
    </div>
  );
}
