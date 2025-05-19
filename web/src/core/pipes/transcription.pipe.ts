import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTranscription',
})
export class TranscriptionPipe implements PipeTransform {
  transform(text: string): string {
    if (!text) {
      return '';
    }
    const trimmed = text.trim();

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      return trimmed;
    }

    return `[${trimmed.toLowerCase()}]`;
  }
}
