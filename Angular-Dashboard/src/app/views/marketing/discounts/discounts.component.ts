import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { DiscountService } from './discount.service';
import { Discount } from '../../../core/models/marketing.model';
import { CATEGORIES_MOCK } from '../../../core/mock-data/categories.mock';
import { ToastService } from '../../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-discounts',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './discounts.component.html',
})
export class DiscountsComponent {
  private readonly svc = inject(DiscountService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  readonly categories = CATEGORIES_MOCK;

  search = '';
  editingId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    type: ['percentage' as Discount['type']],
    value: [0],
    appliesTo: ['all' as Discount['appliesTo']],
    targetName: ['All Products'],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    status: ['active' as Discount['status']],
  });

  get discounts(): Discount[] {
    const term = this.search.trim().toLowerCase();
    const list = [...this.svc.all].sort((a, b) => a.name.localeCompare(b.name));
    return term ? list.filter((d) => d.name.toLowerCase().includes(term)) : list;
  }

  valueLabel(discount: Discount): string {
    return discount.type === 'percentage' ? `${discount.value}% off` : `₹${discount.value} off`;
  }

  onSearch(value: string): void {
    this.search = value;
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', type: 'percentage', value: 0, appliesTo: 'all', targetName: 'All Products', startDate: '', endDate: '', status: 'active' });
  }

  openEdit(discount: Discount): void {
    this.editingId.set(discount.id);
    this.form.reset({
      name: discount.name,
      type: discount.type,
      value: discount.value,
      appliesTo: discount.appliesTo,
      targetName: discount.targetName,
      startDate: discount.startDate,
      endDate: discount.endDate,
      status: discount.status,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const targetName = raw.appliesTo === 'all' ? 'All Products' : raw.targetName;
    const payload = { ...raw, targetName };
    const id = this.editingId();
    if (id) {
      this.svc.update(id, payload).subscribe(() => this.toast.success('Discount updated.'));
    } else {
      this.svc.create(payload).subscribe(() => this.toast.success('Discount created.'));
    }
  }

  toggleStatus(discount: Discount): void {
    this.svc.update(discount.id, { status: discount.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

  remove(discount: Discount): void {
    this.confirm.confirm({ message: `Delete discount "${discount.name}"? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(discount.id).subscribe(() => this.toast.success('Discount deleted.'));
      });
  }
}
