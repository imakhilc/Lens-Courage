import React, { useEffect, useRef } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import { Check, ChevronRight, Lock, Play, Star } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, ProgressBar } from '../components/ui';
import {
  PRIMARY_TAB_BAR_SPACE,
  PRIMARY_TAB_TOP_SPACE,
} from '../components/PrimaryTabBar';
import { useApp } from '../app/AppProvider';
import { colors } from '../theme';
import { Shimmer } from '../components/Shimmer';

export function PathScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const {
    user,
    challenges,
    challengesLoading,
    challengesError,
    localSessions,
    localDataLoading,
  } = useApp();
  const scroll = useRef<ScrollViewInstance>(null);
  const current = user?.currentChallengeOrder ?? 1;
  const recordedChallengeIds = new Set(
    localSessions.map(session => session.challengeId),
  );
  const completedCount = challenges.filter(
    challenge =>
      challenge.order < current || recordedChallengeIds.has(challenge.id),
  ).length;
  const pathLoading =
    challengesLoading ||
    localDataLoading ||
    (challenges.length === 0 && !challengesError);
  useEffect(() => {
    const timer = setTimeout(
      () =>
        scroll.current?.scrollTo({
          y: Math.max(0, (current - 1) * 76 - 150),
          animated: true,
        }),
      250,
    );
    return () => clearTimeout(timer);
  }, [current, challenges.length]);

  return (
    <View style={s.safe}>
      <ScrollView
        ref={scroll}
        contentContainerStyle={[
          s.content,
          {
            paddingTop: insets.top + PRIMARY_TAB_TOP_SPACE,
            paddingBottom: insets.bottom + PRIMARY_TAB_BAR_SPACE,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.eyebrow}>YOUR COURAGE PATH</Text>
        <View style={s.heading}>
          <View>
            <Text style={s.title}>Stage {user?.currentStage ?? 1}</Text>
            {pathLoading ? (
              <Shimmer style={s.shimmerSubtitle} />
            ) : (
              <Text style={s.subtitle}>{completedCount} of 30 complete</Text>
            )}
          </View>
          {pathLoading ? (
            <Shimmer style={s.shimmerCount} />
          ) : (
            <Text style={s.count}>{completedCount} / 30</Text>
          )}
        </View>
        {pathLoading ? (
          <Shimmer style={s.shimmerProgress} />
        ) : (
          <ProgressBar progress={completedCount / 30} />
        )}
        {challengesError && <Text style={s.error}>{challengesError}</Text>}
        {pathLoading ? (
          <View style={s.shimmerPath}>
            {Array.from({ length: 6 }, (_, index) => (
              <Shimmer key={index} style={s.shimmerNode} />
            ))}
          </View>
        ) : (
          challenges.map((challenge, index) => {
            const recordedSession = localSessions.find(
              session => session.challengeId === challenge.id,
            );
            const recordedLocally = Boolean(recordedSession);
            const complete = challenge.order < current || recordedLocally;
            const active = challenge.order === current && !recordedLocally;
            const locked = challenge.order > current;
            const stageStart =
              index === 0 || challenges[index - 1].stage !== challenge.stage;
            return (
              <View key={challenge.id}>
                {stageStart && (
                  <Text style={s.stage}>
                    {challenge.stageName.toUpperCase()}
                  </Text>
                )}
                <Card
                  style={[
                    s.node,
                    active && s.activeNode,
                    challenge.boss && s.bossNode,
                  ]}
                >
                  <View
                    style={[
                      s.nodeIcon,
                      complete && s.completeIcon,
                      active && s.activeIcon,
                      locked && s.lockedIcon,
                    ]}
                  >
                    {complete ? (
                      <Check color="white" size={20} strokeWidth={3} />
                    ) : locked ? (
                      <Lock color={colors.muted} size={17} />
                    ) : challenge.boss ? (
                      <Star color="white" size={21} fill="white" />
                    ) : (
                      <Text style={s.nodeNumber}>{challenge.order}</Text>
                    )}
                  </View>
                  <View style={s.nodeCopy}>
                    <Text style={s.nodeTitle}>{challenge.title}</Text>
                    <Text style={s.nodeSubtitle}>
                      {challenge.targetDurationSec} sec · +{challenge.rewardCP}{' '}
                      CP
                    </Text>
                  </View>
                  {recordedLocally ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() =>
                        navigation.navigate('LocalRecording', {
                          sessionId: recordedSession?.id,
                        })
                      }
                      style={({ pressed }) => [
                        s.recordedPill,
                        pressed && s.actionPressed,
                      ]}
                    >
                      <Play
                        color={colors.teal}
                        fill={colors.teal}
                        size={14}
                        strokeWidth={2.5}
                      />
                      <Text style={s.recordedText}>Recorded</Text>
                    </Pressable>
                  ) : !locked ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() =>
                        navigation.navigate('ChallengeDetail', {
                          challengeId: challenge.id,
                        })
                      }
                      style={({ pressed }) => [
                        s.nodeAction,
                        active ? s.startAction : s.reviewAction,
                        pressed && s.actionPressed,
                      ]}
                    >
                      <Text
                        style={active ? s.startActionText : s.reviewActionText}
                      >
                        {complete ? 'Review' : 'Start'}
                      </Text>
                      <ChevronRight
                        color={active ? 'white' : colors.primary}
                        size={15}
                        strokeWidth={3}
                      />
                    </Pressable>
                  ) : (
                    <Pressable
                      accessibilityLabel={`Challenge ${challenge.order} locked`}
                      hitSlop={8}
                      onPress={() =>
                        ToastAndroid.show(
                          `Finish Challenge ${current} first.`,
                          ToastAndroid.SHORT,
                        )
                      }
                      style={s.lockedAction}
                    >
                      <Lock color={colors.muted} size={14} strokeWidth={2.5} />
                    </Pressable>
                  )}
                </Card>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: 16,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.3,
    color: colors.muted,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 12,
  },
  title: { fontSize: 31, fontWeight: '900', color: colors.ink },
  subtitle: { fontSize: 13, color: colors.muted, marginTop: 2 },
  shimmerSubtitle: { width: 112, height: 13, borderRadius: 6, marginTop: 5 },
  shimmerCount: { width: 64, height: 34, borderRadius: 99 },
  shimmerProgress: { height: 10, borderRadius: 99 },
  shimmerPath: { gap: 9, marginTop: 22 },
  shimmerNode: { height: 68, borderRadius: 20 },
  count: {
    fontWeight: '900',
    color: colors.primaryDark,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 99,
  },
  message: { color: colors.muted, textAlign: 'center', marginTop: 28 },
  error: { color: colors.danger, textAlign: 'center', marginTop: 20 },
  stage: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: colors.muted,
    marginTop: 22,
    marginBottom: 8,
  },
  node: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 9,
    padding: 10,
    borderRadius: 20,
  },
  activeNode: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#F8F6FF',
  },
  bossNode: { minHeight: 76 },
  nodeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  completeIcon: { backgroundColor: colors.teal },
  activeIcon: { backgroundColor: colors.primary },
  lockedIcon: { backgroundColor: '#ECEEF3' },
  nodeNumber: { fontWeight: '900', color: 'white' },
  nodeCopy: { flex: 1 },
  nodeTitle: { fontSize: 15, fontWeight: '900', color: colors.ink },
  nodeSubtitle: { fontSize: 12, color: colors.muted, marginTop: 3 },
  nodeAction: {
    minWidth: 76,
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  startAction: {
    backgroundColor: colors.primary,
    borderBottomWidth: 3,
    borderBottomColor: colors.primaryDark,
  },
  reviewAction: { backgroundColor: colors.primarySoft },
  actionPressed: { opacity: 0.78, transform: [{ translateY: 1 }] },
  startActionText: { fontSize: 12, fontWeight: '900', color: 'white' },
  reviewActionText: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.primary,
  },
  recordedPill: {
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E7F8F5',
    borderWidth: 1,
    borderColor: '#C9F0EA',
  },
  recordedText: { fontSize: 11, fontWeight: '900', color: '#238E82' },
  lockedAction: {
    width: 36,
    height: 36,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F2F6',
  },
});
