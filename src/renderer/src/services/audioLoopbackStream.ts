import {
  AUDIO_LOOPBACK_SAMPLE_RATE,
  AUDIO_LOOPBACK_CHANNELS,
  AUDIO_LOOPBACK_BUFFER_SIZE,
  PCM_INT16_MAX,
  PCM_BYTES_PER_FRAME
} from '@/constants/audioLoopback';

interface QueuedBlock {
  left: Float32Array;
  right: Float32Array;
  offset: number;
}

export interface LoopbackAudioTrack {
  track: MediaStreamTrack;
  pushChunk: (chunk: Uint8Array) => void;
}

export function createLoopbackAudioTrack(): LoopbackAudioTrack {
  const audioContext = new AudioContext({ sampleRate: AUDIO_LOOPBACK_SAMPLE_RATE });
  const destination = audioContext.createMediaStreamDestination();
  const processor = audioContext.createScriptProcessor(AUDIO_LOOPBACK_BUFFER_SIZE, 0, AUDIO_LOOPBACK_CHANNELS);
  const queue: QueuedBlock[] = [];

  processor.onaudioprocess = (event) => {
    const outputLeft = event.outputBuffer.getChannelData(0);
    const outputRight = event.outputBuffer.getChannelData(1);
    let written = 0;
    while (written < outputLeft.length && queue.length > 0) {
      const block = queue[0];
      const available = block.left.length - block.offset;
      const toCopy = Math.min(available, outputLeft.length - written);
      outputLeft.set(block.left.subarray(block.offset, block.offset + toCopy), written);
      outputRight.set(block.right.subarray(block.offset, block.offset + toCopy), written);
      block.offset += toCopy;
      written += toCopy;
      if (block.offset >= block.left.length) queue.shift();
    }
  };

  processor.connect(destination);

  function pushChunk(chunk: Uint8Array): void {
    const view = new DataView(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    const frameCount = Math.floor(chunk.byteLength / PCM_BYTES_PER_FRAME);
    const left = new Float32Array(frameCount);
    const right = new Float32Array(frameCount);
    for (let i = 0; i < frameCount; i++) {
      left[i] = view.getInt16(i * PCM_BYTES_PER_FRAME, true) / PCM_INT16_MAX;
      right[i] = view.getInt16(i * PCM_BYTES_PER_FRAME + 2, true) / PCM_INT16_MAX;
    }
    queue.push({ left, right, offset: 0 });
  }

  const track = destination.stream.getAudioTracks()[0];
  const originalStop = track.stop.bind(track);
  track.stop = () => {
    originalStop();
    processor.disconnect();
    processor.onaudioprocess = null;
    audioContext.close().catch(() => {});
  };

  return { track, pushChunk };
}
