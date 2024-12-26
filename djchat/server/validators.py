from PIL import Image
from django.core.exceptions import ValidationError
import os


def validate_icon_image_size(image):
    if image:
        with Image.open(image) as img:
            if img.width > 128 or img.height > 128:
                raise ValidationError(
                    f"The maximum allowed dimensions for the image are 128x128 - size of image you uploaded: {img.size}"
                )


def validate_image_file_exstension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = [".jpg", ".jpeg", ".png", ".gif"]
    if not ext.lower() in valid_extensions:
        raise ValidationError("Unsupportted file extension")
