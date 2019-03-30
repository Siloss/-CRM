import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PositionsService } from 'src/app/shared/services/position.service';
import { Position } from 'src/app/shared/interfaces';
import { MaterialService, MaterialInstance } from 'src/app/shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { error } from '@angular/compiler/src/util';


@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId:string
  @ViewChild('modal') modalRef: ElementRef
  positions: Position[] = []
  loading = false
  positionId = null
  modal: MaterialInstance
  form: FormGroup

  constructor(private positionsService:PositionsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null,Validators.required),
      cost: new FormControl(null,[Validators.required, Validators.min(1)])
    })

    this.loading = true
    this.positionsService.fetch(this.categoryId).subscribe(
      positions =>{
        this.positions = positions
        this.loading = false
      }
    )
  }

  ngOnDestroy(){
    this.modal.destroy()
  }

  ngAfterViewInit(){
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position:Position) {
    this.positionId = position._id
    this.form.patchValue({
      name:position.name,
      cost:position.cost
    })
    this.modal.open()
    MaterialService.updateTextFields()
  }

  onAddPosition(){
    this.positionId = null
    this.form.patchValue({
      name:null,
      cost:0
    })
    this.modal.open()
    MaterialService.updateTextFields()
  }

  onDeletePosition(event:Event,position:Position){
    event.stopPropagation()
    const decision = window.confirm(`Delete position ${position.name}`)

    if(decision) {
      this.positionsService.delete(position).subscribe(
        responce=>{
          const idx = this.positions.findIndex(p=>p._id===position._id)
          this.positions.splice(idx,1)
          MaterialService.toast(responce.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }

  onCancel(){
    this.modal.close()
  }

  onSubmit(){
    this.form.disable()

    const newPosition: Position = {
      name:this.form.value.name,
      cost:this.form.value.cost,
      category: this.categoryId
    }


    if(this.positionId){
      newPosition._id = this.positionId
      this.positionsService.update(newPosition).subscribe(
        position => {
          MaterialService.toast('Changes Saved')
          this.ngOnInit()
        },
        error=>{
          MaterialService.toast(error.error.message)
        },
        ()=>this.form.enable()
      )
    }
    else{
      this.positionsService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Position was created')
          this.positions.push(position)
        },
        error=>{
          MaterialService.toast(error.error.message)
        },
        ()=>this.form.enable()
      )
    }

   
  }
}
