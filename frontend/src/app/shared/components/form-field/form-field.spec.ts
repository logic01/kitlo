import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField } from './form-field';

@Component({
  imports: [ReactiveFormsModule, FormField],
  template: `
    <app-form-field label="Email" [control]="ctrl">
      <input type="email" [formControl]="ctrl" />
    </app-form-field>
  `,
})
class Host {
  readonly ctrl = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] });
}

describe('FormField', () => {
  it('does not render error text until the control is touched or dirty', async () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).not.toMatch(/Required/);
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('shows the resolved error message after touched', async () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    fixture.componentInstance.ctrl.markAsTouched();
    fixture.componentInstance.ctrl.updateValueAndValidity(); // triggers statusChanges
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toMatch(/Required/);
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
  });

  it('switches from required to email message as the user types', async () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    fixture.componentInstance.ctrl.markAsDirty();
    fixture.componentInstance.ctrl.setValue('not-an-email');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toMatch(/valid email/i);
  });

  it('clears the error once the value becomes valid', async () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    fixture.componentInstance.ctrl.markAsDirty();
    fixture.componentInstance.ctrl.setValue('not-an-email');
    fixture.detectChanges();
    fixture.componentInstance.ctrl.setValue('a@b.co');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });
});

@Component({
  imports: [FormField],
  template: `<app-form-field label="X" [error]="msg()" />`,
})
class ManualHost {
  readonly msg = signal<string | null>(null);
}

describe('FormField manual error override', () => {
  it('renders the manual error string when provided', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(ManualHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();

    fixture.componentInstance.msg.set('Custom problem.');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toMatch(/Custom problem/);
  });
});
