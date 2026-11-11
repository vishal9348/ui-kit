import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { UiProgressBarConfig, UiProgressSize, UiProgressVariant } from './ui-progress-bar.types';

@Component({
  selector: 'ui-progress-bar',
  standalone: true,
  templateUrl: './ui-progress-bar.component.html',
  styleUrl: './ui-progress-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiProgressBarComponent {
  readonly config = input<UiProgressBarConfig>({});

  readonly value = input<number | undefined>();

  readonly min = input<number | undefined>();

  readonly max = input<number | undefined>();

  readonly size = input<UiProgressSize | undefined>();

  readonly variant = input<UiProgressVariant | undefined>();

  readonly label = input<string | undefined>();

  readonly showValue = input<boolean | undefined>();

  readonly indeterminate = input<boolean | undefined>();

  readonly striped = input<boolean | undefined>();

  readonly animated = input<boolean | undefined>();

  readonly resolvedMin = computed(() => this.min() ?? this.config().min ?? 0);

  readonly resolvedMax = computed(() => this.max() ?? this.config().max ?? 100);

  readonly resolvedValue = computed(() => this.value() ?? this.config().value ?? 0);

  readonly resolvedSize = computed(() => this.size() ?? this.config().size ?? 'md');

  readonly resolvedVariant = computed(() => this.variant() ?? this.config().variant ?? 'primary');

  readonly resolvedLabel = computed(() => this.label() ?? this.config().label ?? '');

  readonly isIndeterminate = computed(
    () => this.indeterminate() ?? this.config().indeterminate ?? false,
  );

  readonly shouldShowValue = computed(() => this.showValue() ?? this.config().showValue ?? true);

  readonly isStriped = computed(() => this.striped() ?? this.config().striped ?? false);

  readonly isAnimated = computed(() => this.animated() ?? this.config().animated ?? false);

  readonly percentage = computed(() => {
    const min = this.resolvedMin();
    const max = this.resolvedMax();
    const value = this.resolvedValue();

    if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(value) || max <= min) {
      return 0;
    }

    const percentage = ((value - min) / (max - min)) * 100;

    return Math.min(100, Math.max(0, percentage));
  });

  readonly displayValue = computed(() => `${Math.round(this.percentage())}%`);
}
