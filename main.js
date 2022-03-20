
// Llamado a fetch para consumir la api

fetch("https://apipetshop.herokuapp.com/api/articulos")
	.then((response) => {
		return response.json()
	})
	.then((data) => {

		app.objects = data.response
		app.medicamentos = getMedicamentos()
		app.juguetes = getJuguetes()
	})



var app = new Vue({
	el: "#app",
	data: {
		objects: [],
		medicamentos: [],
		juguetes: [],
		carrito: [],
		totalCarrito: 0,
		filterField: '',
		objetosFiltrados: [],
		elementoRepetido: [],
		nombre: "",
		imagenCompra: "https://img.freepik.com/foto-gratis/apreton-manos-negocios-dos-hombres-que-demuestran-su-acuerdo-firmar-acuerdo-o-contrato-sus-empresas-empresas-empresas_1423-100.jpg?size=626&ext=jpg"
	},
	methods: {
		// Funcion que utiliza el buscador de articulos para filtrar por palabras, corrobora que un articulo contenga una palabra o una parte de una palabra y devuelve una lista
		filter(tienda) {
			return tienda.filter((element) => {
				if (element.nombre.toLowerCase().includes(this.filterField.toLowerCase()) || this.filterField == "") {
					return element
				}
			})
		},
		vaciarCarrito() {
			this.carrito = [];
			this.totalCarrito = 0;
			console.log(this.carrito);
		},
		//Esta función agrega el articulo al carrito, por el momento unicamente muestra este cartel que se agrego el articulo
		addCarrito(product) {
			if (product.stock > 0) {
				// if (this.carrito == "") {
				this.carrito.push(product);
				this.totalCarrito += product.precio;
				localStorage.setItem("producto", JSON.stringify(this.carrito))
				// }
				// else {
				// 	if(this.elementoRepetido.includes(this.elementoRepetido)) {
				// 		this.elementoRepetido.push(`${product.nombre} x2`);
				// 		this.totalCarrito += product.precio;
				// 	}
				// }
				product.stock--;
				Swal.fire({
					icon: 'success',
					imageUrl: `${product.imagen}`,
					text: `Se agrego el producto ${product.nombre} al carrito ($ ${product.precio})`,
					showConfirmButton: false,
					timerProgressBar: true,
					timer: 2000
				});
			}
			else {
				Swal.fire({
					icon: 'error',
					text: 'Lo sentimos, ya no quedan unidades disponibles!',
					showConfirmButton: false,
					timer: 2000
				});
			}
		},
		buy(compra) {
			Swal.fire({
				text: 'Ingrese su nombre para validar la compra',
				input: 'text',
				inputAttributes: {
					autocapitalize: 'off'
				},
				showCancelButton: true,
				confirmButtonText: 'Comprar',
				showLoaderOnConfirm: true,
				preConfirm: (login) => {
					app.nombre = login
					return fetch(`https://apipetshop.herokuapp.com/api/articulos`)
						.then(response => {
							if (!response.ok) {
								throw new Error(response.login)
							}
							return response.json()
						})
						.catch(error => {
							Swal.showValidationMessage(`${error}: sin datos válidos`)
						})
				},
				allowOutsideClick: () => !Swal.isLoading()
			}).then((result) => {
				if (result.isConfirmed) {
					Swal.fire({
						text: app.nombre + " su compra a sido procesada con éxito",
						imageUrl: app.imagenCompra
					})
				}
			})
			this.carrito = [];
			this.totalCarrito = 0;
		},
		eliminar(art) {
			indice = this.carrito.indexOf(art)
			this.carrito.splice(indice, 1)
			this.totalCarrito -= art.precio
			localStorage.setItem("producto", JSON.stringify(this.carrito))
			return element.stock
		},
		formEnviado() {
			let input1 = document.querySelector("#nombre")
			let input2 = document.querySelector("#apellido")
			let input3 = document.querySelector("#provincia")
			let input4 = document.querySelector("#localidad")
			let input5 = document.querySelector("#direccion")
			let input6 = document.querySelector("#codigopostal")
			let input7 = document.querySelector("#tel")
			let input8 = document.querySelector("#email")

			if (input1.value != "" && input2.value != "" && input3.value != "" && input4.value != "" && input5.value != "" && input6.value != "" && input7.value != "" && input8.value != "") {
				Swal.fire({
					icon: 'success',
					text: 'Se envió el formulario con éxito',
					showConfirmButton: false
				});
			}
			else {
				Swal.fire({
					icon: 'error',
					text: 'Se detectaron campos sin rellenar!',
					showConfirmButton: false,
					timer: 2000
				});
			}
		},
	}
})

if (localStorage.getItem("producto")) {
	app.carrito = JSON.parse(localStorage.getItem("producto"))
	app.carrito.forEach((element) => {
		app.totalCarrito += element.precio
	})
}


// Funcion que obtiene de la lista general de objetos traidos del JSON solo los articulos de farmacia
function getMedicamentos() {
	let medicamentos = []
	app.objects.forEach((element) => {
		if (element.tipo == "Medicamento") {
			medicamentos.push(element)
		}
	})

	return medicamentos
}

// Funcion que obtiene de la lista general de objetos traidos del JSON solo los articulos Juguetes
function getJuguetes() {
	let juguetes = []
	app.objects.forEach((element) => {
		if (element.tipo == "Juguete") {
			juguetes.push(element)
		}
	})
	console.log(juguetes);
	return juguetes
}


