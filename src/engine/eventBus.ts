// CareOS Hospital Operating System — Event Bus
import { AgentId, HospitalEvent, HospitalEventName } from '../types/hospital';

type EventListener = (event: HospitalEvent) => void;

class HospitalEventBus {
  private listeners: Map<HospitalEventName | '*', Set<EventListener>> = new Map();
  private history: HospitalEvent[] = [];
  private maxHistory: number = 200;

  constructor() {
    this.listeners.set('*', new Set());
  }

  public subscribe(eventName: HospitalEventName | '*', listener: EventListener): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(listener);

    return () => {
      this.listeners.get(eventName)?.delete(listener);
    };
  }

  public publish(
    name: HospitalEventName,
    sourceAgent: AgentId,
    description: string,
    payload: Record<string, any> = {}
  ): HospitalEvent {
    const event: HospitalEvent = {
      id: `EVT-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      sourceAgent,
      description,
      payload,
    };

    // Store in history
    this.history.unshift(event);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }

    // Notify specific listeners
    const specific = this.listeners.get(name);
    if (specific) {
      specific.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error(`Error in event listener for ${name}:`, err);
        }
      });
    }

    // Notify wildcard listeners
    const wildcards = this.listeners.get('*');
    if (wildcards) {
      wildcards.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error(`Error in wildcard listener for ${name}:`, err);
        }
      });
    }

    return event;
  }

  public getHistory(): HospitalEvent[] {
    return [...this.history];
  }

  public clearHistory(): void {
    this.history = [];
  }
}

export const eventBus = new HospitalEventBus();
