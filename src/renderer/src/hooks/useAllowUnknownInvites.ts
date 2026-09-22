import { useEffect, useState } from 'react';

export function useAllowUnknownInvites(): [boolean, (value: boolean) => void] {
  const [allowUnknownInvites, setAllowUnknownInvitesState] = useState(false);

  useEffect(() => {
    window.api.getAllowUnknownInvites().then(setAllowUnknownInvitesState);
  }, []);

  function setAllowUnknownInvites(value: boolean): void {
    setAllowUnknownInvitesState(value);
    window.api.setAllowUnknownInvites(value);
  }

  return [allowUnknownInvites, setAllowUnknownInvites];
}
