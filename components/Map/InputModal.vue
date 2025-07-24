<template>
  <ClientOnly>
    <UModal v-model:open="show" title="اختر موقع البطولة" description="اختر موقع البطولة" 
    :ui="{
      content: 'min-w-[600px] min-h-[600px] max-w-[1200px] max-h-[800px]  p-5  ',
    }" >
  <!-- <UFormField :label="props.label" :name="props.name" :required="props.required"  :help="lat!=0 && lng!=0 ? 'تم اختيار الموقع' : 'يرجى اختيار الموقع'" > -->
    <UButton  @click="show = true" :color="model.lat!=0 && model.lng!=0 ? 'primary' : 'neutral'" variant="soft" icon="i-heroicons-map-pin" label="اختر موقع البطولة" />
   <!-- </UFormField> -->
   
    <template #body>
      <div class=" w-full h-full">
        <div id="map" class="min-w-[600px] min-h-[600px] max-w-[1200px] max-h-[800px]  p-5 mx-auto z-0" ></div>
      </div>
    </template>
    <template #footer>
      <UButton @click="show = false; " color="primary" variant="soft" icon="i-heroicons-check" label="تأكيد" />
    </template>
  </UModal>
</ClientOnly>
</template>

<script lang="ts" setup>

const L = await import('leaflet');
await import('leaflet/dist/leaflet.css');


const MyIcon = L.icon({
  iconUrl: '/images/location.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const show = ref(false);
const map = ref();

interface LocationObject {
  lat: number;
  lng: number;
}


const model = defineModel<LocationObject>({
  required: true,
  default: () => ({
    lat: 0,
    lng: 0
  })
});

// const lat = ref(props.modelValue.lat);
// const lng = ref(props.modelValue.lng);


const getLocation = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      if (!(model.value.lat && model.value.lng)) {
        model.value.lat = position.coords.latitude;
        model.value.lng = position.coords.longitude;
      }


      map.value = L.map("map", { attributionControl: false }).setView(
        [model.value.lat, model.value.lng],
        9
      ).on('click', onClick);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map.value);
      L.marker([model.value.lat, model.value.lng], {icon: MyIcon})
        .addTo(map.value)
       
    });
  }
};

// onMounted(() => {
//   getLocation();
// });
watch(show, (newVal) => {
  if (newVal) {
    getLocation();
  }
  else{
    if (map.value) {
      map.value.remove();
      map.value = undefined;
    }
  }
});
const onClick = ({latlng}: {latlng: {lat: number, lng: number}}) => {
  map.value.eachLayer((layer: any) => {
    if (layer instanceof L.Marker) {
      map.value.removeLayer(layer);
    }
  });

  // Add new marker at clicked location
  L.marker([latlng.lat, latlng.lng], {  icon: MyIcon })
    .addTo(map.value)

  model.value.lat = latlng.lat;
  model.value.lng = latlng.lng;
}

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
    map.value = undefined;
  }
});
</script>

<style></style>
