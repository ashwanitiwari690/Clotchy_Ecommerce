import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-global-search',
  imports: [CommonModule,FormsModule],
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss',
})
export class GlobalSearchComponent {
  searchText: string = '';
  private searchSubject = new Subject<string>();

  @Output() search = new EventEmitter<string>();

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((value) => {
        return [value];
      })
    ).subscribe(value => {
      this.search.emit(value);
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchText);
  }
}
