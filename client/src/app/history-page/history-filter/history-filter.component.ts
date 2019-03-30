import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Filter } from 'src/app/shared/interfaces';
import { MaterialService, MaterialDatepicker } from 'src/app/shared/classes/material.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {

  @Output() onFilter = new EventEmitter<Filter>()
  @ViewChild('from') fromRef: ElementRef
  @ViewChild('to') toRef: ElementRef

  from: MaterialDatepicker
  to: MaterialDatepicker
  order: number
  isValid = true

  constructor() { }

  ngAfterViewInit(){
    this.from = MaterialService.initDatepicker(this.fromRef, this.validate.bind(this))
    this.to = MaterialService.initDatepicker(this.toRef, this.validate.bind(this))
  }

  ngOnDestroy(){
    this.from.destroy()
    this.to.destroy()
  }

  validate(){
    if(!this.from.date || !this.to) {
      this.isValid = true
      return
    }
    
    this.isValid = this.from.date <= this.to.date
  }

  submitFilter(){
    const filter: Filter  = {}

    if(this.order) {
      filter.order = this.order
    }

    if(this.from.date) {
      filter.start = this.from.date
    }

    if(this.to.date) {
      filter.end = this.to.date
    }
    this.onFilter.emit(filter)


  }
}
