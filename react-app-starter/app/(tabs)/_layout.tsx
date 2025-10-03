import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { useMiniApp } from '@/lib/apps/app-provider';
import { miniAppRegistry } from '@/lib/apps/registry';

export default function TabLayout() {
  const { activeApp } = useMiniApp();

  // Get active tabs from current app (preserves order from registry)
  const activeTabs = activeApp?.tabs || [];

  // Get all unique tab IDs from all apps (for hidden tabs)
  const allTabIds = new Set(
    Object.values(miniAppRegistry).flatMap((app) => app.tabs.map((tab) => tab.id))
  );

  // Get tab IDs that need to be hidden (not in active app)
  const hiddenTabIds = Array.from(allTabIds).filter(
    (id) => !activeTabs.some((tab) => tab.id === id)
  );

  // Map tab icons to SF Symbols
  const getSFSymbol = (iconName: string) => {
    const iconMap: Record<string, string> = {
      house: 'house.fill',
      explore: 'safari.fill',
      posts: 'square.stack.3d.up.fill',
      profiles: 'person.crop.circle.fill',
      settings: 'gearshape.fill',
      apps: 'square.grid.2x2.fill',
      chat: 'bubble.left.and.bubble.right.fill',
      'bubble.left.and.bubble.right.fill': 'bubble.left.and.bubble.right.fill',
      'person.crop.circle': 'person.crop.circle.fill',
      'gearshape.2': 'gearshape.fill',
      'square.grid.2x2': 'square.grid.2x2.fill',
    };

    return iconMap[iconName] || iconName;
  };

  return (
    <NativeTabs>
      {/* Render active tabs with native iOS look */}
      {activeTabs.map((tabConfig) => {
        const sfSymbol = getSFSymbol(tabConfig.icon || 'questionmark.circle');

        return (
          <NativeTabs.Trigger key={tabConfig.id} name={tabConfig.id}>
            <Icon sf={sfSymbol} />
            <Label>{tabConfig.name}</Label>
          </NativeTabs.Trigger>
        );
      })}

      {/* Hidden tabs still need to be registered but won't show in tab bar */}
      {hiddenTabIds.map((tabId) => (
        <NativeTabs.Trigger key={tabId} name={tabId} hidden>
          <Icon sf="questionmark.circle" />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
