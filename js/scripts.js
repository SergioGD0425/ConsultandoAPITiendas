var METODO;
const URLAPI = "https://webapp-210130211157.azurewebsites.net/webresources/mitienda"


const LISTATIENDAS = document.getElementById("listaTiendas");
const chooseMethod = document.getElementById("chooseMethod");
const loadingPage = document.getElementById("loadingPage");
const paginaPeticion = document.getElementById("paginaPeticion");
const errorPage = document.getElementById("errorPage");
const buscadorTienda = document.getElementById("buscadorTienda");
const iconoBusqueda = document.getElementById("iconoBusqueda");
const formNuevatienda = document.getElementById("formNuevatienda");
const anadirTiendaButton = document.getElementById("anadirTiendaButton");

document.getElementById("xhrButton").addEventListener("click", () => eleccion("XHR"));
document.getElementById("fetchButton").addEventListener("click", () => eleccion("fetch"));
document.getElementById("jqueryButton").addEventListener("click", () => eleccion("jquery"));
document.getElementById("busquedaIndividual").addEventListener("click", buscarIdTienda);
document.getElementById("nuevaTienda").addEventListener("click", animarNuevaTienda);
document.getElementById("anadirTiendaButton").addEventListener("click", validarCampos);

var nombreInput = document.getElementById("nombreInput");
nombreInput.addEventListener("input", validarNombre);

var direccionInput = document.getElementById("direccionInput");
direccionInput.addEventListener("input", validarDireccion);

var localidadInput = document.getElementById("localidadInput");
localidadInput.addEventListener("input", validarLocalidad);

var telefonoInput = document.getElementById("telefonoInput");
telefonoInput.addEventListener("input", validarTelefono);

var busquedaIndividualHecha = false;
var nuevaTiendaAnimada = false;

/**
 * Valida el nombre del formulario comprobando si está relleno
 *
 * @return {*} Boolean
 */
function validarNombre() {
    resettext(nombreInput);
    if (nombreInput.validity.valueMissing) {
        errortext(nombreInput, "Campo obligatorio");
    } else {
        goodtext(nombreInput);
        return true;
    }
}

/**
 * Valida la direccion del formulario comprobando si está relleno
 *
 * @return {*} Boolean
 */
function validarDireccion() {
    resettext(direccionInput);
    if (direccionInput.validity.valueMissing) {
        errortext(direccionInput, "Campo obligatorio");
    } else {
        goodtext(direccionInput);
        return true;
    }
}

/**
 * Valida la localidad del formulario comprobando si está relleno
 *
 * @return {*} Boolean
 */
function validarLocalidad() {
    resettext(localidadInput);
    if (localidadInput.validity.valueMissing) {
        errortext(localidadInput, "Campo obligatorio");
    } else {
        goodtext(localidadInput);
        return true;
    }
}

/**
 * Valida el telefono del formulario comprobando si está relleno
 *
 * @return {*} Boolean
 */

function validarTelefono() {
    resettext(telefonoInput);
    if (telefonoInput.validity.patternMismatch) {
        errortext(telefonoInput, "Debe empezar por 6, 8 o 9 y tener 9 dígitos");
    } else if (telefonoInput.validity.valueMissing) {
        errortext(telefonoInput, "Campo obligatorio");
    } else {
        goodtext(telefonoInput);
        return true;
    }
}


/**
 * 
 *
 * @param {*} carga
 */
function estadoCargaBoton(carga) {
    if (carga) {
        anadirTiendaButton.disabled = true;
        anadirTiendaButton.innerHTML = `<i class="fas fa-spinner iconoAnimado"></i>Cargando...`;
    } else {
        anadirTiendaButton.disabled = false;
        anadirTiendaButton.innerHTML = `Añadir tienda`;
    }
}


/**
 * Valida los campos y si si están correctos hace una petición POST para insertarlos en la base de datos
 *
 * @param {*} event
 */
function validarCampos(event) {
    var contadorValidados = 0;
    event.preventDefault();

    if (validarDireccion()) {
        contadorValidados++;
    }
    if (validarNombre()) {
        contadorValidados++;
    }
    if (validarLocalidad()) {
        contadorValidados++;
    }
    if (validarTelefono()) {
        contadorValidados++;
    }
    if (contadorValidados == 4) {
        estadoCargaBoton(true);
        var tienda = {
            telefono: telefonoInput.value,
            direccion: direccionInput.value,
            localidad: localidadInput.value,
            nombreTienda: nombreInput.value
        }
        if (METODO == "XHR") {
            var xmlhttp = new XMLHttpRequest()
            xmlhttp.open("POST", URLAPI);
            xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            xmlhttp.onreadystatechange = function () { //Call a function when the state changes.
                console.log(xmlhttp.readyState,xmlhttp.status);
                
                peticion(URLAPI);
                estadoCargaBoton(false);

            }
            xmlhttp.send(JSON.stringify(tienda));
        } else if (METODO == "fetch") {
            fetch(URLAPI, {
                    method: 'POST', // or 'PUT'
                    body: JSON.stringify(tienda), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                .catch(error => {
                    console.error('Error:', error)
                    estadoCargaBoton(false);
                })
                .then(response => {
                    console.log('Success:', response)
                    peticion(URLAPI);
                    estadoCargaBoton(false);
                });
        } else if (METODO == "jquery") {
            $.ajax({
                type: "POST",
                //the url where you want to sent the userName and password to
                url: URLAPI,
                contentType: 'application/json',
                dataType: 'json',
                //json object to sent to the authentication url
                data: JSON.stringify(tienda),
                success: function () {
                    estadoCargaBoton(false);
                },
                error: function (jqXHR, status, error) { //función error
                    estadoCargaBoton(false);
                },
                complete: function () {
                    peticion(URLAPI);
                }
            });
        }
        formNuevatienda.reset();
    }
}

/**
 * Pone el borde del elemento en rojo y añade un texto
 *
 * @param {*} elemento
 * @param {*} texto
 */
function errortext(elemento, texto) {
    elemento.nextElementSibling.hidden = false;
    elemento.nextElementSibling.innerHTML = texto;
    elemento.style.borderColor = "red";
}


/**
 * pone el borde del elemento en verde
 *
 * @param {*} elemento
 */
function goodtext(elemento) {
    elemento.style.borderColor = "green";
}

/**
 *Rsetea el borde y el texto del elemento
 *
 * @param {*} elemento
 */
function resettext(elemento) {
    elemento.nextElementSibling.hidden = true;
    elemento.nextElementSibling.innerHTML = ``;
    elemento.style.borderColor = "";
}


/**
 * Anima el menú de nueva tienda
 *
 */
function animarNuevaTienda() {
    if (nuevaTiendaAnimada) {
        formNuevatienda.className = "";
    } else {
        formNuevatienda.className = "animarNuevaTienda";
    }
    nuevaTiendaAnimada = !nuevaTiendaAnimada;
}


/**
 *Elige el metodo y realiza la petición
 *
 * @param {*} tipo
 */
function eleccion(tipo) {
    METODO = tipo;
    mostrarCargaPeticion();
    peticion(URLAPI);
}


/**
 * muestra la carga de peticion
 *
 */

function mostrarCargaPeticion() {
    chooseMethod.style.display = "none";
    loadingPage.style.display = "flex";
}


/**
 *Muestra el error de carga
 *
 */
function mostrarErrorCarga() {
    loadingPage.style.display = "none";
    errorPage.style.display = "flex";
}

/**
 * Muestra la página de tiendas
 *
 */
function mostrarPagTiendas() {
    loadingPage.style.display = "none";
    paginaPeticion.style.display = "flex";
}


/**
 * Realiza una búsqueda de tienda por id
 *
 */
function buscarIdTienda() {
    if (busquedaIndividualHecha) {
        mostrarCargaPeticion();
        peticion(URLAPI);
        iconoBusqueda.className = "fas fa-search searchicon";
    } else {
        iconoBusqueda.className = "fas fa-spinner searchicon iconoAnimado";
        if (!isNaN(buscadorTienda.value)) {
            peticion(URLAPI + "/" + buscadorTienda.value, true);
        } else {
            peticion(URLAPI + "/-1", true);
        }
    }
    busquedaIndividualHecha = !busquedaIndividualHecha;
}


/**
 * Realiza una peticion get de tiendas a una api según el método escogido
 *
 * @param {*} string
 * @param {*} boolean
 */
function peticion(Url, buscadId) {
    var tiendas;
    if (METODO == "XHR") {
        var req = new XMLHttpRequest();
        req.open('GET', Url, true);
        req.onreadystatechange = function (aEvt) {
            if (req.readyState == 4) {
                if (req.status == 200) {
                    tiendas = req.responseText;
                    cargarTiendas(JSON.parse(tiendas));
                    mostrarPagTiendas();
                    if (buscadId) {
                        iconoBusqueda.className = "fas fa-times searchicon";
                    }
                } else {
                    if (buscadId) {
                        errorTiendaNoEncontrada();
                        iconoBusqueda.className = "fas fa-times searchicon";
                    } else if (!buscadId) {
                        mostrarErrorCarga();
                    }

                }
            }
        };
        req.send(null);
    } else if (METODO == "fetch") {
        // Opciones de la petición (valores por defecto)
        fetch(Url).then(function (response) {
                if (response.ok) {
                    response.json().then(function (json) {
                        cargarTiendas(json);
                        mostrarPagTiendas();
                        if (buscadId) {
                            iconoBusqueda.className = "fas fa-times searchicon";
                        }
                    });
                } else {
                    console.log('Respuesta de red OK pero respuesta HTTP no OK');
                }
            })
            .catch(function (error) {
                if (buscadId) {
                    errorTiendaNoEncontrada();
                    iconoBusqueda.className = "fas fa-times searchicon";
                } else if (!buscadId) {
                    mostrarErrorCarga();
                }

            })
    } else if (METODO == "jquery") {
        $.ajax({
            url: Url, //URL de la petición
            type: 'GET', //tipo de la petición: POST o GET
            dataType: 'json', //tipo de dato que se espera
            success: function (json) { //función a ejecutar si es satisfactoria
                cargarTiendas(json);
                mostrarPagTiendas();
                if (buscadId) {
                    iconoBusqueda.className = "fas fa-times searchicon";
                }
            },
            error: function (jqXHR, status, error) { //función error 
                if (buscadId) {
                    errorTiendaNoEncontrada();
                    iconoBusqueda.className = "fas fa-times searchicon";
                } else if (!buscadId) {
                    mostrarErrorCarga();
                }
            }
        });
    }
}

/**
 * Muestra un error de tienda no econtrada
 *
 */
function errorTiendaNoEncontrada() {
    borrarHijos(LISTATIENDAS);
    LISTATIENDAS.appendChild(crearNodo("h1", "Tienda no encontrada", "nombreTienda"));
}


/**
 * Borra y carga las tiendas de la petición
 *
 * @param {*} objTiendas
 */
function cargarTiendas(objTiendas) {
    borrarHijos(LISTATIENDAS);
    if (!Array.isArray(objTiendas)) {
        objTiendas = new Array(objTiendas);
    }
    objTiendas.forEach(element => {
        let newTienda = crearNodo("div", undefined, "contenedorTienda");
        newTienda.appendChild(crearNodo("h1", element.nombreTienda, "nombreTienda"));
        newTienda.appendChild(crearNodo("p", element.direccion + "(" + element.localidad + ")", "nombreTienda"));
        newTienda.appendChild(crearNodo("p", element.telefono, "nombreTienda"));
        LISTATIENDAS.appendChild(newTienda);
    });

}


/**
 *Borra los hijos de un nodo
 *
 * @param {*} node
 */
function borrarHijos(node) {
    while (node.lastElementChild) {
        borrarHijos(node.lastElementChild);
        node.removeChild(node.lastElementChild);
    }
}

/**
 * Crea un nodo
 *
 * @param {*} tipoElemento
 * @param {*} texto
 * @param {*} clase
 * @return {*} 
 */
function crearNodo(tipoElemento, texto, clase) {
    let nodo = document.createElement(tipoElemento);
    if (texto != undefined) {
        let text = document.createTextNode(texto);
        nodo.appendChild(text);
    }
    if (clase != undefined)
        nodo.className = clase;
    return nodo;
}