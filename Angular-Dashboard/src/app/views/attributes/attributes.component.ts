import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconDirective } from '@coreui/icons-angular';
import { SharedUIModule } from '../../shared/shared-ui.module';
import { AttributeService } from './attribute.service';
import { ProductAttribute } from '../../core/models/brand.model';
import { ToastService } from '../../layout/toasts/toast.service';
import { ConfirmDialogService } from '../../shared/components/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-attributes',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule, IconDirective],
  templateUrl: './attributes.component.html',
})
export class AttributesComponent {
  private readonly svc = inject(AttributeService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);

  search = '';
  editingId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    valuesText: ['', Validators.required],
  });

  get attributes(): ProductAttribute[] {
    const term = this.search.trim().toLowerCase();
    const list = [...this.svc.all].sort((a, b) => a.name.localeCompare(b.name));
    return term ? list.filter((a) => a.name.toLowerCase().includes(term)) : list;
  }

  onSearch(value: string): void {
    this.search = value;
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', valuesText: '' });
  }

  openEdit(attr: ProductAttribute): void {
    this.editingId.set(attr.id);
    this.form.reset({ name: attr.name, valuesText: attr.values.join(', ') });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const values = raw.valuesText.split(',').map((v) => v.trim()).filter(Boolean);
    if (!values.length) {
      this.toast.error('Add at least one value.');
      return;
    }
    const id = this.editingId();
    if (id) {
      this.svc.update(id, { name: raw.name, values }).subscribe(() => this.toast.success('Attribute updated.'));
    } else {
      this.svc.create({ name: raw.name, values }).subscribe(() => this.toast.success('Attribute created.'));
    }
  }

  remove(attr: ProductAttribute): void {
    this.confirm.confirm({ message: `Delete attribute "${attr.name}"? This cannot be undone.`, danger: true, confirmText: 'Delete' })
      .subscribe((ok) => {
        if (ok) this.svc.delete(attr.id).subscribe(() => this.toast.success('Attribute deleted.'));
      });
  }
}
