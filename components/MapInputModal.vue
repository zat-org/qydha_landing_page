<template>
  <UModal>
    <UCard
      :ui="{
        base: 'w-[800px]',
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            اختر موقع البطولة
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="onSuccess"
          />
        </div>
      </template>
      <ClientOnly>
        <div
          ref="mapContiner"
          id="map"
          class="w-[600px] h-[600px] p-5 mx-auto z-0"
        ></div>
      </ClientOnly>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
const modal = useModal();
const map = ref();
const mapContiner = ref();
const props = defineProps<{ lat?: number; log?: number }>();
const lat = ref(props.lat);
const log = ref(props.log);
const emit = defineEmits(["success"]);

function onSuccess() {
  emit("success", lat.value, log.value);
}

const getLocation = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      if (!(lat.value && log.value)) {
        lat.value = position.coords.latitude;
        log.value = position.coords.longitude;
      }

      // Lazy load Leaflet
      const L = await import('leaflet');
      // Import CSS only when needed
      await import('leaflet/dist/leaflet.css');

      map.value = L.map("map", { attributionControl: false }).setView(
        [lat.value, log.value],
        9
      );

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map.value);
      L.marker([lat.value, log.value], { draggable: true })
        .addTo(map.value)
        .on("dragend", (event: any) => {
          lat.value = event.target._latlng.lat;
          log.value = event.target._latlng.lng;
        });
    });
  }
};

onMounted(() => {
  getLocation();
});

onUnmounted(() => {
  if (map.value) {
    map.value.remove();
    map.value = undefined;
  }
});
</script>

<style></style>
