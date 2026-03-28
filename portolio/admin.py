from django.contrib import admin
from .models import Category, Portfolio

# Register your models here.

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at', 'updated_at')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)

class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'is_deleted', 'deleted_at', 'created_at', 'updated_at','project_mode')
    search_fields = ('title', 'short_description', 'tech_stack', 'client_name')
    list_filter = ('status', 'category', 'is_deleted')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('-created_at',)
    actions = ('restore_selected', 'soft_delete_selected', 'hard_delete_selected')

    def get_queryset(self, request):
        # Show both active and soft-deleted rows in admin.
        return self.model.all_objects.all()

    @admin.action(description='Restore selected portfolios')
    def restore_selected(self, request, queryset):
        queryset.restore()

    @admin.action(description='Soft delete selected portfolios')
    def soft_delete_selected(self, request, queryset):
        queryset.delete()

    @admin.action(description='Hard delete selected portfolios permanently')
    def hard_delete_selected(self, request, queryset):
        queryset.hard_delete()

    def delete_model(self, request, obj):
        # Admin single-object delete should use soft delete by default.
        obj.delete()

    def delete_queryset(self, request, queryset):
        # Admin bulk delete should use soft delete by default.
        queryset.delete()
    
admin.site.register(Category, CategoryAdmin)
admin.site.register(Portfolio, PortfolioAdmin)
