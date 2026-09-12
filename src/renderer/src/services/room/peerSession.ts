import Peer, { type DataConnection } from 'peerjs';

export function randomRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function createPeer(desiredId: string | undefined, iceServers: RTCIceServer[]): Promise<Peer> {
  return new Promise((resolve, reject) => {
    const peer = new Peer(desiredId as string, { config: { iceServers } });
    const onOpen = (): void => {
      cleanup();
      resolve(peer);
    };
    const onError = (error: Error): void => {
      cleanup();
      safeCall(peer, 'destroy');
      reject(error);
    };
    function cleanup(): void {
      peer.off('open', onOpen);
      peer.off('error', onError);
    }
    peer.on('open', onOpen);
    peer.on('error', onError);
  });
}

export function sendTo(conn: DataConnection | null | undefined, message: unknown): void {
  if (!conn || !conn.open) return;
  try {
    conn.send(message);
  } catch {
    return;
  }
}

export function safeCall<T extends object, K extends keyof T>(obj: T, method: K): void {
  try {
    const fn = obj[method];
    if (typeof fn === 'function') (fn as () => void).call(obj);
  } catch {
    return;
  }
}
