import { useQuery } from "@tanstack/react-query";
import { PaintingWithBidCount } from "@shared/schema";
import { useLocation } from "wouter";
import Header from "@/components/header";
import PaintingCard from "@/components/painting-card";
import StatsCards from "@/components/stats-cards";
import LegendarySection from "@/components/legendary-section";
import VoiceCommand from "@/components/voice-command";
import { Activity } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const [, setLocation] = useLocation();

  const { data: paintings, isLoading, error } = useQuery<PaintingWithBidCount[]>({
    queryKey: ['/api/auctions'],
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
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500/20 border-t-purple-500 mx-auto mb-6"></div>
              <Activity className="w-6 h-6 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-foreground font-semibold text-lg">Loading Auction Collection...</p>
            <p className="text-muted-foreground">Accessing vintage art gallery</p>
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
            <p className="text-red-400 font-medium">Failed to load auctions</p>
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
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20"></div>
      </div>

      <Header currentPath="/" />
      
      <main className="relative z-10">
        {/* Stats Cards Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StatsCards 
            totalBids={totalBids}
            activeBidders={2134}
            soldToday={89}
            totalValue={totalBidValue}
          />
        </section>

        {/* Legendary Collection Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LegendarySection />
        </section>

        {/* Auction Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paintings.map((painting) => (
              <PaintingCard
                key={painting.id}
                painting={painting}
                onClick={handlePaintingClick}
              />
            ))}
          </div>
        </section>
      </main>

      <VoiceCommand />
    </div>
  );
}