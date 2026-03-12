import os
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED


def should_include(path: Path) -> bool:
    name = path.name
    if name in {".DS_Store", "Thumbs.db"}:
        return False
    return True


def main() -> None:
    root = Path(__file__).resolve().parent
    plugin_dir = root / "simplyit-chatbot"
    if not plugin_dir.is_dir():
        raise SystemExit(f"Plugin folder not found: {plugin_dir}")

    zip_path = root / "simplyit-chatbot.zip"
    if zip_path.exists():
        zip_path.unlink()

    with ZipFile(zip_path, "w", compression=ZIP_DEFLATED) as zf:
        for file_path in plugin_dir.rglob("*"):
            if not file_path.is_file():
                continue
            if not should_include(file_path):
                continue
            arcname = file_path.relative_to(root)
            zf.write(file_path, arcname.as_posix())

    print(f"Created: {zip_path}")


if __name__ == "__main__":
    main()
