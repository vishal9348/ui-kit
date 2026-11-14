import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

import type { UiChipColor, UiChipSize, UiChipVariant } from './ui-chip.types';

@Component({
  selector: 'ui-chip',
  standalone: true,
  templateUrl: './ui-chip.component.html',
  styleUrl: './ui-chip.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-chip-host',
  },
})
export class UiChipComponent {
  readonly variant = input<UiChipVariant>('soft');
  readonly color = input<UiChipColor>('neutral');
  readonly size = input<UiChipSize>('md');

  readonly selectable = input(false);
  readonly removable = input(false);
  readonly disabled = input(false);

  readonly selected = model(false);

  readonly selectionChange = output<boolean>();
  readonly removed = output<void>();

  onSelect(): void {
    if (this.disabled() || !this.selectable()) {
      return;
    }

    const nextValue = !this.selected();

    this.selected.set(nextValue);
    this.selectionChange.emit(nextValue);
  }

  onRemove(): void {
    if (this.disabled() || !this.removable()) {
      return;
    }

    this.removed.emit();
  }
}
