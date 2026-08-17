import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { FaqService } from './faq.service';
import { Faq } from '../../core/models/ticket.model';
import { ToastService } from '../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../shared/components/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './faq.component.html',
})
export class FaqComponent {
  private readonly svc = inject(FaqService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  search = '';
  editingId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    question: ['', Validators.required],
    answer: ['', Validators.required],
    category: ['', Validators.required],
    status: ['active' as Faq['status']],
  });

  get faqs(): Faq[] {
    const term = this.search.trim().toLowerCase();
    const list = [...this.svc.all].sort((a, b) => a.displayOrder - b.displayOrder);
    return term ? list.filter((f) => f.question.toLowerCase().includes(term)) : list;
  }

  onSearch(value: string): void {
    this.search = value;
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form.reset({ question: '', answer: '', category: '', status: 'active' });
  }

  openEdit(faq: Faq): void {
    this.editingId.set(faq.id);
    this.form.reset({ question: faq.question, answer: faq.answer, category: faq.category, status: faq.status });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const id = this.editingId();
    if (id) {
      this.svc.update(id, raw).subscribe(() => this.toast.success('FAQ updated.'));
    } else {
      const maxOrder = Math.max(0, ...this.svc.all.map((f) => f.displayOrder));
      this.svc.create({ ...raw, displayOrder: maxOrder + 1 }).subscribe(() => this.toast.success('FAQ created.'));
    }
  }

  toggleStatus(faq: Faq): void {
    this.svc.update(faq.id, { status: faq.status === 'active' ? 'inactive' : 'active' }).subscribe();
  }

  move(faq: Faq, direction: 'up' | 'down'): void {
    this.svc.move(faq.id, direction);
  }

  remove(faq: Faq): void {
    this.confirm.confirm({ message: `Delete FAQ "${faq.question}"? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(faq.id).subscribe(() => this.toast.success('FAQ deleted.'));
      });
  }
}
