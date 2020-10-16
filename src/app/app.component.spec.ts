import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { BookDataService } from './services/book-data.service';

describe('AppComponent', () => {

    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let de: DebugElement;

    let service: BookDataService;
    let spy: jasmine.Spy;

    beforeEach(async () => {

    await TestBed.configureTestingModule({
        declarations: [
            AppComponent
        ],
        providers: [ { provide: BookDataService }]
    })
    .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;

        service = de.injector.get(BookDataService);

        spy = spyOn(service, 'getBookData');

        fixture.detectChanges();
    });

    it('should create the app', () => {
    expect(component).toBeTruthy();
    });

    it(`should be falsy`, () => {
    expect(component.showAdvancedSearch).toBeFalse();
    });
});
