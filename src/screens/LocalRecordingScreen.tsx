import React from 'react';
import {
  Alert,
  NativeModules,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Clock3, LockKeyhole, Share2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../app/AppProvider';
import { FloatingActionDock, ScreenNavigationBar } from '../components/ui';
import { cardShadow, colors } from '../theme';
import { RecordedTakePreview } from './RecordingScreen';

const formatDuration = (durationMs: number) => {
  const seconds = Math.round(durationMs / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

const shareVideo = NativeModules.LensCourageShareVideo as {
  share: (path: string, title: string) => Promise<void>;
} | null;

export function LocalRecordingScreen({ navigation, route }: any) {
  const { localSessions, challenges } = useApp();
  const session = localSessions.find(
    item => item.id === route.params?.sessionId,
  );
  const challenge = challenges.find(item => item.id === session?.challengeId);
  const openShareSheet = async () => {
    if (!session) return;
    if (!shareVideo) {
      Alert.alert(
        'Rebuild required',
        'Rebuild the Android app to enable sharing.',
      );
      return;
    }
    try {
      await shareVideo.share(session.localVideoPath, 'Share your courage rep');
    } catch (cause) {
      Alert.alert(
        'Could not share video',
        cause instanceof Error ? cause.message : 'Please try again.',
      );
    }
  };

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
          </View>
        </View>
        <View style={s.privacy}>
          <LockKeyhole color={colors.teal} size={18} />
          <Text style={s.privacyText}>
            This video is playing from local storage on this device.
          </Text>
        </View>
      </View>
      <FloatingActionDock>
        <Pressable
          accessibilityLabel="Share recorded video"
          accessibilityRole="button"
          onPress={openShareSheet}
          style={({ pressed }) => [s.shareButton, pressed && s.sharePressed]}
        >
          <Share2 color={colors.surface} size={20} strokeWidth={2.6} />
          <Text style={s.shareText}>Share video</Text>
        </Pressable>
      </FloatingActionDock>
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
    ...cardShadow,
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
  privacy: {
    marginHorizontal: 20,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  privacyText: { fontSize: 12, color: colors.muted },
  shareButton: {
    height: 58,
    borderRadius: 18,
    borderBottomWidth: 5,
    borderBottomColor: colors.primaryDark,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sharePressed: { transform: [{ translateY: 2 }], borderBottomWidth: 3 },
  shareText: { color: colors.surface, fontSize: 17, fontWeight: '800' },
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
