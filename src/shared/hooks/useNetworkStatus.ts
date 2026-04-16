import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Subscribes to network connectivity changes.
 *
 * Returns `null` until the first NetInfo event is received.
 * Returns `true` when connected with internet reachable.
 * Returns `false` when offline or internet is not reachable.
 *
 * Uses `isInternetReachable` (not just `isConnected`) to avoid false-offline
 * states where a device is associated to WiFi but has no data.
 */
export function useNetworkStatus(): boolean | null {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const handleState = (state: { isConnected: boolean | null; isInternetReachable: boolean | null }) => {
      if (state.isConnected === null) {
        // Not yet determined — leave as null
        return;
      }
      // Treat as online only when both connected AND internet reachable
      // isInternetReachable can be null on Android (not supported in all configs),
      // so fall back to isConnected alone in that case.
      const online =
        state.isConnected === true &&
        (state.isInternetReachable === null || state.isInternetReachable === true);
      setIsConnected(online);
    };

    const unsubscribe = NetInfo.addEventListener(handleState);

    // Fetch current status immediately on mount
    NetInfo.fetch().then(handleState);

    return unsubscribe;
  }, []);

  return isConnected;
}
