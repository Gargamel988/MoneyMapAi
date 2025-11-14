import { ErrorFallback } from "@/src/components/common/error";
import SearchFilterBar from "@/src/components/ui/search-filter-bar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryCard } from "../../../src/components/categories/categorycard";
import { EmptyState } from "../../../src/components/categories/emptystate";
import ModalCategory from "../../../src/components/categories/modal-category";
import { GreenLoadingComponent } from "../../../src/components/common/loading";
import {
  useCategories,
} from "../../../src/hooks/useCategories";
import { useResponsive } from "../../../src/hooks/useRespons";
import { Category } from "../../../src/types/transactıonstype";



type SortType = "name-asc" | "name-desc" | "date-newest" | "date-oldest";

const CategoryManagement = () => {
  const { t } = useTranslation();
  const { dimensions,  wp } = useResponsive();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"hepsi" | "gelir" | "gider">(
    "hepsi"
  );
  const [sortBy, setSortBy] = useState<SortType>("date-newest");
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading,
    deleteCategoryMutation,
    refetch,
  } = useCategories();

  const categories = categoriesData?.data || [];


  const handleDeleteCategory = (id: string) => {
    Alert.alert(
      t("categories.delete.title"),
      t("categories.delete.message"),
      [
        { text: t("categories.delete.cancel"), style: "cancel" },
        {
          text: t("categories.delete.confirm"),
          style: "destructive",
          onPress: () => {
            setDeletingCategoryId(id);
            deleteCategoryMutation.mutate(id, {
              onSettled: () => {
                setDeletingCategoryId(null);
              }
            });
          },
        },
      ]
    );
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setShowAddForm(false);
  };

  const filteredCategories = categories
    .filter((category) => {
      if (filterType !== "hepsi" && category.type !== filterType) return false;
      if (searchQuery.trim() === "") return true;
      return category.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "date-newest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sortBy === "date-oldest")
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      return 0;
    });

  if (isLoading) return <GreenLoadingComponent />;

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: wp(6) }}>
      {/* ---------- HEADER / STATS ---------- */}
     <SearchFilterBar
     onAdd={() => setShowAddForm(true)}
        allCount={categories.length}
        incomeCount={categories.filter((category) => category.type === "gelir").length}
        expenseCount={categories.filter((category) => category.type === "gider").length}
        bool={true}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        setFilterType={setFilterType}
        filterType={filterType}
        setSortBy={setSortBy}
        sortBy={sortBy}
      />
      {/* ---------- LIST ---------- */}
      {categoriesError ? (
        <ErrorFallback error={categoriesError as Error} />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: dimensions.md }}
          data={filteredCategories}
          refreshing={isLoading}
          onRefresh={() => refetch()}
          keyExtractor={(item: Category, index: number) => `${item.id}-${index}`}
          ListEmptyComponent={<EmptyState onAdd={() => setShowAddForm(true)} />}
          renderItem={({ item }: { item: Category }) => (
            <CategoryCard
              category={item as Category}
              onEdit={startEdit}
              onDelete={handleDeleteCategory}
              deleting={deletingCategoryId === item.id}
            />
          )}
        />
      )}

      {showAddForm && (
        <ModalCategory
          visible
          onClose={cancelEdit}
          edit={editingCategory !== null}
          categoryData={editingCategory}
        />
      )}
    </SafeAreaView>
  );
};

export default CategoryManagement;

