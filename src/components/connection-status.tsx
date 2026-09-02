import { useEffect, useState } from "react";
import { CloudOff } from "lucide-react";

/**
 * Says so when the reading is coming off the device rather than the network.
 *
 * This app is meant to be used standing in water, which is exactly where the
 * signal goes. The service worker keeps reviewed records readable offline, but
 * silently serving a cached record is the kind of quiet ambiguity this product
 * avoids everywhere else: the angler should know whether what they are reading
 * was fetched or remembered.
 *
 * Nothing is claimed about freshness beyond what is knowable — reviewed records
 * change on a review cycle measured in months, so a cached one is very unlikely
 * to be wrong, and the note says that rather than raising an alarm.
 */
export function ConnectionStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="no-print mx-auto max-w-6xl px-4 pt-4 sm:px-6"
    >
      <p className="instrument-rule flex items-start gap-3 rounded-[var(--radius-md)] bg-elevated px-4 py-3 text-sm text-fg">
        <CloudOff className="mt-0.5 size-4 shrink-0 text-mark" aria-hidden />
        <span>
          <strong className="font-medium">You are offline.</strong> Species you have already opened
          stay readable from this device, and the reading itself is computed here — nothing about it
          needed the network. A species you have not opened before cannot load its reviewed record
          until you are back on.
        </span>
      </p>
    </div>
  );
}
