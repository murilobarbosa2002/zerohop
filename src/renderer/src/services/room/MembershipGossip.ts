import { sendTo } from '@/services/room/peerSession';
import { normalizeAvatarId } from '@/constants/avatars';
import { getStatus } from '@/services/statusPreference';
import type { MemberRegistry } from '@/services/room/MemberRegistry';
import type { AvatarId } from '@/constants/avatars';

export interface MemberInfo {
  id: string;
  name: string;
  avatarId: string;
  status: string;
}

interface MembershipGossipDeps {
  registry: MemberRegistry;
  getSelfId: () => string | null;
  getSelfName: () => string;
  getSelfAvatarId: () => AvatarId;
  connectToPeer: (id: string) => void;
}

export class MembershipGossip {
  private registry: MemberRegistry;
  private getSelfId: () => string | null;
  private getSelfName: () => string;
  private getSelfAvatarId: () => AvatarId;
  private connectToPeer: (id: string) => void;

  constructor({ registry, getSelfId, getSelfName, getSelfAvatarId, connectToPeer }: MembershipGossipDeps) {
    this.registry = registry;
    this.getSelfId = getSelfId;
    this.getSelfName = getSelfName;
    this.getSelfAvatarId = getSelfAvatarId;
    this.connectToPeer = connectToPeer;
  }

  handleMembersMessage(members: MemberInfo[]): void {
    const selfId = this.getSelfId();
    for (const entry of members) {
      if (entry.id === selfId) continue;
      const isNew = !this.registry.has(entry.id);
      if (isNew && selfId !== null && selfId < entry.id) this.connectToPeer(entry.id);
      this.registry.upsert(entry.id, { name: entry.name, avatarId: normalizeAvatarId(entry.avatarId), status: entry.status });
    }
  }

  broadcast(): void {
    const selfId = this.getSelfId();
    if (!selfId) return;
    const list: MemberInfo[] = [{ id: selfId, name: this.getSelfName(), avatarId: this.getSelfAvatarId(), status: getStatus() }];
    for (const [id, member] of this.registry.entries()) {
      list.push({ id, name: member.name, avatarId: member.avatarId ?? '', status: member.status });
    }
    for (const member of this.registry.values()) sendTo(member.conn, { type: 'members', members: list });
  }
}
