import type { DataConnection, MediaConnection } from 'peerjs';

export interface Member {
  name: string;
  conn: DataConnection | null;
  sharing: boolean;
  watching: boolean;
  mediaConnIn: MediaConnection | null;
  stream: MediaStream | null;
  authenticated: boolean;
}

export interface MemberSnapshot {
  id: string;
  name: string;
  sharing: boolean;
  watching: boolean;
  stream: MediaStream | null;
}

function defaultMember(name: string): Member {
  return {
    name,
    conn: null,
    sharing: false,
    watching: false,
    mediaConnIn: null,
    stream: null,
    authenticated: false
  };
}

export class MemberRegistry {
  private members = new Map<string, Member>();

  upsert(id: string, patch: Partial<Member>): Member {
    const existing = this.members.get(id) || defaultMember(id);
    const updated = { ...existing, ...patch };
    this.members.set(id, updated);
    return updated;
  }

  get(id: string): Member | undefined {
    return this.members.get(id);
  }

  has(id: string): boolean {
    return this.members.has(id);
  }

  remove(id: string): void {
    this.members.delete(id);
  }

  ids(): IterableIterator<string> {
    return this.members.keys();
  }

  values(): IterableIterator<Member> {
    return this.members.values();
  }

  entries(): IterableIterator<[string, Member]> {
    return this.members.entries();
  }

  snapshot(): MemberSnapshot[] {
    return [...this.members.entries()]
      .filter(([, member]) => member.authenticated)
      .map(([id, member]) => ({
        id,
        name: member.name,
        sharing: member.sharing,
        watching: member.watching,
        stream: member.stream || null
      }));
  }
}
