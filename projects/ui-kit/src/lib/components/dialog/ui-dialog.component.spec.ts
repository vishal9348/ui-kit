import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiDialogComponent } from './ui-dialog.component';

describe('UiDialogComponent', () => {
  let component: UiDialogComponent;
  let fixture: ComponentFixture<UiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
