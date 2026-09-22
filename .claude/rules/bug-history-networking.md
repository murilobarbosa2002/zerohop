---
paths:
  - "src/renderer/src/services/**"
---

# Histórico de bugs — rede P2P / sala / voz (não repetir)

- **NUNCA colocar uma chave com valor `undefined` explícito num objeto que vai ser mandado por `DataConnection` do PeerJS (`sendTo`).** A serialização do PeerJS não é JSON — não omite chaves com `undefined` como `JSON.stringify` faria, o valor chega deformado do outro lado e `roomMessageSchema.safeParse` rejeita a mensagem inteira, silenciosamente (só um `console.warn`). Isso já quebrou TODO o fluxo normal de entrar numa sala por causa de um campo opcional novo (`inviteToken`) sempre incluído mesmo quando vazio. **Qualquer campo opcional novo em qualquer mensagem do protocolo de sala precisa de spread condicional** (`...(inviteToken ? { inviteToken } : {})`), nunca `campo: valorQuePodeSerUndefined`.
- **Em `MembershipGossip.handleMembersMessage`, nunca fazer `registry.upsert(id, ...)` ANTES de decidir se deve chamar `connectToPeer(id)`.** `PeerConnectionManager.connectToPeer` usa `isKnownMember(id) => registry.has(id)` como guarda contra reconectar em alguém já conectado. Fazer o upsert antes do `connectToPeer` faz o guard sempre ver `true` e cancelar a conexão — numa sala com 3+ pessoas, dois convidados nunca conseguiam se conectar diretamente. Decidir/chamar `connectToPeer` primeiro, upsert depois.
- **`VoiceChat.callMember` precisa de retry/timeout, igual as `DataConnection`s da malha** (`watchConnection`/`watchForRealDisconnect`). Sem isso, numa sala com 3+ pessoas, uma `MediaConnection` de voz específica podia nunca conectar e ficar quebrada pra sempre. Ver `watchCallConnection` (monitora `iceConnectionState`, com `VOICE_CALL_CONNECT_TIMEOUT_MS` e `VOICE_CALL_MAX_RETRIES`).
- **Não confiar só em `track.enabled` pra silenciar áudio que passou por qualquer processamento do Web Audio API.** O microfone passa por um grafo (`source -> gainNode -> destination` em `MicCapture.ts`) antes de virar a `MediaStreamTrack` enviada — mutar só `track.enabled` podia deixar o áudio saindo mesmo mutado. `MicCaptureHandle.setMuted()` zera o `gainNode.gain.value` também, em paralelo ao `track.enabled`.
- **mDNS do Chromium desativado** (`disable-features: WebRtcHideLocalIpsWithMdns`) — sem isso, ICE pode falhar até em testes na mesma máquina se a resolução mDNS não funcionar no Windows do usuário. Manter esse flag.
