import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const handleVoiceCommand = () => {
    if (!isSupported) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please use a modern browser.",
        variant: "destructive",
      });
      return;
    }

    // This is where OmniDimension integration would go
    // For now, we'll simulate the voice assistant functionality
    setIsListening(true);
    
    toast({
      title: "Voice Assistant Activated",
      description: "Say 'list auctions' to see current items, or 'place bid on [painting name]' to bid.",
    });

    // Simulate listening for 3 seconds
    setTimeout(() => {
      setIsListening(false);
      toast({
        title: "Voice Command Processed",
        description: "Voice assistant integration with OmniDimension is in development.",
      });
    }, 3000);

    // TODO: Integrate with OmniDimension voice agent
    // This would involve:
    // 1. Initialize voice recognition
    // 2. Connect to OmniDimension webhook/SDK
    // 3. Handle voice commands for listing auctions
    // 4. Process bid placement via voice
    // 5. Update UI with real-time Socket.io events
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleVoiceCommand}
        disabled={isListening}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group ${
          isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary/90'
        }`}
        size="lg"
      >
        {isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
        <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-popover text-popover-foreground px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
          Talk to Auction Assistant
        </span>
      </Button>
    </div>
  );
}
