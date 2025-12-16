<template>
  <ClientOnly>
    <UModal v-model:open="show" title="اختر موقع البطولة" description="اختر موقع البطولة" 
    :ui="{
      content: 'min-w-[600px] min-h-[600px] max-w-[1200px] max-h-[800px]  p-5  ',
    }" >
  <!-- <UFormField :label="props.label" :name="props.name" :required="props.required"  :help="lat!=0 && lng!=0 ? 'تم اختيار الموقع' : 'يرجى اختيار الموقع'" > -->
    <UButton  @click="show = true" :color="model.latitude!=0 && model.longitude!=0 ? 'success' : 'neutral'" variant="soft" icon="i-heroicons-map-pin" label="اختر موقع البطولة" />
   <!-- </UFormField> -->
   
    <template #body>

      <div class=" w-full h-full">
      <Loading  v-show="!map"/>
        <div   id="map" class="min-w-[600px] min-h-[600px] max-w-[1200px] max-h-[800px]  p-5 mx-auto z-0" ></div>
      
        <div v-if="props.showInputs" class="flex justify-between items-center w-full p-2 gap-2">
          <UFormField label="الطول" name="latitude">
            <UInput type="number" v-model="model.latitude" label="الطول" />
          </UFormField>
          <UFormField label="العرض" name="longitude">
            <UInput type="number" v-model="model.longitude" label="العرض" />
          </UFormField>
          <UButton label="حفظ" @click="saveLocation" />
        </div>
      </div>

    </template>
    <template #footer>
      <UButton @click="show = false; " color="primary" variant="soft" icon="i-heroicons-check" label="تأكيد" />
    </template>
  </UModal>
</ClientOnly>
</template>

<script lang="ts" setup>
const show = ref(false);
const map = ref();
let L: any = null;
let MyIcon: any = null;
  const props  =withDefaults(defineProps<{showInputs?:boolean}>(), {
    showInputs: true
  })

interface LocationObject {
  latitude: number;
  longitude: number;
}


const model = defineModel<LocationObject>({
  required: true,
  default: () => ({
    latitude: 0,
    longitude: 0
  })
});

// const lat = ref(props.modelValue.lat);
// const lng = ref(props.modelValue.lng);

const initializeLeaflet = async () => {
  if (typeof window !== 'undefined' && !L) {
    L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');
    
    MyIcon = L.icon({
      iconUrl: '/images/location.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }
};

const getLocation = async () => {
  if (typeof window === 'undefined') return;
  
  await initializeLeaflet();
  
  if (navigator.geolocation && L) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      if (!(model.value.latitude && model.value.longitude)) {
        model.value.latitude = position.coords.latitude;
        model.value.longitude = position.coords.longitude;
      }


      map.value = L.map("map", { attributionControl: false }).setView(
        [model.value.latitude, model.value.longitude],
        9
      ).on('click', onClick);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map.value);
      L.marker([model.value.latitude, model.value.longitude], {icon: MyIcon})
        .addTo(map.value)
       
    });
  }
};

// onMounted(() => {
//   getLocation();
// });
if (process.client) {
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




}

const saveLocation = () => {
  if (!L || !map.value || typeof window === 'undefined') return;  
  map.value.eachLayer((layer: any) => {
    if (layer instanceof L.Marker) {
      map.value.removeLayer(layer);
    }
  });

  // Add new marker at clicked location
  L.marker([model.value.latitude, model.value.longitude], {  icon: MyIcon })
    .addTo(map.value)
  
  // Zoom to marker location
  map.value.setView([model.value.latitude, model.value.longitude], 10);

}



const onClick = ({latlng}: {latlng: {lat: number, lng: number}}) => {
  if (!L || !map.value || typeof window === 'undefined') return;
  
  map.value.eachLayer((layer: any) => {
    if (layer instanceof L.Marker) {
      map.value.removeLayer(layer);
    }
  });

  // Add new marker at clicked location
  L.marker([latlng.lat, latlng.lng], {  icon: MyIcon })
    .addTo(map.value)

  // Update model values - ensure reactivity
  model.value = {
    latitude: latlng.lat,
    longitude: latlng.lng
  };
  
  // Zoom to marker location
  // map.value.setView([latlng.lat, latlng.lng], 15);
}

if (process.client) {
  onUnmounted(() => {
    if (map.value) {
      map.value.remove();
      map.value = undefined;
    }
  });
}
</script>

<style></style>
