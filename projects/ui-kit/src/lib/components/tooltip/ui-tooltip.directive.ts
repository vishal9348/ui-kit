import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
  OutputRefSubscription,
} from '@angular/core';

import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';

import { ComponentPortal } from '@angular/cdk/portal';
// import { Subscription } from 'rxjs';

import { UiTooltipPanelComponent } from './ui-tooltip-panel.component';
import { UiTooltipPosition, UiTooltipTrigger } from './ui-tooltip.types';

@Directive({
  selector: '[uiTooltip]',
  standalone: true,
})
export class UiTooltipDirective implements OnDestroy {
  readonly tooltip = input<string | TemplateRef<unknown> | null>(null, { alias: 'uiTooltip' });

  readonly position = input<UiTooltipPosition>('top', { alias: 'uiTooltipPosition' });

  readonly delay = input<number>(300, { alias: 'uiTooltipDelay' });

  readonly hideDelay = input<number>(100, { alias: 'uiTooltipHideDelay' });

  readonly disabled = input<boolean>(false, { alias: 'uiTooltipDisabled' });

  readonly maxWidth = input<number>(240, { alias: 'uiTooltipMaxWidth' });

  readonly trigger = input<UiTooltipTrigger>('hover', { alias: 'uiTooltipTrigger' });

  readonly customClass = input<string>('', { alias: 'uiTooltipClass' });

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private overlayRef?: OverlayRef;
  private panelComponentRef?: ComponentRef<UiTooltipPanelComponent>;

  private showTimer?: ReturnType<typeof setTimeout>;
  private hideTimer?: ReturnType<typeof setTimeout>;

  private outsideClickSubscription?: OutputRefSubscription;
  private pointerEnteredSubscription?: OutputRefSubscription;
  private pointerLeftSubscription?: OutputRefSubscription;

  private readonly tooltipId = `ui-tooltip-${Math.random().toString(36).slice(2, 11)}`;

  private originalDescribedBy: string | null = null;
  private isVisible = false;

  private readonly positions: Record<UiTooltipPosition, ConnectedPosition[]> = {
    top: [
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -8,
      },
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 8,
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: -8,
      },
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetY: -8,
      },
    ],
    bottom: [
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 8,
      },
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -8,
      },
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: 8,
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 8,
      },
    ],
    left: [
      {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
        offsetX: -8,
      },
      {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetX: 8,
      },
    ],
    right: [
      {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetX: 8,
      },
      {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
        offsetX: -8,
      },
    ],
  };

  constructor() {
    effect(() => {
      const content = this.tooltip();
      const isDisabled = this.disabled();

      // Track configuration inputs.
      this.position();
      this.maxWidth();
      this.customClass();

      if (!content || isDisabled) {
        this.hide();
        return;
      }

      if (this.isVisible) {
        this.updatePanel();
      }
    });
  }

  @HostListener('mouseenter')
onMouseEnter(): void {
  if (this.trigger() !== 'hover') return;

  this.clearHideTimer();
  this.scheduleShow();
}

@HostListener('mouseleave')
onMouseLeave(): void {
  if (this.trigger() !== 'hover') return;

  this.scheduleHide();
}

@HostListener('focusin')
onFocusIn(): void {
  if (this.trigger() !== 'hover') return;

  this.clearHideTimer();
  this.scheduleShow();
}

@HostListener('focusout')
onFocusOut(): void {
  if (this.trigger() !== 'hover') return;

  this.scheduleHide();
}

  @HostListener('click')
  onClick(): void {
    if (this.trigger() !== 'click') return;

    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    this.hide();
  }

  private scheduleShow(): void {
    this.clearShowTimer();

    if (this.disabled() || !this.tooltip()) return;

    this.showTimer = setTimeout(() => this.show(), Math.max(0, this.delay()));
  }

  private scheduleHide(): void {
    this.clearHideTimer();

    this.hideTimer = setTimeout(() => this.hide(), Math.max(0, this.hideDelay()));
  }

  private show(): void {
    if (this.disabled() || !this.tooltip()) return;

    this.clearTimers();

    if (!this.overlayRef) {
      this.createOverlay();
    }

    if (!this.overlayRef || this.overlayRef.hasAttached()) return;

    const portal = new ComponentPortal(UiTooltipPanelComponent, this.viewContainerRef);

    this.panelComponentRef = this.overlayRef.attach(portal);

    this.updatePanel();

    this.pointerEnteredSubscription = this.panelComponentRef.instance.pointerEntered.subscribe(
      () => {
        this.clearHideTimer();
      },
    );

    this.pointerLeftSubscription = this.panelComponentRef.instance.pointerLeft.subscribe(() => {
      if (this.trigger() === 'hover') {
        this.scheduleHide();
      }
    });

    this.isVisible = true;
    this.addDescribedBy();

    if (this.trigger() === 'click') {
      this.outsideClickSubscription = this.overlayRef.outsidePointerEvents().subscribe(() => {
        this.hide();
      });
    }
  }

  private createOverlay(): void {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(this.positions[this.position()])
      .withFlexibleDimensions(false)
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: 'ui-tooltip-overlay-pane',
    });
  }

  private updatePanel(): void {
    if (!this.panelComponentRef) return;

    this.panelComponentRef.setInput('content', this.tooltip());
    this.panelComponentRef.setInput('tooltipId', this.tooltipId);
    this.panelComponentRef.setInput('maxWidth', this.maxWidth());
    this.panelComponentRef.setInput('customClass', this.customClass());

    this.overlayRef?.updatePositionStrategy(
      this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions(this.positions[this.position()])
        .withFlexibleDimensions(false)
        .withPush(true),
    );

    this.overlayRef?.updatePosition();
  }

  private addDescribedBy(): void {
    const host = this.elementRef.nativeElement;

    if (this.originalDescribedBy === null) {
      this.originalDescribedBy = host.getAttribute('aria-describedby') ?? '';
    }

    const ids = (this.originalDescribedBy ?? '').split(/\s+/).filter(Boolean);

    if (!ids.includes(this.tooltipId)) {
      ids.push(this.tooltipId);
    }

    host.setAttribute('aria-describedby', ids.join(' '));
  }

  private restoreDescribedBy(): void {
    const host = this.elementRef.nativeElement;

    if (this.originalDescribedBy) {
      host.setAttribute('aria-describedby', this.originalDescribedBy);
    } else {
      host.removeAttribute('aria-describedby');
    }

    this.originalDescribedBy = null;
  }

  private clearShowTimer(): void {
    if (this.showTimer !== undefined) {
      clearTimeout(this.showTimer);
      this.showTimer = undefined;
    }
  }

  private clearHideTimer(): void {
    if (this.hideTimer !== undefined) {
      clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }
  }

  private clearTimers(): void {
    this.clearShowTimer();
    this.clearHideTimer();
  }

  private hide(): void {
    this.clearTimers();

    if (!this.isVisible) return;

    this.isVisible = false;

    this.pointerEnteredSubscription?.unsubscribe();
    this.pointerLeftSubscription?.unsubscribe();
    this.outsideClickSubscription?.unsubscribe();

    this.pointerEnteredSubscription = undefined;
    this.pointerLeftSubscription = undefined;
    this.outsideClickSubscription = undefined;

    this.overlayRef?.detach();
    this.panelComponentRef = undefined;

    this.restoreDescribedBy();
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.hide();

    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }
}
