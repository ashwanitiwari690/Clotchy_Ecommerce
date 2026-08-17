import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { CategoryService } from './category.service';
import { Category } from '../../core/models/category.model';
import { placeholderImage } from '../../core/models/common.model';
import { ToastService } from '../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../shared/components/confirm-dialog/confirm-dialog.service';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent {
  private readonly svc = inject(CategoryService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  search = '';
  editingId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
    parentId: [''],
    description: [''],
    status: ['active' as 'active' | 'inactive'],
  });

  get categories(): Category[] {
    const term = this.search.trim().toLowerCase();
    const list = [...this.svc.all].sort((a, b) => a.sortOrder - b.sortOrder);
    return term ? list.filter((c) => c.name.toLowerCase().includes(term)) : list;
  }

  get parentOptions(): Category[] {
    return this.svc.all.filter((c) => c.id !== this.editingId());
  }

  productCount(id: string): number {
    return this.svc.productCount(id);
  }

  parentName(cat: Category): string {
    if (!cat.parentId) return '—';
    return this.svc.getById(cat.parentId)?.name ?? '—';
  }

  onSearch(value: string): void {
    this.search = value;
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', slug: '', parentId: '', description: '', status: 'active' });
  }

  openEdit(cat: Category): void {
    this.editingId.set(cat.id);
    this.form.reset({
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId ?? '',
      description: cat.description ?? '',
      status: cat.status,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const id = this.editingId();
    if (id) {
      this.svc.update(id, { ...raw, parentId: raw.parentId || null }).subscribe(() => this.toast.success('Category updated.'));
    } else {
      const maxOrder = Math.max(0, ...this.svc.all.map((c) => c.sortOrder));
      this.svc.create({
        ...raw,
        parentId: raw.parentId || null,
        image: placeholderImage(raw.slug || 'category', 400, 400),
        sortOrder: maxOrder + 1,
      }).subscribe(() => this.toast.success('Category created.'));
    }
  }

  toggleStatus(cat: Category): void {
    this.svc.update(cat.id, { status: cat.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

  remove(cat: Category): void {
    this.confirm.confirm({ message: `Delete category "${cat.name}"? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) {
          this.svc.delete(cat.id).subscribe(() => this.toast.success('Category deleted.'));
        }
      });
  }

  move(cat: Category, direction: 'up' | 'down'): void {
    this.svc.move(cat.id, direction);
  }
}
