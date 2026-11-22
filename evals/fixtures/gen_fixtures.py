"""Generate golden screenshot fixtures for the vision eval cases.

Renders three WhatsApp/SMS-style screenshots with PIL:
  1. fake_upi_qr.png       - "scan the QR and enter your UPI PIN to receive" scam
  2. apk_forward.png       - bank KYC .apk install demand in a chat bubble
  3. genuine_bank_sms.png  - a genuine bank transaction alert (must NOT be flagged)

Deterministic: same output every run. Committed fixtures were generated from this script.
"""
from PIL import Image, ImageDraw, ImageFont
import pathlib

OUT = pathlib.Path(__file__).parent
FONT = r"C:\Windows\Fonts\arial.ttf"
FONT_B = r"C:\Windows\Fonts\arialbd.ttf"

def font(size, bold=False):
    return ImageFont.truetype(FONT_B if bold else FONT, size)

GREEN = "#075E54"
LIGHT = "#ECE5DD"
BUBBLE = "#DCF8C6"
WHITE = "#FFFFFF"

def base_screen(title="Kavach"):
    img = Image.new("RGB", (900, 460), LIGHT)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 900, 70], fill=GREEN)
    d.ellipse([24, 14, 64, 54], fill="#25D366")
    d.text((80, 22), title, font=font(24, bold=True), fill=WHITE)
    d.text((80, 48), "Online", font=font(15), fill="#CFE9E4")
    return img, d

def bubble(img, d, y, text, lines_width=760, incoming=True):
    x0 = 40 if incoming else 900 - 40 - lines_width
    lines = []
    words = text.split()
    cur = ""
    f = font(21)
    for w in words:
        trial = (cur + " " + w).strip()
        if d.textlength(trial, font=f) > lines_width - 40:
            lines.append(cur)
            cur = w
        else:
            cur = trial
    lines.append(cur)
    h = 34 + len(lines) * 30 + 26
    d.rounded_rectangle([x0, y, x0 + lines_width, y + h], radius=12, fill=BUBBLE)
    ty = y + 16
    for ln in lines:
        d.text((x0 + 18, ty), ln, font=f, fill="#111111")
        ty += 30
    d.text((x0 + lines_width - 120, y + h - 26), "11:04 AM", font=font(14), fill="#54656F")
    return y + h + 18

# 1. Fake UPI QR: "scan and enter PIN to receive"
img, d = base_screen("KSEB Refund Desk")
y = bubble(img, d, 95, "Dear consumer, your electricity refund of Rs 500 is approved. Scan this QR code and enter your UPI PIN to receive the amount in your account.")
# fake QR block
qx, qy, s = 380, y + 10, 13
import random
rnd = random.Random(2026)
for r in range(21):
    for c in range(21):
        if rnd.random() > 0.45:
            d.rectangle([qx + c * s, qy + r * s, qx + c * s + s - 1, qy + r * s + s - 1], fill="#111111")
d.rectangle([qx - 8, qy - 8, qx + 21 * s + 7, qy + 21 * s + 7], outline="#111111", width=3)
d.text((qx + 21 * s + 24, qy + 20), "Scan to receive", font=font(17), fill="#333333")
d.text((qx + 21 * s + 24, qy + 46), "Rs 500.00", font=font(20, bold=True), fill="#111111")
img.save(OUT / "fake_upi_qr.png")

# 2. APK install demand in a WhatsApp forward
img, d = base_screen("Mom")
y = bubble(img, d, 95, "Beta, this came from your uncle's office. Your SBI YONO account will be blocked today. Install SBI_KYC_Update.apk to reactivate it immediately.", incoming=True)
# file attachment chip
d.rounded_rectangle([60, y, 560, y + 78], radius=12, fill=WHITE, outline="#BBBBBB", width=1)
d.rectangle([74, y + 16, 102, y + 58], fill="#C0392B")
d.text((84, y + 24), "A", font=font(22, bold=True), fill=WHITE)
d.text((116, y + 14), "SBI_KYC_Update.apk", font=font(19, bold=True), fill="#111111")
d.text((116, y + 42), "2.4 MB - tap to install", font=font(15), fill="#667781")
img.save(OUT / "apk_forward.png")

# 3. Genuine bank SMS (transaction alert)
img = Image.new("RGB", (900, 300), "#F4F4F4")
d = ImageDraw.Draw(img)
d.rectangle([0, 0, 900, 56], fill="#3B3B3B")
d.text((24, 14), "Messaging  -  VD-SBIBNK", font=font(19), fill=WHITE)
body = "Rs 1,240.00 debited from A/c XX4412 on 22-11-26 towards Amazon.in. Not you? Call 1800 266 7766 / visit www.sbi.in"
lines = []
cur = ""
f = font(22)
for w in body.split():
    trial = (cur + " " + w).strip()
    if d.textlength(trial, font=f) > 820:
        lines.append(cur)
        cur = w
    else:
        cur = trial
lines.append(cur)
ty = 90
for ln in lines:
    d.text((30, ty), ln, font=f, fill="#111111")
    ty += 34
d.text((30, ty + 16), "24-11-26, 10:42 am", font=font(16), fill="#777777")
img.save(OUT / "genuine_bank_sms.png")

print("fixtures written:")
for p in sorted(OUT.glob("*.png")):
    print(" ", p.name, p.stat().st_size, "bytes")
