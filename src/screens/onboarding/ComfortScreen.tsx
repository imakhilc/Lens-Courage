import React from 'react';
import { Pressable, Text } from 'react-native';
import { Card, FloatingActionDock, PrimaryButton } from '../../components/ui';
import { useApp } from '../../app/AppProvider';
import { ComfortLevel } from '../../types/models';
import { OnboardingLayout, onboardingStyles as s } from './shared';
const options: Array<[ComfortLevel, string, string, string]> = [
  [1, '😵', 'I avoid it', 'Even recording alone feels weird.'],
  [2, '😬', 'I can do it alone', 'But I overthink every take.'],
  [3, '🙂', 'I can record', 'Public recording is the scary part.'],
  [4, '😎', 'Give me harder reps', 'I want real vlogging confidence.'],
];
export function ComfortScreen({ navigation }: any) {
  const { draft, setDraft } = useApp();
  return (
    <>
      <OnboardingLayout
        step={1}
        eyebrow="STARTING POINT"
        title="How does talking to a camera feel right now?"
        subtitle="No right answer. This only changes how we introduce the journey."
      >
        {options.map(([value, emoji, title, subtitle]) => (
          <Pressable
            key={value}
            onPress={() => setDraft({ startingComfortLevel: value })}
          >
            <Card
              style={[
                s.option,
                draft.startingComfortLevel === value && s.selected,
              ]}
            >
              <Text style={s.emoji}>{emoji}</Text>
              <Text style={s.optionText}>
                <Text style={s.optionTitle}>{title}</Text>
                {'\n'}
                <Text style={s.optionSubtitle}>{subtitle}</Text>
              </Text>
              {draft.startingComfortLevel === value && (
                <Text style={s.check}>✓</Text>
              )}
            </Card>
          </Pressable>
        ))}
      </OnboardingLayout>
      <FloatingActionDock>
        <PrimaryButton
          label="Continue"
          disabled={!draft.startingComfortLevel}
          onPress={() => navigation.navigate('Goal')}
        />
      </FloatingActionDock>
    </>
  );
}
