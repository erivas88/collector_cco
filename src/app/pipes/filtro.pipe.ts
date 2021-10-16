import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(arreglo: any[], texto: string =''): any[] {

   /* console.log(arreglo)
    return null;*/

    if(texto ===''){
      return arreglo;
    }
    if(!arreglo){
      return arreglo;    
    }
    return arreglo.filter(item => item.estacion.includes(texto));

  }

}
