import type { MicCaptureHandle } from '@/services/MicCapture.types';

export async function requestMicPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}

export async function captureMicrophone(deviceId: string, gain: number): Promise<MicCaptureHandle> {
  const rawStream = await navigator.mediaDevices.getUserMedia({
    audio: deviceId ? { deviceId, echoCancellation: true, noiseSuppression: true } : { echoCancellation: true, noiseSuppression: true }
  });

  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(rawStream);
  const gainNode = audioContext.createGain();
  gainNode.gain.value = gain;
  const destination = audioContext.createMediaStreamDestination();
  source.connect(gainNode).connect(destination);

  return {
    stream: destination.stream,
    setGain: (value) => {
      gainNode.gain.value = value;
    },
    stop: () => {
      rawStream.getTracks().forEach((track) => track.stop());
      destination.stream.getTracks().forEach((track) => track.stop());
      audioContext.close().catch(() => {});
    }
  };
}
