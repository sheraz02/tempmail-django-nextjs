import asyncio
from aiosmtpd.controller import Controller
from email import message_from_bytes
import requests

DJANGO_API = "http://127.0.0.1:8000/api/receive-email/"  # Django endpoint to save emails

class MailHandler:
    async def handle_DATA(self, server, session, envelope):
        msg = message_from_bytes(envelope.content)

        # Extract headers
        subject = msg.get("subject", "")
        sender = msg.get("from", "")
        to_addr = msg.get("to", "")

        # Extract body (plain or HTML only)
        plain_body = None
        html_body = None

        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                content_disposition = str(part.get("Content-Disposition"))

                if content_type == "text/plain" and "attachment" not in content_disposition:
                    plain_body = part.get_payload(decode=True).decode(
                        part.get_content_charset() or "utf-8", errors="ignore"
                    )
                elif content_type == "text/html":
                    html_body = part.get_payload(decode=True).decode(
                        part.get_content_charset() or "utf-8", errors="ignore"
                    )
        else:
            # Single-part email
            if msg.get_content_type() == "text/plain":
                plain_body = msg.get_payload(decode=True).decode(
                    msg.get_content_charset() or "utf-8", errors="ignore"
                )
            elif msg.get_content_type() == "text/html":
                html_body = msg.get_payload(decode=True).decode(
                    msg.get_content_charset() or "utf-8", errors="ignore"
                )

        # Pick best available body
        body = plain_body or html_body or "(No content)"

        # Forward to Django API (to store in DB)
        data = {
            "to": to_addr,
            "from": sender,
            "subject": subject,
            "body": body,
        }

        try:
            r = requests.post(DJANGO_API, json=data)
            print(f"[+] Stored in DB via API: {r.status_code} - {r.text}")
        except Exception as e:
            print("[!] Error forwarding to API:", e)

        return "250 Message accepted for delivery"

if __name__ == "__main__":
    handler = MailHandler()
    controller = Controller(handler, hostname="127.0.0.1", port=1025)
    controller.start()
    print("SMTP server running on localhost:1025")
    try:
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        controller.stop()
