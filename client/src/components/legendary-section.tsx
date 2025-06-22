import { Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LegendarySection() {
  return (
    <div className="mb-12">
      <div className="text-center max-w-4xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
          background: 'linear-gradient(135deg, #FF5CF0 0%, #FFA500 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          LEGENDARY COLLECTION
        </h2>
        
        {/* Subtext */}
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Experience the thrill of real-time bidding on history's most coveted masterpieces. 
          Each piece tells a story, each bid writes history. Join the elite circle of collectors 
          competing for legendary artworks that define cultural heritage.
        </p>
        
        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105">
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
          
          <Button 
            variant="outline" 
            className="px-8 py-4 text-lg font-semibold bg-black/50 border-gray-600 text-white hover:bg-gray-800 rounded-lg transition-all duration-300"
          >
            <Volume2 className="w-5 h-5 mr-2" />
            Audio Guide
          </Button>
        </div>
      </div>
    </div>
  );
}