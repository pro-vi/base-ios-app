// Shared types for mini-apps

export interface TabConfig {
  id: string;
  name: string;
  icon: string; // SF Symbol name for the tab icon
  component: string; // Path to the feature component
}

export interface MiniApp {
  id: string;
  name: string;
  description: string;
  tabs: TabConfig[];
}
