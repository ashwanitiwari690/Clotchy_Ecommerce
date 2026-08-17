import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { CouponService } from './coupon.service';
import { Coupon } from '../../../core/models/marketing.model';
import { ToastService } from '../../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective, DecimalPipe],
  templateUrl: './coupons.component.html',
})
export class CouponsComponent {
  private readonly svc = inject(CouponService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  search = '';
  editingId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    code: ['', Validators.required],
    discountType: ['percentage' as Coupon['discountType']],
    discountValue: [0],
    minOrder: [0],
    maxDiscount: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    usageLimit: [100],
    status: ['active' as Coupon['status']],
  });

  get coupons(): Coupon[] {
    const term = this.search.trim().toLowerCase();
    const list = [...this.svc.all].sort((a, b) => a.code.localeCompare(b.code));
    return term ? list.filter((c) => c.code.toLowerCase().includes(term)) : list;
  }

  discountLabel(coupon: Coupon): string {
    if (coupon.discountType === 'free-shipping') return 'Free Shipping';
    if (coupon.discountType === 'percentage') return `${coupon.discountValue}%`;
    return `₹${coupon.discountValue}`;
  }

  onSearch(value: string): void {
    this.search = value;
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form.reset({ code: '', discountType: 'percentage', discountValue: 0, minOrder: 0, maxDiscount: '', startDate: '', endDate: '', usageLimit: 100, status: 'active' });
  }

  openEdit(coupon: Coupon): void {
    this.editingId.set(coupon.id);
    this.form.reset({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrder: coupon.minOrder,
      maxDiscount: coupon.maxDiscount == null ? '' : String(coupon.maxDiscount),
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      usageLimit: coupon.usageLimit,
      status: coupon.status,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload = {
      code: raw.code.toUpperCase(),
      discountType: raw.discountType,
      discountValue: raw.discountType === 'free-shipping' ? 0 : Number(raw.discountValue),
      minOrder: Number(raw.minOrder),
      maxDiscount: raw.maxDiscount === '' ? null : Number(raw.maxDiscount),
      startDate: raw.startDate,
      endDate: raw.endDate,
      usageLimit: Number(raw.usageLimit),
      status: raw.status,
    };
    const id = this.editingId();
    if (id) {
      this.svc.update(id, payload).subscribe(() => this.toast.success('Coupon updated.'));
    } else {
      this.svc.create({ ...payload, usedCount: 0 }).subscribe(() => this.toast.success('Coupon created.'));
    }
  }

  toggleStatus(coupon: Coupon): void {
    this.svc.update(coupon.id, { status: coupon.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

  remove(coupon: Coupon): void {
    this.confirm.confirm({ message: `Delete coupon "${coupon.code}"? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(coupon.id).subscribe(() => this.toast.success('Coupon deleted.'));
      });
  }
}
