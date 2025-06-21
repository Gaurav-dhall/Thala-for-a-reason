import { Clock, User, Calendar, Brush, DollarSign, Zap, Eye, Cpu, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatTimeRemaining } from "@/lib/utils";
import type { PaintingWithBidCount } from "@shared/schema";

interface PaintingCardProps {
  painting: PaintingWithBidCount;
  onClick: (painting: PaintingWithBidCount) => void;
}

export default function PaintingCard({ painting, onClick }: PaintingCardProps) {
  const timeRemaining = painting.auctionEndTime 
    ? formatTimeRemaining(painting.auctionEndTime)
    : painting.timeRemaining || "Unknown";

  const isEndingSoon = timeRemaining.includes('m') && !timeRemaining.includes('h');

  return (
    <Card 
      className="glass-card premium-shadow cyber-card-hover cursor-pointer group overflow-hidden cyber-border relative"
      onClick={() => onClick(painting)}
    >
      {/* Cyber authentication badge */}
      <div className="absolute top-4 left-4 z-10">
        <Badge className="bg-neon-purple/20 text-neon border-neon-purple/50 border font-medium tracking-wide backdrop-blur-sm">
          <Shield className="w-3 h-3 mr-1" />
          VERIFIED
        </Badge>
      </div>

      {/* Time remaining badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className={`border-0 font-semibold backdrop-blur-sm ${
          isEndingSoon 
            ? 'bg-red-500/80 hover:bg-red-500 text-white animate-pulse plasma-glow' 
            : 'bg-neon-green/80 hover:bg-neon-green text-black cyber-glow'
        }`}>
          <Clock className="w-4 h-4 mr-1" />
          {timeRemaining}
        </Badge>
      </div>

      {/* Image with cyber overlay effects */}
      <div className="relative overflow-hidden">
        <img 
          src={painting.imageUrl || "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&w=800&h=600&fit=crop"}
          alt={`${painting.title} by ${painting.artist}`}
          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Cyber grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-void-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Matrix lines overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent transform -skew-x-12"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/20 to-transparent transform skew-y-6"></div>
        </div>
        
        {/* Hover action button */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center space-x-2 glass-effect cyber-border rounded-full px-4 py-2 text-sm font-semibold text-neon">
            <Eye className="w-4 h-4" />
            <span>ACCESS NODE</span>
          </div>
        </div>

        {/* Holographic effect */}
        <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-60"></div>
      </div>
      
      <CardContent className="p-6 relative">
        {/* Title with cyber styling */}
        <h3 className="font-serif text-2xl font-bold text-foreground mb-3 group-hover:text-neon transition-colors duration-300 leading-tight">
          {painting.title}
        </h3>
        
        {/* Artist and details grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center text-sm">
            <User className="w-4 h-4 mr-2 text-neon-blue flex-shrink-0" />
            <span className="font-medium text-muted-foreground truncate">{painting.artist}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-neon-cyan flex-shrink-0" />
            <span className="font-medium text-muted-foreground">{painting.year}</span>
          </div>
          
          <div className="flex items-center text-sm col-span-2">
            <Brush className="w-4 h-4 mr-2 text-plasma-pink flex-shrink-0" />
            <span className="font-medium text-muted-foreground">{painting.type}</span>
          </div>
        </div>
        
        {/* Cyber bid information */}
        <div className="relative">
          <div className="absolute inset-0 neon-gradient opacity-5 rounded-xl"></div>
          <div className="relative p-4 rounded-xl cyber-border">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1 font-medium tracking-wider uppercase">Neural Bid</p>
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-1 text-luxury-gold" />
                  <p className="text-2xl font-bold text-luxury-gold">
                    {formatCurrency(painting.currentBid)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1 font-medium tracking-wider uppercase">Node Activity</p>
                <div className="flex items-center justify-end space-x-1">
                  <Cpu className="w-4 h-4 text-neon-purple" />
                  <p className="text-lg font-bold text-neon">
                    {painting.bidCount || 0}
                  </p>
                  <span className="text-sm text-muted-foreground">bids</span>
                </div>
              </div>
            </div>
            
            {/* Neural activity indicator */}
            {(painting.bidCount || 0) > 0 && (
              <div className="mt-3 flex items-center space-x-2">
                <div className="flex-1 h-1 bg-deep-space rounded-full overflow-hidden">
                  <div 
                    className="h-full neon-gradient rounded-full transition-all duration-500 pulse-neon"
                    style={{ width: `${Math.min((painting.bidCount || 0) * 20, 100)}%` }}
                  ></div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  (painting.bidCount || 0) > 5 
                    ? 'text-red-400 bg-red-500/20 border border-red-500/30' 
                    : 'text-neon-green bg-neon-green/20 border border-neon-green/30'
                }`}>
                  {(painting.bidCount || 0) > 5 ? 'CRITICAL' : 'ACTIVE'}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
