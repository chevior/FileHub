from pathlib import Path
from uuid import uuid4


def _build_suffix(cleaned_name: str, fallback_extension: str) -> str:
    path = Path(cleaned_name)
    suffixes = [suffix for suffix in path.suffixes if suffix]
    if suffixes:
        combined = "".join(suffixes[-2:])
        if len(combined) <= 20:
            return combined
        last_suffix = suffixes[-1]
        if len(last_suffix) > 20:
            return last_suffix[:20]
        return last_suffix

    if cleaned_name.startswith(".") and len(cleaned_name) > 1:
        hidden_suffix = cleaned_name
        if hidden_suffix[1:].isalnum() and len(hidden_suffix) <= 20:
            return hidden_suffix

    return fallback_extension


def build_stored_name(filename: str | None, fallback_prefix: str = "filehub-upload", fallback_extension: str = ".bin") -> str:
    """Create a safe stored filename while preserving the original extension when present."""
    if filename is None:
        filename = ""

    cleaned_name = Path(filename).name.strip()
    if not cleaned_name:
        return f"{fallback_prefix}-{uuid4().hex}{fallback_extension}"

    suffix = _build_suffix(cleaned_name, fallback_extension)

    return f"{uuid4().hex}{suffix}"
