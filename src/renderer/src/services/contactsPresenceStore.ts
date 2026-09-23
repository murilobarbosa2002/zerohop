import { watchContactsPresence } from '@/services/contactPresence';
import { CONTACT_PRESENCE_POLL_INTERVAL_MS } from '@/constants/timing';

export interface ContactsPresenceEventDetail {
  changed: { online: Map<string, boolean> };
  'contact-online': { contactId: string };
}

class ContactsPresenceStore extends EventTarget {
  private online = new Map<string, boolean>();
  private contactIds: string[] = [];
  private stopCurrentProbe: (() => void) | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  setContactIds(ids: string[]): void {
    this.contactIds = ids;
    let changed = false;
    for (const id of [...this.online.keys()]) {
      if (!ids.includes(id)) {
        this.online.delete(id);
        changed = true;
      }
    }
    if (changed) this.emitChanged();
  }

  start(): void {
    if (this.intervalId) return;
    this.poll();
    this.intervalId = setInterval(() => this.poll(), CONTACT_PRESENCE_POLL_INTERVAL_MS);
  }

  stop(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
    this.stopCurrentProbe?.();
    this.stopCurrentProbe = null;
  }

  getSnapshot(): Map<string, boolean> {
    return this.online;
  }

  private poll(): void {
    this.stopCurrentProbe?.();
    this.stopCurrentProbe = null;
    if (this.contactIds.length === 0) return;
    this.stopCurrentProbe = watchContactsPresence(this.contactIds, (contactId, isOnline) => {
      const wasOnline = this.online.get(contactId);
      const next = new Map(this.online);
      next.set(contactId, isOnline);
      this.online = next;
      this.emitChanged();
      if (isOnline && wasOnline === false) {
        this.dispatchEvent(new CustomEvent('contact-online', { detail: { contactId } }));
      }
    });
  }

  private emitChanged(): void {
    this.dispatchEvent(new CustomEvent('changed', { detail: { online: this.online } }));
  }
}

export const contactsPresenceStore = new ContactsPresenceStore();
