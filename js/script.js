/*Joaquin Bonifacino y Rafael Cadenas*/

//Evento que se ejecuta al terminar de cargar la pagina
window.addEventListener("load",inicio);

let nuestroSistema = new Sistema();

function inicio(){
	//Desabilita el boton de agregar una donacion
	document.getElementById("infoDonaciones").disabled = true;

	//Trigger de agregar Donaciones
	document.getElementById("infoDonantes").addEventListener("click",agregarDonante);
	//Trigger de agregar Donantes
	document.getElementById("infoDonaciones").addEventListener("click",agregarDonacion);

	//Trigger de ordenar por creciente o decreciente
	document.getElementById("idDecreciente").addEventListener("change",actualizar);
	document.getElementById("idCreciente").addEventListener("change",actualizar);

	//Trigger de ordenar por creciente o decreciente
	document.getElementById("idResaltar").addEventListener("change",actualizar);
	document.getElementById("idBuscar").addEventListener("input",actualizar);
	//Carga los paquetes de graficas que ofrece google
	google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    //Carga la tabla (Aunque no contenga datos)
	nuestroSistema.actualizarTabla();
}

function agregarDonante(){
	
	if(document.getElementById("idFormDonantes").reportValidity()){

		//Traemos las 3 variables de los 3 inputs de la pagina
		let nombre = document.getElementById("nombre").value;
		let direccion = document.getElementById("direccion").value;
		let tel = document.getElementById("telefono").value;

		//En el caso de que el donante no exista se agrega, sino se alerta
		if(!nuestroSistema.existeDonanteNombre(nombre)){
			//Creamos el nuevo objeto donante y le pasamos las variables correspondientes
			let don = new Donante(nombre,direccion,tel);

			//Agregamos el objeto al array de donantes
			nuestroSistema.agregarDonanteLista(don);

			//Actualizamos el combo de donaciones con el nuevo donante
			actualizarCombo();

			//Limpiamos los campos de input una vez se agrego el donante
			document.getElementById("idFormDonantes").reset();

			//Rehabilita el boton de donaciones
			document.getElementById("infoDonaciones").disabled = false;
			alert("Donante registrado con exito");
		}else{
			alert("Este donante ya existe");
		}
	
	}else{
		alert("Nombre, direccion o telefono incorrectos")
	}
}



function actualizarCombo(){

	/*Traemos el array de todos los donantes y el objeto del combo, 
	luego limpiamos lo que tenga dentro el combo
	*/
    let listaDonantes = nuestroSistema.darTodosDonantes();
    let combo = document.getElementById("idDonante");
    combo.innerHTML = "";


    //Recorriendo el array de donantes re cargamos el combo con los nombres
    for(let i=0; i<listaDonantes.length; i++){

        let donante = listaDonantes[i];
        let nodoOption = document.createElement("option");
        let nodoTxt = document.createTextNode(donante.nombre);

        //Despues de cargadas las variables usamos append para cargar el combo
        nodoOption.appendChild(nodoTxt);
        combo.appendChild(nodoOption);
    }
}



function agregarDonacion(){
	
	//Chequea si todos los campos han sido correctamente ingresados
	if(document.getElementById("idFormDonaciones").reportValidity()){

		//Traigo los valores de cada uno de los inputs
		let combo = document.getElementById("idDonante");
		let nombre = combo.options[combo.selectedIndex].text;
		let modo = document.getElementById("idModo").value;
		let monto = parseInt(document.getElementById("idMonto").value);
		let comentario = document.getElementById("idComentarios").value;

		// Creamos el objeto donacion con los valores adecuados a la clase
		let donacion = new Donacion(nombre,modo,monto,comentario);

		//Se agrega el objeto al array de donaciones
		nuestroSistema.agregarDonacionLista(donacion);
		//Funcion que actualiza la lista de donante mayor
		actualizarDonanteMayor();

		//Convierte el atributo nombre del objeto donacion en el objeto donante en si
		nuestroSistema.agregarDonanteADonacion();

		//Actualiza la tabla 
		nuestroSistema.actualizarTabla();
		alert("Donacion registrada con exito");

		//Actualiza el Monto total General
		actualizarTotalMonto();

		//Actualiza en estadisticas el monto de donacion mayor
		actualizarMayor();

		//Actualiza en estadisticas la cantidad de donaciones
		actualizarCantTDonaciones();

		//Actualiza en estadisticas el promedio de los montos de las donaciones
		actualizarPromedioMonto();

		//Re dibuja el chart despues de agregada una donacion
		drawChart();
		
	}else{
		alert("Nombre, modo, monto o comentario incorrectos")
	}
}

//Actualiza el Monto total General
function actualizarTotalMonto(){
	/*Guarda el objeto en "total", acumula en la variable "suma"
	luego lo concatena al texto y lo re carga al objeto
	*/
	let total = document.getElementById("total");
	let suma = nuestroSistema.total();
	suma = "Total General $" + suma;
	total.innerHTML = suma;
}

//Actualiza en estadisticas el monto de donacion mayor
function actualizarMayor() {
	let mayor = document.getElementById("mayor");
	let valor = nuestroSistema.mayor();
	valor = "Monto Donación Mayor $" + valor;
	mayor.innerHTML = valor;
}
//Actualiza la cantidad de donaciones totales mostrada en la seccion de estadisticas
function actualizarCantTDonaciones(){
	let objeto = document.getElementById("idTotalDonaciones");
	let cantidad = nuestroSistema.listaDonaciones.length;
	let string = "Cantidad total de donaciones:" + cantidad;
	objeto.innerHTML = string;
}

//Actualiza el promedio de monto de las donaciones mostrado en la seccion de estadisticas
function actualizarPromedioMonto(){
	let objeto = document.getElementById("idPromedioMonto");
	let listaDonaciones = nuestroSistema.darTodosDonacion();
	let suma = 0;
	for (let i = 0; i < listaDonaciones.length; i++) {
		suma+=parseInt(listaDonaciones[i].monto);
	}
	let promedio = suma/listaDonaciones.length;
	promedio = parseInt(promedio);
	let string = "Promedio por donación: " + promedio;
	objeto.innerHTML = string;
}

function actualizarDonanteMayor(){
	let mayor = document.getElementById("idDonanteMayor");
	mayor.innerHTML = "";
	let donantes = nuestroSistema.mayorDonante();
	let p = document.getElementById("texto");
	//Se valida si es uno o mas donantes para determinar el singular o plural
	if(donantes.length > 1){
		p.innerHTML = "Donantes que más veces donaron:";
		//Se recorre la lista de los donantes que mas donaron y se agregan a la lista en el HTML
		for (i = 0; i < donantes.length; i++){
			texto = donantes[i];
			let donante = document.createElement("li");
			let txt = document.createTextNode(texto);
			donante.appendChild(txt);
			mayor.appendChild(donante);
		}
	} else {
		let txt = "Donante que más veces donó: " + donantes;
		p.innerHTML = txt;
	}

}
//creada para que funcione con los event listeners
function actualizar(){
	nuestroSistema.actualizarTabla();
}
//Funcion que dibuja la grafica
function drawChart() {
	let cantEfectivo=0;
	let cantTrans=0;
	let cantCanj=0;
	let cantMerc=0;
	let cantCheque=0;
	let cantOtros=0;
	
		//Recorre la lista de donaciones comprobando que modo usa
	    for (var i = 0; i < nuestroSistema.listaDonaciones.length; i++) {
	     	if(nuestroSistema.listaDonaciones[i].modo=="Efectivo"){
	     		cantEfectivo++;
	     	}

	     	if(nuestroSistema.listaDonaciones[i].modo=="Transferencia"){
	     			cantTrans++;
	     	}

	     	if(nuestroSistema.listaDonaciones[i].modo=="Canje"){
	     			cantCanj++;
	     	}

	     	if(nuestroSistema.listaDonaciones[i].modo=="Mercaderia"){
	     			cantMerc++;
	     	}

	     	if(nuestroSistema.listaDonaciones[i].modo=="Cheque"){
	     			cantCheque++;
	     	}

	     	if(nuestroSistema.listaDonaciones[i].modo=="Otros"){
	     			cantOtros++;
	     	}

	     }
	     //Se establecen las variables que se toman en cuenta en la grafica
		var data = google.visualization.arrayToDataTable([
	    	['Modo', 'Cantidad'],
	        ['Efectivo',cantEfectivo],
	        ['Transferencia',cantTrans],
	        ['Canje',cantCanj],
	        ['Mercaderia',cantMerc],
	        ['Cheque',cantCheque],
	        ['Otros',cantOtros]
	    ]);
		   //Valida el titulo dependiendo si hay datos o no
		let title;
	    title= 'Donaciones por Modo';
	        
	        //Establece el diseño
	    var options = {
	        	
	        title: title,
	        pieHole: 0.4,
	        backgroundColor:"none",
	    };
	        //Crea el objeto de la clase piechart

	    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));

	    //Le doy dimension en el caso de que tenga informacion dentro
	    if (nuestroSistema.listaDonaciones.length > 0){
		    document.getElementById("donutchart").style.width = "550px";
		    document.getElementById("donutchart").style.height= "500px";
		    chart.draw(data, options);
	    }


}
	


