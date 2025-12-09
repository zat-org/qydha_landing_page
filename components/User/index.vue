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
        <p>{{ items?.toLocaleString() }} مستخدم</p>
      </div>
    </template>
      <Loading v-if="usersREQ.status.value == 'pending' " />
      

      <UTable v-else  v-model:sorting="sorting" :data="rows" :columns="cols" >
        <template #phone-cell="{ row }">
  
          <p>{{ `${(row.original.phone as string).replace('+', '')}+` }}</p>
        </template>
        <template #roles-cell="{ row }" dir="ltr">
          <div class="flex  gap-2 items-center">
  
            <UBadge v-for="role in row.original.roles" variant="outline"
              :icon="new Date(row.original.expireDate).getTime() > new Date().getTime() && role == 'User' ? 'i-heroicons-star-16-solid' : ''"
              :label="userApi.getUserRoleLabel(role)"
              :color="userApi.getUserRoleColor(role)">
            </UBadge>
          </div>
        </template>
        <template #action-cell="{ row }" dir="ltr">
          <UButtonGroup>
            <UButton color="primary" variant="outline" size="md" icon="i-heroicons-eye"
              :to="`/user/${row.original.id}`" />
            <UButton color="secondary" variant="outline" size="md" icon="i-heroicons-clipboard"
              @click="copyToClipboard(row.original.id)" />
          </UButtonGroup>
        </template>
      </UTable>
      <UPagination v-model:page="page" :page-count="10" :total="items" class="mx-auto" />
  </UCard>
</template>

<script lang="ts" setup>
import type { User } from "~/models/user";
const userApi = useUsers()
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')

// definePageMeta({
//   keepAlive: true,
//   scrollPos: 0,
// });
const usersREQ = await useUsers().getAllUsers();

// await usersREQ.fetchREQ("",);
const route = useRoute();
const router = useRouter();
const query = ref(route.query.search?.toString() || "");

const toast = useToast();
const exactSearch = ref<boolean>(route.query.exact === "true" || true);
const roleFilter = ref<string>((route.query.role as string) || "User");
const page = ref(
  (route.query.page ? +route.query.page : 1) || usersREQ.data.value?.data.currentPage!
);

await usersREQ.fetchREQ(
  query.value,
  page.value,
  exactSearch.value,
  roleFilter.value,

);
const items = ref(usersREQ.data.value?.data.totalCount!);


const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.add({
    title: 'تم النسخ',
    description: 'تم النسخ بنجاح',
    color: 'success',
  });
};

const rows = computed(() => {
  return usersREQ.data.value?.data.items;
});
const cols = [
  // { accessorKey: "id", header: "#" },
  {
    accessorKey: "username",
    header: ({ column }: { column: any }) => {
      const isSorted = column.getIsSorted()
      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'الاسم',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc', false)
      })
    },
    sortingFn: (rowA: any, rowB: any) => {
      return rowA.original.username.toLowerCase().localeCompare(rowB.original.username.toLowerCase())
    }
  },
  { accessorKey: "phone", header: "رقم الهاتف" },
  { accessorKey: "roles", header: "الفئة" },
  { id: "action", header: "الاجراءات" },
  {
    accessorKey: "expireDate", header: "الاشتركات",
    cell: ({ row }: { row: any }) => {
      return h(UBadge, {
        color: 'neutral',
        variant: 'outline',
        label: row.original.expireDate ? (new Date(row.original.expireDate).getTime() > new Date().getTime() ? `${Math.ceil((new Date(row.original.expireDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} يوم` : 'منتهي') : 'لا يوجد',
        icon: 'i-heroicons-calendar',
        class: 'mx-1',
      })
    }
  }

];

const sorting = ref([
  {
    id: 'username',
    desc: false
  }
])
watch([page, query, exactSearch, roleFilter], async (newValue, oldValue) => {
  if (oldValue[1] !== newValue[1] || oldValue[2] !== newValue[2]|| oldValue[3] !== newValue[3]) {
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
},);

const roleOptions = [
  { value: "SuperAdmin", label: "الادمن" },
  { value: "StaffAdmin", label: "الاستف" },
  { value: "User", label: "مستخدمين" },
  { value: "Organizer", label: "منظم بطوله" },
  { value: "Streamer", label: "الاستريمر" },
];
</script>

<style></style>
