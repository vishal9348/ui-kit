import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { UiButtonComponent } from './ui-button.component';

describe('UiButtonComponent', () => {
  let fixture: ComponentFixture<UiButtonComponent>;
  let component: UiButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiButtonComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the primary variant by default', () => {
    const button = fixture.nativeElement.querySelector('button');

    expect(button.classList.contains('ui-button--primary')).toBe(true);
  });

  it('should use the configured variant', () => {
    fixture.componentRef.setInput('config', {
      variant: 'danger',
    });

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button.classList.contains('ui-button--danger')).toBe(true);
  });

  it('should disable the button when configured', () => {
    fixture.componentRef.setInput('config', {
      disabled: true,
    });

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(true);
  });

  it('should disable the button when loading', () => {
    fixture.componentRef.setInput('config', {
      loading: true,
    });

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  it('should emit clicked when clicked', () => {
    const spy = vi.fn();

    component.clicked.subscribe(spy);

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not emit clicked when disabled', () => {
    const spy = vi.fn();

    component.clicked.subscribe(spy);

    fixture.componentRef.setInput('config', {
      disabled: true,
    });

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should use direct variant input', () => {
  fixture.componentRef.setInput('variant', 'danger');
  fixture.detectChanges();

  expect(component.resolvedVariant()).toBe('danger');
});

it('should prioritize direct input over config', () => {
  fixture.componentRef.setInput('config', {
    variant: 'secondary',
  });

  fixture.componentRef.setInput('variant', 'danger');
  fixture.detectChanges();

  expect(component.resolvedVariant()).toBe('danger');
});

it('should emit the native click event', () => {
  const spy = vi.fn();

  component.clicked.subscribe(spy);

  const button: HTMLButtonElement =
    fixture.nativeElement.querySelector('button');

  button.click();

  expect(spy).toHaveBeenCalledOnce();
  expect(spy.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
});

it('should support icon-only mode', () => {
  fixture.componentRef.setInput('iconOnly', true);
  fixture.componentRef.setInput('ariaLabel', 'Delete employee');
  fixture.detectChanges();

  const button: HTMLButtonElement =
    fixture.nativeElement.querySelector('button');

  expect(button.classList.contains('ui-button--icon-only')).toBe(true);
  expect(button.getAttribute('aria-label')).toBe('Delete employee');
});
});
