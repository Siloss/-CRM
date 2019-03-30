import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MaterialService } from '../../classes/material.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements AfterViewInit {

  @ViewChild('floating') floatingRef: ElementRef

links = [
  {url:'/overview',name:'Overview'},
  {url:'/analytics',name:'Analytics'},
  {url:'/history',name:'History'},
  {url:'/order',name:'Add Order'},
  {url:'/assortment',name:'Assortment'}, //here(tuut)
]

  constructor(private auth:AuthService,private router:Router) { }

  ngAfterViewInit(){
    MaterialService.initializeFloatingButton(this.floatingRef)
  }

  ngOnInit() {
  }
  Logout(){
    this.auth.logout()
    this.router.navigate(['/login'])
  }
}
