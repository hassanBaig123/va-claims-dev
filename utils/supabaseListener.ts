import { startDbListener } from '@/utils/dbListener';

let listenerStarted = false;

export function initSupabaseListener() {
  if (listenerStarted) return;
  
  startDbListener().catch(console.error);
  listenerStarted = true;
}