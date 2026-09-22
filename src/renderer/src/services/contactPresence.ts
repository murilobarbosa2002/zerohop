import { createPeer, safeCall } from '@/services/room/peerSession';
import { getIceServers } from '@/services/room/turnCredentials';
import { CONTACT_PRESENCE_PROBE_TIMEOUT_MS } from '@/constants/timing';

export function watchContactsPresence(contactIds: string[], onResult: (contactId: string, online: boolean) => void): () => void {
  let cancelled = false;
  let peer: Awaited<ReturnType<typeof createPeer>> | null = null;

  (async () => {
    let nextPeer;
    try {
      const iceServers = await getIceServers();
      nextPeer = await createPeer(undefined, iceServers);
    } catch {
      if (!cancelled) for (const id of contactIds) onResult(id, false);
      return;
    }
    if (cancelled) {
      safeCall(nextPeer, 'destroy');
      return;
    }
    peer = nextPeer;
    for (const id of contactIds) {
      const connection = peer.connect(id, { reliable: true });
      let settled = false;
      const timeout = setTimeout(() => {
        if (settled || cancelled) return;
        settled = true;
        onResult(id, false);
        safeCall(connection, 'close');
      }, CONTACT_PRESENCE_PROBE_TIMEOUT_MS);
      connection.on('open', () => {
        if (settled || cancelled) return;
        settled = true;
        clearTimeout(timeout);
        onResult(id, true);
        safeCall(connection, 'close');
      });
      connection.on('error', () => {
        if (settled || cancelled) return;
        settled = true;
        clearTimeout(timeout);
        onResult(id, false);
      });
    }
  })();

  return () => {
    cancelled = true;
    if (peer) safeCall(peer, 'destroy');
  };
}
