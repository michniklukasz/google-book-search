import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Book, BookDataService } from './services/book-data.service';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // ----------------Data from google api------------------------------
  // array of books
  public books: Book[];
  public isLoaded: boolean = false;
  // ---------------Data from user input-------------------------------
  // basic search form control, Observable<string>
  public searchField: FormControl;
  // -------------------------------------------------------------------
  public isError: boolean = false;
  constructor(
    private bookData: BookDataService
  ) {}
  // ---------------------Methods for user input------------------------
  ngOnInit(): void {
    this.searchField = new FormControl();
    this.searchField.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => this.bookData.searchBooks(term)),
      tap(_ => this.isLoaded = true))
      .subscribe(
        data => this.books = data,
        error => { this.isLoaded = false;
                   this.isError = true;
                   console.log('error from app.component.ts', error);
                   setTimeout(() => window.location.reload(), 1000);
        });
  }
}
