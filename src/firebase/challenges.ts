import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { Challenge } from '../types/models';

export async function fetchChallenges(): Promise<Challenge[]> {
  const snapshot = await getDocs(
    query(
      collection(getFirestore(getApp()), 'challenges'),
      orderBy('order', 'asc'),
    ),
  );
  return snapshot.docs
    .map(item => item.data() as Challenge)
    .filter(item => item.active);
}
