import { useEffect, useState } from 'react';

export type MicPermissionStatus = 'granted' | 'denied' | 'prompt' | 'unknown';

export function useMicPermissionStatus(refreshKey: number): MicPermissionStatus {
  const [status, setStatus] = useState<MicPermissionStatus>('unknown');

  useEffect(() => {
    let permissionStatus: PermissionStatus | null = null;

    function handleChange(): void {
      if (permissionStatus) setStatus(permissionStatus.state as MicPermissionStatus);
    }

    navigator.permissions
      .query({ name: 'microphone' as PermissionName })
      .then((result) => {
        permissionStatus = result;
        setStatus(result.state as MicPermissionStatus);
        result.addEventListener('change', handleChange);
      })
      .catch(() => setStatus('unknown'));

    return () => permissionStatus?.removeEventListener('change', handleChange);
  }, [refreshKey]);

  return status;
}
