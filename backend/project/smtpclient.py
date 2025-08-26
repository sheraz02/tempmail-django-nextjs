import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
from email.mime.application import MIMEApplication
from email import encoders

# --------------------
# SMTP SERVER SETTINGS
# --------------------
SMTP_SERVER = "localhost"   # Or your mail server e.g. smtp.gmail.com
SMTP_PORT = 1025            # If testing with local server like `python -m smtpd -c DebuggingServer -n localhost:1025`
SENDER_EMAIL = "sender@example.com"
RECEIVER_EMAIL = "jx1z0wkd93@sheraz.com"

# --------------------
# 1. PLAIN TEXT EMAIL
# --------------------
def send_plain_text():
    msg = MIMEText("Hello, this is a plain-text email.", "plain")
    msg["Subject"] = "Plain Text Email"
    msg["From"] = SENDER_EMAIL
    msg["To"] = RECEIVER_EMAIL
    send_message(msg)

# --------------------
# 2. HTML EMAIL
# --------------------
def send_html():
    html_content = """
    <html>
        <body>
            <h1 style='color:blue'>Hello!</h1>
            <p>This is an <b>HTML email</b> with <a href='https://example.com'>a link</a>.</p>
        </body>
    </html>
    """
    msg = MIMEText(html_content, "html")
    msg["Subject"] = "HTML Email"
    msg["From"] = SENDER_EMAIL
    msg["To"] = RECEIVER_EMAIL
    send_message(msg)

# --------------------
# 3. EMAIL WITH ATTACHMENT
# --------------------
def send_with_attachment():
    msg = MIMEMultipart()
    msg["Subject"] = "Email with Attachment"
    msg["From"] = SENDER_EMAIL
    msg["To"] = RECEIVER_EMAIL

    # Body
    msg.attach(MIMEText("Please see the attached file.", "plain"))

    # Attachment
    file_path = "sample.txt"
    with open(file_path, "rb") as f:
        part = MIMEApplication(f.read(), Name="sample.txt")
        part["Content-Disposition"] = f'attachment; filename="sample.txt"'
        msg.attach(part)

    send_message(msg)

# --------------------
# 4. EMAIL WITH EMBEDDED IMAGE
# --------------------
def send_with_inline_image():
    msg = MIMEMultipart("related")
    msg["Subject"] = "Email with Embedded Image"
    msg["From"] = SENDER_EMAIL
    msg["To"] = RECEIVER_EMAIL

    # HTML Body referencing the image via cid
    html = """
    <html>
        <body>
            <h2>Here is an inline image:</h2>
            <img src="cid:myimage">
        </body>
    </html>
    """

    msg_alt = MIMEMultipart("alternative")
    msg.attach(msg_alt)
    msg_alt.attach(MIMEText("Your email client does not support HTML", "plain"))
    msg_alt.attach(MIMEText(html, "html"))

    # Attach image
    with open("image.png", "rb") as f:
        img = MIMEImage(f.read())
        img.add_header("Content-ID", "<myimage>")
        msg.attach(img)

    send_message(msg)

# --------------------
# 5. MULTIPART EMAIL (Text + HTML)
# --------------------
def send_multipart():
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Multipart Email"
    msg["From"] = SENDER_EMAIL
    msg["To"] = RECEIVER_EMAIL

    text = "This is the plain text version."
    html = """
    <html>
        <body>
            <p>This is the <b>HTML version</b>.</p>
        </body>
    </html>
    """

    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))

    send_message(msg)

# --------------------
# Helper: Send Email
# --------------------
def send_message(msg):
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        print(f"[+] Sent: {msg['Subject']}")

# --------------------
# Run Examples
# --------------------
if __name__ == "__main__":
    send_plain_text()
    send_html()
    # send_with_attachment()
    # send_with_inline_image()
    # send_multipart()
