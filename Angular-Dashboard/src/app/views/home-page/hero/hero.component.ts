import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { HeroService } from './hero.service';
import { HeroBanner } from '../../../core/models/homepage.model';
import { placeholderImage } from '../../../core/models/common.model';
import { ToastService } from '../../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { UploadedImage } from '../../../shared/components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  private readonly svc = inject(HeroService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  editingId = signal<string | null>(null);
  previewBanner = signal<HeroBanner | null>(null);
  desktopImages = signal<UploadedImage[]>([]);
  mobileImages = signal<UploadedImage[]>([]);

  form = this.fb.nonNullable.group({
    heading: ['', Validators.required],
    subheading: [''],
    description: [''],
    primaryButtonText: ['Shop Now'],
    primaryButtonLink: ['/shop'],
    secondaryButtonText: [''],
    secondaryButtonLink: [''],
    startDate: [''],
    endDate: [''],
    status: ['active' as HeroBanner['status']],
  });

  get banners(): HeroBanner[] {
    return [...this.svc.all].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  openAdd(): void {
    this.editingId.set(null);
    this.desktopImages.set([]);
    this.mobileImages.set([]);
    this.form.reset({ heading: '', subheading: '', description: '', primaryButtonText: 'Shop Now', primaryButtonLink: '/shop', secondaryButtonText: '', secondaryButtonLink: '', startDate: '', endDate: '', status: 'active' });
  }

  openEdit(banner: HeroBanner): void {
    this.editingId.set(banner.id);
    this.desktopImages.set([{ url: banner.desktopImage, name: banner.heading }]);
    this.mobileImages.set([{ url: banner.mobileImage, name: banner.heading }]);
    this.form.reset({
      heading: banner.heading,
      subheading: banner.subheading,
      description: banner.description,
      primaryButtonText: banner.primaryButtonText,
      primaryButtonLink: banner.primaryButtonLink,
      secondaryButtonText: banner.secondaryButtonText,
      secondaryButtonLink: banner.secondaryButtonLink,
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
    const desktopImage = this.desktopImages()[0]?.url ?? placeholderImage('hero-new-desktop', 1920, 800);
    const mobileImage = this.mobileImages()[0]?.url ?? placeholderImage('hero-new-mobile', 900, 1200);
    const id = this.editingId();
    if (id) {
      this.svc.update(id, { ...raw, desktopImage, mobileImage }).subscribe(() => this.toast.success('Hero banner updated.'));
    } else {
      const maxOrder = Math.max(0, ...this.svc.all.map((b) => b.displayOrder));
      this.svc.create({ ...raw, desktopImage, mobileImage, displayOrder: maxOrder + 1 }).subscribe(() => this.toast.success('Hero banner created.'));
    }
  }

  toggleStatus(banner: HeroBanner): void {
    this.svc.update(banner.id, { status: banner.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

  move(banner: HeroBanner, direction: 'up' | 'down'): void {
    this.svc.move(banner.id, direction);
  }

  preview(banner: HeroBanner): void {
    this.previewBanner.set(banner);
  }

  remove(banner: HeroBanner): void {
    this.confirm.confirm({ message: `Delete hero banner "${banner.heading}"? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(banner.id).subscribe(() => this.toast.success('Hero banner deleted.'));
      });
  }
}
