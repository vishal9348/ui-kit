import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, expect, it, vi } from 'vitest';

import { UiDropdownComponent } from './ui-dropdown.component';

describe('UiDropdownComponent', () => {
  let fixture: ComponentFixture<UiDropdownComponent>;
  let component: UiDropdownComponent;

  const options = [
    { label: 'Engineering', value: 101 },
    { label: 'Finance', value: 102 },
    { label: 'Human Resources', value: 103 },
    { label: 'Disabled Department', value: 104, disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDropdownComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDropdownComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('options', options);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the placeholder initially', () => {
    expect(component.selectedLabel()).toBe('');
    expect(component.hasSelection()).toBe(false);
  });

  it('should open the dropdown', () => {
    component.openDropdown();

    expect(component.isOpen()).toBe(true);
  });

  it('should select an option', () => {
    component.selectOption(options[0]);

    expect(component.selectedValue()).toBe(101);
    expect(component.selectedLabel()).toBe('Engineering');
  });

  it('should emit selectionChange', () => {
    const spy = vi.fn();

    component.selectionChange.subscribe(spy);

    component.selectOption(options[1]);

    expect(spy).toHaveBeenCalledWith(102);
  });

  it('should filter options', () => {
    component.updateSearch('finance');

    expect(component.filteredOptions()).toHaveLength(1);
    expect(component.filteredOptions()[0].value).toBe(102);
  });

  it('should not select disabled options', () => {
    component.selectOption(options[3]);

    expect(component.selectedValue()).toBeNull();
  });

  it('should support multiple selection', () => {
    fixture.componentRef.setInput('multiple', true);

    component.selectOption(options[0]);
    component.selectOption(options[1]);

    expect(component.selectedValue()).toEqual([101, 102]);
  });

  it('should remove an option in multiple selection mode', () => {
    fixture.componentRef.setInput('multiple', true);

    component.selectOption(options[0]);
    component.selectOption(options[1]);
    component.selectOption(options[0]);

    expect(component.selectedValue()).toEqual([102]);
  });

  it('should support ControlValueAccessor writeValue', () => {
    component.writeValue(102);

    expect(component.selectedValue()).toBe(102);
    expect(component.selectedLabel()).toBe('Finance');
  });

  it('should update the form disabled state', () => {
    component.setDisabledState(true);

    expect(component.isDisabled()).toBe(true);
  });

  it('should clear the selection', () => {
    component.writeValue(101);

    component.clearSelection();

    expect(component.selectedValue()).toBeNull();
  });

  it('should notify the form when selection changes', () => {
    const spy = vi.fn();

    component.registerOnChange(spy);

    component.selectOption(options[0]);

    expect(spy).toHaveBeenCalledWith(101);
  });

  it('should mark the control as touched when closed', () => {
    const spy = vi.fn();

    component.registerOnTouched(spy);

    component.openDropdown();
    component.closeDropdown();

    expect(spy).toHaveBeenCalledOnce();
  });
});
