import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { CollectionService } from './collection.service';
import { Collection } from '../../core/models/collection.model';
import { placeholderImage } from '../../core/models/common.model';
import { ToastService } from '../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../shared/components/confirm-dialog/confirm-dialog.service';
import { UploadedImage } from '../../shared/components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './collections.component.html',
})
export class CollectionsComponent {
  private readonly svc = inject(CollectionService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  search = '';
  editingId = signal<string | null>(null);
  imageItems = signal<UploadedImage[]>([]);
  modalVisible = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    description: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    status: ['active' as 'active' | 'inactive'],
    featured: [false],
  });

  get collections(): Collection[] {
    const term = this.search.trim().toLowerCase();
    const list = [...this.svc.all].sort((a, b) => a.name.localeCompare(b.name));
    return term ? list.filter((c) => c.name.toLowerCase().includes(term)) : list;
  }

  productCount(id: string): number {
    return this.svc.productCount(id);
  }

  onSearch(value: string): void {
    this.search = value;
  }

  openAdd(): void {
    this.editingId.set(null);
    this.imageItems.set([]);
    this.form.reset({ name: '', slug: '', description: '', startDate: '', endDate: '', status: 'active', featured: false });
    this.modalVisible.set(true);
  }

  openEdit(col: Collection): void {
    this.editingId.set(col.id);
    this.imageItems.set([{ url: col.image, name: col.name }]);
    this.form.reset({
      name: col.name,
      slug: col.slug,
      description: col.description,
      startDate: col.startDate,
      endDate: col.endDate,
      status: col.status,
      featured: col.featured,
    });
    this.modalVisible.set(true);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please fill in all required fields.');
      return;
    }
    const raw = this.form.getRawValue();
    const image = this.imageItems()[0]?.url ?? placeholderImage(raw.slug || 'collection', 800, 600);
    const id = this.editingId();
    const onError = (err: HttpErrorResponse) => this.toast.error(err.error?.message ?? 'Failed to save collection.');
    if (id) {
      this.svc.update(id, { ...raw, image }).subscribe({
        next: () => {
          this.toast.success('Collection updated.');
          this.modalVisible.set(false);
        },
        error: onError,
      });
    } else {
      this.svc.create({ ...raw, image }).subscribe({
        next: () => {
          this.toast.success('Collection created.');
          this.modalVisible.set(false);
        },
        error: onError,
      });
    }
  }

  toggleStatus(col: Collection): void {
    this.svc.update(col.id, { status: col.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

  remove(col: Collection): void {
    this.confirm.confirm({ message: `Delete collection "${col.name}"? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(col.id).subscribe(() => this.toast.success('Collection deleted.'));
      });
  }
}
