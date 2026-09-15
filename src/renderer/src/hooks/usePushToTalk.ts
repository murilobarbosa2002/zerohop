import { useEffect, useRef, useState } from 'react';
import { keyboardEventToAccelerator } from '@/lib/keyboardAccelerator';
import { playPushToTalkStartSound, playPushToTalkStopSound } from '@/services/soundEffects';
import type { RoomClient } from '@/services/RoomClient';
import type { AcceleratorBinding } from '@shared/hotkeySettings';

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
}

export function usePushToTalk(roomClient: RoomClient, pushToTalkOriginRef: { current: boolean }): boolean {
  const [active, setActive] = useState(false);
  const [hotkey, setHotkey] = useState<AcceleratorBinding | null>(null);
  const [releaseDelayMs, setReleaseDelayMs] = useState(0);
  const heldRef = useRef(false);
  const releaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    window.api.getHotkeySettings().then((settings) => {
      setHotkey(settings.pushToTalkHotkey);
      setReleaseDelayMs(settings.pushToTalkReleaseDelayMs);
    });
    return window.api.onHotkeySettingsChanged((settings) => {
      setHotkey(settings.pushToTalkHotkey);
      setReleaseDelayMs(settings.pushToTalkReleaseDelayMs);
    });
  }, []);

  useEffect(() => {
    if (!hotkey) return;

    function setPushToTalkActive(next: boolean): void {
      pushToTalkOriginRef.current = true;
      roomClient.setMicMuted(!next);
      pushToTalkOriginRef.current = false;
      setActive(next);
      next ? playPushToTalkStartSound() : playPushToTalkStopSound();
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (isTypingTarget(event.target)) return;
      const pressed = keyboardEventToAccelerator(event);
      if (!pressed || pressed.accelerator !== hotkey!.accelerator) return;
      if (releaseTimeoutRef.current) {
        clearTimeout(releaseTimeoutRef.current);
        releaseTimeoutRef.current = null;
      }
      if (!heldRef.current) {
        heldRef.current = true;
        setPushToTalkActive(true);
      }
    }

    function handleKeyUp(event: KeyboardEvent): void {
      const released = keyboardEventToAccelerator(event);
      if (!released || released.accelerator !== hotkey!.accelerator) return;
      if (!heldRef.current) return;
      releaseTimeoutRef.current = setTimeout(() => {
        heldRef.current = false;
        releaseTimeoutRef.current = null;
        setPushToTalkActive(false);
      }, releaseDelayMs);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const unsubscribeNative = window.api.onHotkeyPttActiveChanged(setPushToTalkActive);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      unsubscribeNative();
      if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
      if (heldRef.current) {
        heldRef.current = false;
        setPushToTalkActive(false);
      }
    };
  }, [hotkey, releaseDelayMs, roomClient, pushToTalkOriginRef]);

  return active;
}
