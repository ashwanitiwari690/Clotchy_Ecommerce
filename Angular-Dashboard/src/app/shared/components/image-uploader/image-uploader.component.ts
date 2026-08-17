import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';

export interface UploadedImage {
  url: string;
  name: string;
}

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule, IconDirective],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.scss',
})
export class ImageUploaderComponent {
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
      const reader = new FileReader();
      reader.onload = () => {
        const next = this.multiple ? [...this.images] : [];
        next.push({ url: reader.result as string, name: file.name });
        this.images = next;
        this.imagesChange.emit(this.images);
      };
      reader.readAsDataURL(file);
    }
  }

  remove(index: number): void {
    this.images = this.images.filter((_, i) => i !== index);
    this.imagesChange.emit(this.images);
  }
}
