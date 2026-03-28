from django.db import models
from froala_editor.fields import FroalaField

from common.manager import AllObjectsManager, GeneralManager
from .portfolio_enums import PROJECT_STATUS_CHOICES
from common.models import CommonModel

# Create your models here.
class Portfolio(CommonModel):
    title = models.CharField(max_length=200,db_index=True)
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='portfolios', db_index=True)
    slug = models.SlugField(max_length=200, unique=True)
    short_description = models.CharField(max_length=500,db_index=True)
    status  = models.CharField(max_length=50,choices=(('Draft', 'Draft'), ('Published', 'Published'),('Deleted', 'Deleted')), default='Draft', db_index=True)

    description = FroalaField()
    tech_stack = models.CharField(max_length=200,db_index=True)
    image = models.ImageField(upload_to='portfolio_images/')
    github_link = models.URLField(blank=True, null=True)
    live_link = models.URLField(blank=True, null=True)
    project_mode = models.CharField(max_length=50,db_index=True, choices=PROJECT_STATUS_CHOICES,default='In Progress')
    client_name = models.CharField(max_length=100,db_index=True)
    #----------Object representation of the model for better readability in admin and shell----------#
    objects = GeneralManager()
	
   

    def __str__(self):
        return self.title
    

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Portfolio'
        verbose_name_plural = 'Portfolios'

        unique_together = ('title', 'slug')


        #-------------Composite index on title and slug for faster lookups-------------#
        indexes = [
            models.Index(fields=['title', 'slug']),
        ]

    @property
    def get_mode_display(self):
        return dict(PROJECT_STATUS_CHOICES).get(self.project_mode, 'Unknown')    