export interface UiFileRejected {
  file: File;
  reason: 'invalid-type' | 'file-too-large' | 'max-files-exceeded';
  message: string;
}

export type UiFileUploadStatus = 'idle' | 'dragging' | 'disabled';
