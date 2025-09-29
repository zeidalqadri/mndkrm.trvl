import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
const formSchema = z.object({
  where: z.string().min(1, 'Destination is required'),
  when: z.string().min(1, 'Date is required'),
  howLong: z.string().min(1, 'Duration is required'),
});
type FormValues = z.infer<typeof formSchema>;
interface TripBuilderFormProps {
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
}
export function TripBuilderForm({ onSubmit, isSubmitting }: TripBuilderFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const processSubmit: SubmitHandler<FormValues> = (data) => {
    if (!isSubmitting) {
      onSubmit(data);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit(processSubmit)} className="space-y-12 md:space-y-20">
        <div className="space-y-2">
          <label htmlFor="where" className="text-2xl font-display text-foreground/50">Where</label>
          <input
            id="where"
            {...register('where')}
            className="brutalist-input"
            placeholder="Japan (Tokyo & Kyoto)"
            autoComplete="off"
            disabled={isSubmitting}
          />
          {errors.where && <p className="text-destructive text-lg pt-2">{errors.where.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="when" className="text-2xl font-display text-foreground/50">When</label>
          <input
            id="when"
            {...register('when')}
            className="brutalist-input"
            placeholder="March 15-24, 2026"
            autoComplete="off"
            disabled={isSubmitting}
          />
          {errors.when && <p className="text-destructive text-lg pt-2">{errors.when.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="howLong" className="text-2xl font-display text-foreground/50">How long</label>
          <input
            id="howLong"
            {...register('howLong')}
            className="brutalist-input"
            placeholder="10 days"
            autoComplete="off"
            disabled={isSubmitting}
          />
          {errors.howLong && <p className="text-destructive text-lg pt-2">{errors.howLong.message}</p>}
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <button type="submit" className="brutalist-button" disabled={isSubmitting}>
            {isSubmitting ? 'PLANNING...' : 'PLAN MY TRIP'}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}