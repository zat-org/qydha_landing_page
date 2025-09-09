<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, toRefs, watch } from 'vue'
import L from 'leaflet'

// Import Leaflet CSS (this is crucial for proper rendering)
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'

// Extend Leaflet types for heatLayer
declare module 'leaflet' {
    function heatLayer(latlngs: any[], options?: any): any;
}
interface IBalootGamesCountWithLocation {
    cityName: string,
    countryName: string,
    latitude: number,
    longitude: number,
    gamesCount: number,
}
const props = defineProps<{ balootGamesCountWithLocation: IBalootGamesCountWithLocation[] }>();
const { balootGamesCountWithLocation } = toRefs(props)

const mapContainer = ref<HTMLElement>();
const map = ref<L.Map>();
const mapReady = ref(false)
const circlesLayer = ref<L.LayerGroup | null>(null)
const heatLayer = ref<any>(null)
const showHeatMap = ref(false) // Toggle between heatmap and circles
const initMap = async () => {
    if (!mapContainer.value) return;

    try {
        // Wait for DOM to be ready
        await nextTick();

        // Ensure container has proper dimensions
        if (mapContainer.value.offsetHeight === 0) {
            console.warn('Map container has no height, retrying...');
            setTimeout(initMap, 100);
            return;
        }

        map.value = L.map(mapContainer.value, {
            attributionControl: false,
            zoomControl: true,
            scrollWheelZoom: false, // Disable scroll wheel zoom to prevent container scrolling issues
            dragging: true,
            touchZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true
        }).setView([25, 40], 4);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            minZoom: 2,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            crossOrigin: true
        }).addTo(map.value);

        // Force map to invalidate size after initialization
        setTimeout(() => {
            if (map.value) {
                map.value.invalidateSize();
            }
        }, 100);

        // Wait for map to be fully initialized before adding circles
        map.value.whenReady(() => {
            mapReady.value = true
            // Add circles for each city

        });

    } catch (error) {
        console.error('Error initializing map:', error);
    }
};
const addHeatMap = () => {
    // Remove existing heatmap if any
    console.log('addHeatMap')
    if (heatLayer.value) {
        map.value!.removeLayer(heatLayer.value)
        heatLayer.value = null
    }

    if (balootGamesCountWithLocation.value && balootGamesCountWithLocation.value.length > 0) {
        // Convert data to heatmap format: [lat, lng, intensity]
        const heatPoints = balootGamesCountWithLocation.value
            .filter(city => city.latitude && city.longitude && 
                !isNaN(city.latitude) && !isNaN(city.longitude))
            .map(city => [
                city.latitude,
                city.longitude,
                Math.max(city.gamesCount / 100, 0.1) // Normalize intensity
            ])

        if (heatPoints.length > 0) {
            heatLayer.value = L.heatLayer(heatPoints, {
                radius: 30,
                blur: 1,
                maxZoom: 10,
                max: 1.0,
                gradient: {
                    0.0: 'blue',
                    0.2: 'cyan',
                    0.4: 'lime',
                    0.6: 'yellow',
                    0.8: 'orange',
                    1.0: 'red'
                }
            }).addTo(map.value!)
        }
    }
}

const addCircles = () => {
    // Remove existing circles if any
    if (circlesLayer.value) {
        circlesLayer.value.clearLayers();
    } else {
        circlesLayer.value = L.layerGroup().addTo(map.value!);
    }

    if (balootGamesCountWithLocation.value && balootGamesCountWithLocation.value.length > 0) {
        balootGamesCountWithLocation.value.forEach(city => {
            // Validate coordinates
            if (city.latitude && city.longitude && 
                !isNaN(city.latitude) && !isNaN(city.longitude) &&
                city.latitude >= -90 && city.latitude <= 90 &&
                city.longitude >= -180 && city.longitude <= 180) {
                
                const radius = 10000;
                const circle = L.circle([city.latitude, city.longitude], {
                    color: 'blue',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.5,
                    radius
                }).bindPopup(`<b>${city.cityName}</b><br/>Games: ${city.gamesCount}`);
                
                // Add hover events to show/hide popup
                circle.on('mouseover', function(e) {
                    this.openPopup();
                }).on('mouseout', function(e) {
                    this.closePopup();
                }).on('click', function(e) {
                    this.openPopup();
                });
                
                circlesLayer.value!.addLayer(circle);
            } else {
                // console.warn('Invalid coordinates for city:', city);
            }
        });
    }
}

const removeCircles = () => {
    if (circlesLayer.value) {
        circlesLayer.value.clearLayers();
    }
}

const removeHeatMap = () => {
    if (heatLayer.value) {
        map.value!.removeLayer(heatLayer.value);
        heatLayer.value = null;
    }
}

const toggleVisualization = () => {
    showHeatMap.value = !showHeatMap.value;
}
// Watch for changes in visualization type and data
watch([showHeatMap, balootGamesCountWithLocation], () => {
    if (mapReady.value) {
        if (showHeatMap.value) {
            removeCircles()
            addHeatMap()
        } else {
            removeHeatMap()
            addCircles()
        }
    }
}, { deep: true })

// Watch for map ready state
watch(mapReady, (isReady) => {
    if (isReady) {
        if (showHeatMap.value) {
            addHeatMap()
        } else {
            addCircles()
        }
    }
})


onMounted(() => {
    initMap();

})

onUnmounted(() => {
    if (map.value) {
        map.value.remove();
        map.value = undefined;
    }
});
</script>

<template>
    <div class="relative">
        <div ref="mapContainer" class="w-full h-[500px] rounded-xl shadow z-0"></div>
        <!-- Toggle Button -->
        <!-- <button 
            @click="toggleVisualization"
            class="absolute top-2 right-2 z-[1000] bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium shadow-sm transition-colors"
        >
            {{ showHeatMap ? 'Show Circles' : 'Show Heatmap' }}
        </button> -->
    </div>
</template>

<style scoped>
.relative {
    position: relative;
}

div[ref="mapContainer"] {
    height: 500px;
    min-height: 500px;
    width: 100%;
    overflow: hidden;
    /* Prevent scrolling */
    position: relative;
    z-index: 0;
}

/* Ensure Leaflet containers don't cause scrolling */
/* :deep(.leaflet-container) {
    height: 100% !important;
    width: 100% !important;
    overflow: hidden !important;
} */

/* Fix for missing tiles issue */
/* :deep(.leaflet-tile-pane) {
    opacity: 1 !important;
} */
/* 
:deep(.leaflet-tile) {
    opacity: 1 !important;
} */

/* Prevent map from interfering with page scroll */
/* :deep(.leaflet-container) {
    touch-action: pan-x pan-y;
} */
</style>
