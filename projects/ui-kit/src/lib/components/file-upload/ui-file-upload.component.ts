import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { UiFileRejected } from './ui-file-upload.types';

@Component({
  selector: 'ui-file-upload',
  standalone: true,
  templateUrl: './ui-file-upload.component.html',
  styleUrl: './ui-file-upload.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiFileUploadComponent),
      multi: true,
    },
  ],
})
export class UiFileUploadComponent implements ControlValueAccessor {
  readonly label = input('Upload files');
  readonly hint = input('Drag and drop files here, or browse');
  readonly accept = input('');
  readonly multiple = input(false);
  readonly maxFiles = input<number | null>(null);
  readonly maxFileSize = input<number | null>(null);
  readonly disabled = input(false);
  readonly required = input(false);
  readonly showFileList = input(true);
  readonly id = input('ui-file-upload');

  readonly filesChange = output<File[]>();
  readonly fileRejected = output<UiFileRejected>();
  readonly fileRemoved = output<File>();

  readonly selectedFiles = signal<File[]>([]);
  readonly isDragging = signal(false);
  readonly formDisabled = signal(false);
  readonly validationErrors = signal<string[]>([]);

  readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  readonly hasFiles = computed(() => this.selectedFiles().length > 0);

  readonly status = computed(() => {
    if (this.isDisabled()) return 'disabled';
    if (this.isDragging()) return 'dragging';
    return 'idle';
  });

  private onChange: (files: File[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(files: File[] | null): void {
    this.selectedFiles.set(files ?? []);
    this.validationErrors.set([]);
  }

  registerOnChange(fn: (files: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);

    if (isDisabled) {
      this.isDragging.set(false);
    }
  }

  openFilePicker(): void {
    if (this.isDisabled()) return;

    this.fileInput()?.nativeElement.click();
  }

  onFileInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files) {
      this.addFiles(Array.from(inputElement.files));
    }

    // Allows selecting the same file again after removing it.
    inputElement.value = '';
    this.onTouched();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();

    if (this.isDisabled()) return;

    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();

    const currentTarget = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as Node | null;

    if (relatedTarget && currentTarget.contains(relatedTarget)) {
      return;
    }

    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);

    if (this.isDisabled()) return;

    const files = event.dataTransfer?.files;

    if (files) {
      this.addFiles(Array.from(files));
    }

    this.onTouched();
  }

  addFiles(incomingFiles: File[]): void {
    if (this.isDisabled() || incomingFiles.length === 0) return;

    this.validationErrors.set([]);

    const acceptedFiles: File[] = [];
    const currentFiles = [...this.selectedFiles()];

    for (const file of incomingFiles) {
      if (!this.multiple() && currentFiles.length + acceptedFiles.length >= 1) {
        this.rejectFile(file, 'max-files-exceeded', 'Only one file can be selected.');
        continue;
      }

      if (
        this.multiple() &&
        this.maxFiles() !== null &&
        currentFiles.length + acceptedFiles.length >= this.maxFiles()!
      ) {
        this.rejectFile(
          file,
          'max-files-exceeded',
          `You can select a maximum of ${this.maxFiles()} files.`,
        );
        continue;
      }

      if (!this.isAcceptedType(file)) {
        this.rejectFile(file, 'invalid-type', `${file.name} has an unsupported file type.`);
        continue;
      }

      if (this.maxFileSize() !== null && file.size > this.maxFileSize()!) {
        this.rejectFile(
          file,
          'file-too-large',
          `${file.name} exceeds the maximum file size of ${this.formatFileSize(this.maxFileSize()!)}.`,
        );
        continue;
      }

      const duplicate = [...currentFiles, ...acceptedFiles].some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified,
      );

      if (!duplicate) {
        acceptedFiles.push(file);
      }
    }

    if (acceptedFiles.length > 0) {
      const nextFiles = [...currentFiles, ...acceptedFiles];

      this.selectedFiles.set(nextFiles);
      this.onChange(nextFiles);
      this.filesChange.emit(nextFiles);
    }
  }

  removeFile(index: number): void {
    if (this.isDisabled()) return;

    const currentFiles = [...this.selectedFiles()];
    const removedFile = currentFiles[index];

    if (!removedFile) return;

    currentFiles.splice(index, 1);

    this.selectedFiles.set(currentFiles);
    this.onChange(currentFiles);
    this.filesChange.emit(currentFiles);
    this.fileRemoved.emit(removedFile);
    this.onTouched();
  }

  clearFiles(): void {
    if (this.isDisabled()) return;

    const removedFiles = [...this.selectedFiles()];

    this.selectedFiles.set([]);
    this.validationErrors.set([]);

    this.onChange([]);
    this.filesChange.emit([]);

    for (const file of removedFiles) {
      this.fileRemoved.emit(file);
    }

    this.onTouched();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);

    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
  }

  private isAcceptedType(file: File): boolean {
    const accepted = this.accept()
      .split(',')
      .map((type) => type.trim().toLowerCase())
      .filter(Boolean);

    if (accepted.length === 0) return true;

    return accepted.some((type) => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type);
      }

      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }

      return file.type.toLowerCase() === type;
    });
  }

  private rejectFile(file: File, reason: UiFileRejected['reason'], message: string): void {
    this.validationErrors.update((errors) => [...errors, message]);

    this.fileRejected.emit({
      file,
      reason,
      message,
    });
  }
}
