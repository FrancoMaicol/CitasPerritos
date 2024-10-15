//Selectores
const pacienteInput = document.querySelector('#paciente')
const propietarioInput = document.querySelector('#propietario')
const emailInput = document.querySelector('#email')
const fechaInput = document.querySelector('#fecha')
const sintomasInput = document.querySelector('#sintomas')
const contenedorCitas = document.querySelector('#citas')
const formulario = document.querySelector('#formulario-cita')
const formularioInput = document.querySelector('#formulario-cita input[type="submit"]')

formulario.addEventListener('submit', submitCita)
//eventos
pacienteInput.addEventListener('change', datosCita)
propietarioInput.addEventListener('change', datosCita)
emailInput.addEventListener('change', datosCita)
fechaInput.addEventListener('change', datosCita)
sintomasInput.addEventListener('change', datosCita)

//Para realizar la acción de editar al paciente
let editando = false

const citasObj = {
    id: generarId(),
    paciente: '',
    propietario: '',
    email: '',
    fecha: '',
    sintomas: ''
}

class Notificacion {
    constructor({texto, tipo}) {
        this.texto = texto,
        this.tipo = tipo

        this.mostrar()
    }

    mostrar() {
        const alerta = document.createElement('DIV')
        alerta.classList.add('text-center', 'w-full', 'p-3', 'text-white', 'my-5', 'alert', 'uppercase', 'font-bold', 'text-sm')
        alerta.textContent = this.texto 

        //Para que no haya duplicados en el mensaje de alerta
        const alertaPrev = document.querySelector('.alert')
        //O una forma más actualizada sería la siguiente:
        // Con el optional change, solo es agregar un "?"
        alertaPrev?.remove()
        //Esta es una forma de hacerlo
        // if(alertaPrev) {
        //     alertaPrev.remove()
        // }

        this.tipo === 'error' ? alerta.classList.add('bg-red-500') : alerta.classList.add('bg-green-500')
        //lo que quiere decir aqui es que parentElement toma el valor "padre" del formulario y agrega alerta arriba del mismo
        
        formulario.parentElement.insertBefore(alerta, formulario)
       
        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

class AdminCitas {
    constructor() {
        this.citas = []
    }

    agregar(cita) {
        this.citas = [...this.citas, cita]
        // console.log(this.citas)
        //Mandamos a llamar al método para mostrarlo en el HTML
        this.mostrar()
    }

    editar(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)

        this.mostrar()
    }

    elimiarRegistro(id) {
        this.citas = this.citas.filter(cita => cita.id !== id)

        this.mostrar()
    }

    mostrar() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }



        this.citas.forEach(cita => {
            const divCita = document.createElement('div');
            divCita.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10' ,'rounded-xl', 'p-3');
        
            const paciente = document.createElement('p');
            paciente.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            paciente.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${cita.paciente}`;
        
            const propietario = document.createElement('p');
            propietario.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            propietario.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${cita.propietario}`;
        
            const email = document.createElement('p');
            email.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${cita.email}`;
        
            const fecha = document.createElement('p');
            fecha.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${cita.fecha}`;
        
            const sintomas = document.createElement('p');
            sintomas.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            sintomas.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${cita.sintomas}`;
        
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEditar.innerHTML = 'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
            //Toma una copia del arreglo para traer todos los valores es como usar el spread operator ({...cita})
            const clone = structuredClone(cita)
            btnEditar.onclick = () => cargarEdicion(clone)

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            
            btnEliminar.onclick = () => this.elimiarRegistro(cita.id)

            const contenedorBotones = document.createElement('DIV')
            contenedorBotones.classList.add('flex', 'justify-between', 'mt-10')
            contenedorBotones.appendChild(btnEditar)
            contenedorBotones.appendChild(btnEliminar)
            // Agregar al HTML
            divCita.appendChild(paciente);
            divCita.appendChild(propietario);
            divCita.appendChild(email);
            divCita.appendChild(fecha);
            divCita.appendChild(sintomas);
            divCita.appendChild(contenedorBotones)
            contenedorCitas.appendChild(divCita);
            
        })
    }
}

const citas = new AdminCitas()

function datosCita(e) {
    //Para que esto funcione y se le asgine dinámicamente los valores del elemento del html "name" tiene que coincidir con el nombre del objeto creado
    // en este caso se accede a la propiedad name del input y se utiliza como clave del objeto
    // e.target.name = paciente
    citasObj[e.target.name] = e.target.value
    // console.log(citasObj)
}

function submitCita(e) {
    e.preventDefault()
    console.log(citasObj)
    // //realizamos un destructuring para extraer los datos
    // const{paciente, propietario, email, fecha, sintomas} = citasObj
    // if(paciente.trim() === '') {
    //     console.log("Todos los campos son obligatorios")
    //     return
    // }
    if(Object.values(citasObj).some(valor => valor.trim() === '')){
        //Asi funciono, ya que se manda a llamar de igual forma la clase y esta ya tiene los valores del constructor pero siempre y cuando en el constructor se tenga el mismo valor, es decir, si es una array no funciona
        // const notificacion = new Notificacion("Todos los campos son obligatorios", 'success')
        
        //otra forma sería la siguiente
        // const notificacion = new Notificacion({
        //     texto: "Todos los campos son obligatorios",
        //     tipo: 'error'
        // })
        // console.log(notificacion)
        // notificacion.mostrar()

        //También se podría de la siguiente manera
        new Notificacion({
            texto: 'Todos los campos son obligatorios',
            tipo: 'error'
        })
        return
    }

    if(editando) {
        // console.log("Editando registro")
        //Una vez que editando pase a true y se aplique esta condicion seguira en estado true
        citas.editar({...citasObj})
        new Notificacion({
            texto: 'Actualizado Correctamente',
            tipo: 'exito'
        })
    }else{
        //editando marca como false por eso cumple esta condición 
        citas.agregar({...citasObj})
        new Notificacion({
            texto: 'Paciente registrado correctamente',
            tipo: 'exito'
        })
        console.log(editando)
    }
    //Agrega la cita al objeto
    //En esta forma sobreescribira los valores una vez agregado otro "paciente", tendríamos que hacer una copia para que no sobreescriba
    // // citas.agregar(citasObj)
    // citas.agregar({...citasObj})
    //Reinicia el formulario
    formulario.reset()
    //Elimina los valores del objeto
    reiniciarObjetoCita()
    //Esto nos permite poder agregar mas ususarios ya que regresa a su estado normal
    editando = false
    formularioInput.value = 'Registrar paciente'

}

function reiniciarObjetoCita() {
    //Dos formas para el reinicio 
    //Primera forma
    //citasObj.id = generarId()
    // citasObj.paciente = ''
    // citasObj.propietario = ''
    // citasObj.email = ''
    // citasObj.fecha = ''
    // citasObj.sintomas = ''

    //Segunda forma
    Object.assign(citasObj, {
        id: generarId(),
        paciente: '',
        propietario: '',
        email: '',
        fecha: '',
        sintomas: ''       
    })
}

function generarId() {
    return Math.random().toString(36).substring(2) + Date.now()
}

function cargarEdicion(cita) {
    // console.log(citasObj, cita)
    // console.log(Object.assign(citasObj, cita))
    Object.assign(citasObj, cita)

    pacienteInput.value = cita.paciente
    propietarioInput.value = cita.propietario
    emailInput.value = cita.email
    fechaInput.value = cita.fecha
    sintomasInput.value = cita.sintomas

    editando = true
    formularioInput.value = 'Guardar Cambios'
}


