export class FacturaLineasEspejo {
    constructor(
    public idGuia:     string,
    public numFactura: string,
    public tipoDocumento:  string,
    public linea:      number,
    public articulo:   string,
    public cantEntregar:   number,
    public cantEntregada:  number,
    public idJusti:    string,
    public tipoJusti:  string,
    public descripcion: string, // DESCRIPCION DEL ARTICULO
    public justificacion:  string, // DESCRIPCION DE LA JUSTIFICACION
    public idCliente:  string,
    ){}
}
