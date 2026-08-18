import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../layout/toasts/toast.service';

export interface UploadedImage {
  url: string;
  name: string;
}

interface UploadResponse {
  success: boolean;
  data: UploadedImage;
}

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule, IconDirective],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.scss',
})
export class ImageUploaderComponent {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  @Input() multiple = false;
  @Input() label = 'Drag & drop or click to upload';
  @Input() hint = 'PNG, JPG up to 5MB';
  @Input() images: UploadedImage[] = [];
  @Output() imagesChange = new EventEmitter<UploadedImage[]>();

  dragOver = false;

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(): void {
    this.dragOver = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.dragOver = false;
    if (e.dataTransfer?.files?.length) {
      this.handleFiles(e.dataTransfer.files);
    }
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFiles(input.files);
    }
    input.value = '';
  }

  private handleFiles(files: FileList): void {
    const list = this.multiple ? Array.from(files) : [files[0]];
    for (const file of list) {
      const formData = new FormData();
      formData.append('file', file);
      this.http.post<UploadResponse>(`${environment.ECOMMERCE_API}uploads`, formData).subscribe({
        next: (res) => {
          const uploaded = { url: res.data.url, name: file.name };
          this.images = this.multiple ? [...this.images, uploaded] : [uploaded];
          this.imagesChange.emit(this.images);
        },
        error: () => this.toast.error(`Failed to upload "${file.name}".`),
      });
    }
  }

  remove(index: number): void {
    this.images = this.images.filter((_, i) => i !== index);
    this.imagesChange.emit(this.images);
  }
}
