<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center gap-4">
        <UInput v-model="query" placeholder="البحث بالاسم او الرقم او الهاتف " class="flex-1" />
        <div>
          <p>البحث الدقيق</p>
          <USwitch v-model="exactSearch" />
        </div>
        <USelect :items="roleOptions" v-model="roleFilter" class="w-40" />
        <p>{{ usersNumebr?.toLocaleString() }} مستخدم</p>
      </div>
    </template>

    <UTable :data="rows"  :columns="cols"  @select="select" :loading="usersREQ.status.value == 'pending'">
      <template #phone-cell="{ row }" dir="ltr">
        <p>{{ (row.original.phone as string).replace("+", "") }}</p>
      </template>
      <template #roles-cell="{ row }" dir="ltr">
        <UBadge v-for="role in row.original.roles" :class="{ 'hidden': role == 'User' }" class="mx-1" variant="outline"
          :label="role == 'User' ? 'مستخدم' : role == 'Streamer' ? 'استريمر' : (role as string).includes('Staff') ? 'استف' : 'ادمن'"
          :color="role == 'User' ? 'neutral' : role == 'Streamer' ? 'error' : (role as string).includes('Admin') ? 'primary' : 'success'" />
      </template>
    </UTable>
    <UPagination v-model="page" :page-count="10" :total="items" class="mx-auto" />
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
  { accessorKey: "id", header: "#" },
  { accessorKey: "username", header: "الاسم" },
  { accessorKey: "phone", header: "رقم الهاتف" },
  { accessorKey: "roles", header: "الفئة" },
];

const select = (row: any, e?: Event) => {
  return navigateTo(`/user/${row.original.id}`);
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
