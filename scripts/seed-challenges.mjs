import { readFile } from 'node:fs/promises';
import process from 'node:process';
import admin from 'firebase-admin';

if (
  !process.env.GOOGLE_APPLICATION_CREDENTIALS &&
  !process.env.FIRESTORE_EMULATOR_HOST
) {
  console.error(
    'Set GOOGLE_APPLICATION_CREDENTIALS or FIRESTORE_EMULATOR_HOST before seeding.',
  );
  process.exit(1);
}
const configuredProjectId =
  process.env.GCLOUD_PROJECT ||
  process.env.FIREBASE_PROJECT_ID ||
  (process.env.FIRESTORE_EMULATOR_HOST ? 'lens-courage-local' : undefined);
admin.initializeApp(
  configuredProjectId ? { projectId: configuredProjectId } : undefined,
);
const challenges = JSON.parse(
  await readFile(new URL('../seed/challenges.json', import.meta.url), 'utf8'),
);
const db = admin.firestore();
const writer = db.bulkWriter();
for (const challenge of challenges) {
  writer.set(db.collection('challenges').doc(challenge.id), challenge);
}
await writer.close();
console.log(`Seeded ${challenges.length} challenges.`);
