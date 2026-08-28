import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Consistent date/time formatting across the dashboard: `27 Aug 2026, 09:45 PM`.
 * Wraps Angular's DatePipe so every table/detail page renders dates the same
 * way instead of raw ISO strings.
 */
@Pipe({
  name: 'appDate',
  standalone: true,
})
export class AppDatePipe implements PipeTransform {
  private readonly datePipe = new DatePipe('en-IN');

  transform(value: string | number | Date | null | undefined, format: 'full' | 'date' | 'time' = 'full'): string {
    if (value === null || value === undefined || value === '') return '—';
    const pattern = format === 'date' ? 'dd MMM yyyy' : format === 'time' ? 'hh:mm a' : 'dd MMM yyyy, hh:mm a';
    return this.datePipe.transform(value, pattern) ?? '—';
  }
}
