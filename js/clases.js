class Sistema{
    constructor(){
        this.listaDonantes = [];
        this.listaDonaciones = [];
    }

    //Devuelve la lista de todos los donantes
    darTodosDonantes(){
        return this.listaDonantes;
    }

    //Devuelve la lista de todas las donaciones
    darTodosDonacion(){
        return this.listaDonaciones;
    }

    //Convierte el atributo nombre del objeto donacion en el objeto donante en si
    agregarDonanteADonacion(){
        let listaDonantes = this.darTodosDonantes();
        let listaDonaciones = this.darTodosDonacion();
        for (let i2 = 0; i2 < listaDonantes.length; i2++) {
            let nombre = listaDonantes[i2].nombre 
        
            for (let i = 0; i < listaDonaciones.length; i++) {
                if(listaDonaciones[i].donante == nombre)
                    listaDonaciones[i].donante = listaDonantes[i2];
            }
        }
    }


    volverANombre(){
        let listaDonantes = this.darTodosDonantes();
        let listaDonaciones = this.darTodosDonacion();
        for (let i2 = 0; i2 < listaDonantes.length; i2++) {
            let nombre = listaDonantes[i2].nombre 
        
            for (let i = 0; i < listaDonaciones.length; i++) {
                if(listaDonaciones[i].donante.nombre == nombre)
                    listaDonaciones[i].donante = nombre;
            }
        }
    }

    //Funcion que se le apsa un objeto para agregar al array de donantes
    agregarDonanteLista(unElemento){
        this.listaDonantes.push(unElemento);
    }

    //Funcion que se le apsa un objeto para agregar al array de donaciones
    agregarDonacionLista(unElemento){
        this.listaDonaciones.push(unElemento);
    }

       
    //Funcion que devuelve verdadero en el caso de que ya exista un donante con ese nombre 
    //(ignorando mayusculas y minusculas)
    existeDonanteNombre(nombre){
    
        let existe = false;

        for(let i=0; i<this.listaDonantes.length; i++){
            
            let d = this.listaDonantes[i];
           
            if(d.nombre.toLowerCase() == nombre.toLowerCase()){
                existe = true;
            }
            
            
        }
        
        return existe;
    }

    /*Funcion encargada de tomar cada monto del sistema, parsearlo 
    y acumularlo en la variable "suma" que es retornada
    */
    total(){
        let suma = 0;
        let listaDonaciones = this.darTodosDonacion();
        for (let i = 0; i < listaDonaciones.length; i++) {
            let d = listaDonaciones[i];
            suma = suma + parseInt(d.monto)
        }
        return suma
        
    }

    /*Funcion encargada de buscar la mayor donacion dentro del array de donaciones
    y devolverla en la variable "max"
    */
    mayor(){
        let max = Number.MIN_VALUE;
        let listaDonaciones = this.darTodosDonacion();
        for (let i = 0; i < listaDonaciones.length; i++){
            let d = listaDonaciones[i];
            let m = parseInt(d.monto);
            if(m > max) {
                max = m;
            }
        }
        return max;
    }

    //Funcion encargada de devolver un array el cual trae el/los donante/s con el mayor monto
    mayorDonante(){
        this.volverANombre();
        let listaDonantes = this.darTodosDonantes();
        let listaDonaciones = this.darTodosDonacion();
        let max = Number.MIN_VALUE;
        let donantes = [];

        for (let i2 = 0; i2 < listaDonantes.length; i2++) {
            let nombre = listaDonantes[i2].nombre;
            let cont = 0; 

        
            for (let i = 0; i < listaDonaciones.length; i++) {
                if(listaDonaciones[i].donante == nombre){
                    cont++;
                }
                
            }
            if(cont > max){
                max = cont;
                donantes = [];
            }

            if(cont == max){
                nombre = "" + nombre
                donantes.push(nombre);
            }
            

        }
        return donantes;
    }

    //Funcion que ordena la tabla chequeando que radio button esta apretado cuando es llamada
    ordenarLista(){
        let radio = document.getElementById("idDecreciente");
        if(radio.checked){
            this.listaDonaciones.sort(function(a,b){
                return b.monto - a.monto;
            });
        }else{
            this.listaDonaciones.sort(function(a,b){
                return a.donante.toString().localeCompare(b.donante.toString())
            });
        }
    }

    //Funcion que se le pasa un objeto combo de argumento y devuelve si esta chequeado o no
    comboChequeado(combo){
        let check=false;
        if(combo.checked){
            check=true
        }
            return check;
    }

    //Funcion que se encarga de actualizar la tabla
    actualizarTabla(){

        let tabla = document.getElementById("tablaDonaciones");
        let listaDonaciones = this.darTodosDonacion();
        let listaDonantes = this.darTodosDonantes();

        //Si no hay donaciones ingresada se muestra el mensaje "No hay donaciones para mostrar"
        if(listaDonaciones.length == 0){

            let fila = tabla.insertRow();
            let celda = fila.insertCell();
            celda.colSpan="4";
            celda.innerHTML = "No hay donaciones para mostrar";

        }else{


            //Limpio la tabla original
            tabla.innerHTML = "";

            //Cargo cada uno de los headers de la tabla
            //Header 1
            var header = tabla.createTHead();
            var row = header.insertRow(0);
            var cell = row.insertCell(0);
            cell.innerHTML = "<b>Comentarios</b>";
            //Header 2
            header = tabla.createTHead();
            cell = row.insertCell(0);
            cell.innerHTML = "<b>Monto</b>";
            //Header 3
            header = tabla.createTHead();
            cell = row.insertCell(0);
            cell.innerHTML = "<b>Modo</b>";
            //Header 4
            header = tabla.createTHead();
            cell = row.insertCell(0);
            cell.innerHTML = "<b>Donante</b>";

            //Llamo a la funcion que orden por monto o nombre
            this.ordenarLista();

            //Traigo el valor del monto a resaltar
            let checkbox = document.getElementById("idResaltar");
            if(nuestroSistema.comboChequeado(checkbox)){
                var montoAResaltar= document.getElementById("idBuscar").value;
                
            }

            /*Recorro la tabla de donaciones para cargar la tabla
            en el caso de que el valor a resaltar sea igual a algun monto de cualquier donaciones
            la fila que le corresponde se le cambia el estilo del fondo a amarillo.
            */
            for(let i=0; i<listaDonaciones.length; i++){
                    
                let fila = tabla.insertRow();

                if(montoAResaltar==listaDonaciones[i].monto){
                    fila.style.backgroundColor = "yellow";
                }
                let celda = fila.insertCell();

                //Se carga la correspondiente informacion del donante y el modo.
                celda.innerHTML = listaDonaciones[i].donante.toString();
                
                let celda2 = fila.insertCell();
                celda2.innerHTML = listaDonaciones[i].modo;


                /*Se crea la celda para el monto y despues se cambia el estilo del color del texto
                de esa celda dependiendo de si el monto es mayor o menor a 1000
                */
                let celda3 = fila.insertCell();
                if(listaDonaciones[i].monto >= 1000){
                    celda3.style.color = "red";
                    celda3.innerHTML = listaDonaciones[i].monto;
                } else {
                     celda3.style.color = "green";
                     celda3.innerHTML = listaDonaciones[i].monto;
                }
                let celda4 = fila.insertCell();
                celda4.innerHTML = listaDonaciones[i].comentario;

               
            }
        }
    }
}

    

//Creacion de la clase donante con sus 3 respectivos atributos
class Donante{
    constructor(nombre,direccion,telefono){
        this.nombre= nombre;
        this.direccion = direccion;
        this.telefono = telefono;
    }

    //Funcion que devuelve la informacion del objeto donante desde la que fue llamada
    toString(){
        return this.nombre +" ("+ this.direccion+ "," +this.telefono+")" ;
    }

}
//Creacion de la clase donante con sus 4 respectivos atributos 
class Donacion{
    constructor(donante,modo,monto,comentario){
        this.donante = donante;
        this.modo = modo;
        this.monto = monto;
        this.comentario = comentario;
    }



    //Devuelve las propiedades del objeto donde es llamado
    toString(){
        return this.donante +"/"+ this.modo+ "/"+ this.monto + "/" +this.comentario ;
    }


}

