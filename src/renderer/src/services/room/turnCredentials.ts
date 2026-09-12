const ICE_SERVERS: RTCIceServer[] = [{ urls: 'stun:stun.l.google.com:19302' }];

export async function getIceServers(): Promise<RTCIceServer[]> {
  return ICE_SERVERS;
}
