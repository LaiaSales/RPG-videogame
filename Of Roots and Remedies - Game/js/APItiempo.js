const apiKey = '1d24dfb184aa65ca3cd3e978c5064fcc';

// Consulta segun ubicación del usuario
window.addEventListener('load', ()=>{

    // Variable seleccionando div donde mostraremos las imagenes del weather
    let pantallaWeather = document.querySelector('#pantalla-weather');


    // Obtenemos la geolocalización del navegador (pedimos permiso al usuario)
    // if(navigator.geolocation){ DESCOMENTAR ESTO!!!!!!!!!!!!

        navigator.geolocation.getCurrentPosition(geolocalizacion =>{
            console.log(geolocalizacion);

            let longitud = geolocalizacion.coords.longitude;
            let latitud = geolocalizacion.coords.latitude;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=${apiKey}&units=metric&lang=es`;

            // Petición de datos a la API con FETCH
            fetch(url)
            .then (response => response.json())
            .then (datos =>{ // "datos" es el nombre que le das a la info del JSON


                // Código para funcionalidad de la API
                let clima = datos.weather[0].main;
                let climaId = datos.weather[0].id;

                // Código para demo en la presentación
                // let clima = 'Clouds';
                // let clima = 'Rain';

                if (climaId === 781) {
                    iconoDom.src = 'img/tornado.svg'; 
                }

                switch(clima){
                    case 'Clouds': 
                        pantallaWeather.style.backgroundImage = 'url(img/sombra-nubes.png)';
                        pantallaWeather.style.animation = 'nubes 25s linear infinite';
                        break;
                    case 'Clear':
                        pantallaWeather.style.backgroundImage = 'none';
                        break;
                    case 'Snow':
                        pantallaWeather.style.backgroundImage = 'none'; //modificar
                        break;
                    case 'Rain':
                    case 'Drizzle':
                        pantallaWeather.style.backgroundImage = 'url(img/Rain2.png)';
                        pantallaWeather.style.animation = 'lluvia 5s linear infinite';
                        break;
                    case 'Thunderstorm': 
                        pantallaWeather.style.backgroundImage = 'none'; //modificar
                        break;
                    case 'Atmosphere': 
                        pantallaWeather.style.backgroundImage = 'none'; //modificar dust, fog, haze...
                        break;
                    default:
                        pantallaWeather.style.backgroundImage = 'none';
                }

            })

            .catch(error => console.log('Descripción errores', error))

        });
    }
});