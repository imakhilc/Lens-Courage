import React from 'react';
import { Pressable, Text } from 'react-native';
import { Card, FloatingActionDock, PrimaryButton } from '../../components/ui';
import { useApp } from '../../app/AppProvider';
import { PrimaryGoal } from '../../types/models';
import { OnboardingLayout, onboardingStyles as s } from './shared';
const options: Array<[PrimaryGoal, string, string, string]> = [
  [
    'vlogging',
    '🎥',
    'Vlogging in public',
    'Build up to real-world creator reps.',
  ],
  [
    'natural_camera',
    '💬',
    'Talking naturally',
    'Sound more like yourself on camera.',
  ],
  [
    'short_form',
    '✨',
    'Making Reels / Shorts',
    'Practice clear hooks and delivery.',
  ],
  ['all', '🌟', 'All of the above', 'Build rounded camera confidence.'],
];
export function GoalScreen({ navigation }: any) {
  const { draft, setDraft } = useApp();
  return (
    <>
      <OnboardingLayout
        step={2}
        eyebrow="YOUR GOAL"
        title="What should Lens Courage help with most?"
        subtitle="We’ll keep the same path and tune the encouragement."
      >
        {options.map(([value, emoji, title, subtitle]) => (
          <Pressable
            key={value}
            onPress={() => setDraft({ primaryGoal: value })}
          >
            <Card style={[s.option, draft.primaryGoal === value && s.selected]}>
              <Text style={s.emoji}>{emoji}</Text>
              <Text style={s.optionText}>
                <Text style={s.optionTitle}>{title}</Text>
                {'\n'}
                <Text style={s.optionSubtitle}>{subtitle}</Text>
              </Text>
              {draft.primaryGoal === value && <Text style={s.check}>✓</Text>}
            </Card>
          </Pressable>
        ))}
      </OnboardingLayout>
      <FloatingActionDock>
        <PrimaryButton
          label="Continue"
          disabled={!draft.primaryGoal}
          onPress={() => navigation.navigate('Reminder')}
        />
      </FloatingActionDock>
    </>
  );
}
