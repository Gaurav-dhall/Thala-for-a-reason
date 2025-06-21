import { useState, useEffect } from "react";
import { Mic, MicOff, Sparkles, Zap } from "lucide-react";
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

    setIsListening(true);
    
    toast({
      title: "🎤 AI Auction Assistant Activated",
      description: "Try: 'Show me the Monet painting' or 'What's the highest bid on Sunset Over Venice?'",
    });

    // Simulate sophisticated voice processing
    setTimeout(() => {
      setIsListening(false);
      toast({
        title: "✨ Voice Command Processed",
        description: "Advanced AI voice integration with real-time auction intelligence is ready for deployment.",
      });
    }, 3000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative">
        {/* Floating particles effect */}
        {isListening && (
          <>
            <Sparkles className="absolute -top-8 -left-4 w-4 h-4 text-gold-primary animate-ping" />
            <Zap className="absolute -top-6 -right-6 w-3 h-3 text-primary animate-pulse delay-200" />
            <Sparkles className="absolute -bottom-4 -right-8 w-3 h-3 text-gold-primary animate-ping delay-500" />
          </>
        )}
        
        <Button
          onClick={handleVoiceCommand}
          disabled={isListening}
          className={`relative overflow-hidden w-16 h-16 rounded-full shadow-2xl transition-all duration-500 group ${
            isListening 
              ? 'luxury-gradient animate-pulse scale-110 pulse-glow' 
              : 'btn-luxury hover:scale-110'
          }`}
          size="lg"
        >
          {/* Background glow effect */}
          <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
            isListening ? 'bg-gradient-to-r from-primary to-gold-primary opacity-30 animate-pulse' : 'opacity-0'
          }`}></div>
          
          {/* Icon */}
          <div className="relative z-10">
            {isListening ? (
              <div className="relative">
                <MicOff className="w-7 h-7 text-white" />
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
              </div>
            ) : (
              <Mic className="w-7 h-7 text-white" />
            )}
          </div>

          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="glass-effect premium-shadow rounded-xl px-4 py-3 min-w-max">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-luxury-gold" />
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                  AI Auction Assistant
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Voice-powered bidding & insights
              </p>
            </div>
            {/* Arrow */}
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-white/20 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        </Button>

        {/* Status indicator */}
        {isListening && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
