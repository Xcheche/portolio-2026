
"""Template context helpers shared across portfolio pages."""

from portolio.models.category import Category


def category(request):
	"""Expose portfolio categories globally to templates."""
	all_category = (
		Category.objects.exclude(slug__isnull=True)
		.exclude(slug__exact="")
		.order_by("name")
	)
	return {"all_category": all_category}







import datetime

def footer_info(request):
	info = {
		"my_name": "Chekwubechukwu Omenife",
		"current_time": datetime.datetime.now(),
		"footer_message": "Thanks for visiting my site!",
		"copy_right": "Copyright @2026 All rights reserved."
	}
	return {
		# Keep nested structure expected by templates: footer_info.my_name
		"footer_info": info,
		# Backward-compatible flat keys for any template still using old access.
		**info,
	}
