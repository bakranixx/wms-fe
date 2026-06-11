"use client";

import * as React from "react";
import { format } from "date-fns";
import { Tag, Plus, Search, Filter, MoreHorizontal, Pencil, Trash2, Package } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PremiumStatCard, StatusBadge, EmptyState } from "@/components/shared/premium-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categories as mockCategories, mockProducts } from "@/lib/mock-data";
import {
  CategoryFormDialog,
  type CategoryFormValues,
  defaultCategoryValues,
} from "./_components/category-form-dialog";
import { DeleteCategoryDialog } from "./_components/delete-category-dialog";

type Category = (typeof mockCategories)[number];

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>(mockCategories);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formInitialValues, setFormInitialValues] =
    React.useState<CategoryFormValues>(defaultCategoryValues);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === "active").length;
  const totalProducts = mockProducts.length;

  const getProductCount = (categoryName: string) =>
    mockProducts.filter((p) => p.category === categoryName).length;

  // Filtered list
  const filteredCategories = React.useMemo(() => {
    return categories.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  const openCreateForm = () => {
    setFormInitialValues(defaultCategoryValues);
    setSelectedCategory(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const openEditForm = (category: Category) => {
    setFormInitialValues({
      code: category.code,
      name: category.name,
      description: category.description,
      status: category.status,
    });
    setSelectedCategory(category);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const openDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (values: CategoryFormValues) => {
    if (isEditing && selectedCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === selectedCategory.id ? { ...c, ...values } : c,
        ),
      );
      toast.success("Category updated successfully");
    } else {
      const newCategory: Category = {
        id: `${Date.now()}`,
        ...values,
        description: values.description ?? "",
        productCount: 0,
        createdAt: new Date(),
      };
      setCategories((prev) => [newCategory, ...prev]);
      toast.success("Category created successfully");
    }
  };

  const handleDelete = () => {
    if (!selectedCategory) return;
    setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
    toast.success("Category deleted successfully");
    setIsDeleteOpen(false);
    setSelectedCategory(null);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Tag className="h-6 w-6 text-primary" />
            Product Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage product category classifications
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
        <PremiumStatCard
          title="Total Categories"
          value={totalCategories}
          icon={Tag}
          description="All categories"
        />
        <PremiumStatCard
          title="Active"
          value={activeCategories}
          icon={Tag}
          description="Active categories"
        />
        <PremiumStatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          description="Across all categories"
        />
        <PremiumStatCard
          title="Avg Products"
          value={Math.round(totalProducts / totalCategories)}
          icon={Package}
          description="Per category"
        />
      </div>

      {/* Filters */}
      <Card className="glass-card border-primary/10 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card className="glass-card border-primary/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">All Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCategories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="text-xs">Code</TableHead>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs">Products</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Created</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow
                    key={category.id}
                    className="text-sm border-border/50 hover:bg-primary/5"
                  >
                    <TableCell className="py-3">
                      <span className="font-mono text-primary bg-primary/10 px-2 py-1 rounded text-xs">
                        {category.code}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium py-3">{category.name}</TableCell>
                    <TableCell className="py-3 text-muted-foreground max-w-[200px] truncate">
                      {category.description}
                    </TableCell>
                    <TableCell className="py-3 font-medium">
                      {getProductCount(category.name)}
                    </TableCell>
                    <TableCell className="py-3">
                      <StatusBadge status={category.status} />
                    </TableCell>
                    <TableCell className="py-3 text-muted-foreground">
                      {format(category.createdAt, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditForm(category)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDelete(category)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={Tag}
              title="No categories found"
              description="Try adjusting your search or filters"
            />
          )}
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        isEditing={isEditing}
        initialValues={formInitialValues}
        onSubmit={handleSubmit}
      />

      <DeleteCategoryDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        category={selectedCategory}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
