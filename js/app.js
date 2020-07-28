const formularioContactos = document.querySelector('#contacto');
const listadoContactos = document.querySelector('#listado-contactos tbody');
const inputBuscador = document.querySelector('#buscar');


evenListeners();
function evenListeners(e){
    //Cuando el formulario de crear o editar se ejecuta
    if(formularioContactos){
        formularioContactos.addEventListener('submit',leerFormulario);
    }
    
    
    //Listener para eliminar el boton
    if(listadoContactos){
        listadoContactos.addEventListener('click', eliminarContacto);
    }

    //buscador
    inputBuscador.addEventListener('input', buscarContactos);

    numeroContactos();
    

}



function leerFormulario(e) {
    e.preventDefault();

    //leer el valor de los input

    const nombre = document.querySelector('#nombre').value;
    const empresa = document.querySelector('#empresa').value;
    const telefono = document.querySelector('#telefono').value;
    const accion = document.querySelector('#accion').value;

    if (nombre === '' || empresa === '' || telefono === '') {
        mostrarNotificacion('Todos los campos son obligatorios', 'error');
        
    }else {
        // Pasa la validacion, crear llamado a Ajax
        const infoContacto = new FormData();
                        // llave mas valor
        infoContacto.append('nombre',nombre);
        infoContacto.append('empresa',empresa);
        infoContacto.append('telefono',telefono);
        infoContacto.append('accion',accion);
              //utilizando el operador spread operator (...) crea una copia de lo q hay en formdata
            //console.log(...infoContacto);
         if (accion === 'crear') {
             //creamos un nuevo contacto
             insertarBD(infoContacto);
             
         } else{
             //editamos contacto
             //leer el Id
             const idRegistro = document.querySelector('#id').value;
             infoContacto.append('id',idRegistro);
             actualizarRegistro(infoContacto);
         }  
    }
}

// Inserta en la base de datos via Ajax
function insertarBD(datos){
    //llamado a ajax. creamos el objeto
    const xhr = new XMLHttpRequest();

    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    //pasar los datos
    xhr.onload = function() {
        if (this.status === 200) {
            console.log(JSON.parse( xhr.responseText));
            //leemos la respuesta de php
            const respuesta = JSON.parse( xhr.responseText);
                console.log(respuesta.datos.nombre);    

            //inserta un nuevo elemento a la tabla
            const nuevoContacto = document.createElement('tr');
             nuevoContacto.innerHTML = `
                 <td>${respuesta.datos.nombre}</td>
                 <td>${respuesta.datos.empresa}</td>
                 <td>${respuesta.datos.telefono}</td>
            
            
            `;

            // crear contenedor para los botones
            const contenedorAcciones = document.createElement('td');

            // crear el icono Editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas','fa-pen-square');

            // crea el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
           // btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            //agregar al padre
            contenedorAcciones.appendChild(btnEditar);

            // crear el icono Eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas','fa-trash-alt');

            //crea el boton eliminar
            const  btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            //agregar al padre
            contenedorAcciones.appendChild(btnEliminar);

            // Agregar al tr
            nuevoContacto.appendChild(contenedorAcciones);

            //Agregarlo con los contactos
            listadoContactos.appendChild(nuevoContacto);

            //Resetear el formulario
            document.querySelector('form').reset();


            //Mostrar notificacion
            mostrarNotificacion('Contacto Creado Correctamente', 'correcto');

            //Actualizamos el numero de contactos
            numeroContactos();






   
            
        }
    }

    //enviar los datos
    xhr.send(datos);

}

// Actualizar en la base de datos
function actualizarRegistro(datos){
   // console.log(...datos);
   //crear el objeto
   const xhr = new XMLHttpRequest();

   //abrir la conexion
   xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);
   
   //leer la respuesta

xhr.onload = function() {
    const resultado = JSON.parse(xhr.responseText);
    console.log(resultado);

    if (resultado.respuesta === 'correcto') {
        //mostrar notificacion de correcto
        mostrarNotificacion('Contacto Editado', 'correcto');
        
    } else {
        mostrarNotificacion('Hubo un error... ', 'error');
    }

    //despues de 3 seg redireccionar
    setTimeout(() =>{
        window.location.href = 'index.php';


    }, 4000);


}

   //enviar la peticion
   xhr.send(datos);


}

//Eliminar el contacto
function eliminarContacto(e) {
    //console.log(e.target.parentElement.classList.contains('btn-borrar'));//te regresa true si diste click en el boton borrar
   if (e.target.parentElement.classList.contains('btn-borrar')) {
       //tomar el Id
       const id = e.target.parentElement.getAttribute('data-id');
       //console.log(id);
       //preguntar al usuario si estan seguros
       const respuesta = confirm('¿Estas seguro (a) ?');
       if (respuesta) {
           //console.log('Si estoy seguro');

           //llamado a ajax
           //crear el objeto
           const xhr = new XMLHttpRequest();


           //abrir la conexion
           xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

           //leer la respuesta
           xhr.onload = function () {
               if (this.status === 200) {
                   const resultado = JSON.parse(xhr.responseText);
                   console.log(resultado);

                   if(resultado.respuesta == 'correcto'){
                       //Eliminar el registro del DOM
                       //console.log(e.target.parentElement.parentElement.parentElement);
                       //parentElement te envio al elemento padre
                       e.target.parentElement.parentElement.parentElement.remove();

                       //Mostrar notificacion
                       mostrarNotificacion('Contacto eliminado', 'error');

                       //Actualizar el numero de contactos
                       numeroContactos();


                   } else {
                       //MOstramos una notificacion
                       mostrarNotificacion('Hubo un error...', 'error')

                   }
                   
               }
               
           }

           //enviar la peticion
           xhr.send();
       } 
   }

}


function mostrarNotificacion(mensaje, clase){
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    // formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    // Ocultar y mostrar notificacion. esta funcion espera el tiempo señalado a ejecutar un codigo

    setTimeout(() => {
        notificacion.classList.add('visible');

        setTimeout(() => {
            notificacion.classList.remove('visible');
            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);


        
    }, 100);



}


//buscador de contactos
function buscarContactos(e){
    //console.log(e.target.value);
    const expresion = new RegExp(e.target.value, "i"); //la i significa que ignora si es may o minus
    const registros = document.querySelectorAll('tbody tr');

    registros.forEach(registro => {
        //limpia de contactos cuando ingresas algo en el buscador
        registro.style.display = 'none';
        //accedes al valor console.log(registro.childNodes[1].textContent);

        //esta expresion compara coincidencias de lo q ingresas en el bucador y regresa true si las hay y reemplaza los espacios en blanco con un espacio
        //console.log(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1);
         if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
            registro.style.display = 'table-row';
        }
        numeroContactos();

    })

}

//Muestra el numero de contactos
function numeroContactos(){
    const totalContactos = document.querySelectorAll('tbody tr');
    const contenedorNumero = document.querySelector('.total-contactos span');

    //console.log(totalContactos.length);
    let total = 0;
    totalContactos.forEach(contacto => {
        //console.log(contacto.style.display);
        if (contacto.style.display === '' || contacto.style.display === 'table-row') {
            total++;
            
        }
    });

    //console.log(total);
    contenedorNumero.textContent = total;

}