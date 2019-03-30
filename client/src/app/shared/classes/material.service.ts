import { ElementRef } from '@angular/core';

declare var M

export interface MaterialInstance{
    open?():void
    close?():void
    destroy?():void
}

export interface MaterialDatepicker extends MaterialInstance {
    date?: Date
}

export class MaterialService{
    static toast(message:string){
        M.toast({html: message})
    }

    static initializeFloatingButton(ref: ElementRef){
        M.FloatingActionButton.init(ref.nativeElement)
    }

    static updateTextFields(){
        M.updateTextFields()
    }

    static initModal(ref:ElementRef){
       return M.Modal.init(ref.nativeElement)
    }
    static initTooltip(ref:ElementRef){
        return M.Tooltip.init(ref.nativeElement)
    }

    static initDatepicker(ref:ElementRef, onClose:()=>void){
        return M.Datepicker.init(ref.nativeElement,{
            format: 'dd.mm.yyyy',
            showClearBtn: true,
            onClose: onClose
        })
    }

    static initTapTarget(ref:ElementRef){
        return M.TapTarget.init(ref.nativeElement);
    }
}