  <template>

    <div ref="mapContiner" id="map" class=" h-300 w-300 z-0"></div>    

</template>

<script lang="ts" setup>
import L from "leaflet";
const map = ref();
const mapContiner = ref()


const lat  = defineModel("lat")
const log  = defineModel("log")
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
    //  lat.value = position.coords.latitude
    // log.value= position.coords.longitude
      
        console.log(map.value)
        map.value = L.map("map", { attributionControl: false }).setView([lat.value, log.value], 4)

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 9
        }).addTo(map.value);
        L.marker([lat.value, log.value], { draggable:false}).addTo(map.value).on("dragend", (event: any) => {
          lat.value = event.target._latlng.lat
          log.value = event.target._latlng.lng
        })
        map.value.getPane('tilePane').style.zIndex = 0; // Adjust as needed

    })
  }

}

onMounted(()=>{
  getLocation()
})

onUnmounted(()=>{
  map.value = undefined
})

</script>

<style>

</style>