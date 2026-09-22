import { tv } from '@/lib/tv';

export const notificationDotVariants = tv({
  base: 'w-status-dot-size h-status-dot-size rounded-full flex-shrink-0 mt-1',
  variants: {
    kind: {
      'invite-received': 'bg-accent',
      'invite-accepted': 'bg-success',
      'invite-declined': 'bg-text-dim',
      'invite-failed': 'bg-danger',
      'member-joined': 'bg-success',
      'member-left': 'bg-text-dim',
      'join-request': 'bg-warn',
      'update-available': 'bg-accent',
      'personal-room-password-missing': 'bg-warn'
    }
  }
});
