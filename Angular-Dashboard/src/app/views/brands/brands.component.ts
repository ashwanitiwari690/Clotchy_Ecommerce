import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { BrandService } from './brand.service';
import { Brand } from '../../core/models/brand.model';
import { placeholderImage } from '../../core/models/common.model';
import { ToastService } from '../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../shared/components/confirm-dialog/confirm-dialog.service';
import { UploadedImage } from '../../shared/components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './brands.component.html',
})
export class BrandsComponent {
  private readonly svc = inject(BrandService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  search = '';
  editingId = signal<string | null>(null);
  logoImages = signal<UploadedImage[]>([]);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    status: ['active' as 'active' | 'inactive'],
  });

  get brands(): Brand[] {
    const term = this.search.trim().toLowerCase();
    const list = [...this.svc.all].sort((a, b) => a.name.localeCompare(b.name));
    return term ? list.filter((b) => b.name.toLowerCase().includes(term)) : list;
  }

  onSearch(value: string): void {
    this.search = value;
  }

  openAdd(): void {
    this.editingId.set(null);
    this.logoImages.set([]);
    this.form.reset({ name: '', slug: '', status: 'active' });
  }

  openEdit(brand: Brand): void {
    this.editingId.set(brand.id);
    this.logoImages.set([{ url: brand.logo, name: brand.name }]);
    this.form.reset({ name: brand.name, slug: brand.slug, status: brand.status });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const logo = this.logoImages()[0]?.url ?? placeholderImage(raw.slug || 'brand', 200, 200);
    const id = this.editingId();
    if (id) {
      this.svc.update(id, { ...raw, logo }).subscribe(() => this.toast.success('Brand updated.'));
    } else {
      this.svc.create({ ...raw, logo }).subscribe(() => this.toast.success('Brand created.'));
    }
  }

  toggleStatus(brand: Brand): void {
    this.svc.update(brand.id, { status: brand.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

  remove(brand: Brand): void {
    this.confirm.confirm({ message: `Delete brand "${brand.name}"? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(brand.id).subscribe(() => this.toast.success('Brand deleted.'));
      });
  }
}
