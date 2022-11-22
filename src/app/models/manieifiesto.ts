export class Manifiesto{
    constructor(
       public idGuia: string,
        public idCliente: string,
        public nombre: string,
        public orden_Visita: number,
        public FACTURA: string,
        public CONDICION_PAGO: string
 
    ){}
}
