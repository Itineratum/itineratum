export interface FeedbackFormData {
  rating: number;
  feedbackCategory: FeedbackCategory;
  thoughtsSuggestions: string;
  files: File[];
}

export enum FeedbackCategory {
  generalFeedback = "General Feedback",
  featureSuggestion = "Feature Suggestion",
  bugReport = "Bug Report",
  other = "Other",
}
