import { Component, inject, signal } from '@angular/core';
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

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
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
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const image = this.imageItems()[0]?.url ?? placeholderImage(raw.slug || 'collection', 800, 600);
    const id = this.editingId();
    if (id) {
      this.svc.update(id, { ...raw, image }).subscribe(() => this.toast.success('Collection updated.'));
    } else {
      this.svc.create({ ...raw, image }).subscribe(() => this.toast.success('Collection created.'));
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
