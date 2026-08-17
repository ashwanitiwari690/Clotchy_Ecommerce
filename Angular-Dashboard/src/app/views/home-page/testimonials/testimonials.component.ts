import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { TestimonialService } from './testimonial.service';
import { Testimonial } from '../../../core/models/homepage.model';
import { placeholderImage } from '../../../core/models/common.model';
import { ToastService } from '../../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { UploadedImage } from '../../../shared/components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './testimonials.component.html',
})
export class TestimonialsComponent {
  private readonly svc = inject(TestimonialService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  editingId = signal<string | null>(null);
  images = signal<UploadedImage[]>([]);
  readonly stars = [1, 2, 3, 4, 5];

  form = this.fb.nonNullable.group({
    customerName: ['', Validators.required],
    rating: [5],
    review: ['', Validators.required],
    date: [new Date().toISOString().slice(0, 10)],
    status: ['pending' as Testimonial['status']],
  });

  get testimonials(): Testimonial[] {
    return [...this.svc.all].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  openAdd(): void {
    this.editingId.set(null);
    this.images.set([]);
    this.form.reset({ customerName: '', rating: 5, review: '', date: new Date().toISOString().slice(0, 10), status: 'pending' });
  }

  openEdit(t: Testimonial): void {
    this.editingId.set(t.id);
    this.images.set([{ url: t.customerImage, name: t.customerName }]);
    this.form.reset({ customerName: t.customerName, rating: t.rating, review: t.review, date: t.date, status: t.status });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const customerImage = this.images()[0]?.url ?? placeholderImage(raw.customerName || 'testimonial', 150, 150);
    const id = this.editingId();
    if (id) {
      this.svc.update(id, { ...raw, customerImage }).subscribe(() => this.toast.success('Testimonial updated.'));
    } else {
      const maxOrder = Math.max(0, ...this.svc.all.map((t) => t.displayOrder));
      this.svc.create({ ...raw, customerImage, displayOrder: maxOrder + 1 }).subscribe(() => this.toast.success('Testimonial created.'));
    }
  }

  approve(t: Testimonial): void {
    this.svc.update(t.id, { status: 'approved' }).subscribe(() => this.toast.success('Testimonial approved.'));
  }

  hide(t: Testimonial): void {
    this.svc.update(t.id, { status: 'hidden' }).subscribe(() => this.toast.success('Testimonial hidden.'));
  }

  move(t: Testimonial, direction: 'up' | 'down'): void {
    this.svc.move(t.id, direction);
  }

  remove(t: Testimonial): void {
    this.confirm.confirm({ message: `Delete this testimonial from ${t.customerName}? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(t.id).subscribe(() => this.toast.success('Testimonial deleted.'));
      });
  }
}
