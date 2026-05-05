<template>
    <TournamentRequestSingle :id />
</template>
<script setup lang="ts">
import TournamentRequestSingle from '~/features/tournament/request/components/TournamentRequestSingle.vue';
const route = useRoute()
const id = route.params.id.toString()
definePageMeta({
    middleware: ['auth', 'role'],
    requiredRoles: ['StaffAdmin', 'SuperAdmin', 'Organizer'],
});

useHead({
    title: 'طلبات البطولة',
    meta: [
        { name: 'description', content: 'طلبات  بطولة' },
        { property: 'og:title', content: 'قيدها |Qydha' },
        { property: 'og:image', content: '/images/preview.PNG' }
    ]
})
</script>
<style></style>
