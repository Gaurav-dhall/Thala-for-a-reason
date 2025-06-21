import { useState, useEffect } from "react";
import { Mic, MicOff, Cpu, Radio, Zap } from "lucide-react";
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
        title: "Neural Interface Unavailable",
        description: "Your system doesn't support neural voice recognition. Please upgrade your browser.",
        variant: "destructive",
      });
      return;
    }

    setIsListening(true);
    
    toast({
      title: "Neural Assistant Online",
      description: "Voice commands: 'Analyze auction matrix' or 'Show highest value nodes'",
    });

    // Simulate cyber AI processing
    setTimeout(() => {
      setIsListening(false);
      toast({
        title: "Neural Processing Complete",
        description: "Advanced AI voice matrix successfully integrated with auction neural network.",
      });
    }, 3000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative">
        {/* Cyber particle effects */}
        {isListening && (
          <>
            <Radio className="absolute -top-8 -left-4 w-4 h-4 text-neon-blue animate-ping" />
            <Zap className="absolute -top-6 -right-6 w-3 h-3 text-plasma-pink animate-pulse delay-200" />
            <Cpu className="absolute -bottom-4 -right-8 w-3 h-3 text-neon-green animate-ping delay-500" />
          </>
        )}
        
        <Button
          onClick={handleVoiceCommand}
          disabled={isListening}
          className={`relative overflow-hidden w-16 h-16 rounded-full shadow-2xl transition-all duration-500 group ${
            isListening 
              ? 'neon-gradient animate-pulse scale-110 neon-glow' 
              : 'btn-cyber hover:scale-110'
          }`}
          size="lg"
        >
          {/* Neural glow effect */}
          <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
            isListening ? 'neon-gradient opacity-30 animate-pulse' : 'opacity-0'
          }`}></div>
          
          {/* Holographic border */}
          <div className="absolute inset-0 rounded-full border-2 border-neon-purple/30 group-hover:border-neon-purple/60 transition-colors duration-300"></div>
          
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

          {/* Cyber tooltip */}
          <div className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="glass-card premium-shadow rounded-xl px-4 py-3 min-w-max cyber-border">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-neon-blue" />
                <span className="text-sm font-semibold text-neon whitespace-nowrap">
                  Neural Voice Matrix
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                AI-powered auction interface
              </p>
            </div>
          </div>
        </Button>

        {/* Neural activity indicator */}
        {isListening && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-neon-blue rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-plasma-pink rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}

        {/* Connection status ring */}
        <div className="absolute -inset-2 rounded-full border border-neon-purple/20 animate-pulse"></div>
      </div>
    </div>
  );
}
