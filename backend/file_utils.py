from pathlib import Path
from uuid import uuid4


def build_stored_name(filename: str | None, fallback_prefix: str = "upload", fallback_extension: str = ".bin") -> str:
    """Create a safe stored filename while preserving the original extension when present."""
    if filename is None:
        filename = ""

    cleaned_name = Path(filename).name.strip()
    if not cleaned_name:
        return f"{fallback_prefix}-{uuid4().hex}{fallback_extension}"

    suffix = Path(cleaned_name).suffix.lower()
    if not suffix:
        suffix = fallback_extension

    return f"{uuid4().hex}{suffix}"
