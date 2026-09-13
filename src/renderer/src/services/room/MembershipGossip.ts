import { sendTo } from '@/services/room/peerSession';
import type { MemberRegistry } from '@/services/room/MemberRegistry';

export interface MemberInfo {
  id: string;
  name: string;
}

interface MembershipGossipDeps {
  registry: MemberRegistry;
  getSelfId: () => string | null;
  getSelfName: () => string;
  connectToPeer: (id: string) => void;
}

export class MembershipGossip {
  private registry: MemberRegistry;
  private getSelfId: () => string | null;
  private getSelfName: () => string;
  private connectToPeer: (id: string) => void;

  constructor({ registry, getSelfId, getSelfName, connectToPeer }: MembershipGossipDeps) {
    this.registry = registry;
    this.getSelfId = getSelfId;
    this.getSelfName = getSelfName;
    this.connectToPeer = connectToPeer;
  }

  handleMembersMessage(members: MemberInfo[]): void {
    const selfId = this.getSelfId();
    for (const entry of members) {
      if (entry.id === selfId) continue;
      const isNew = !this.registry.has(entry.id);
      if (isNew && selfId !== null && selfId < entry.id) this.connectToPeer(entry.id);
      this.registry.upsert(entry.id, { name: entry.name });
    }
  }

  broadcast(): void {
    const selfId = this.getSelfId();
    if (!selfId) return;
    const list: MemberInfo[] = [{ id: selfId, name: this.getSelfName() }];
    for (const [id, member] of this.registry.entries()) list.push({ id, name: member.name });
    for (const member of this.registry.values()) sendTo(member.conn, { type: 'members', members: list });
  }
}
