import { Component, OnInit, AfterContentInit, AfterViewInit } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import { Category } from '../shared/interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-assortment-page',
  templateUrl: './assortment-page.component.html',
  styleUrls: ['./assortment-page.component.css']
})
export class AssortmentPageComponent implements OnInit {

  categories$: Observable<Category[]>

  constructor(private categoryService:CategoriesService) { }

  ngOnInit() {
    this.categories$ = this.categoryService.fetch()
  }

}
