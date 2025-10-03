export const FEATURE_FLAGS = {
  // Tab visibility flags
  SHOW_HELLO_TAB: false,
  SHOW_NANO_TAB: true,
  SHOW_VIDEO_TAB: true,
  SHOW_DISCOVER_TAB: true,
  SHOW_NOTES_TAB: true,
  SHOW_CHATS_TAB: true,

  // Debug/Development flags
  SHOW_PREVIEW_BUTTON: false,
  ENABLE_THREE_FINGER_GESTURE: true,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
  return FEATURE_FLAGS[flag];
};
