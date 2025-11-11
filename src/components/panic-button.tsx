"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";

export default function PanicButton() {
  const handlePanic = () => {
    // Redirect to a neutral, common website to avoid suspicion
    window.location.href = "https://www.google.com/search?q=cute+puppies+videos";
  };

  return (
    <Button
      variant="destructive"
      size="lg"
      className="fixed bottom-4 right-4 z-50 h-14 rounded-full shadow-2xl animate-in fade-in-0 zoom-in-95"
      onClick={handlePanic}
      aria-label="Panic Exit: Immediately leave this site"
    >
      <AlertTriangle className="mr-2 h-5 w-5" />
      Panic Exit
    </Button>
  );
}
