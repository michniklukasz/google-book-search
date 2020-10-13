import { Component, Input, OnInit } from '@angular/core';
import { Book } from '../../services/book-data.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  defaultImage = 'https://www.google.com/search?q=default+image&rlz=1C1CHBD_plPL907PL907&source=lnms&tbm=isch&sa=X&ved=2ahUKEwib2OCIgrLsAhWqAxAIHV49BI8Q_AUoAXoECBkQAw&biw=1280&bih=578#imgrc=E__DFTIbn9J8IM';
  shortDescription: string;
  @Input()
  book: Book[];
  constructor() { }
  // truncatingdescription, with n param you can decite how long shorter string should be
  shorteningDescription(str: string = '...', n: number): string {
    if (str.length <= n) { return str; }
    const subStr = str.substr(0, n);
    return (
        `${subStr.substr(0, subStr.lastIndexOf(' '))} (...)`
    )
  }
  ngOnInit(): void {
    // console.log(this.book['description']);
    this.shortDescription = this.shorteningDescription(this.book['description'], 150);
  }
}