import { create } from 'zustand';
import { AnimatePresence, motion } from 'framer-motion';
import { TripBuilderForm } from '@/components/TripBuilderForm';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { ItineraryDisplay } from '@/components/ItineraryDisplay';
import { MondokromaItinerary } from '@/lib/types';
import { Button } from '@/components/ui/button';
type AppStatus = 'idle' | 'building' | 'ready' | 'error';
interface AppState {
  status: AppStatus;
  itinerary: MondokromaItinerary | null;
  errorMessage: string | null;
  startBuilding: (formData: { where: string; when: string; howLong: string }) => void;
  reset: () => void;
}
const useAppStore = create<AppState>((set) => ({
  status: 'idle',
  itinerary: null,
  errorMessage: null,
  startBuilding: async (formData) => {
    set({ status: 'building', itinerary: null, errorMessage: null });
    try {
      const response = await fetch('/api/trip/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to build itinerary');
      }
      set({ status: 'ready', itinerary: result.itinerary });
    } catch (error) {
      console.error('Error building itinerary:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      set({ status: 'error', errorMessage: message });
    }
  },
  reset: () => set({ status: 'idle', itinerary: null, errorMessage: null }),
}));
function ErrorDisplay({ message, onRetry }: { message: string, onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-2xl"
    >
      <h2 className="text-4xl md:text-6xl font-display font-bold text-destructive">PLANNING FAILED</h2>
      <p className="text-xl mt-4 text-foreground/70">{message}</p>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-8">
        <Button onClick={onRetry} className="brutalist-button bg-foreground text-background hover:bg-accent hover:text-accent-foreground">
          TRY AGAIN
        </Button>
      </motion.div>
    </motion.div>
  );
}
export function HomePage() {
  const { status, itinerary, errorMessage, startBuilding, reset } = useAppStore();
  const renderContent = () => {
    switch (status) {
      case 'idle':
        return <TripBuilderForm onSubmit={startBuilding} isSubmitting={status === 'building'} />;
      case 'building':
        return null;
      case 'ready':
        if (itinerary) {
          return <ItineraryDisplay itinerary={itinerary} />;
        }
        // Fallback in case itinerary is null, which can happen if API returns success:true but no itinerary
        return <ErrorDisplay message="An unexpected error occurred while displaying the itinerary." onRetry={reset} />;
      case 'error':
        return <ErrorDisplay message={errorMessage || "An unknown error occurred."} onRetry={reset} />;
      default:
        return null;
    }
  };
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <div className="p-8 md:p-16">
        <header className="fixed top-8 left-8 md:top-16 md:left-16 z-50 print-hidden">
          <h1
            className="text-2xl font-display font-bold cursor-pointer"
            onClick={status !== 'building' ? reset : undefined}
          >
            Mondokroma Canvas
          </h1>
        </header>
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)]">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {status === 'building' && <ProgressIndicator />}
        </AnimatePresence>
        <footer className="fixed bottom-8 right-8 md:bottom-16 md:right-16 text-foreground/50 print-hidden">
          Built with ❤️ at Cloudflare
        </footer>
      </div>
    </main>
  );
}