import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsPage } from '../shared/interfaces';
import {Chart} from 'chart.js'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  aSub: Subscription
  average: number
  pending = true

  constructor(private service: AnalyticsService) { }

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Gain',
      color:'rgb(155,9,142)'
    }

    const orderConfig: any = {
      label:'Orders',
      color: 'rgb(54,162,1)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      console.log(data)
      this.average = data.average

      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)

      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)

      // ****temp****
      //gainConfig.labels.push('08.05.2018')
      //gainConfig.data.push(1500)
      // ****temp****

      
      
      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      new Chart(gainCtx,createChartConfig(gainConfig))
      new Chart(orderCtx,createChartConfig(orderConfig))

      this.pending = false

    })
  }

  ngOnDestroy(){
    if(this.aSub) {
      this.aSub.unsubscribe()
    }
    
  }

}

function createChartConfig({labels,data,label,color}) {
  return {
    type:'line',
    options:{
      responsive:true
    },
    data:{
      labels,
      datasets:[
        {
          label, data,
          borderColor:color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}

