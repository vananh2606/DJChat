# Generated by Django 5.1.3 on 2024-11-25 10:08

import server.models
import server.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("server", "0003_server_banner_server_icon"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="server",
            name="banner",
        ),
        migrations.RemoveField(
            model_name="server",
            name="icon",
        ),
        migrations.AddField(
            model_name="channel",
            name="banner",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to=server.models.server_banner_upload_path,
                validators=[server.validators.validate_image_file_exstension],
            ),
        ),
        migrations.AddField(
            model_name="channel",
            name="icon",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to=server.models.server_icon_upload_path,
                validators=[
                    server.validators.validate_icon_image_size,
                    server.validators.validate_image_file_exstension,
                ],
            ),
        ),
    ]