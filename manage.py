#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""

from logging import DEBUG
import os
import sys
from config.settings import base


def main():
    """Run administrative tasks."""
     
    if DEBUG:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")
    else:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
#-----Portfolio--------------

#TODO: Context processor for portfolio categories dropdown in portfolio page  
# TODO: Add delete confirmation page for portfolio delete action   
#TODO: Add search functionality to portfolio page
#TODO: Add taggit to get featured portfolios in home page and custom template tag to get portfolio categories in dropdown in portfolio page