# 08 — Mock Services and Adapter Contracts

## Purpose
Keep UI components independent from simulated data and future backend/device integration. Implement mock adapters first; do not place business logic inside screens.

## Service contracts (illustrative)

```ts
export interface DeviceService {
  getDevice(childId: string): Promise<WatchDevice | null>;
  setConnection(deviceId: string, state: DeviceConnection): Promise<void>;
  setBattery(deviceId: string, percent: number): Promise<void>;
}

export interface LocationService {
  getLatest(childId: string): Promise<LocationSample | null>;
  getHistory(childId: string, from: string, to: string): Promise<LocationSample[]>;
  setSimulatedLocation(sample: LocationSample): Promise<void>;
  playRoute(routeId: string): AsyncIterable<LocationSample>;
}

export interface SafeZoneService {
  list(childId: string): Promise<SafeZone[]>;
  create(input: Omit<SafeZone, 'id' | 'createdAt' | 'updatedAt'>): Promise<SafeZone>;
  update(zone: SafeZone): Promise<SafeZone>;
  remove(zoneId: string): Promise<void>;
}

export interface AlertService {
  list(childId: string): Promise<AlertEvent[]>;
  createSimulated(input: Omit<AlertEvent, 'id' | 'occurredAt' | 'source' | 'demoOnly'>): Promise<AlertEvent>;
  markRead(alertId: string): Promise<void>;
  acknowledge(alertId: string): Promise<void>;
}

export interface GrowthService {
  createTask(input: NewTaskInput): Promise<Task>;
  updateTask(task: Task): Promise<Task>;
  simulateCompletion(taskId: string): Promise<{ task: Task; transaction?: CoinTransaction }>;
  listTasks(childId: string, range: DateRange): Promise<Task[]>;
  getCoinBalance(childId: string): Promise<number>;
  listCoinTransactions(childId: string): Promise<CoinTransaction[]>;
}

export interface AssistantService {
  ask(input: { text: string; context: DemoContext }): Promise<AssistantReply>;
}
```

## Implementations
- `MockDeviceService`
- `MockLocationService`
- `LocalSafeZoneService`
- `LocalAlertService`
- `LocalGrowthService`
- `KnowledgeBaseAssistantService`
- `IndexedDbStorageAdapter`

Future implementation names may include `ApiDeviceService`, `ApiLocationService`, etc., but do not implement remote versions in v1.

## Event bus
Use a typed event bus or store actions for events such as:
- `device.connection.changed`
- `device.battery.changed`
- `location.updated`
- `safezone.entered`
- `safezone.exited`
- `alert.created`
- `alert.acknowledged`
- `task.created`
- `task.completed.simulated`
- `coin.earned`
- `subscription.changed`

One simulator action should update the underlying domain store and then publish the event. Screens subscribe to store state, not ad-hoc event chains.

## Determinism
- Inject a `ClockAdapter` for timestamps.
- Curated scenarios use fixed event sequences and fixed sample coordinates.
- Tests use a fake clock and known seeds.
- A reset restores the same initial state.
- Random generation is not allowed in the primary demo scenarios.

## Error behavior
- Storage errors surface a clear retry/reload path.
- Notification permission denial does not block in-app alerts.
- Map load failure shows a fallback map and keeps location details accessible.
- WebGL failure falls back to static product artwork.
- Unknown AI intent returns a safe “not in my verified demo information” answer and support option.
