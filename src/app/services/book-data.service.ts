import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// importing API Key
import {environment} from '../../environments/environments';

import { map } from 'rxjs/operators';

export class Book {
  constructor(
    public title: string,
    public description: string,
    public cover: string = '',
  ){}
}

@Injectable({
  providedIn: 'root'
})
export class BookDataService {
  // api key and api key query
  private API_KEY: string = environment.API_KEY;
  private apiKeyQuery = `&key=${this.API_KEY}`;
  // google book volumes prart of url
  private apiPrefix = 'https://www.googleapis.com/books/v1/volumes?';
  // ---------------PARAMETERS-----------------------------------------
  private partialResponse = '&fields=items/volumeInfo(title,description,imageLinks/thumbnail)';
  private onlyBooks = '&printType=books';
  private startIndex = '&startIndex=0';
  private maxResults = '&maxResults=10';

  constructor(
    private http: HttpClient
  ) {}
  searchBooks(term): Observable<Book[]> {
    const apiURL = `${this.apiPrefix}q=${term}${this.partialResponse}${this.startIndex}${this.maxResults}${this.onlyBooks}${this.apiKeyQuery}`;
    console.log(apiURL);
    return this.http.get(apiURL).pipe(
        map(res => {
          return res['items'].map(item => {
            return new Book(
                item.volumeInfo.title,
                item.volumeInfo.description,
                item.volumeInfo.imageLinks.thumbnail,
            );
          });
        })
    );
  }
}
