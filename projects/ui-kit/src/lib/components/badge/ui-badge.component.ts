import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { UiBadgeShape, UiBadgeSize, UiBadgeVariant } from './ui-badge.types';

@Component({
  selector: 'ui-badge',
  standalone: true,
  templateUrl: './ui-badge.component.html',
  styleUrl: './ui-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBadgeComponent {
  readonly label = input<string>('');

  readonly count = input<number | null>(null);

  readonly maxCount = input<number>(99);

  readonly variant = input<UiBadgeVariant>('primary');

  readonly size = input<UiBadgeSize>('md');

  readonly shape = input<UiBadgeShape>('pill');

  readonly dot = input<boolean>(false);

  readonly showZero = input<boolean>(false);

  readonly ariaLabel = input<string>('');

  readonly visible = computed(() => {
    const count = this.count();

    if (count === null) {
      return true;
    }

    return count > 0 || this.showZero();
  });

  readonly displayCount = computed(() => {
    const count = this.count();

    if (count === null) {
      return '';
    }

    const max = Math.max(0, this.maxCount());

    return count > max ? `${max}+` : `${count}`;
  });

  readonly accessibleLabel = computed(() => {
    const customLabel = this.ariaLabel().trim();

    if (customLabel) {
      return customLabel;
    }

    if (this.count() !== null) {
      return `${this.count()} notifications`;
    }

    return this.label() || 'Badge';
  });
}
