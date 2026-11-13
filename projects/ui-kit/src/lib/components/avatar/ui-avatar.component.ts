import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  computed,
  input,
  signal,
} from '@angular/core';

import type { UiAvatarSize, UiAvatarShape, UiAvatarStatus } from './ui-avatar.types';

@Component({
  selector: 'ui-avatar',
  standalone: true,
  templateUrl: './ui-avatar.component.html',
  styleUrl: './ui-avatar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiAvatarComponent implements OnChanges {
  readonly src = input<string | null>(null);

  readonly name = input<string>('');

  readonly alt = input<string>('');

  readonly size = input<UiAvatarSize | number>('md');

  readonly shape = input<UiAvatarShape>('circle');

  readonly status = input<UiAvatarStatus | null>(null);

  readonly showStatus = input<boolean>(true);

  readonly imageFailed = signal(false);

  readonly initials = computed(() => {
    const name = this.name().trim();

    if (!name) return '';

    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  });

  readonly sizeStyle = computed(() => {
    const size = this.size();

    if (typeof size === 'number') {
      return `${size}px`;
    }

    const sizes: Record<UiAvatarSize, string> = {
      xs: '24px',
      sm: '32px',
      md: '40px',
      lg: '48px',
      xl: '64px',
    };

    return sizes[size];
  });

  readonly accessibleLabel = computed(() => {
    const name = this.alt().trim() || this.name().trim();

    if (!name) return 'Avatar';

    return this.status() ? `${name}, ${this.status()}` : name;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['src']) {
      this.imageFailed.set(false);
    }
  }

  onImageError(): void {
    this.imageFailed.set(true);
  }
}
