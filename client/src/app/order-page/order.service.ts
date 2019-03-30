import { Injectable } from '@angular/core';
import { Position, OrderPosition } from '../shared/interfaces';
import { OrderPositionsComponent } from './order-positions/order-positions.component';

@Injectable()
export class OrderService {

    public list: OrderPosition[] = []
    public price = 0

    add(position: Position) {
        const OrderPosition: OrderPosition = Object.assign({}, {
            name: position.name,
            cost: position.cost,
            quantity: position.quantity,
            _id: position._id,
        })

        const candidate = this.list.find(p => p._id === position._id)

        if (candidate) {
            //change quantity
            candidate.quantity += OrderPosition.quantity
        } else {
            this.list.push(OrderPosition)
        }

        this.computePrice()
    }

    remove(OrderPosition:OrderPosition) {
        const indx = this.list.findIndex(p=>p._id === OrderPosition._id)
        this.list.splice(indx,1)
        this.computePrice()
    }

    clear() {
        this.list = []
        this.price = 0
    }

    private computePrice() {
        this.price = this.list.reduce((total, item) => {
           return total+= item.quantity * item.cost
        }, 0)
    }
}   