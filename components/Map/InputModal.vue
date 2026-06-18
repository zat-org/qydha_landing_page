<template>
  <ClientOnly>
    <UModal
      v-model:open="show"
      title="اختر موقع البطولة"
      description="اختر موقع البطولة"
      :ui="{
        content:
          'min-w-[600px] min-h-[600px] max-w-[1200px] max-h-[800px]  p-5  ',
      }"
    >
      <UButton
        :color="
          model.latitude != 0 && model.longitude != 0 ? 'success' : 'neutral'
        "
        variant="soft"
        icon="i-heroicons-map-pin"
        label="اختر موقع البطولة"
        @click="show = true"
      />

      <template #body>
        <div class="w-full h-full">
          <Loading v-show="mapLoading" />
          <div
            ref="mapContainer"
            class="min-w-[600px] min-h-[600px] max-w-[1200px] max-h-[800px] p-5 mx-auto z-0"
          />

          <div
            v-if="props.showInputs"
            class="flex justify-between items-center w-full p-2 gap-2"
          >
            <UFormField label="الطول" name="latitude">
              <UInput v-model="model.latitude" type="number" label="الطول" />
            </UFormField>
            <UFormField label="العرض" name="longitude">
              <UInput v-model="model.longitude" type="number" label="العرض" />
            </UFormField>
            <UButton label="حفظ" @click="saveLocation" />
          </div>
        </div>
      </template>
      <template #footer>
        <UButton
          color="primary"
          variant="soft"
          icon="i-heroicons-check"
          label="تأكيد"
          @click="show = false"
        />
      </template>
    </UModal>
  </ClientOnly>
</template>

<script lang="ts" setup>
import L from "leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";


const show = ref(false);
const map = ref<LeafletMap>();
const mapContainer = ref<HTMLElement>();
const mapLoading = ref(false);
let marker: L.Marker | null = null;





const props = withDefaults(defineProps<{ showInputs?: boolean }>(), {
  showInputs: true,
});

interface LocationObject {
  latitude: number;
  longitude: number;
}

const model = defineModel<LocationObject>({
  required: true,
  default: () => ({
    latitude: 0,
    longitude: 0,
  }),
});

// const DEFAULT_CENTER = { latitude: 24.7136, longitude: 46.6753 };

const MyIcon = L.icon({
  iconUrl: "/images/location.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const getInitialCenter = () => {
  return {
    lat: model.value.latitude ?? 0,
    lng: model.value.longitude ?? 0,
  };
  // return {
  //   lat: DEFAULT_CENTER.latitude,
  //   lng: DEFAULT_CENTER.longitude,
  // };
};

const setMarker = (lat: number, lng: number) => {
  if (!map.value) return;

  if (marker) {
    marker.setLatLng([lat, lng]);
    return;
  }

  marker = L.marker([lat, lng], { icon: MyIcon }).addTo(map.value);
};

const destroyMap = () => {
  marker = null;

  if (map.value) {
    map.value.remove();
    map.value = undefined;
  }
};

const initMap = async () => {
  if (typeof window === "undefined" || !mapContainer.value) return;

  destroyMap();

  const center = getInitialCenter();

  map.value = L.map(mapContainer.value, { attributionControl: false })
    .setView([center.lat, center.lng], 9)
    .on("click", onClick);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map.value);

  setMarker(center.lat, center.lng);
};

const tryGeolocation = () => {
  // if (model.value.latitude && model.value.longitude) return;
  // console.log(model.value);



    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        model.value = { latitude, longitude };
        setMarker(latitude, longitude);
        map.value?.setView([latitude, longitude], 9);
        console.log("tryGeolocation success");
      },
      (error: any) => {
        console.log("tryGeolocation error");
        console.log(error.message);
      },
    );

};

const openMap = async () => {
  mapLoading.value = true;

  try {
    await nextTick();
    tryGeolocation();
    await initMap();

    await nextTick();
    requestAnimationFrame(() => {
      map.value?.invalidateSize();
    });
  } finally {
    mapLoading.value = false;
  }
};

if (import.meta.client) {
  watch(show, (isOpen) => {
    if (isOpen) {
      openMap();
      return;
    }

    destroyMap();
  });
}

const saveLocation = () => {
  if (!map.value) return;

  setMarker(model.value.latitude, model.value.longitude);
  map.value.setView([model.value.latitude, model.value.longitude], 10);
};

const onClick = ({ latlng }: { latlng: { lat: number; lng: number } }) => {
  if (!map.value) return;

  model.value = {
    latitude: latlng.lat,
    longitude: latlng.lng,
  };

  setMarker(latlng.lat, latlng.lng);
};

if (import.meta.client) {
  onUnmounted(() => {
    destroyMap();
  });
}
</script>

<style></style>
