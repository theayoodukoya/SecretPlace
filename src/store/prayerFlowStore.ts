import { create } from 'zustand';
import { PrayerPlan, PrayerStep } from '@/types';

interface PrayerFlowState {
  activePlan: PrayerPlan | null;
  activeSteps: PrayerStep[];
  currentStepIndex: number;
  isPaused: boolean;
  remainingSeconds: number | null; // null if open-ended

  // Actions
  startFlow: (plan: PrayerPlan, steps: PrayerStep[]) => void;
  nextStep: () => void;
  previousStep: () => void;
  togglePause: () => void;
  setRemainingSeconds: (seconds: number) => void;
  endFlow: () => void;
}

export const usePrayerFlowStore = create<PrayerFlowState>((set, get) => ({
  activePlan: null,
  activeSteps: [],
  currentStepIndex: 0,
  isPaused: true,
  remainingSeconds: null,

  startFlow: (plan, steps) => {
    set({
      activePlan: plan,
      activeSteps: steps,
      currentStepIndex: 0,
      isPaused: false,
      remainingSeconds: steps[0]?.duration_seconds || null,
    });
  },

  nextStep: () => {
    const { activeSteps, currentStepIndex } = get();
    if (currentStepIndex < activeSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      set({
        currentStepIndex: nextIndex,
        remainingSeconds: activeSteps[nextIndex].duration_seconds || null,
      });
    } else {
      // Flow complete logic could go here or be handled by the component
      set({ isPaused: true });
    }
  },

  previousStep: () => {
    const { activeSteps, currentStepIndex } = get();
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      set({
        currentStepIndex: prevIndex,
        remainingSeconds: activeSteps[prevIndex].duration_seconds || null,
      });
    }
  },

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

  setRemainingSeconds: (seconds) => set({ remainingSeconds: seconds }),

  endFlow: () =>
    set({
      activePlan: null,
      activeSteps: [],
      currentStepIndex: 0,
      isPaused: true,
      remainingSeconds: null,
    }),
}));
