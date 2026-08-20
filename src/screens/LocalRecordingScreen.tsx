import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock3, LockKeyhole } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../app/AppProvider';
import { ScreenNavigationBar } from '../components/ui';
import { colors } from '../theme';
import { RecordedTakePreview } from './RecordingScreen';

const formatDuration = (durationMs: number) => {
  const seconds = Math.round(durationMs / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

export function LocalRecordingScreen({ navigation, route }: any) {
  const { localSessions, challenges } = useApp();
  const session = localSessions.find(
    item => item.id === route.params?.sessionId,
  );
  const challenge = challenges.find(item => item.id === session?.challengeId);

  if (!session) {
    return (
      <SafeAreaView edges={['left', 'right']} style={s.safe}>
        <ScreenNavigationBar
          label="YOUR RECORDED REP"
          title="Recording unavailable"
          onBack={navigation.goBack}
        />
        <View style={s.unavailable}>
          <Text style={s.title}>Recording unavailable</Text>
          <Text style={s.copy}>
            This local recording could not be found on this device.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={s.safe}>
      <ScreenNavigationBar
        label="YOUR RECORDED REP"
        title={challenge?.title ?? 'Challenge recording'}
        onBack={navigation.goBack}
      />
      <View style={s.content}>
        <View style={s.videoCard}>
          <View style={s.video}>
            <RecordedTakePreview
              filePath={session.localVideoPath}
              fillAxis="width"
              autoPlay={false}
            />
          </View>
          <View style={s.details}>
            <View style={s.detailRow}>
              <Clock3 color={colors.muted} size={17} />
              <Text style={s.detailText}>
                {formatDuration(session.durationMs)}
              </Text>
            </View>
            {session.openingPhrase && (
              <Text style={s.phrase}>“{session.openingPhrase}”</Text>
            )}
          </View>
        </View>
        <View style={s.privacy}>
          <LockKeyhole color={colors.teal} size={18} />
          <Text style={s.privacyText}>
            This video is playing from local storage on this device.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    paddingBottom: 132,
  },
  videoCard: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    padding: 10,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  video: {
    flex: 1,
    minHeight: 288,
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: colors.cameraBlack,
  },
  details: {
    paddingHorizontal: 5,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 13, fontWeight: '800', color: colors.muted },
  phrase: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'right',
  },
  privacy: {
    marginHorizontal: 20,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  privacyText: { fontSize: 12, color: colors.muted },
  unavailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: { fontSize: 26, fontWeight: '900', color: colors.ink },
  copy: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
});
