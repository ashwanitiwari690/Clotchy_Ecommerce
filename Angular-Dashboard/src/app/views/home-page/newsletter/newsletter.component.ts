import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedUIModule } from '../../../shared/shared-ui.module';
import { NewsletterService } from './newsletter.service';
import { NewsletterConfig } from '../../../core/models/homepage.model';
import { ToastService } from '../../../layout/toasts/toast.service';
import { UploadedImage } from '../../../shared/components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [SharedUIModule, ReactiveFormsModule],
  templateUrl: './newsletter.component.html',
})
export class NewsletterComponent {
  private readonly svc = inject(NewsletterService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  images = signal<UploadedImage[]>([{ url: this.svc.value.backgroundImage, name: 'newsletter-bg' }]);

  form = this.fb.nonNullable.group({
    title: [this.svc.value.title, Validators.required],
    description: [this.svc.value.description],
    buttonText: [this.svc.value.buttonText],
    placeholderText: [this.svc.value.placeholderText],
    status: [this.svc.value.status as NewsletterConfig['status']],
  });

  save(): void {
    const raw = this.form.getRawValue();
    this.svc.update({ ...raw, backgroundImage: this.images()[0]?.url ?? this.svc.value.backgroundImage });
    this.toast.success('Newsletter section updated.');
  }
}
