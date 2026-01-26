interface AiInput {
  topic: string;
  mood?: string;
  durationMins?: number;
}

export const PrayerAiService = {
  async generatePrayer(input: AiInput) {
    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Deterministic mock response
    return {
      prayer: `Father, I come before You regarding ${input.topic}. I ask for Your divine intervention and peace. ${input.mood ? `Lord, even though I feel ${input.mood}, I choose to trust You.` : ''} Guide my steps and grant me wisdom. In Jesus' name, Amen.`,
      points: [
        `Pray for clarity regarding ${input.topic}`,
        `Ask for peace that surpasses understanding`,
        `Declare victory over the situation`,
      ],
      scriptures: ['Philippians 4:6-7', 'James 1:5', 'Psalm 23:1'],
      confession: `I declare that God is working all things together for my good regarding ${input.topic}.`,
    };
  },
};
