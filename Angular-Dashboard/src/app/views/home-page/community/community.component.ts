import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { CommunityService } from './community.service';
import { CommunityImage } from '../../../core/models/homepage.model';
import { placeholderImage, generateId } from '../../../core/models/common.model';
import { ToastService } from '../../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import { UploadedImage } from '../../../shared/components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './community.component.html',
})
export class CommunityComponent {
  private readonly svc = inject(CommunityService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  editingId = signal<string | null>(null);
  images = signal<UploadedImage[]>([]);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    socialUrl: ['https://instagram.com/clotchy'],
    status: ['active' as CommunityImage['status']],
  });

  get images$(): CommunityImage[] {
    return [...this.svc.all].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  openAdd(): void {
    this.editingId.set(null);
    this.images.set([]);
    this.form.reset({ title: '', description: '', socialUrl: 'https://instagram.com/clotchy', status: 'active' });
  }

  openEdit(img: CommunityImage): void {
    this.editingId.set(img.id);
    this.images.set([{ url: img.image, name: img.title }]);
    this.form.reset({ title: img.title, description: img.description, socialUrl: img.socialUrl, status: img.status });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const image = this.images()[0]?.url ?? placeholderImage(generateId('community'), 500, 500);
    const id = this.editingId();
    if (id) {
      this.svc.update(id, { ...raw, image }).subscribe(() => this.toast.success('Community image updated.'));
    } else {
      const maxOrder = Math.max(0, ...this.svc.all.map((c) => c.displayOrder));
      this.svc.create({ ...raw, image, displayOrder: maxOrder + 1 }).subscribe(() => this.toast.success('Community image added.'));
    }
  }

  toggleStatus(img: CommunityImage): void {
    this.svc.update(img.id, { status: img.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

  move(img: CommunityImage, direction: 'up' | 'down'): void {
    this.svc.move(img.id, direction);
  }

  remove(img: CommunityImage): void {
    this.confirm.confirm({ message: `Remove this community image? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(img.id).subscribe(() => this.toast.success('Community image removed.'));
      });
  }
}
