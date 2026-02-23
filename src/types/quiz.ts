export type Gender = "male" | "female" | "other";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";
export type WeightUnit = "lbs" | "kg";
export type HeightUnit = "in" | "cm";
export type GoalPace = "slow" | "moderate" | "aggressive";

export interface QuizData {
  gender?: Gender;
  age?: number;
  heightValue?: number;
  heightUnit: HeightUnit;
  currentWeight?: number;
  goalWeight?: number;
  weightUnit: WeightUnit;
  activityLevel?: ActivityLevel;
  goalPace?: GoalPace;
  motivation?: string;
  dietaryPreferences?: string[];
}

export interface HealthValidation {
  isValid: boolean;
  bmi: number;
  goalBmi: number;
  warnings: string[];
  suggestions: string[];
  minHealthyWeight: number;
  maxHealthyWeight: number;
  recommendedGoalWeight: number;
  weeklyLossRate: number;
  estimatedWeeks: number;
}

export interface WeightDataPoint {
  week: number;
  weight: number;
  label: string;
}
