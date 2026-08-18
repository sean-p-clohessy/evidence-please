"""Extract text from locally downloaded Ofsted report-card PDFs.

Research output is written beside each PDF and remains outside the shipped app.
"""

from pathlib import Path
from urllib.request import urlretrieve

import pdfplumber

REPORTS = {
    "south-city-birmingham": "https://files.ofsted.gov.uk/v1/file/50304841",
    "macclesfield": "https://files.ofsted.gov.uk/v1/file/50304845",
    "newbury": "https://files.ofsted.gov.uk/v1/file/50303117",
    "kendal": "https://files.ofsted.gov.uk/v1/file/50301692",
    "furness": "https://files.ofsted.gov.uk/v1/file/50299910",
    "craven": "https://files.ofsted.gov.uk/v1/file/50305984",
    "capel-manor": "https://files.ofsted.gov.uk/v1/file/50297763",
    "sandwell": "https://files.ofsted.gov.uk/v1/file/50294740",
    "heart-of-worcestershire": "https://files.ofsted.gov.uk/v1/file/50300699",
    "wirral-metropolitan": "https://files.ofsted.gov.uk/v1/file/50297762",
}


def extract_report(pdf_path: Path) -> Path:
    with pdfplumber.open(pdf_path) as report:
        text = "\n".join(page.extract_text() or "" for page in report.pages)
    output_path = pdf_path.with_suffix(".txt")
    output_path.write_text(text, encoding="utf-8")
    return output_path


if __name__ == "__main__":
    report_dir = Path("tmp/pdfs/ofsted-pilot")
    report_dir.mkdir(parents=True, exist_ok=True)
    for slug, url in REPORTS.items():
        source = report_dir / f"{slug}.pdf"
        if not source.exists():
            print(f"Downloading {url} -> {source.name}")
            urlretrieve(url, source)
        output = extract_report(source)
        print(f"Extracted {source.name} -> {output.name}")
