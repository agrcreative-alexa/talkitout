#!/usr/bin/env python3
"""Inline src/ parts into the single-file game: index.html. Run: python3 build.py"""
import os, pathlib, subprocess, sys

root = pathlib.Path(__file__).parent
src = root / "src"
CSS = ["tokens", "chrome", "scene", "feedback", "results"]
JS = ["content", "chrome", "scene", "feedback", "results", "engine"]

for name in JS:  # refuse to publish a build with a syntax error in any part
    r = subprocess.run(["node", "--check", str(src / f"{name}.js")], capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"BUILD REFUSED: {name}.js\n{r.stderr}")

css = "\n".join((src / f"{n}.css").read_text() for n in CSS)
js = "\n".join((src / f"{n}.js").read_text() for n in JS)
if "</script" in js.lower():
    sys.exit("BUILD REFUSED: a JS part contains '</script'")
html = (src / "shell.html").read_text().replace("/*{{CSS}}*/", css).replace("/*{{JS}}*/", js)
tmp = root / f"index.html.{os.getpid()}.tmp"
tmp.write_text(html)
tmp.replace(root / "index.html")
print(f"built index.html ({len(html) // 1024} KB)")
