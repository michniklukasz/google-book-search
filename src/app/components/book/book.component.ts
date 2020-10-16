import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  shortDescription: string;
  // default photo, in case of null value of thumbnail in received object from api
  defualtImage: string = '../../../assets/default-placeholder.png';
  @Input()
  book;
  constructor() { }
  // truncating description, with n param you can decite how long shorter string should be
  shorteningDescription(str: string = '...', n: number): string {
    if (str.length <= n) { return str; }
    const subStr = str.substr(0, n);
    return (
        `${subStr.substr(0, subStr.lastIndexOf(' '))} (...)`
    );
  }
  ngOnInit(): void {
    // component decides on the length of book description, second argument sets length
    this.shortDescription = this.shorteningDescription(this.book['description'], 150);
  }
}