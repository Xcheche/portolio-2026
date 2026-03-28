from django.db import models
from common.models import CommonModel




class Category(CommonModel):
    name = models.CharField(max_length=100, unique=True,db_index=True)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    

    class Meta:
        ordering = ['name']
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        unique_together = ('name', 'slug')

        #-------------Composite index on name and slug for faster lookups-------------#
        indexes = [
            models.Index(fields=['name', 'slug']),
        ]


