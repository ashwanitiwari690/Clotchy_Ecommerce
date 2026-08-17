import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { MarketingBannerService } from './marketing-banner.service';
import { MarketingBanner } from '../../../core/models/marketing.model';
import { placeholderImage } from '../../../core/models/common.model';
import { ToastService } from '../../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { UploadedImage } from '../../../shared/components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-marketing-banners',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './banners.component.html',
})
export class BannersComponent {
  private readonly svc = inject(MarketingBannerService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  search = '';
  editingId = signal<string | null>(null);
  images = signal<UploadedImage[]>([]);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    link: [''],
    position: ['top' as MarketingBanner['position']],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    status: ['active' as MarketingBanner['status']],
  });

  get banners(): MarketingBanner[] {
    const term = this.search.trim().toLowerCase();
    const list = [...this.svc.all].sort((a, b) => a.title.localeCompare(b.title));
    return term ? list.filter((b) => b.title.toLowerCase().includes(term)) : list;
  }

  onSearch(value: string): void {
    this.search = value;
  }

  openAdd(): void {
    this.editingId.set(null);
    this.images.set([]);
    this.form.reset({ title: '', link: '', position: 'top', startDate: '', endDate: '', status: 'active' });
  }

  openEdit(banner: MarketingBanner): void {
    this.editingId.set(banner.id);
    this.images.set([{ url: banner.image, name: banner.title }]);
    this.form.reset({
      title: banner.title,
      link: banner.link,
      position: banner.position,
      startDate: banner.startDate,
      endDate: banner.endDate,
      status: banner.status,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const image = this.images()[0]?.url ?? placeholderImage(raw.title || 'banner', 800, 200);
    const id = this.editingId();
    if (id) {
      this.svc.update(id, { ...raw, image }).subscribe(() => this.toast.success('Banner updated.'));
    } else {
      this.svc.create({ ...raw, image }).subscribe(() => this.toast.success('Banner created.'));
    }
  }

  toggleStatus(banner: MarketingBanner): void {
    this.svc.update(banner.id, { status: banner.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

  remove(banner: MarketingBanner): void {
    this.confirm.confirm({ message: `Delete banner "${banner.title}"? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(banner.id).subscribe(() => this.toast.success('Banner deleted.'));
      });
  }
}
