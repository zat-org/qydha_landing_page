import type { CategoryCreate, ICategory } from "~/models/influncerCode";

export const useCategory = () => {
  const { $api } = useNuxtApp();

  const getAllCategory = () =>
    useAppApiData<ICategory[]>(appKeys.categories, () =>
      $api("/influencer-codes-categories/"),
    );

  const addCategory = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (newCat: CategoryCreate) => {
      await execute(async () => {
        await $api("/influencer-codes-categories/", {
          method: "POST",
          body: newCat,
        });
        await refreshAppData(appKeys.categories);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const deleteCategory = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (catId: string) => {
      await execute(async () => {
        await $api(`/influencer-codes-categories/${catId}`, {
          method: "DELETE",
        });
        await refreshAppData(appKeys.categories);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updateCategory = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (body: CategoryCreate, catId: string) => {
      await execute(async () => {
        await $api(`/influencer-codes-categories/${catId}`, {
          method: "PUT",
          body,
        });
        await refreshAppData(appKeys.categories);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  /** @deprecated Use getAllCategory */
  const getAllcategory = getAllCategory;
  /** @deprecated Use addCategory */
  const AddCategry = addCategory;
  /** @deprecated Use deleteCategory */
  const deleteCategry = deleteCategory;
  /** @deprecated Use updateCategory */
  const updateCategry = updateCategory;

  return {
    getAllCategory,
    addCategory,
    deleteCategory,
    updateCategory,
    getAllcategory,
    AddCategry,
    deleteCategry,
    updateCategry,
  };
};
