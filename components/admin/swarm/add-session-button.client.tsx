import { useSessionContext } from '@/lib/providers/session-state-provider';
import { Button } from '@/components/ui/button';

export default function AddSessionButton() {
  const { addSession } = useSessionContext();

  return (
    <Button className="w-full" onClick={addSession}>
      +
    </Button>
  );
}