import type { HealthValidation, QuizData, WeightDataPoint } from "@/types/quiz";

// Convert height to cm
export function getHeightInCm(value: number, unit: "in" | "cm"): number {
  return unit === "in" ? value * 2.54 : value;
}

// Convert weight to kg
export function getWeightInKg(value: number, unit: "lbs" | "kg"): number {
  return unit === "lbs" ? value * 0.453592 : value;
}

// Convert kg to preferred unit
export function convertFromKg(value: number, unit: "lbs" | "kg"): number {
  return unit === "lbs" ? value / 0.453592 : value;
}

// Calculate BMI
export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

// Get healthy weight range for a height
export function getHealthyWeightRange(heightCm: number): {
  min: number;
  max: number;
} {
  const heightM = heightCm / 100;

  return {
    min: 18.5 * (heightM * heightM),
    max: 24.9 * (heightM * heightM),
  };
}

// Weekly weight loss rate based on pace (in kg)
export function getWeeklyLossRate(
  pace: "slow" | "moderate" | "aggressive",
): number {
  switch (pace) {
    case "slow":
      return 0.25;
    case "moderate":
      return 0.5;
    case "aggressive":
      return 0.75;
    default:
      return 0.5;
  }
}

// Validate health goals
export function validateHealthGoals(data: QuizData): HealthValidation {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  if (!data.currentWeight || !data.goalWeight || !data.heightValue) {
    return {
      isValid: false,
      bmi: 0,
      goalBmi: 0,
      warnings: ["Please complete all required fields"],
      suggestions: [],
      minHealthyWeight: 0,
      maxHealthyWeight: 0,
      recommendedGoalWeight: 0,
      weeklyLossRate: 0,
      estimatedWeeks: 0,
    };
  }

  const heightCm = getHeightInCm(data.heightValue, data.heightUnit);
  const currentWeightKg = getWeightInKg(data.currentWeight, data.weightUnit);
  const goalWeightKg = getWeightInKg(data.goalWeight, data.weightUnit);

  const currentBmi = calculateBmi(currentWeightKg, heightCm);
  const goalBmi = calculateBmi(goalWeightKg, heightCm);
  const healthyRange = getHealthyWeightRange(heightCm);

  const weeklyLossRateKg = getWeeklyLossRate(data.goalPace || "moderate");
  const weightToLose = currentWeightKg - goalWeightKg;
  const estimatedWeeks = Math.ceil(weightToLose / weeklyLossRateKg);

  let isValid = true;

  // Check if goal weight is below healthy range
  if (goalBmi < 18.5) {
    warnings.push("Your goal weight is below the healthy BMI range.");
    suggestions.push(
      `Consider a goal weight of at least ${Math.round(convertFromKg(healthyRange.min, data.weightUnit))} ${data.weightUnit} to stay within a healthy range.`,
    );

    isValid = false;
  }

  // Check if trying to gain weight (not supported in this flow)
  if (goalWeightKg >= currentWeightKg) {
    warnings.push("This program is designed for weight loss goals.");
    suggestions.push(
      "Please set a goal weight lower than your current weight.",
    );

    isValid = false;
  }

  // Check for aggressive weight loss
  if (weightToLose > 0 && estimatedWeeks < 4 && weightToLose > 2) {
    warnings.push(
      "Your timeline may be too aggressive for healthy weight loss.",
    );
    suggestions.push(
      "Most experts recommend losing 0.5-1 kg (1-2 lbs) per week.",
    );
  }

  // Check for unrealistic goals
  if (weightToLose > currentWeightKg * 0.4) {
    warnings.push(
      "Losing more than 40% of your body weight requires medical supervision.",
    );
    suggestions.push(
      "Consider setting intermediate milestones with your healthcare provider.",
    );

    isValid = false;
  }

  // Add encouraging message if everything looks good
  if (isValid && warnings.length === 0) {
    suggestions.push(
      "Your goals are realistic and achievable! You've got this.",
    );
  }

  // Recommend a healthy goal weight if needed
  let recommendedGoal = goalWeightKg;

  if (goalBmi < 18.5) {
    recommendedGoal = healthyRange.min + 2; // A bit above minimum for safety
  }

  return {
    isValid,
    bmi: Math.round(currentBmi * 10) / 10,
    goalBmi: Math.round(goalBmi * 10) / 10,
    warnings,
    suggestions,
    minHealthyWeight: Math.round(
      convertFromKg(healthyRange.min, data.weightUnit),
    ),
    maxHealthyWeight: Math.round(
      convertFromKg(healthyRange.max, data.weightUnit),
    ),
    recommendedGoalWeight: Math.round(
      convertFromKg(recommendedGoal, data.weightUnit),
    ),
    weeklyLossRate:
      Math.round(convertFromKg(weeklyLossRateKg, data.weightUnit) * 10) / 10,
    estimatedWeeks,
  };
}

// Generate weight trajectory data points
export function generateTrajectoryData(data: QuizData): WeightDataPoint[] {
  if (!data.currentWeight || !data.goalWeight) return [];

  const weeklyRate = getWeeklyLossRate(data.goalPace || "moderate");
  const currentKg = getWeightInKg(data.currentWeight, data.weightUnit);
  const goalKg = getWeightInKg(data.goalWeight, data.weightUnit);
  const weeksNeeded = Math.ceil((currentKg - goalKg) / weeklyRate);

  const points: WeightDataPoint[] = [];

  // Generate weekly data points
  for (let week = 0; week <= weeksNeeded; week++) {
    const weight = Math.max(goalKg, currentKg - week * weeklyRate);

    points.push({
      week,
      weight: Math.round(convertFromKg(weight, data.weightUnit) * 10) / 10,
      label: week === 0 ? "Today" : `Week ${week}`,
    });
  }

  return points;
}
