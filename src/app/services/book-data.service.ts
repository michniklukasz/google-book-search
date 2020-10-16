import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
// imports API Key
import { environment } from '../../environments/environment';
// interfaces
import { BookItems } from './../interfaces/bookItems';
import { UserTerms } from './../interfaces/userTerms';

@Injectable({
  providedIn: 'root'
})
export class BookDataService {
  // -----------------------------------------API KEY-----------------------------------------
  private API_KEY: string = environment.API_KEY;
  // ---------------------------------------PARAMETERS-----------------------------------------
  private FIELDS = 'totalItems,items/volumeInfo(title,description,imageLinks/thumbnail)';
  private PRINT_TYPE = 'books';
  // ------------------------------------------------------------------------------------------
  // Default object to FILL EMPTY key&values in response object form api
  public defaultObject: BookItems = {
    volumeInfo: {
      title: '...',
      description: '...',
      imageLinks: {
        thumbnail: null
      }
    }
  };
  constructor(
    private http: HttpClient
  ) {}
  // --------------------------------- METHODS -----------------------------------------------
  // method biuld a query accoridng to user inputs
  buildQuery(userTerms: UserTerms): string {
    const queryParams = [
      {query: userTerms.title},
      {query: userTerms.author}
    ];
    const finalQuery: string = queryParams
      .filter(query => query.query !== null)
      .map(query => `+intitle:"${encodeURI(query.query as string)}"`)
      .reduce((queryAccumulator, queryCurrent) => queryAccumulator + queryCurrent);
    return `q=${finalQuery}`;
  }
  // methods build default and donditional params for url
  buildParams(userTerms: UserTerms, pageParams: {[key: string]: number}): HttpParams {
    let params = new HttpParams();
    params = params.set('printType', this.PRINT_TYPE);
    params = params.set('startIndex', pageParams.startIndex.toString());
    params = params.set('maxResults', pageParams.maxResults.toString());
    params = params.set('fields', this.FIELDS);
    if (userTerms.language && typeof(userTerms.language) === 'string') {
      params = params.set('langRestrict', userTerms.language.toLowerCase());
    }
    params = params.set('key', this.API_KEY);
    return params;
  }
  // core method for API call
  getBookData(userTerms: UserTerms, pageParams: {[key: string]: number}): Promise<any> {
    const query = this.buildQuery(userTerms);
    const params = this.buildParams(userTerms, pageParams);
    const apiURL = `https://www.googleapis.com/books/v1/volumes?${query}&${params}`;
    return this.http.get(apiURL).toPromise().then(data => data);
  }
}
