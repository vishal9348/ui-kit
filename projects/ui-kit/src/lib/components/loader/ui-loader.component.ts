import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { UiLoaderConfig, UiLoaderSize, UiLoaderVariant } from './ui-loader.types';

@Component({
  selector: 'ui-loader',
  standalone: true,
  templateUrl: './ui-loader.component.html',
  styleUrl: './ui-loader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLoaderComponent {
  readonly config = input<UiLoaderConfig>({});

  readonly size = input<UiLoaderSize | undefined>();

  readonly variant = input<UiLoaderVariant | undefined>();

  readonly text = input<string | undefined>();

  readonly overlay = input<boolean | undefined>();

  readonly fullscreen = input<boolean | undefined>();

  readonly visible = input<boolean | undefined>();

  readonly resolvedSize = computed(() => this.size() ?? this.config().size ?? 'md');

  readonly resolvedVariant = computed(() => this.variant() ?? this.config().variant ?? 'primary');

  readonly resolvedText = computed(() => this.text() ?? this.config().text ?? '');

  readonly isOverlay = computed(() => this.overlay() ?? this.config().overlay ?? false);

  readonly isFullscreen = computed(() => this.fullscreen() ?? this.config().fullscreen ?? false);

  readonly isVisible = computed(() => this.visible() ?? this.config().visible ?? true);
}
