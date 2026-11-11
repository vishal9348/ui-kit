import { Injectable, computed, signal } from '@angular/core';

import { UiToast, UiToastConfig, UiToastPosition } from './ui-toast.types';

@Injectable({
  providedIn: 'root',
})
export class UiToastService {
  private readonly toastList = signal<UiToast[]>([]);

  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  private readonly pausedTimers = new Map<number, number>();

  private nextId = 0;

  readonly position = signal<UiToastPosition>('top-right');

  readonly toasts = computed(() => this.toastList());

  readonly count = computed(() => this.toastList().length);
  private readonly startedAt = new Map<number, number>();

  private readonly remainingTime = new Map<number, number>();

  setPosition(position: UiToastPosition): void {
    this.position.set(position);
  }

  show(config: UiToastConfig): number {
    const id = ++this.nextId;

    const toast: UiToast = {
      ...config,
      id,
      variant: config.variant ?? 'info',
      duration: Math.max(0, config.duration ?? 4000),
      closable: config.closable ?? true,
    };

    this.toastList.update((items) => [...items, toast]);

    if (toast.duration > 0) {
      this.startTimer(id, toast.duration);
    }

    return id;
  }

  success(message: string, title?: string): number {
    return this.show({ message, title, variant: 'success' });
  }

  error(message: string, title?: string): number {
    return this.show({ message, title, variant: 'error' });
  }

  warning(message: string, title?: string): number {
    return this.show({ message, title, variant: 'warning' });
  }

  info(message: string, title?: string): number {
    return this.show({ message, title, variant: 'info' });
  }

  dismiss(id: number): void {
    this.clearTimer(id);
    this.pausedTimers.delete(id);

    this.toastList.update((items) => items.filter((item) => item.id !== id));
  }

  dismissAll(): void {
    for (const id of this.timers.keys()) {
      this.clearTimer(id);
    }

    this.pausedTimers.clear();
    this.toastList.set([]);
  }

  pause(id: number): void {
    const timer = this.timers.get(id);

    if (!timer) {
      return;
    }

    clearTimeout(timer);
    this.timers.delete(id);

    const started = this.startedAt.get(id) ?? Date.now();
    const remaining = this.remainingTime.get(id) ?? 0;

    this.remainingTime.set(id, Math.max(0, remaining - (Date.now() - started)));

    this.startedAt.delete(id);
  }

  resume(id: number): void {
    const remaining = this.remainingTime.get(id);

    if (remaining === undefined) {
      return;
    }

    if (remaining <= 0) {
      this.dismiss(id);
      return;
    }

    this.startTimer(id, remaining);
  }

  private startTimer(id: number, duration: number): void {
    this.clearTimer(id);

    this.remainingTime.set(id, duration);
    this.startedAt.set(id, Date.now());

    const timer = setTimeout(() => {
      this.dismiss(id);
    }, duration);

    this.timers.set(id, timer);
  }

  private clearTimer(id: number): void {
    const timer = this.timers.get(id);

    if (timer) {
      clearTimeout(timer);
    }

    this.timers.delete(id);
    this.startedAt.delete(id);
    this.remainingTime.delete(id);
  }
}
