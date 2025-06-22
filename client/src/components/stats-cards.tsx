import { TrendingUp, Users, Trophy, Link as LinkIcon, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  totalBids: number;
  activeBidders: number;
  soldToday: number;
  totalValue: number;
}

export default function StatsCards({ totalBids, activeBidders, soldToday, totalValue }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Bids */}
      <Card className="glass-card premium-shadow cyber-border overflow-hidden group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Total Bids</p>
              <p className="text-2xl font-bold text-foreground mt-1">{formatNumber(totalBids)}</p>
              <div className="flex items-center mt-2 text-green-400">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+23% last 24h</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Bidders */}
      <Card className="glass-card premium-shadow cyber-border overflow-hidden group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Active Bidders</p>
              <p className="text-2xl font-bold text-foreground mt-1">{formatNumber(activeBidders)}</p>
              <div className="flex items-center mt-2 text-blue-400">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+18% online now</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sold Today */}
      <Card className="glass-card premium-shadow cyber-border overflow-hidden group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Sold Today</p>
              <p className="text-2xl font-bold text-foreground mt-1">{soldToday}</p>
              <div className="flex items-center mt-2 text-orange-400">
                <span className="text-sm font-medium">artworks</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Value */}
      <Card className="glass-card premium-shadow cyber-border overflow-hidden group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Total Value</p>
              <p className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalValue)}</p>
              <div className="flex items-center mt-2 text-pink-400">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+67% this week</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
              <LinkIcon className="w-6 h-6 text-pink-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}