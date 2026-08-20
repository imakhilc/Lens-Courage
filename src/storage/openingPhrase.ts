import AsyncStorage from '@react-native-async-storage/async-storage';

const keyForUser = (uid: string) => `@lens-courage/opening-phrase/v1/${uid}`;

export async function getOpeningPhrase(uid: string) {
  return AsyncStorage.getItem(keyForUser(uid));
}

export async function saveOpeningPhrase(uid: string, phrase: string) {
  await AsyncStorage.setItem(keyForUser(uid), phrase);
}

export async function clearOpeningPhrase(uid: string) {
  await AsyncStorage.removeItem(keyForUser(uid));
}
