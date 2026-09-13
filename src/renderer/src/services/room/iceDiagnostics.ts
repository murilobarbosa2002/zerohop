import type { DataConnection } from 'peerjs';
import {
  ICE_ROUTE_MAX_RETRIES,
  ICE_ROUTE_RETRY_DELAY_MS,
  ICE_DISCONNECTED_GRACE_MS,
  PEER_CONNECTION_MAX_POLL_ATTEMPTS,
  PEER_CONNECTION_POLL_INTERVAL_MS
} from '@/constants/timing';
import { logEvent } from '@/services/appLog';
import { LOG_STRINGS } from '@/strings/logs.strings';
import { LogCategory, LogLevel } from '@shared/logEntry';

interface CandidateStats {
  id: string;
  type: string;
  candidateType?: string;
  protocol?: string;
  address?: string;
  ip?: string;
  port?: number;
}

interface CandidatePairStats {
  type: string;
  state?: string;
  nominated?: boolean;
  localCandidateId?: string;
  remoteCandidateId?: string;
}

function waitForPeerConnection(
  connection: DataConnection,
  maxAttempts = PEER_CONNECTION_MAX_POLL_ATTEMPTS
): Promise<RTCPeerConnection | null> {
  return new Promise((resolve) => {
    let attempts = 0;
    const poll = setInterval(() => {
      attempts++;
      if (connection.peerConnection) {
        clearInterval(poll);
        resolve(connection.peerConnection);
      } else if (attempts > maxAttempts) {
        clearInterval(poll);
        resolve(null);
      }
    }, PEER_CONNECTION_POLL_INTERVAL_MS);
  });
}

async function dumpIceStats(peerConnection: RTCPeerConnection, label: string): Promise<void> {
  const stats = await peerConnection.getStats();
  stats.forEach((report: CandidateStats | CandidatePairStats) => {
    if (report.type === 'local-candidate' || report.type === 'remote-candidate') {
      const candidate = report as CandidateStats;
      console.log(
        '[ice-stats]', label, candidate.type,
        'tipo:', candidate.candidateType,
        'protocolo:', candidate.protocol,
        'endereço:', candidate.address || candidate.ip,
        'porta:', candidate.port
      );
    }
    if (report.type === 'candidate-pair') {
      const pair = report as CandidatePairStats;
      console.log('[ice-stats]', label, 'par:', pair.state, 'nomeado:', pair.nominated);
    }
  });
}

async function logActiveRoute(peerConnection: RTCPeerConnection, label: string): Promise<boolean> {
  try {
    const stats = await peerConnection.getStats();
    const candidatesById = new Map<string, CandidateStats>();
    let nominatedPair: CandidatePairStats | null = null;
    let succeededPair: CandidatePairStats | null = null;
    stats.forEach((report: CandidateStats | CandidatePairStats) => {
      if (report.type === 'local-candidate' || report.type === 'remote-candidate') {
        const candidate = report as CandidateStats;
        candidatesById.set(candidate.id, candidate);
      }
      if (report.type === 'candidate-pair') {
        const pair = report as CandidatePairStats;
        if (pair.nominated) nominatedPair = pair;
        else if (pair.state === 'succeeded' && !succeededPair) succeededPair = pair;
      }
    });
    const activePair = nominatedPair || succeededPair;
    if (!activePair) {
      console.log('[ice-route]', label, 'ainda sem par ativo nas estatísticas (tentando de novo em 1.5s).');
      return false;
    }
    const pair: CandidatePairStats = activePair;
    const localCandidate = pair.localCandidateId ? candidatesById.get(pair.localCandidateId) : undefined;
    const remoteCandidate = pair.remoteCandidateId ? candidatesById.get(pair.remoteCandidateId) : undefined;
    const viaTurn = localCandidate?.candidateType === 'relay' || remoteCandidate?.candidateType === 'relay';
    console.log(
      '%c[ice-route]', 'font-weight:bold;color:' + (viaTurn ? '#e5484d' : '#4ee3b0'),
      label,
      viaTurn ? 'CONECTADO VIA TURN (relay, consome banda do plano gratuito)' : 'conectado DIRETO (peer-to-peer, sem TURN)',
      '| local:', localCandidate?.candidateType, localCandidate?.protocol,
      '| remoto:', remoteCandidate?.candidateType, remoteCandidate?.protocol
    );
    const detail = `local: ${localCandidate?.candidateType}/${localCandidate?.protocol} | remoto: ${remoteCandidate?.candidateType}/${remoteCandidate?.protocol}`;
    logEvent(
      LogCategory.CONNECTION,
      viaTurn ? LogLevel.WARNING : LogLevel.INFO,
      viaTurn ? LOG_STRINGS.connectionEstablishedTurnMessage(label) : LOG_STRINGS.connectionEstablishedDirectMessage(label),
      detail
    );
    return true;
  } catch (error) {
    console.error('[ice-route]', label, 'erro ao ler estatísticas:', (error as Error).message);
    logEvent(LogCategory.CONNECTION, LogLevel.ERROR, LOG_STRINGS.connectionStatsErrorMessage(label), (error as Error).message);
    return true;
  }
}

function logActiveRouteWithRetry(
  peerConnection: RTCPeerConnection,
  label: string,
  attemptsLeft = ICE_ROUTE_MAX_RETRIES
): void {
  logActiveRoute(peerConnection, label).then((done) => {
    if (!done && attemptsLeft > 0) {
      setTimeout(() => logActiveRouteWithRetry(peerConnection, label, attemptsLeft - 1), ICE_ROUTE_RETRY_DELAY_MS);
    }
  });
}

export async function watchConnection(
  connection: DataConnection,
  label: string,
  timeoutMs: number,
  onTimeout: () => void
): Promise<void> {
  let settled = false;
  connection.on('open', () => {
    settled = true;
  });
  connection.on('close', () => {
    settled = true;
  });
  connection.on('error', () => {
    settled = true;
  });

  const peerConnection = await waitForPeerConnection(connection);
  if (!peerConnection) {
    console.warn('[ice]', label, 'peerConnection nunca foi criada');
    logEvent(LogCategory.CONNECTION, LogLevel.ERROR, LOG_STRINGS.connectionNeverPreparedMessage(label));
    return;
  }

  console.log('[ice]', label, 'peerConnection criada, estado inicial:', peerConnection.iceConnectionState);
  peerConnection.addEventListener('iceconnectionstatechange', () => {
    console.log('[ice]', label, 'iceConnectionState ->', peerConnection.iceConnectionState);
    if (peerConnection.iceConnectionState === 'connected' || peerConnection.iceConnectionState === 'completed') {
      logActiveRouteWithRetry(peerConnection, label);
    }
  });
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log('[ice]', label, 'iceGatheringState ->', peerConnection.iceGatheringState);
  });
  peerConnection.addEventListener('icecandidate', (event) => {
    if (!event.candidate) return;
    console.log(
      '[ice-candidate]', label, event.candidate.type, event.candidate.protocol, event.candidate.address, event.candidate.port
    );
  });

  setTimeout(() => {
    if (settled) return;
    console.warn('[ice]', label, 'não abriu em', timeoutMs, 'ms — despejando estatísticas:');
    dumpIceStats(peerConnection, label);
    logEvent(
      LogCategory.CONNECTION,
      LogLevel.WARNING,
      LOG_STRINGS.connectionTimeoutMessage(label),
      `iceConnectionState: ${peerConnection.iceConnectionState}, iceGatheringState: ${peerConnection.iceGatheringState}`
    );
    onTimeout();
  }, timeoutMs);
}

export async function watchForRealDisconnect(connection: DataConnection, label: string, onDisconnected: () => void): Promise<void> {
  const maybePeerConnection = await waitForPeerConnection(connection);
  if (!maybePeerConnection) return;
  const peerConnection: RTCPeerConnection = maybePeerConnection;

  let fired = false;
  let graceTimer: ReturnType<typeof setTimeout> | null = null;

  function clearGraceTimer(): void {
    if (graceTimer) {
      clearTimeout(graceTimer);
      graceTimer = null;
    }
  }

  function fireDisconnected(): void {
    if (fired) return;
    fired = true;
    clearGraceTimer();
    console.warn('[ice]', label, 'conexão caiu de verdade (iceConnectionState:', peerConnection.iceConnectionState + ')');
    logEvent(
      LogCategory.CONNECTION,
      LogLevel.WARNING,
      LOG_STRINGS.connectionLostMessage(label),
      `iceConnectionState: ${peerConnection.iceConnectionState}`
    );
    onDisconnected();
  }

  peerConnection.addEventListener('iceconnectionstatechange', () => {
    if (fired) return;
    const state = peerConnection.iceConnectionState;
    if (state === 'failed' || state === 'closed') {
      fireDisconnected();
      return;
    }
    if (state === 'disconnected') {
      clearGraceTimer();
      graceTimer = setTimeout(fireDisconnected, ICE_DISCONNECTED_GRACE_MS);
      return;
    }
    if (state === 'connected' || state === 'completed') {
      clearGraceTimer();
    }
  });
}
