<template>
  <UCard
    :ui="{
      base: 'flex flex-col h-full ',
      body: { base: 'grow flex flex-col' },
    }"
  >
    <template #header>
      <div class="flex justify-between items-center gap-2">
        <UInput
          v-model="query"
          placeholder="username or id  or phone "
          class="grow"
        />
        <p>البحث الدقيق</p>
        <UToggle v-model="exactSearch" />

        <p>{{ usersNumebr?.toLocaleString() }} مستخدم</p>
      </div>
    </template>

    <UTable
      :rows="rows"
      :columns="cols"
      class="grow"
      :ui="{ td: { padding: 'py-1 sm:py-1' }, th: { padding: 'py-1 sm:py-1' } }"
      @select="select"
      :loading="usersREQ.status.value == 'pending'"
    >
  <template #phone-data="{row}" dir="ltr">
    <p>{{ (row.phone as string).replace('+','') }}</p>
  </template>
  
  </UTable>
    <UPagination
      v-model="page"
      :page-count="10"
      :total="items"
      class="mx-auto"
    />
  </UCard>
</template>

<script lang="ts" setup>
import type { User } from "~/models/user";

// definePageMeta({
//   keepAlive: true,
//   scrollPos: 0,
// });
const usersREQ = await useUsers().getAllUsers();
await usersREQ.fetchREQ("");
const usersNumebr = usersREQ.data.value?.data.totalCount;
const route = useRoute();
const router = useRouter();
const query = ref(route.query.search?.toString() || "");

const exactSearch = ref<boolean>(route.query.exact === "true");
const page = ref(
  Number(route.query.page) || usersREQ.data.value?.data.currentPage!
);
await usersREQ.fetchREQ(query.value,page.value,exactSearch.value);
const items = ref(usersREQ.data.value?.data.totalCount!);

const rows = computed(() => {
  return usersREQ.data.value?.data.items;
});
const cols = [
  { key: "id", label: "#" },
  { key: "username", label: "الاسم" },
  { key: "phone", label: "رقم الهاتف" },
];

const select = (row: User) => {
  return navigateTo(`/user/${row.id}`);
};
watch(
  [page, query, exactSearch],
  async (newValue, oldValue) => {
    if (oldValue[1] !== newValue[1] || oldValue[2] !== newValue[2]) {
      page.value = 1;
    }
    await router.replace({
      query: {
        search: query.value || undefined,
        page: page.value.toString(),
        exact: `${exactSearch.value}`,
      },
    });
    await usersREQ.fetchREQ(query.value, page.value, exactSearch.value);
    items.value = usersREQ.data.value?.data.totalCount!;
  },
 
);
</script>

<style></style>
