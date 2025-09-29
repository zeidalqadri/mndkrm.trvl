import { useState } from 'react';
import { motion } from 'framer-motion';
import { MondokromaItinerary } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { produce } from 'immer';
interface EditableFieldProps {
  value: string;
  onSave: (newValue: string | number | boolean) => void;
  isMono?: boolean;
}
function EditableField({ value, onSave, isMono = false }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const handleSave = () => {
    let newValue: string | number | boolean = currentValue;
    const numValue = Number(currentValue);
    if (!isNaN(numValue) && currentValue.trim() !== '') {
      newValue = numValue;
    } else if (currentValue.toLowerCase() === 'true') {
      newValue = true;
    } else if (currentValue.toLowerCase() === 'false') {
      newValue = false;
    }
    onSave(newValue);
    setIsEditing(false);
  };
  if (isEditing) {
    return (
      <input
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            handleSave();
          }
        }}
        className={`bg-accent/20 text-foreground p-1 -m-1 focus:outline-none focus:ring-2 focus:ring-accent w-full ${isMono ? 'font-mono' : 'font-sans'}`}
        autoFocus
      />
    );
  }
  return (
    <span onClick={() => setIsEditing(true)} className={`cursor-pointer hover:bg-accent/10 p-1 -m-1 transition-colors duration-200`}>
      {value}
    </span>
  );
}
function renderValue(value: any, path: (string | number)[], onUpdate: (path: (string | number)[], newValue: any) => void): JSX.Element {
  if (value === null) {
    return <span></span>;
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return <EditableField value={String(value)} onSave={(newValue) => onUpdate(path, newValue)} isMono={true} />;
  }
  if (Array.isArray(value)) {
    return (
      <ul className="list-disc list-inside pl-4 space-y-2">
        {value.map((item, index) => (
          <li key={index}>{renderValue(item, [...path, index], onUpdate)}</li>
        ))}
      </ul>
    );
  }
  if (typeof value === 'object' && value !== null) {
    return (
      <div className="pl-4 border-l-2 border-foreground/20 space-y-4">
        {Object.entries(value).map(([key, val]) => (
          <div key={key}>
            <h4 className="font-bold font-mono text-foreground/60 capitalize">{key.replace(/_/g, ' ')}</h4>
            <div className="mt-1">{renderValue(val, [...path, key], onUpdate)}</div>
          </div>
        ))}
      </div>
    );
  }
  return <span>{String(value)}</span>;
}
interface ItineraryDisplayProps {
  itinerary: MondokromaItinerary;
}
export function ItineraryDisplay({ itinerary: initialItinerary }: ItineraryDisplayProps) {
  const [itinerary, setItinerary] = useState(initialItinerary);
  const handleUpdate = (path: (string | number)[], newValue: any) => {
    setItinerary(currentItinerary =>
      produce(currentItinerary, draft => {
        let current: any = draft;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }
        current[path[path.length - 1]] = newValue;
      })
    );
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-4xl mx-auto space-y-12 md:space-y-20 text-lg print:space-y-8"
      id="itinerary-content"
    >
      <header className="space-y-4 print:text-center">
        <h1 className="text-6xl md:text-8xl font-display font-bold print:text-5xl">{itinerary.route[0].location.split(',')[0]}{itinerary.route.length > 1 ? ` & ${itinerary.route[itinerary.route.length - 1].location.split(',')[0]}` : ''}</h1>
        <p className="text-2xl text-foreground/70 print:text-xl">{itinerary.dates.start} to {itinerary.dates.end} ({itinerary.dates.nights} nights)</p>
        <p className="border-t-2 border-b-2 border-foreground py-4 mt-8 text-xl print:border-t print:border-b print:py-2 print:mt-4 print:text-base">
          <EditableField value={itinerary.traveler_statement} onSave={(newValue) => handleUpdate(['traveler_statement'], newValue)} />
        </p>
      </header>
      <section className="print:break-before-page">
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 print:text-3xl print:mb-4">Overview</h2>
        <p className="leading-relaxed print:text-base">
          <EditableField value={itinerary.overview} onSave={(newValue) => handleUpdate(['overview'], newValue)} />
        </p>
      </section>
      <section>
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 print:text-3xl print:mb-4">Day by Day</h2>
        <div className="space-y-12 print:space-y-6">
          {itinerary.day_by_day.map((day, index) => (
            <div key={day.day} className="border-t-2 border-foreground pt-6 print:border-t print:pt-4 print:break-inside-avoid">
              <h3 className="text-3xl font-display font-bold mb-4 print:text-2xl print:mb-2">Day {day.day}: {day.location}</h3>
              <div className="space-y-4 print:space-y-2 print:text-sm">
                <div>
                  <h4 className="font-bold font-mono text-foreground/60 print:text-xs">MORNING</h4>
                  <p><EditableField value={day.morning} onSave={(newValue) => handleUpdate(['day_by_day', index, 'morning'], newValue)} /></p>
                </div>
                <div>
                  <h4 className="font-bold font-mono text-foreground/60 print:text-xs">AFTERNOON</h4>
                  <p><EditableField value={day.afternoon} onSave={(newValue) => handleUpdate(['day_by_day', index, 'afternoon'], newValue)} /></p>
                </div>
                <div>
                  <h4 className="font-bold font-mono text-foreground/60 print:text-xs">EVENING</h4>
                  <p><EditableField value={day.evening} onSave={(newValue) => handleUpdate(['day_by_day', index, 'evening'], newValue)} /></p>
                </div>
                {day.notes && (
                  <div>
                    <h4 className="font-bold font-mono text-foreground/60 print:text-xs">NOTES</h4>
                    <p><EditableField value={day.notes} onSave={(newValue) => handleUpdate(['day_by_day', index, 'notes'], newValue)} /></p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="print:break-before-page">
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 print:text-3xl print:mb-4">Logistics</h2>
        <div className="font-mono text-base space-y-6 print:text-sm print:space-y-4">
          {renderValue(itinerary.logistics, ['logistics'], handleUpdate)}
        </div>
      </section>
      <section>
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 print:text-3xl print:mb-4">Budget</h2>
        <div className="font-mono text-base print:text-sm">
          {renderValue(itinerary.budget, ['budget'], handleUpdate)}
        </div>
      </section>
      <footer className="text-center pt-12 border-t-2 border-foreground print-hidden">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="brutalist-button flex-1" onClick={() => alert('Itinerary approved! (Mock handoff)')}>
            Approve Itinerary
            </Button>
            <Button size="lg" variant="outline" className="brutalist-button bg-background text-foreground hover:bg-foreground hover:text-background flex-1" onClick={() => window.print()}>
                <Printer className="mr-2 h-6 w-6"/>
                Print
            </Button>
        </div>
      </footer>
    </motion.div>
  );
}