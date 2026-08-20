import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  Easing,
  Linking,
  Modal,
  NativeModules,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useEvent, useVideoPlayer, VideoView } from 'react-native-video';
import {
  Camera,
  CommonResolutions,
  Recorder,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
  useVideoOutput,
} from 'react-native-vision-camera';
import {
  Camera as CameraIcon,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FastForward,
  Pause,
  Play,
  Rewind,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react-native';
import {
  FloatingActionDock,
  PrimaryButton,
  ScreenNavigationBar,
} from '../components/ui';
import { useApp } from '../app/AppProvider';
import { cardShadow, colors } from '../theme';
import {
  createLocalSessionId,
  saveLocalSession,
} from '../storage/localSessions';

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

const keepAwake = NativeModules.LensCourageKeepAwake as {
  activate: () => void;
  deactivate: () => void;
} | null;

export function RecordedTakePreview({
  filePath,
  fillAxis = 'width',
  autoPlay = true,
}: {
  filePath: string;
  fillAxis?: 'width' | 'height';
  autoPlay?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const ended = useRef(false);
  const player = useVideoPlayer(`file://${filePath}`, instance => {
    instance.loop = false;
    if (autoPlay) instance.play();
  });

  const stopAtEnd = useCallback(() => {
    if (ended.current) return;
    ended.current = true;
    player.loop = false;
    player.pause();
    player.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  }, [player]);

  useEvent(
    player,
    'onPlaybackStateChange',
    useCallback(
      event => {
        if (ended.current && event.isPlaying) {
          player.pause();
          setIsPlaying(false);
          return;
        }
        setIsPlaying(event.isPlaying);
      },
      [player],
    ),
  );
  useEvent(
    player,
    'onProgress',
    useCallback(
      event => {
        const nextDuration = player.duration;
        setDuration(nextDuration);
        if (
          nextDuration > 0 &&
          event.currentTime >= Math.max(0, nextDuration - 0.08)
        ) {
          stopAtEnd();
          return;
        }
        setCurrentTime(event.currentTime);
      },
      [player, stopAtEnd],
    ),
  );
  useEvent(player, 'onEnd', stopAtEnd);

  const seekBy = (seconds: number) => {
    player.currentTime = Math.max(
      0,
      Math.min(player.duration, player.currentTime + seconds),
    );
  };
  const togglePlayback = () => {
    if (player.isPlaying) player.pause();
    else {
      if (ended.current) {
        ended.current = false;
        player.currentTime = 0;
        setCurrentTime(0);
      }
      player.loop = false;
      player.play();
    }
  };
  const toggleMuted = () => {
    const nextMuted = !isMuted;
    player.muted = nextMuted;
    setIsMuted(nextMuted);
  };
  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <View style={s.player}>
      <VideoView
        player={player}
        style={
          fillAxis === 'height' ? s.playerVideoByHeight : s.playerVideoByWidth
        }
        resizeMode="cover"
        controls={false}
        surfaceType="texture"
      />
      <View style={s.playerControls}>
        <View style={s.playerProgressTrack}>
          <View
            style={[s.playerProgressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <View style={s.playerControlRow}>
          <Pressable
            accessibilityLabel="Go back 5 seconds"
            hitSlop={10}
            onPress={() => seekBy(-5)}
            style={s.playerControlButton}
          >
            <Rewind color="white" size={21} />
          </Pressable>
          <Pressable
            accessibilityLabel={isPlaying ? 'Pause video' : 'Play video'}
            onPress={togglePlayback}
            style={s.playerPlayButton}
          >
            {isPlaying ? (
              <Pause color="white" fill="white" size={22} />
            ) : (
              <Play color="white" fill="white" size={22} />
            )}
          </Pressable>
          <Pressable
            accessibilityLabel="Go forward 5 seconds"
            hitSlop={10}
            onPress={() => seekBy(5)}
            style={s.playerControlButton}
          >
            <FastForward color="white" size={21} />
          </Pressable>
          <Pressable
            accessibilityLabel={isMuted ? 'Unmute video' : 'Mute video'}
            accessibilityState={{ checked: isMuted }}
            hitSlop={10}
            onPress={toggleMuted}
            style={s.playerControlButton}
          >
            {isMuted ? (
              <VolumeX color="white" size={21} />
            ) : (
              <Volume2 color="white" size={21} />
            )}
          </Pressable>
          <Text style={s.playerTime}>
            {formatTime(Math.floor(currentTime))} /{' '}
            {formatTime(Math.floor(duration))}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function RecordingScreen({ navigation, route }: any) {
  const { user, challenges, registerLocalSession, openingPhrase } = useApp();
  const insets = useSafeAreaInsets();
  const challenge = challenges.find(
    item => item.id === route.params?.challengeId,
  );
  const cameraPermission = useCameraPermission();
  const microphonePermission = useMicrophonePermission();
  const device = useCameraDevice('front');
  const isFocused = useIsFocused();
  const videoOutput = useVideoOutput({
    targetResolution: CommonResolutions.HD_16_9,
    enableAudio: true,
    fileType: 'mp4',
  });
  const recorder = useRef<Recorder | null>(null);
  const recordingRef = useRef(false);
  const stoppingRef = useRef(false);
  const interruptedRef = useRef(false);
  const startedAt = useRef(0);
  const [appActive, setAppActive] = useState(
    AppState.currentState === 'active',
  );
  const [permissionExplained, setPermissionExplained] = useState(
    cameraPermission.hasPermission && microphonePermission.hasPermission,
  );
  const [ready, setReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [filePath, setFilePath] = useState<string>();
  const [durationMs, setDurationMs] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [showDiscardWarning, setShowDiscardWarning] = useState(false);
  const sheetBackdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(48)).current;
  const pendingNavigationAction = useRef<any>(undefined);
  const discarding = useRef(false);

  useEffect(() => {
    if (!showDiscardWarning) return;
    sheetBackdropOpacity.setValue(0);
    sheetTranslateY.setValue(48);
    Animated.parallel([
      Animated.timing(sheetBackdropOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [sheetBackdropOpacity, sheetTranslateY, showDiscardWarning]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      navigationBarColor: filePath ? colors.surface : 'transparent',
      navigationBarTranslucent: !filePath,
    });
  }, [filePath, navigation]);

  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)),
      250,
    );
    return () => clearInterval(timer);
  }, [recording]);

  useEffect(() => {
    if (recording) keepAwake?.activate();
    else keepAwake?.deactivate();
    return () => keepAwake?.deactivate();
  }, [recording]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      const active = nextState === 'active';
      setAppActive(active);
      if (!active && recordingRef.current && !stoppingRef.current) {
        stoppingRef.current = true;
        interruptedRef.current = true;
        recorder.current
          ?.stopRecording()
          .catch(() => {
            recordingRef.current = false;
            setRecording(false);
            setError(
              'Recording was interrupted and could not be saved. Please try again.',
            );
          })
          .finally(() => {
            stoppingRef.current = false;
          });
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (event: any) => {
        if (discarding.current || (!recording && !filePath)) return;
        event.preventDefault();
        pendingNavigationAction.current = event.data.action;
        setShowDiscardWarning(true);
      }),
    [filePath, navigation, recording],
  );

  if (!challenge || !user)
    return (
      <View style={s.center}>
        <Text style={s.error}>Challenge unavailable.</Text>
      </View>
    );

  const requestPermissions = async () => {
    setPermissionExplained(true);
    setError(undefined);
    const cameraGranted =
      cameraPermission.hasPermission ||
      (await cameraPermission.requestPermission());
    const microphoneGranted =
      microphonePermission.hasPermission ||
      (await microphonePermission.requestPermission());
    if (!cameraGranted || !microphoneGranted)
      setError(
        'Camera and microphone access are both required to record a private rep.',
      );
  };
  const finishRecording = (path: string) => {
    recordingRef.current = false;
    recorder.current = null;
    setRecording(false);
    setFilePath(path);
    setDurationMs(Date.now() - startedAt.current);
    if (interruptedRef.current) {
      setError(
        'Recording stopped safely when the app left the foreground. Review this take or try again.',
      );
      interruptedRef.current = false;
    }
  };
  const startRecording = async () => {
    if (!ready) return setError('Camera is still getting ready.');
    setError(undefined);
    setElapsed(0);
    startedAt.current = Date.now();
    try {
      const nextRecorder = await videoOutput.createRecorder({
        maxDuration: Math.min(challenge.maxDurationSec, 150),
      });
      recorder.current = nextRecorder;
      await nextRecorder.startRecording(
        path => finishRecording(path),
        cause => {
          recordingRef.current = false;
          recorder.current = null;
          setRecording(false);
          setError(cause.message);
        },
      );
      recordingRef.current = true;
      setRecording(true);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Recording could not start.',
      );
    }
  };
  const stopRecording = async () => {
    if (stoppingRef.current) return;
    stoppingRef.current = true;
    try {
      await recorder.current?.stopRecording();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Recording could not stop.',
      );
    } finally {
      stoppingRef.current = false;
    }
  };
  const discardTake = async () => {
    discarding.current = true;
    setShowDiscardWarning(false);
    if (recording) {
      try {
        await recorder.current?.stopRecording();
      } catch {
        // The take is being discarded, so a recorder shutdown error is harmless.
      }
    }
    const action = pendingNavigationAction.current;
    if (action) navigation.dispatch(action);
    else navigation.goBack();
  };
  const closeDiscardWarning = () => {
    Animated.parallel([
      Animated.timing(sheetBackdropOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 48,
        duration: 190,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setShowDiscardWarning(false);
    });
  };
  const discardWarning = (
    <Modal
      animationType="none"
      onRequestClose={closeDiscardWarning}
      statusBarTranslucent
      transparent
      visible={showDiscardWarning}
    >
      <View style={s.sheetBackdrop}>
        <Animated.View
          pointerEvents="none"
          style={[s.sheetScrim, { opacity: sheetBackdropOpacity }]}
        >
          <BlurView
            autoUpdate
            blurAmount={18}
            blurRadius={16}
            blurType="dark"
            overlayColor="rgba(17,18,24,.32)"
            style={s.sheetBlur}
          />
        </Animated.View>
        <Pressable
          accessibilityLabel="Keep recording"
          onPress={closeDiscardWarning}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View
          style={[s.sheet, { transform: [{ translateY: sheetTranslateY }] }]}
        >
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>Discard this take?</Text>
          <Text style={s.sheetCopy}>
            Your recording hasn’t been accepted yet. Leaving will discard this
            take.
          </Text>
          <PrimaryButton
            label={recording ? 'Keep recording' : 'Keep this take'}
            onPress={closeDiscardWarning}
          />
          <Pressable onPress={discardTake} style={s.sheetDiscard}>
            <Text style={s.sheetDiscardText}>Discard and leave</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
  const retry = () => {
    setRetryCount(value => value + 1);
    setFilePath(undefined);
    setDurationMs(0);
    setElapsed(0);
    setReady(false);
  };
  const accept = async () => {
    if (!filePath) return;
    setSaving(true);
    setError(undefined);
    const sessionId = createLocalSessionId();
    try {
      const localSession = {
        id: sessionId,
        uid: user.uid,
        challengeId: challenge.id,
        challengeOrder: challenge.order,
        createdAt: new Date().toISOString(),
        durationMs,
        retryCount,
        oneTakeQualified: challenge.oneTakeBonus && retryCount === 0,
        completionStatus: 'recorded',
        localVideoPath: filePath,
        openingPhrase,
      } as const;
      await saveLocalSession(localSession);
      registerLocalSession(localSession);
      discarding.current = true;
      navigation.replace('TakeAccepted', {
        challengeId: challenge.id,
        sessionId,
      });
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'This take could not be saved locally.',
      );
      setSaving(false);
    }
  };
  const takeIsTooShort = durationMs < challenge.minDurationSec * 1000;

  if (!permissionExplained)
    return (
      <View style={s.permission}>
        <View style={s.permissionIcon}>
          <CameraIcon color={colors.primary} size={38} />
        </View>
        <Text style={s.permissionTitle}>Camera and microphone</Text>
        <Text style={s.permissionCopy}>
          Lens Courage needs camera and microphone access so you can record your
          private practice reps.
        </Text>
        <PrimaryButton label="Continue" onPress={requestPermissions} />
        <Text onPress={navigation.goBack} style={s.cancel}>
          Not now
        </Text>
      </View>
    );
  if (!cameraPermission.hasPermission || !microphonePermission.hasPermission)
    return (
      <View style={s.permission}>
        <Text style={s.permissionTitle}>Permission needed</Text>
        <Text style={s.permissionCopy}>{error}</Text>
        {cameraPermission.canRequestPermission ||
        microphonePermission.canRequestPermission ? (
          <PrimaryButton
            label="Grant permission"
            onPress={requestPermissions}
          />
        ) : (
          <PrimaryButton label="Open Settings" onPress={Linking.openSettings} />
        )}
        <Text onPress={navigation.goBack} style={s.cancel}>
          Go back
        </Text>
      </View>
    );
  if (filePath)
    return (
      <SafeAreaView edges={['left', 'right']} style={s.previewSafe}>
        {discardWarning}
        <ScreenNavigationBar
          label="REVIEW YOUR TAKE"
          title={challenge.title}
          onBack={navigation.goBack}
        />
        <View style={s.previewContent}>
          <View style={s.previewCard}>
            <View style={s.previewVideo}>
              <RecordedTakePreview filePath={filePath} />
            </View>
            <View style={s.previewMeta}>
              <View style={s.previewStatus}>
                <CheckCircle2 color={colors.teal} size={18} strokeWidth={2.5} />
                <Text style={s.previewStatusText}>Take ready</Text>
              </View>
              <View style={s.previewDuration}>
                <Clock3 color={colors.muted} size={16} strokeWidth={2.4} />
                <Text style={s.previewDurationText}>
                  {formatTime(Math.round(durationMs / 1000))}
                </Text>
              </View>
            </View>
          </View>
          <Text style={s.previewPrivacy}>
            This video stays on your phone by default.
          </Text>
          {takeIsTooShort && (
            <View style={s.durationWarning}>
              <AlertTriangle
                color={colors.danger}
                size={19}
                strokeWidth={2.5}
              />
              <Text style={s.durationWarningText}>
                This take is too short to complete the challenge. Record at
                least {challenge.minDurationSec} seconds, then try again.
              </Text>
            </View>
          )}
          {error && <Text style={s.previewError}>{error}</Text>}
        </View>
        <FloatingActionDock>
          <Pressable disabled={saving} onPress={retry} style={s.previewRetry}>
            <RotateCcw color={colors.primary} size={18} strokeWidth={2.5} />
            <Text style={s.previewRetryText}>
              {challenge.oneTakeBonus && retryCount === 0
                ? 'Try again · forfeit +5 CP'
                : 'Try again'}
            </Text>
          </Pressable>
          <PrimaryButton
            label={
              saving
                ? 'Saving take…'
                : takeIsTooShort
                ? 'Take is too short'
                : 'Use this take'
            }
            disabled={saving || takeIsTooShort}
            onPress={accept}
          />
        </FloatingActionDock>
      </SafeAreaView>
    );
  if (!device)
    return (
      <View style={s.permission}>
        <Text style={s.permissionTitle}>No front camera found</Text>
        <Text style={s.permissionCopy}>
          Lens Courage could not find a usable front camera on this device.
        </Text>
        <PrimaryButton label="Go back" onPress={navigation.goBack} />
      </View>
    );

  return (
    <View style={s.root}>
      {discardWarning}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && appActive}
        outputs={[videoOutput]}
        orientationSource="device"
        mirrorMode="auto"
        onConfigured={() => setReady(true)}
        onError={cause => setError(cause.message)}
      />
      <View style={s.scrim} />
      <View style={[s.top, { top: insets.top + 8 }]}>
        <Pressable
          accessibilityLabel="Close camera"
          onPress={navigation.goBack}
          style={s.close}
        >
          <X color="white" size={23} />
        </Pressable>
        <View>
          <Text style={s.challengeTitle}>{challenge.title}</Text>
          <Text style={s.timer}>
            {recording && <Text style={s.live}>● </Text>}
            {formatTime(recording ? elapsed : Math.round(durationMs / 1000))}
          </Text>
        </View>
        <View style={s.topSpacer} />
      </View>
      <View style={s.prompt}>
        <Text style={s.promptLabel}>YOUR PROMPT</Text>
        {openingPhrase && (
          <Text style={s.openingPrompt}>Start: “{openingPhrase}”</Text>
        )}
        <Text style={s.promptText}>{challenge.fullPrompt}</Text>
        <Text style={s.hint}>Look at the lens, not your preview.</Text>
      </View>
      {error && <Text style={s.cameraError}>{error}</Text>}
      <View style={s.bottom}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={recording ? 'Stop recording' : 'Start recording'}
          onPress={recording ? stopRecording : startRecording}
          style={[s.record, recording && s.stop]}
        >
          {recording ? (
            <View style={s.stopInner} />
          ) : (
            <View style={s.recordInner} />
          )}
        </Pressable>
        <Text style={s.ready}>
          {recording
            ? 'Tap to finish'
            : ready
            ? 'Start when you’re ready'
            : 'Preparing camera…'}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cameraBlack },
  previewSafe: { flex: 1, backgroundColor: colors.background },
  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetScrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  sheetBlur: {
    flex: 1,
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.surface,
  },
  sheetHandle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: colors.border,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
  },
  sheetCopy: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
  },
  sheetDiscard: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  sheetDiscardText: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.danger,
  },
  previewContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 142,
  },
  previewCard: {
    ...cardShadow,
    flex: 1,
    marginTop: 8,
    padding: 10,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewVideo: {
    flex: 1,
    minHeight: 280,
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: colors.cameraBlack,
  },
  player: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.cameraBlack,
  },
  playerVideoByWidth: {
    width: '100%',
    aspectRatio: 9 / 16,
    flexShrink: 0,
  },
  playerVideoByHeight: {
    height: '100%',
    aspectRatio: 9 / 16,
    flexShrink: 0,
  },
  playerControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,.52)',
  },
  playerProgressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,.35)',
    marginBottom: 12,
  },
  playerProgressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: 'white',
  },
  playerControlRow: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playerControlButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerPlayButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,.2)',
  },
  playerTime: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: 'white',
    textAlign: 'right',
  },
  previewMeta: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  previewStatus: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  previewStatusText: { fontSize: 13, fontWeight: '900', color: colors.ink },
  previewDuration: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  previewDurationText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.muted,
  },
  previewPrivacy: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 10,
  },
  durationWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 9,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFF0F1',
  },
  durationWarningText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    color: colors.danger,
  },
  previewError: {
    fontSize: 12,
    color: colors.danger,
    textAlign: 'center',
    marginTop: 6,
  },
  previewRetry: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginBottom: 4,
  },
  previewRetryText: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primary,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  permission: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.background,
  },
  permissionIcon: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  permissionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.ink,
    textAlign: 'center',
    marginTop: 18,
  },
  permissionCopy: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 28,
  },
  cancel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.muted,
    textAlign: 'center',
    padding: 18,
  },
  error: { color: colors.danger },
  scrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.18)',
  },
  top: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  close: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topSpacer: { width: 44, height: 44 },
  challengeTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
  },
  timer: {
    fontSize: 13,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginTop: 3,
  },
  live: { color: colors.coral },
  prompt: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: '18%',
    padding: 15,
    borderRadius: 18,
    backgroundColor: 'rgba(17,18,24,.68)',
  },
  promptLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: '#D8D3FF',
  },
  promptText: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '800',
    color: 'white',
    marginTop: 5,
  },
  openingPrompt: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '900',
    color: '#FFF1A8',
    marginTop: 5,
  },
  hint: { fontSize: 11, color: 'rgba(255,255,255,.72)', marginTop: 8 },
  cameraError: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 185,
    color: 'white',
    backgroundColor: 'rgba(232,80,91,.9)',
    padding: 10,
    borderRadius: 12,
    textAlign: 'center',
  },
  bottom: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 30,
    alignItems: 'center',
  },
  record: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 5,
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.coral,
  },
  stop: { backgroundColor: colors.coral },
  stopInner: {
    width: 32,
    height: 32,
    borderRadius: 7,
    backgroundColor: 'white',
  },
  ready: { fontSize: 13, fontWeight: '800', color: 'white', marginTop: 10 },
});
