import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { HomePromotionService } from './home-promotion.service';
import { HomePromotion } from '../../../core/models/homepage.model';
import { placeholderImage } from '../../../core/models/common.model';
import { ToastService } from '../../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { UploadedImage } from '../../../shared/components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-home-promotions',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './promotions.component.html',
})
export class PromotionsComponent {
  private readonly svc = inject(HomePromotionService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  editingId = signal<string | null>(null);
  images = signal<UploadedImage[]>([]);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    buttonText: ['Shop Now'],
    buttonUrl: ['/shop'],
    discount: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    status: ['active' as HomePromotion['status']],
  });

  get promotions(): HomePromotion[] {
    return this.svc.all;
  }

  openAdd(): void {
    this.editingId.set(null);
    this.images.set([]);
    this.form.reset({ title: '', description: '', buttonText: 'Shop Now', buttonUrl: '/shop', discount: '', startDate: '', endDate: '', status: 'active' });
  }

  openEdit(promo: HomePromotion): void {
    this.editingId.set(promo.id);
    this.images.set([{ url: promo.bannerImage, name: promo.title }]);
    this.form.reset({
      title: promo.title,
      description: promo.description,
      buttonText: promo.buttonText,
      buttonUrl: promo.buttonUrl,
      discount: promo.discount,
      startDate: promo.startDate,
      endDate: promo.endDate,
      status: promo.status,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const bannerImage = this.images()[0]?.url ?? placeholderImage(raw.title || 'promo', 1600, 700);
    const id = this.editingId();
    if (id) {
      this.svc.update(id, { ...raw, bannerImage }).subscribe(() => this.toast.success('Promotion updated.'));
    } else {
      this.svc.create({ ...raw, bannerImage }).subscribe(() => this.toast.success('Promotion created.'));
    }
  }

  toggleStatus(promo: HomePromotion): void {
    this.svc.update(promo.id, { status: promo.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

  remove(promo: HomePromotion): void {
    this.confirm.confirm({ message: `Delete promotion "${promo.title}"? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(promo.id).subscribe(() => this.toast.success('Promotion deleted.'));
      });
  }
}
