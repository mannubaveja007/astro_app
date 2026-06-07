import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_BASE_HEIGHT = 60; // Base height of the tab items

export function useLayoutConstants() {
  const insets = useSafeAreaInsets();
  const TAB_BAR_TOTAL_HEIGHT = TAB_BAR_BASE_HEIGHT + insets.bottom;
  const SCREEN_BOTTOM_PADDING = TAB_BAR_TOTAL_HEIGHT + 24; // Spacing to scroll above the tab bar

  return {
    insets,
    TAB_BAR_BASE_HEIGHT,
    TAB_BAR_TOTAL_HEIGHT,
    SCREEN_BOTTOM_PADDING,
  };
}
