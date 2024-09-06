
const { OpenStreetMapProvider } = require("leaflet-geosearch");

const lat = -33.7495668;
const lng = -62.0135247;

const map = L.map("mapa").setView([lat, lng], 15);

let markers = new L.FeatureGroup().addTo(map);
let marker;


document.addEventListener('DOMContentLoaded', ()=>{
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //! Buscar la direccion
    const  buscador = document.querySelector('#formbuscador');
    buscador.addEventListener('input', buscarDireccion);
});

function buscarDireccion(e){
    if (e.target.value.length > 10) {
        console.log('Buscando ...');
        //! Si existe un pin anterior limpiarlo
        markers.clearLayers();

        //! utilizar el provider y GeoCoder
        const geoCodeService = L.esri.Geocoding.geocodeService();

        const provider = new OpenStreetMapProvider();
        provider.search({ query: e.target.value }).then((resultado) =>{
            
            geoCodeService.reverse().latlng(resultado[0].bounds[0], 15).run(function(error, result){
                llenarInputs(result);
                //! Mostrar el mapa
                map.setView(resultado[0].bounds[0], 15);
                //! Agregar el pin
                marker = new L.marker(resultado[0].bounds[0],{
                    draggable: true,
                    autoPan: true
                })
                .addTo(map)
                .bindPopup(resultado[0].label)
                .openPopup()

                //! Detectar movimiento del marker
                marker.on('moveend', function(e){
                    marker = e.target;
                    const posicion = marker.getLatLng();
                    map.panTo(new L.LatLng(posicion.lat, posicion.lng));
                    //! reverse geocoding cuando el usuario reubica el pin
                    geoCodeService.reverse().latlng(posicion, 15).run(function(error, result){

                        llenarInputs(result);
                        //! asigna los valores al popup del marker
                        marker.bindPopup(result.address.LongLabel);
                    }); 
                })

                //! Asignar al contenedor markers
            })
           

        });
        markers.addLayer(marker);
    }
}

function llenarInputs(result){
    document.querySelector('#direccion').value = result.address.Address || '';
    document.querySelector('#ciudad').value = result.address.City || '';
    document.querySelector('#estado').value = result.address.Region || '';
    document.querySelector('#pais').value = result.address.CountryCode || '';
    document.querySelector('#lat').value = result.latlng.lat || '';
    document.querySelector('#lng').value = result.latlng.lng || '';

}
