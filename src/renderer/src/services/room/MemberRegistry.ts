import type { DataConnection, MediaConnection } from 'peerjs';
import type { AvatarId } from '@/constants/avatars';

export interface Member {
  name: string;
  avatarId: AvatarId | null;
  status: string;
  personalId: string | null;
  conn: DataConnection | null;
  sharing: boolean;
  watching: boolean;
  mediaConnIn: MediaConnection | null;
  stream: MediaStream | null;
  authenticated: boolean;
  voiceConnIn: MediaConnection | null;
  voiceStream: MediaStream | null;
  micMuted: boolean;
}

export interface MemberSnapshot {
  id: string;
  name: string;
  avatarId: AvatarId | null;
  status: string;
  personalId: string | null;
  sharing: boolean;
  watching: boolean;
  stream: MediaStream | null;
  voiceStream: MediaStream | null;
  micMuted: boolean;
}

function defaultMember(name: string): Member {
  return {
    name,
    avatarId: null,
    status: '',
    personalId: null,
    conn: null,
    sharing: false,
    watching: false,
    mediaConnIn: null,
    stream: null,
    authenticated: false,
    voiceConnIn: null,
    voiceStream: null,
    micMuted: false
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
        avatarId: member.avatarId,
        status: member.status,
        personalId: member.personalId,
        sharing: member.sharing,
        watching: member.watching,
        stream: member.stream || null,
        voiceStream: member.voiceStream || null,
        micMuted: member.micMuted
      }));
  }
}
