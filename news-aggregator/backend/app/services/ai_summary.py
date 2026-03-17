import anthropic
from app.config import settings


def generate_summary(article_text: str) -> str | None:
    """Claude API ашиглан мэдээний хураангуй гаргах."""
    if not settings.ANTHROPIC_API_KEY:
        return None

    try:
        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=200,
            messages=[
                {
                    "role": "user",
                    "content": f"Дараах мэдээний 2-3 өгүүлбэрт багтаах хураангуй бич. Монгол хэлээр бич:\n\n{article_text[:2000]}"
                }
            ]
        )
        return message.content[0].text
    except Exception as e:
        print(f"AI хураангуй алдаа: {e}")
        return None
