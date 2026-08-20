import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Clock3 } from 'lucide-react-native';
import { BrandMark, Card, PrimaryButton, ProgressBar } from '../components/ui';
import { useApp } from '../app/AppProvider';
import { colors } from '../theme';
import {
  PRIMARY_TAB_BAR_SPACE,
  PRIMARY_TAB_TOP_SPACE,
} from '../components/PrimaryTabBar';
import { Shimmer } from '../components/Shimmer';

const heroShimmer = {
  baseColor: 'rgba(255,255,255,.16)',
  highlightColor: 'rgba(255,255,255,.38)',
};

export function TodayScreen({ navigation }: any) {
  const {
    user,
    challenges,
    challengesLoading,
    challengesError,
    localSessions,
    localDataLoading,
    clearDevData,
    refreshData,
  } = useApp();
  const [clearingDevData, setClearingDevData] = useState(false);
  const insets = useSafeAreaInsets();
  const challenge = challenges.find(
    item => item.order === (user?.currentChallengeOrder ?? 1),
  );
  const recordedSession = localSessions.find(
    session => session.challengeId === challenge?.id,
  );
  const todayLoading =
    challengesLoading || localDataLoading || (!challenge && !challengesError);
  const confirmDevReset = () =>
    Alert.alert(
      '__DEV__ clear data',
      'Reset local challenge history and permanently delete all locally recorded videos for this account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear data',
          style: 'destructive',
          onPress: async () => {
            setClearingDevData(true);
            try {
              await clearDevData();
            } catch (cause) {
              Alert.alert(
                'Could not clear data',
                cause instanceof Error
                  ? cause.message
                  : 'Rebuild the debug app and try again.',
              );
            } finally {
              setClearingDevData(false);
            }
          },
        },
      ],
    );
  return (
    <View style={s.safe}>
      <ScrollView
        contentContainerStyle={[
          s.content,
          {
            paddingTop: insets.top + PRIMARY_TAB_TOP_SPACE,
            paddingBottom: insets.bottom + PRIMARY_TAB_BAR_SPACE,
          },
        ]}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            onRefresh={refreshData}
            progressBackgroundColor={colors.surface}
            refreshing={challengesLoading || localDataLoading}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={s.header}>
          <View style={s.brand}>
            <BrandMark />
            <View>
              <Text style={s.brandName}>Lens Courage</Text>
              <Text style={s.tag}>ONE BRAVE REP AT A TIME</Text>
            </View>
          </View>
          <View style={s.chips}>
            <Text style={s.streak}>⚡ {user?.currentStreak ?? 0}</Text>
            <Text style={s.cp}>CP {user?.totalCP ?? 0}</Text>
          </View>
        </View>
        {user?.previewMode && (
          <Text style={s.preview}>
            LOCAL PREVIEW · ADD GOOGLE-SERVICES.JSON FOR FIREBASE
          </Text>
        )}
        {challengesError && (
          <Text style={s.catalogError}>{challengesError}</Text>
        )}
        <Text style={s.eyebrow}>
          {!todayLoading && recordedSession
            ? "TODAY'S REP · RECORDED"
            : "TODAY'S REP"}
        </Text>
        <View style={s.dayRow}>
          <Text style={s.title}>
            Challenge {challenge?.order ?? user?.currentChallengeOrder ?? 1} of
            30
          </Text>
          <Text style={s.day}>
            DAY {challenge?.order ?? user?.currentChallengeOrder ?? 1}
          </Text>
        </View>
        {todayLoading ? (
          <Card style={s.hero}>
            <View style={s.heroTop}>
              <Shimmer {...heroShimmer} style={s.shimmerPill} />
              <Shimmer {...heroShimmer} style={s.shimmerReward} />
            </View>
            <Shimmer {...heroShimmer} style={s.shimmerTitle} />
            <Shimmer {...heroShimmer} style={s.shimmerCopy} />
            <Shimmer {...heroShimmer} style={s.shimmerCopyShort} />
            <Shimmer {...heroShimmer} style={s.shimmerMeta} />
            <Shimmer {...heroShimmer} style={s.shimmerButton} />
          </Card>
        ) : challenge ? (
          <Card style={s.hero}>
            <View style={s.heroTop}>
              <Text style={s.heroPill}>
                {challenge.stageName.toUpperCase()}
              </Text>
              <Text style={s.reward}>+{challenge.rewardCP} CP</Text>
            </View>
            <Text style={s.heroTitle}>{challenge.title}</Text>
            <Text style={s.heroCopy}>{challenge.fullPrompt}</Text>
            <View style={s.meta}>
              <Clock3 color="white" size={17} strokeWidth={2.5} />
              <Text style={s.metaText}>
                {challenge.targetDurationSec} sec · Front camera
              </Text>
            </View>
            <PrimaryButton
              variant="inverted"
              label={recordedSession ? 'Challenge recorded' : 'Start challenge'}
              disabled={Boolean(recordedSession)}
              onPress={() =>
                navigation.navigate('ChallengeDetail', {
                  challengeId: challenge.id,
                })
              }
            />
          </Card>
        ) : (
          <Card style={s.unavailableHero}>
            <Text style={s.unavailableTitle}>Challenge unavailable</Text>
            <Text style={s.unavailableCopy}>
              Reconnect and reopen the app to load your courage path.
            </Text>
          </Card>
        )}
        <Card style={s.quests}>
          <View style={s.row}>
            <View>
              <Text style={s.cardTitle}>Daily quests</Text>
              <Text style={s.cardSub}>Complete all 3 for +20 CP</Text>
            </View>
            {localDataLoading ? (
              <Shimmer style={s.shimmerCounter} />
            ) : (
              <Text style={s.counter}>{recordedSession ? 1 : 0} / 3</Text>
            )}
          </View>
          {[
            'Complete today’s challenge',
            'Review coach feedback',
            'Record 30 seconds today',
          ].map((q, i) => (
            <View key={q} style={[s.quest, i === 2 && s.questLast]}>
              <Text style={s.number}>{i + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.questTitle}>{q}</Text>
                <Text style={s.cardSub}>
                  {i === 0 && recordedSession
                    ? '1 / 1'
                    : `0 / ${i === 2 ? '30 sec' : '1'}`}
                </Text>
              </View>
              {i === 0 && localDataLoading ? (
                <Shimmer style={s.shimmerQuestState} />
              ) : i === 0 && recordedSession ? (
                <View style={s.questDone}>
                  <Check color="white" size={16} strokeWidth={3} />
                </View>
              ) : (
                <View style={s.circle} />
              )}
            </View>
          ))}
        </Card>
        <Card style={s.weekly}>
          <View style={s.row}>
            <View>
              <Text style={s.cardTitle}>Weekly courage chest</Text>
              <Text style={s.cardSub}>Complete 5 challenges</Text>
            </View>
            <Text style={{ fontSize: 28 }}>🎁</Text>
          </View>
          <View style={s.weekRow}>
            <View style={{ flex: 1 }}>
              <ProgressBar progress={0} />
            </View>
            <Text style={s.weekCount}>0 / 5</Text>
          </View>
        </Card>
        {__DEV__ && (
          <Pressable
            accessibilityRole="button"
            disabled={clearingDevData}
            onPress={confirmDevReset}
            style={({ pressed }) => [
              s.devClear,
              pressed && s.devClearPressed,
              clearingDevData && s.devClearDisabled,
            ]}
          >
            <Text style={s.devClearLabel}>__DEV__</Text>
            <Text style={s.devClearText}>
              {clearingDevData
                ? 'Clearing data…'
                : 'Clear local challenge data'}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandName: { fontSize: 20, fontWeight: '900', color: colors.ink },
  tag: { fontSize: 9, fontWeight: '800', color: colors.muted },
  chips: { flexDirection: 'row', gap: 5 },
  streak: {
    padding: 8,
    borderRadius: 99,
    backgroundColor: '#FFF7DC',
    color: '#9D7010',
    fontWeight: '800',
  },
  cp: {
    padding: 8,
    borderRadius: 99,
    backgroundColor: colors.primarySoft,
    color: colors.primaryDark,
    fontWeight: '800',
  },
  preview: {
    fontSize: 9,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 7,
  },
  catalogMessage: {
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  catalogError: {
    fontSize: 11,
    color: colors.danger,
    textAlign: 'center',
    marginTop: 8,
  },
  eyebrow: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 16,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  title: { fontSize: 26, fontWeight: '900', color: colors.ink },
  day: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 99,
    fontWeight: '800',
    color: colors.ink,
  },
  hero: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderWidth: 0,
    padding: 16,
  },
  unavailableHero: { marginTop: 12 },
  unavailableTitle: { fontSize: 19, fontWeight: '900', color: colors.ink },
  unavailableCopy: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
    marginTop: 5,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between' },
  shimmerPill: { width: 94, height: 29, borderRadius: 99 },
  shimmerReward: { width: 68, height: 29, borderRadius: 99 },
  shimmerTitle: { width: '64%', height: 32, borderRadius: 9, marginTop: 17 },
  shimmerCopy: { width: '100%', height: 15, borderRadius: 6, marginTop: 14 },
  shimmerCopyShort: {
    width: '76%',
    height: 15,
    borderRadius: 6,
    marginTop: 7,
  },
  shimmerMeta: { width: 142, height: 17, borderRadius: 7, marginTop: 14 },
  shimmerButton: { height: 58, borderRadius: 18, marginTop: 13 },
  heroPill: {
    color: 'white',
    fontWeight: '800',
    fontSize: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.4)',
    borderRadius: 99,
    padding: 7,
  },
  reward: {
    color: 'white',
    fontSize: 12,
    fontWeight: '900',
    backgroundColor: 'rgba(255,255,255,.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.35)',
    borderRadius: 99,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  heroTitle: { fontSize: 28, fontWeight: '900', color: 'white', marginTop: 12 },
  heroCopy: {
    fontSize: 15,
    lineHeight: 21,
    color: 'rgba(255,255,255,.9)',
    marginTop: 6,
    marginBottom: 11,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  metaText: { fontSize: 12, color: 'white', fontWeight: '700' },
  quests: { marginTop: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: { fontSize: 19, fontWeight: '900', color: colors.ink },
  cardSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  counter: {
    fontWeight: '800',
    color: colors.muted,
    backgroundColor: '#F0F1F5',
    padding: 7,
    borderRadius: 99,
  },
  shimmerCounter: { width: 52, height: 31, borderRadius: 99 },
  quest: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomColor: '#EFF0F4',
    borderBottomWidth: 1,
  },
  questLast: { borderBottomWidth: 0, paddingBottom: 0 },
  number: {
    width: 33,
    height: 33,
    borderRadius: 11,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    fontWeight: '900',
  },
  questTitle: { fontSize: 14, fontWeight: '800', color: colors.ink },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D7DAE4',
  },
  questDone: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teal,
  },
  shimmerQuestState: { width: 24, height: 24, borderRadius: 12 },
  weekly: { marginTop: 10 },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 11,
  },
  weekCount: { fontWeight: '900', color: colors.ink },
  devClear: {
    minHeight: 50,
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F2BEC2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF5F6',
  },
  devClearLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.danger,
    backgroundColor: '#FFE1E4',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
  },
  devClearText: { fontSize: 13, fontWeight: '900', color: colors.danger },
  devClearPressed: { opacity: 0.7 },
  devClearDisabled: { opacity: 0.45 },
});
