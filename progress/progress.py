#!/usr/bin/env python3
"""Render progress.json -> progress.html (the live progress page). Run: python3 progress/progress.py"""
import json, pathlib, html
d = pathlib.Path(__file__).parent
data = json.loads((d / "progress.json").read_text())
e = html.escape
LABEL = {"queued": "Queued", "building": "Builder working", "judging": "Critic judging", "lost": "Critic picked the other one",
         "won": "Critic picked ours", "kept": "Kept as best version"}

def attempt(a):
    gap = f'<p class="gap"><b>Biggest gap</b> {e(a["gap"])}</p>' if a.get("gap") else ""
    note = f'<p class="note">{e(a["note"])}</p>' if a.get("note") else ""
    return f'<li class="att s-{a["status"]}"><span class="n">Attempt {a["n"]}</span><span class="chip">{LABEL[a["status"]]}</span>{note}{gap}</li>'

def piece(p):
    atts = "".join(attempt(a) for a in p["attempts"]) or '<li class="att s-queued"><span class="chip">Queued</span></li>'
    return f'<section class="piece r-{p["result"]}"><header><h2>{e(p["name"])}</h2><span class="res">{e(p["resultLabel"])}</span></header><p class="what">{e(p["what"])}</p><ol>{atts}</ol></section>'

won = sum(1 for p in data["pieces"] if p["result"] == "won")
done = sum(1 for p in data["pieces"] if p["result"] in ("won", "kept"))
page = f"""<title>Talk It Out Gauntlet</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,800&family=IBM+Plex+Mono:wght@400;600&display=swap">
<style>
/* Layout: scoreboard header, then one lane per piece with its attempts stacked as a ledger. */
:root {{ --bg:#f3f5f1; --card:#ffffff; --fg:#17201b; --soft:#5d6a62; --line:#d6dcd4; --accent:#b8860b;
  --won:#16794c; --won-bg:#dff3e7; --lost:#b3362f; --lost-bg:#fbe3e0; --live:#1d5fbf; --live-bg:#e0ebfb; --kept:#8a5a00; --kept-bg:#fbefd0;
  --display:'Bricolage Grotesque','Avenir Next','Segoe UI',sans-serif; --mono:'IBM Plex Mono',ui-monospace,Menlo,monospace; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg:#111613; --card:#1a211d; --fg:#e8eee9; --soft:#9aa89f; --line:#2c3630; --accent:#e3b341;
  --won:#5fd39a; --won-bg:#143524; --lost:#ff8f86; --lost-bg:#3d1b18; --live:#8fb8ff; --live-bg:#172a47; --kept:#f0c35a; --kept-bg:#3a2c0c; color-scheme:dark }} }}
:root[data-theme="dark"] {{ --bg:#111613; --card:#1a211d; --fg:#e8eee9; --soft:#9aa89f; --line:#2c3630; --accent:#e3b341;
  --won:#5fd39a; --won-bg:#143524; --lost:#ff8f86; --lost-bg:#3d1b18; --live:#8fb8ff; --live-bg:#172a47; --kept:#f0c35a; --kept-bg:#3a2c0c; color-scheme:dark }}
* {{ box-sizing:border-box }}
body {{ background:var(--bg); color:var(--fg); font:500 16px/1.5 var(--display); }}
.wrap {{ max-width:860px; margin:0 auto; padding-inline:20px; padding-block:32px 56px; display:flex; flex-direction:column; gap:20px }}
h1 {{ font:800 34px/1.05 var(--display); margin:0; text-wrap:balance }}
.lede {{ margin:6px 0 0; color:var(--soft); max-width:62ch }}
.score {{ display:flex; flex-wrap:wrap; gap:10px 28px; font:400 13px/1.4 var(--mono); color:var(--soft); border-block:1px solid var(--line); padding-block:12px }}
.score b {{ font:600 20px/1 var(--mono); color:var(--fg); display:block; font-variant-numeric:tabular-nums }}
.now {{ font:400 14px/1.5 var(--mono); color:var(--live); background:var(--live-bg); padding:10px 14px; border-radius:6px; margin:0 }}
.piece {{ background:var(--card); border:1px solid var(--line); border-radius:10px; padding:16px 18px; display:flex; flex-direction:column; gap:8px }}
.piece header {{ display:flex; justify-content:space-between; align-items:baseline; gap:12px; flex-wrap:wrap }}
h2 {{ font:800 20px/1.2 var(--display); margin:0 }}
.res {{ font:600 12px/1 var(--mono); text-transform:uppercase; letter-spacing:.06em; color:var(--soft) }}
.r-won .res {{ color:var(--won) }} .r-kept .res {{ color:var(--kept) }} .r-live .res {{ color:var(--live) }}
.what {{ margin:0; color:var(--soft); font-size:14px }}
ol {{ list-style:none; margin:4px 0 0; padding:0; display:flex; flex-direction:column; gap:8px }}
.att {{ display:grid; grid-template-columns:auto 1fr; gap:4px 12px; align-items:center; border-top:1px solid var(--line); padding-top:8px }}
.n {{ font:600 12px/1 var(--mono); color:var(--soft) }}
.chip {{ justify-self:start; font:600 12px/1 var(--mono); padding:5px 8px; border-radius:4px; background:var(--live-bg); color:var(--live) }}
.s-won .chip {{ background:var(--won-bg); color:var(--won) }} .s-lost .chip {{ background:var(--lost-bg); color:var(--lost) }}
.s-kept .chip {{ background:var(--kept-bg); color:var(--kept) }} .s-queued .chip {{ background:transparent; color:var(--soft); padding-left:0 }}
.gap,.note {{ grid-column:1/-1; margin:0; font-size:14px; min-width:0 }}
.gap b {{ font:600 11px/1 var(--mono); text-transform:uppercase; letter-spacing:.06em; color:var(--lost); margin-right:6px }}
.note {{ color:var(--soft) }}
footer {{ font:400 12px/1.5 var(--mono); color:var(--soft) }}
</style>
<div class="wrap">
<div><h1>Talk It Out: builder vs. harsh critic</h1>
<p class="lede">{e(data["lede"])}</p></div>
<div class="score"><span><b>{won} / {len(data["pieces"])}</b>pieces picked blind</span><span><b>{done} / {len(data["pieces"])}</b>pieces closed</span><span><b>{e(data["updated"])}</b>last update</span></div>
<p class="now">{e(data["now"])}</p>
{"".join(piece(p) for p in data["pieces"])}
<footer>{e(data["foot"])}</footer>
</div>"""
(d / "progress.html").write_text(page)
print("progress.html written")
