import { Component, OnInit, ViewChildren, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MaterialService, MaterialInstance } from '../shared/classes/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';
import { Order, Filter } from '../shared/interfaces';

const STEP = 2

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('tooltip') tooltipRef: ElementRef
  isFilterVisible = false
  oSub:Subscription
  tooltip:MaterialInstance
  orders: Order[] = []
  filter:Filter

  offset = 0
  limit = STEP

  loading = false
  reloading = true
  NoMoreOrders = false

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.reloading = !false
    this.fetch()
  }

  private fetch(){
   
    const params = Object.assign({},this.filter,{
      offset: this.offset,
      limit: this.limit
    })

    this.oSub = this.ordersService.fetch(params).subscribe(orders=>{
      this.orders = this.orders.concat(orders)
      this.NoMoreOrders = orders.length < STEP
      this.loading = false
      this.reloading = false
    })
  }

  loadMore(){
    this.offset += STEP
    this.loading = true
    this.fetch()
  }

  applyFilter(filter: Filter){
    this.orders = []
    this.offset = 0
    this.filter = filter
    this.reloading = true
    this.fetch()
  }


  ngAfterViewInit() {
   this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }

  ngOnDestroy() {
    this.tooltip.destroy()
    this.oSub.unsubscribe()
  }

  isFiltered():boolean{
    if(this.filter)
    return !!Object.keys(this.filter).length
  }
}
