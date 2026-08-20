import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalSession } from '../types/models';

const KEY = '@lens-courage/local-sessions/v1';

export async function saveLocalSession(session: LocalSession) {
  const sessions = await getLocalSessions();
  await AsyncStorage.setItem(
    KEY,
    JSON.stringify([
      session,
      ...sessions.filter(item => item.id !== session.id),
    ]),
  );
}

export async function getLocalSessions(uid?: string) {
  const stored = await AsyncStorage.getItem(KEY);
  const sessions: LocalSession[] = stored ? JSON.parse(stored) : [];
  return uid ? sessions.filter(session => session.uid === uid) : sessions;
}

export function createLocalSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
