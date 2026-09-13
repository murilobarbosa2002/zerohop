import { useRef } from 'react';
import type { ResizeHandleProps } from '@/components/ResizeHandle/ResizeHandle.types';

export function ResizeHandle({ onDrag }: ResizeHandleProps) {
  const draggingRef = useRef(false);

  function handleMouseDown(event: React.MouseEvent): void {
    event.preventDefault();
    draggingRef.current = true;

    function handleMouseMove(moveEvent: MouseEvent): void {
      if (!draggingRef.current) return;
      onDrag(moveEvent.movementX);
    }

    function handleMouseUp(): void {
      draggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      className="w-1 flex-shrink-0 cursor-col-resize hover:bg-accent/40 active:bg-accent/60"
      role="separator"
      aria-orientation="vertical"
    />
  );
}
