import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VoiceCommand() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="icon"
        className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-2xl border-2 border-purple-400/50 pulse-neon"
      >
        <Mic className="w-8 h-8 text-white" />
      </Button>
    </div>
  );
}