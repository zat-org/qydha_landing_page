<template>
  <div  id="map" class="h-[50vh] w-full z-[0] "></div>
</template>

<script lang="ts" setup>
import L from "leaflet";

const map = ref();

const initmap = () => {
  map.value = L.map("map", { attributionControl: false }).setView([0, 0], 4);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 9,
  }).addTo(map.value);
  map.value.getPane("tilePane").style.zIndex = 0; // Adjust as needed
};

const addMarker = () => {
  // L.marker([lat.value, log.value], { draggable:false}).addTo(map.value).on("dragend", (event: any) => {
  //   lat.value = event.target._latlng.lat
  //   log.value = event.target._latlng.lng
  // })
};

onMounted(() => {
    initmap()
});

onUnmounted(() => {
  map.value = undefined;
});
</script>

<style></style>
