import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { StaticPageService } from './static-page.service';
import { StaticPage } from '../../core/models/static-page.model';
import { ToastService } from '../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../shared/components/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-static-pages',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './static-pages.component.html',
})
export class StaticPagesComponent {
  private readonly svc = inject(StaticPageService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  search = '';
  editingId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    title: ['', Validators.required],
    content: ['', Validators.required],
    status: ['active' as StaticPage['status']],
  });

  get pages(): StaticPage[] {
    const term = this.search.trim().toLowerCase();
    const list = [...this.svc.all].sort((a, b) => a.title.localeCompare(b.title));
    return term ? list.filter((p) => p.title.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term)) : list;
  }

  onSearch(value: string): void {
    this.search = value;
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form.reset({ slug: '', title: '', content: '', status: 'active' });
    this.form.get('slug')?.enable();
  }

  openEdit(page: StaticPage): void {
    this.editingId.set(page.id);
    this.form.reset({ slug: page.slug, title: page.title, content: page.content, status: page.status });
    this.form.get('slug')?.disable();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const id = this.editingId();
    if (id) {
      this.svc.update(id, raw).subscribe(() => this.toast.success('Page updated.'));
    } else {
      this.svc.create(raw).subscribe(() => this.toast.success('Page created.'));
    }
  }

  toggleStatus(page: StaticPage): void {
    this.svc.update(page.id, { status: page.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

  remove(page: StaticPage): void {
    this.confirm
      .confirm({ message: `Delete page "${page.title}"? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(page.id).subscribe(() => this.toast.success('Page deleted.'));
      });
  }
}
