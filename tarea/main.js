document.addEventListener('DOMContentLoaded', () => {
    // Función para cargar el catálogo de películas al cargar la página
    function cargarCatalogo() {
        fetch('/peliculas')
            .then(response => response.json())
            .then(data => {
                // Obtener el contenedor donde se mostrarán las películas
                const catalogoContainer = document.getElementById('catalogo');
                catalogoContainer.innerHTML = '';

                // Iterar sobre cada película en los datos recibidos
                data.pelicula.forEach(pelicula => {
                    // Crear un elemento para mostrar la película
                    const peliculaDiv = document.createElement('div');
                    peliculaDiv.classList.add('pelicula');

                    // Crear elementos para mostrar la información de la película
                    const nombre = document.createElement('h2');
                    nombre.textContent = pelicula.nombre;
                    const año = document.createElement('p');
                    año.textContent = `Año: ${pelicula.año}`;
                    const director = document.createElement('p');
                    director.textContent = `Director: ${pelicula.director}`;
                    const actores = document.createElement('p');
                    actores.textContent = `Actores: ${pelicula.actores.join(', ')}`;
                    const imagen = document.createElement('img');
                    imagen.src = pelicula.img;
                    imagen.alt = pelicula.nombre;

                    // Agregar los elementos al contenedor de la película
                    peliculaDiv.appendChild(nombre);
                    peliculaDiv.appendChild(año);
                    peliculaDiv.appendChild(director);
                    peliculaDiv.appendChild(actores);
                    peliculaDiv.appendChild(imagen);

                    // Agregar el contenedor de la película al contenedor principal
                    catalogoContainer.appendChild(peliculaDiv);
                });
            })
            .catch(error => {
                console.error('Error al obtener el catálogo de películas:', error);
            });
    }

    // Llamar a cargarCatalogo() cuando se cargue la página por primera vez
    cargarCatalogo();

    // Agregar un evento de escucha para el formulario de agregar película
    document.getElementById('movie-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        // Obtener los valores del formulario
        const title = document.getElementById('nombre').value;
        const year = document.getElementById('año').value;
        const director = document.getElementById('director').value;
        const actors = document.getElementById('actores').value;

        // Enviar los datos al servidor para agregar la película
        fetch('/catalog/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, year, director, actors })
        })
        .then(response => response.text())
        .then(message => {
            alert(message); // Mostrar un mensaje de éxito o error
            cargarCatalogo(); // Volver a cargar el catálogo después de agregar una película
        })
        .catch(error => {
            console.error('Error al agregar la película:', error);
            alert('Error al agregar la película. Por favor, intenta de nuevo.');
        });
    });

    // Agregar un evento de escucha para el botón de eliminar película
    document.getElementById('eliminarBtn').addEventListener('click', function() {
        // Aquí puedes mostrar un formulario modal para eliminar una película
        console.log('Eliminar película');
    });
});
