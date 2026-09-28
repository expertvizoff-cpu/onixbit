from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageDraw

root = Path('/home/astra/projects/client-systems/onixbit/site/public/media/bitrix24-implementation')
paths = [root / 'office-wide.webp', root / 'office-sunset.webp']
width = 1600
segment_height = 2150
overlap = 430
positions = [0.05, 0.72, 0.23, 0.86, 0.42, 0.12, 0.66, 0.32, 0.92]
segments = []

for index, x_position in enumerate(positions):
    source = Image.open(paths[index % 2]).convert('RGB')
    if index in {2, 3, 6}:
        source = ImageOps.mirror(source)
    target_ratio = width / segment_height
    source_ratio = source.width / source.height
    if source_ratio > target_ratio:
        crop_width = int(source.height * target_ratio)
        left = int((source.width - crop_width) * x_position)
        source = source.crop((left, 0, left + crop_width, source.height))
    else:
        crop_height = int(source.width / target_ratio)
        top = max(0, (source.height - crop_height) // 2)
        source = source.crop((0, top, source.width, top + crop_height))
    source = source.resize((width, segment_height), Image.Resampling.LANCZOS)
    brightness = 0.56 if index % 2 == 0 else 0.46
    source = ImageEnhance.Brightness(source).enhance(brightness)
    source = ImageEnhance.Contrast(source).enhance(1.16)
    source = ImageEnhance.Color(source).enhance(0.72)
    navy = Image.new('RGB', (width, segment_height), (3, 16, 28))
    source = Image.blend(source, navy, 0.22)

    glow = Image.new('RGBA', (width, segment_height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    center_x = int(width * (0.18 if index % 3 == 0 else 0.78))
    center_y = int(segment_height * (0.38 if index % 2 == 0 else 0.66))
    radius = 520
    for current_radius in range(radius, 0, -20):
        alpha = int(18 * (1 - current_radius / radius) ** 1.8)
        color = (255, 38, 52, alpha) if index % 2 == 0 else (68, 190, 240, alpha)
        box = (
            center_x - current_radius,
            center_y - current_radius,
            center_x + current_radius,
            center_y + current_radius,
        )
        draw.ellipse(box, fill=color)
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    source = Image.alpha_composite(source.convert('RGBA'), glow).convert('RGB')
    segments.append(source)

height = segment_height + (len(segments) - 1) * (segment_height - overlap)
canvas = Image.new('RGB', (width, height), (3, 12, 20))
y_position = 0

for index, segment in enumerate(segments):
    if index == 0:
        canvas.paste(segment, (0, 0))
        y_position = segment_height - overlap
        continue

    previous = canvas.crop((0, y_position, width, y_position + overlap))
    mask = Image.new('L', (width, overlap))
    mask_draw = ImageDraw.Draw(mask)
    for row in range(overlap):
        progress = row / (overlap - 1)
        progress = progress * progress * (3 - 2 * progress)
        mask_draw.line((0, row, width, row), fill=int(255 * progress))
    incoming = segment.crop((0, 0, width, overlap))
    blended = Image.composite(incoming, previous, mask)
    canvas.paste(blended, (0, y_position))
    canvas.paste(segment.crop((0, overlap, width, segment_height)), (0, y_position + overlap))
    y_position += segment_height - overlap

vignette = Image.new('RGBA', (width, height), (0, 0, 0, 0))
vignette_draw = ImageDraw.Draw(vignette)
for column in range(width):
    edge_distance = min(column, width - 1 - column) / (width / 2)
    alpha = int(72 * (1 - edge_distance) ** 1.7)
    vignette_draw.line((column, 0, column, height), fill=(0, 5, 10, alpha))

for row in range(height):
    if row < 700:
        alpha = int(35 * (1 - row / 700))
    elif row > height - 1000:
        alpha = int(60 * ((row - (height - 1000)) / 1000))
    else:
        alpha = 0
    if alpha:
        vignette_draw.line((0, row, width, row), fill=(0, 5, 10, alpha))

canvas = Image.alpha_composite(canvas.convert('RGBA'), vignette).convert('RGB')
output = root / 'continuous-office-night.webp'
canvas.save(output, 'WEBP', quality=86, method=6)
preview = canvas.resize((320, round(height * 320 / width)), Image.Resampling.LANCZOS)
preview.save('/tmp/continuous-office-preview.jpg', quality=78)
print(output, canvas.size, output.stat().st_size)