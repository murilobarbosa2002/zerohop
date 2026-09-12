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

export async function captureMicrophone(deviceId: string, gain: number, noiseSuppression: boolean): Promise<MicCaptureHandle> {
  const audioConstraints = { echoCancellation: true, noiseSuppression, ...(deviceId ? { deviceId } : {}) };
  const rawStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });

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
