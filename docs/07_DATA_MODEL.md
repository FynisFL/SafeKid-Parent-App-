# 07 — Data Model

Use strict TypeScript types and Zod validation. All records are local demo records. IDs should be UUIDs or deterministic demo IDs; timestamps use ISO 8601 strings.

```ts
export type SubscriptionTier = 'free' | 'plus';
export type DeviceConnection = 'connected' | 'disconnected' | 'unknown';
export type TaskStatus = 'assigned' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
export type AlertType = 'sos' | 'safe_zone_entry' | 'safe_zone_exit' | 'low_battery' | 'device_disconnected' | 'speed' | 'task_reminder' | 'task_completed';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'normal';
export type DataOrigin = 'demo_seed' | 'demo_simulator' | 'local_user_action';

export interface ParentProfile {
  id: string;
  displayName: string;
  avatarInitial: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChildProfile {
  id: string;
  displayName: string;
  age: number;
  avatarKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface WatchDevice {
  id: string;
  childId: string;
  displayName: string;
  modelLabel: string;
  deviceIdLabel: string; // fictional demo identifier
  connection: DeviceConnection;
  batteryPercent: number;
  lastSyncAt: string;
  firmwareLabel?: string;
  origin: DataOrigin;
}

export interface LocationSample {
  id: string;
  childId: string;
  latitude: number;
  longitude: number;
  placeLabel: string;
  recordedAt: string;
  accuracyMeters?: number;
  origin: 'demo_seed' | 'demo_simulator';
}

export interface SafeZone {
  id: string;
  childId: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  enabled: boolean;
  schedule?: { startTime?: string; endTime?: string; weekdays?: number[] };
  createdAt: string;
  updatedAt: string;
}

export interface AlertEvent {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  childId: string;
  deviceId?: string;
  locationSampleId?: string;
  occurredAt: string;
  readAt?: string;
  acknowledgedAt?: string;
  source: 'demo_simulator' | 'local_user_action';
  demoOnly: true;
}

export interface ApprovedContact {
  id: string;
  displayName: string;
  relationship: string;
  maskedPhone?: string;
  approved: boolean;
}

export interface Habit {
  id: string;
  childId: string;
  name: string;
  category: 'morning' | 'learning' | 'responsibility' | 'health' | 'other';
  description?: string;
  active: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  childId: string;
  habitId?: string;
  title: string;
  description?: string;
  parentNote?: string;
  category: Habit['category'];
  status: TaskStatus;
  dueDate: string;
  repeat: 'once' | 'daily' | 'weekdays' | 'weekly' | 'custom';
  reminderEnabled: boolean;
  reminderTime?: string;
  rewardCoins: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  completionOrigin?: 'demo_simulator';
  rewardGrantedAt?: string;
}

export interface CoinTransaction {
  id: string;
  childId: string;
  taskId?: string;
  type: 'earned' | 'adjustment';
  amount: number;
  reason: string;
  createdAt: string;
  origin: DataOrigin;
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  startedAt: string;
  billingMode: 'none' | 'monthly_demo' | 'yearly_demo';
  demoOnly: true;
}

export interface NotificationPreferences {
  sos: boolean;
  safeZone: boolean;
  device: boolean;
  speed: boolean;
  taskReminders: boolean;
  rewards: boolean;
  sound: boolean;
  haptics: boolean;
}
```

## Derived state rules
- Coin balance = sum of valid CoinTransaction amounts; never maintain an unrelated manually edited balance as a second source of truth.
- A task reward is granted only when status transitions to `completed` and `rewardGrantedAt` is empty. Transaction creation and task update must occur atomically in one storage transaction.
- Habit progress derives from completed tasks linked to the habit within the selected date range.
- A Safe Zone event is created only by the simulator; no real geofence is running.
- Device connection/battery values are simulator state, not watch telemetry.
- “Last sync” is seeded or simulator-generated. It must not imply a real watch sync.

## Seed data
Use fictional labels only:
- Parent display name: “Alex” until user enters a name.
- Child: “Minh Anh”, age 7.
- Device: “SafeKid Watch S01”, ID “DEMO-SK-001”.
- Fictional locations: “ABC Primary School”, “Family Home” in a clearly fictionalized map area or a generic demo map. Do not use the user's actual location.
- Starting battery: 85%.
- Starting plan: Free.
- Starting Coin balance: derived from seeded transactions (e.g. 125 Coins).

The sample names and data are fictional and editable.
