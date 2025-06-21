import { useState } from "react";
import { Cpu, DollarSign, TrendingUp, Zap, Shield, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import type { Painting } from "@shared/schema";

interface BidFormProps {
  painting: Painting;
  onBidSuccess: () => void;
}

export default function BidForm({ painting, onBidSuccess }: BidFormProps) {
  const [formData, setFormData] = useState({ bidderName: '', amount: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const currentBid = parseFloat(painting.currentBid);
  const minimumBid = currentBid + 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.bidderName.trim()) {
      newErrors.bidderName = 'Name is required';
    }

    const bidAmount = parseFloat(formData.amount);
    if (!bidAmount || bidAmount <= currentBid) {
      newErrors.amount = `Bid must be higher than current bid of ${formatCurrency(currentBid)}`;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitting(true);
      try {
        await apiRequest('POST', `/api/auctions/${painting.id}/bid`, {
          bidderName: formData.bidderName,
          amount: bidAmount.toString()
        });

        toast({
          title: "Bid Placed Successfully!",
          description: `Your bid of ${formatCurrency(bidAmount)} has been placed.`,
        });

        setFormData({ bidderName: '', amount: '' });
        onBidSuccess();
      } catch (error) {
        toast({
          title: "Error Placing Bid",
          description: error instanceof Error ? error.message : "Failed to place bid",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <Card className="glass-card premium-shadow cyber-border overflow-hidden">
      <CardHeader className="neon-gradient text-white relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <CardTitle className="flex items-center text-2xl font-bold relative z-10">
          <Cpu className="w-6 h-6 mr-3 pulse-neon" />
          Neural Bid Interface
        </CardTitle>
        <p className="text-white/90 text-sm font-medium relative z-10 uppercase tracking-wider">
          Access Elite Node Network
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="bidderName" className="text-sm font-semibold text-neon uppercase tracking-wider mb-3 block">
              User Identity
            </Label>
            <Input
              id="bidderName"
              type="text"
              value={formData.bidderName}
              onChange={(e) => setFormData({...formData, bidderName: e.target.value})}
              className={`h-12 text-lg font-medium cyber-border bg-deep-space/50 text-foreground ${errors.bidderName ? 'border-red-500' : ''}`}
              placeholder="Enter neural ID"
            />
            {errors.bidderName && (
              <p className="text-red-400 text-sm mt-2 font-medium">{errors.bidderName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm font-semibold text-cyber uppercase tracking-wider mb-3 block">
              Quantum Value (USD)
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <DollarSign className="w-6 h-6 text-luxury-gold pulse-neon" />
              </div>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className={`pl-14 h-14 text-2xl font-bold cyber-border bg-deep-space/50 text-foreground ${errors.amount ? 'border-red-500' : ''}`}
                placeholder={`Min: ${formatCurrency(minimumBid)}`}
                min={minimumBid.toString()}
                step="1000"
              />
            </div>
            {errors.amount && (
              <p className="text-red-400 text-sm mt-2 font-medium">{errors.amount}</p>
            )}
            
            <div className="mt-4 p-4 glass-effect rounded-xl cyber-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Current Neural Bid:</span>
                <span className="text-lg font-bold text-luxury-gold">{formatCurrency(currentBid)}</span>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-neon-blue animate-pulse" />
                <span className="text-xs font-medium text-neon-blue">Minimum increment: $1,000</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-14 btn-cyber text-lg font-bold tracking-wider mt-8 relative overflow-hidden group"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                Processing Neural Request...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Execute Neural Bid
                <Zap className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform duration-300" />
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
            Neural bid execution confirms legal binding contract in the cyber auction matrix.
            All transactions are secured through quantum encryption protocols.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
