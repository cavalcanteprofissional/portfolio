"""
render_pdf.py — HTML → PDF rendering using Playwright.

Takes an HTML string, renders it in a headless Chromium browser,
and outputs a print-quality A4 PDF with backgrounds enabled.
"""

from pathlib import Path

from playwright.sync_api import sync_playwright


def render_pdf(html_content: str, output_path: str | Path) -> Path:
    """
    Render HTML content to a PDF file using Playwright Chromium.

    Args:
        html_content: The full HTML string to render.
        output_path: Destination path for the PDF file.

    Returns:
        The Path of the generated PDF.
    """
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_content(html_content, wait_until="networkidle")
        page.pdf(
            path=str(output_path),
            format="A4",
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
        )
        browser.close()

    return output_path
