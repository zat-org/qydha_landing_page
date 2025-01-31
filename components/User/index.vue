<template>
  <UCard
    :ui="{
      base: 'flex flex-col h-full ',
      body: { base: 'grow flex flex-col' },
    }"
  >
    <template #header>
      <div class="flex justify-between items-center gap-4">
        <UInput
          v-model="query"
          placeholder="username or id  or phone "
          class="grow"
        />
<div>
  <p>البحث الدقيق</p>
  <UToggle v-model="exactSearch" />
</div>
        <USelect
          :options="roleOptions"
          v-model="roleFilter"
        />
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
      <template #phone-data="{ row }" dir="ltr">
        <p>{{ (row.phone as string).replace("+", "") }}</p>
      </template>
      <template #roles-data="{ row }" dir="ltr">
        <UBadge  
          v-for="role in row.roles"
          :class="{'hidden':role=='User'}"
          class="mx-1"
          variant="outline"
          :label="role=='User'?'مستخدم':role=='Streamer'?'استريمر':(role as string).includes('Staff')?'استف':'ادمن'"
          :color="role=='User'?'gray':role=='Streamer'?'red':(role as string).includes('Admin')?'blue':'green' "  />
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

const exactSearch = ref<boolean>(route.query.exact === "true" || true);
const roleFilter = ref<string>((route.query.role as string) || "User");

const page = ref(
  Number(route.query.page) || usersREQ.data.value?.data.currentPage!
);
await usersREQ.fetchREQ(
  query.value,
  page.value,
  exactSearch.value,
  roleFilter.value
);
const items = ref(usersREQ.data.value?.data.totalCount!);

const rows = computed(() => {
  return usersREQ.data.value?.data.items;
});
const cols = [
  { key: "id", label: "#" },
  { key: "username", label: "الاسم" },
  { key: "phone", label: "رقم الهاتف" },
  { key: "roles", label: "الفئة" },
];

const select = (row: User) => {
  return navigateTo(`/user/${row.id}`);
};
watch([page, query, exactSearch, roleFilter], async (newValue, oldValue) => {
  if (oldValue[1] !== newValue[1] || oldValue[2] !== newValue[2]) {
    page.value = 1;
  }
  await router.replace({
    query: {
      search: query.value || undefined,
      page: page.value.toString(),
      exact: `${exactSearch.value}`,
      role: roleFilter.value,
    },
  });
  await usersREQ.fetchREQ(
    query.value,
    page.value,
    exactSearch.value,
    roleFilter.value
  );
  items.value = usersREQ.data.value?.data.totalCount!;
});

const roleOptions = [
  { value: "SuperAdmin", label: "الادمن" },
  { value: "StaffAdmin", label: "الاستف" },
  { value: "User", label: "مستخدمين" },
  { value: "Streamer", label: "الاستريمر" },
  
  
];
</script>

<style></style>
