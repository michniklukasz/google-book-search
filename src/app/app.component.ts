import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BookDataService } from './services/book-data.service';

import { debounce } from './decorators/debounce-decorator';
import { Books } from './interfaces/books';
import { BookItems } from './interfaces/bookItems';
import { Volume } from './interfaces/volumeInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // ---------------------------ADVANCED SEARCH FOR TEMPLATE---------------------------------
  showAdvancedSearch: boolean = false;
  ADVANCED_TEXT_SHOWED: string = 'Hide additional fields';
  ADVANCED_TEXT_HIDDEN: string = 'Show additional fields';
  displayedAdvancedSearchText: string = this.ADVANCED_TEXT_HIDDEN;
  // ---------------------------------DATA FROM API------------------------------------------
  public totalItems: number = 0;
  public books: Volume[];
  // -----------------------------------USER INPUT-------------------------------------------
  // reactive form with user input
  bookForm: FormGroup;
  // ------------------------------BOOLEANS FOR TEMPLATE-------------------------------------
  // boleans visibility template
  public handleNoBooks: boolean = false;
  // defines if class="book-list" is visible
  public visibleBookList: boolean = false;
  // button - scrolls back to top
  public showScrollTop: boolean = false;
  // ---------------PARAMS FOR API GET REQUEST---------------------------------
  //  maxResults define amount of books received from api
  //  startIndex define starting index in totalItems of books within api query
  public pageParams: {[key: string]: number} = {
    startIndex: 0,
    maxResults: 10
  };
  // listen to scroll event to detect user reach bottom of page
  @HostListener('window:scroll', [])
  // decorator sets delay of called function to 0.3s
  @debounce()
  // listen to position of scroll
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight && this.visibleBookList === true) {
      // before next api request function sets new pageParams to receive subsequent items from totalItems available
      this.loadNewPage();
      // check if there are more available items to GET
      if (this.pageParams.startIndex < this.totalItems) {
        // gets subsequent items form API, and then concatenate to book array
        this.getData()
          .then((data) => this.books = this.addBooks(data))
          .then(() => this.showScrollTop = true)
          .catch(error => this.handleErrorWithData(error));
      }
    }
  }
  constructor(
    private bookData: BookDataService,
    private fb: FormBuilder
  ) {}
  // ----------------------------- GET and process data -----------------------------------
  getData(): Promise<Books> {
    return Promise.resolve(this.bookData.getBookData(this.bookForm.value, this.pageParams));
  }
  setTotalItems = (data: Books): Promise<Books> => {
    if (data){
      this.totalItems = data.totalItems;
      return Promise.resolve(data);
    } else {
      return Promise.reject(new Error('problem at seting totalItems in app.component.ts'));
    }
  }
  setBooks = (data: Books): Promise<Volume[]> => {
    const initialBooks = data.items.map((item: BookItems) => {
      return ({...this.bookData.defaultObject.volumeInfo, ...item.volumeInfo});
    });
    return Promise.resolve(initialBooks);
  }
  chainingProcess = (data: Books) => {
    if (data.totalItems !== 0) {
      return this.setTotalItems(data)
        .then(this.setBooks)
        .then((books) => {
          this.books = books;
          this.visibleBookList = true;
          this.handleNoBooks = false;
        });
     } else {
      this.handleNoBooks = true;
      this.visibleBookList = true;
    }
  }
  // ---------------------------------------------
  // method GET subsequent books within totalItems
  addBooks = (data: Books): Volume[] => {
    const anotherBooks: Volume[] = data.items.map((item: BookItems) => {
      return ({...this.bookData.defaultObject.volumeInfo, ...item.volumeInfo});
    });
    const previousBooks: Volume[] = this.books;
    return previousBooks.concat(anotherBooks);
  }
  // ---------------------------METHODS CONNECTED WITH BUTTONS---------------------------
  onSubmit(): void {
    // setting initial values
    this.books = [];
    this.totalItems = 0;
    // check, decprecetaed?
      // make http GET request
    this.getData()
      .then(this.chainingProcess)
      .catch(error => this.handleErrorWithData(error));
  }
  // connected with CLEAR button, resets form to initial values
  resetForm(): void {
    // make invisible div class="book-list" and "error-info"
    this.visibleBookList = false;
    this.handleNoBooks = false;
    // setting initial values
    this.books = [];
    this.totalItems = 0;
    this.bookForm.reset();
  }
  // show or hides advanced search fields in form
  toggleAdvancedSearch(): void {
    this.showAdvancedSearch = !this.showAdvancedSearch;
    if (this.showAdvancedSearch) {
      this.displayedAdvancedSearchText = this.ADVANCED_TEXT_SHOWED;
      this.resetAdvancedSearchFields();
    } else {
      this.displayedAdvancedSearchText = this.ADVANCED_TEXT_HIDDEN;
    }
  }
  // ------------------------------------UTILES--------------------------------------------------
  // reset fields beyond title field
  // used in toggleAdvancedSearch when hidding advanced search fields
  resetAdvancedSearchFields(): void {
    const previousTitle = this.bookForm.value.title;
    this.bookForm.reset({
      title: previousTitle,
      authors: null,
      language: null
    });
  }
  handleErrorWithData(error): void {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
    this.handleNoBooks = true;
  }
  scrollBackToTop(): void {
    window.scroll(0, 0);
    this.showScrollTop = false;
  }
  loadNewPage(): void {
    this.pageParams.startIndex += this.pageParams.maxResults;
  }
  // --------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.bookForm = this.fb.group({
      title: [null, [
        Validators.minLength(3)
      ]],
      author: [null, [
        Validators.minLength(3)
      ]],
      language: null,
    });
  }
}
