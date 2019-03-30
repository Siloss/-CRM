import { Injectable } from '@angular/core';
import { Order } from '../interfaces';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    constructor(private http: HttpClient) {
    }

    create(order: Order): Observable<Order> {
        return this.http.post<Order>('/api/order', order)
    }

    fetch(params: any ={}): Observable<Order[]> {
        return this.http.get<Order[]>('/api/order',{
            params: new HttpParams({
                fromObject: params
            })
        })
    }
}