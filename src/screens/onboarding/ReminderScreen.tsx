import React, { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { Card, FloatingActionDock, PrimaryButton } from '../../components/ui';
import { useApp } from '../../app/AppProvider';
import { OnboardingLayout, onboardingStyles as s } from './shared';
const options = [
  ['08:00', '🌤️', 'Morning', 'Around 8:00'],
  ['13:00', '☀️', 'Afternoon', 'Around 1:00'],
  ['19:00', '🌙', 'Evening', 'Around 7:00'],
  ['off', '🔕', 'Not now', 'You can enable this later.'],
];
export function ReminderScreen() {
  const { draft, setDraft, completeOnboarding } = useApp();
  const [busy, setBusy] = useState(false);
  const selected =
    draft.reminderEnabled === false ? 'off' : draft.reminderLocalTime;
  const finish = async () => {
    setBusy(true);
    try {
      await completeOnboarding();
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <OnboardingLayout
        step={3}
        eyebrow="A SMALL NUDGE"
        title="When should we remind you?"
        subtitle="We’ll ask for notification permission only if you choose a reminder."
      >
        {options.map(([value, emoji, title, subtitle]) => (
          <Pressable
            key={value}
            onPress={() =>
              setDraft(
                value === 'off'
                  ? { reminderEnabled: false, reminderLocalTime: undefined }
                  : { reminderEnabled: true, reminderLocalTime: value },
              )
            }
          >
            <Card style={[s.option, selected === value && s.selected]}>
              <Text style={s.emoji}>{emoji}</Text>
              <Text style={s.optionText}>
                <Text style={s.optionTitle}>{title}</Text>
                {'\n'}
                <Text style={s.optionSubtitle}>{subtitle}</Text>
              </Text>
              {selected === value && <Text style={s.check}>✓</Text>}
            </Card>
          </Pressable>
        ))}
      </OnboardingLayout>
      <FloatingActionDock>
        <PrimaryButton
          label={busy ? 'Finishing setup…' : 'Go to home'}
          disabled={selected === undefined || busy}
          onPress={finish}
        />
      </FloatingActionDock>
    </>
  );
}
