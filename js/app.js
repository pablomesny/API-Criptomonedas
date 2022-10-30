const criptomonedasSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

eventListeners();

function eventListeners() {
    document.addEventListener('DOMContentLoaded', consultarCriptomonedas);
    formulario.addEventListener('submit', validarFormulario);
}

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => mostrarCriptomonedas(resultado))
            
}

function mostrarCriptomonedas(resultado) {

    for(let i = 0; i < resultado.Data.length; i++) {
        const selectCriptomoneda = document.createElement('option');
        const nombreCriptomoneda = resultado.Data[i].CoinInfo.FullName;

        selectCriptomoneda.value = resultado.Data[i].CoinInfo.Name;
        selectCriptomoneda.textContent = nombreCriptomoneda;

        criptomonedasSelect.appendChild(selectCriptomoneda);
    }
}

function validarFormulario(e) {
    e.preventDefault();

    
    const moneda = document.querySelector('#moneda').value;
    const criptomoneda = document.querySelector('#criptomonedas').value;
    
    if(moneda === '' || criptomoneda === '') {
        mostrarMensaje('Ambos campos son obligatorios');
        return;
    }
    
    spinner();
    consultarCotizaciones(moneda, criptomoneda);    
}

function mostrarMensaje(mensaje) {
    const existeAlerta = document.querySelector('.error');

    if(!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('error');
        alerta.textContent = mensaje;

        resultado.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function consultarCotizaciones(moneda, criptomoneda) {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => mostrarCotizaciones(resultado.RAW[criptomoneda][moneda]))
}

function mostrarCotizaciones(cotizacion) {
    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precioActual = numerosConPunto(PRICE);
    const precioMax = numerosConPunto(HIGHDAY);
    const precioMin = numerosConPunto(LOWDAY);
    const variacion = porcentajeVariacion(CHANGEPCT24HOUR);

    console.log(PRICE);

    const resultadoHTML = document.createElement('div');
    resultadoHTML.classList.add('resultado');
    resultadoHTML.innerHTML = `
    <h2>El precio es: $${precioActual}</h2>
    <p>Precio más alto del día: <span>$${precioMax}</span></p>
    <p>Precio más bajo del día: <span>$${precioMin}</span></p>
    <p>Variación últimas 24hs: <span>${variacion}%</span></p>
    <p>Última actualización hace: <span>${LASTUPDATE} ms</span></p>
    `;

    resultado.appendChild(resultadoHTML);
}

function numerosConPunto(numero) {
    let array = numero.toFixed(2).toString().split('.');
    array[0] = array[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
    return array.join(',');
}

function porcentajeVariacion(numero){
    return numero.toFixed(3);
}

function spinner() {
    limpiarHTML();

    const spinnerSelect = document.querySelector('.lds-roller');

    if(!spinnerSelect){
        const spinner = document.createElement('div');
        spinner.classList.add('lds-roller');
        spinner.innerHTML = `
        <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        `;
        resultado.appendChild(spinner);
    }
}

function limpiarHTML() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}