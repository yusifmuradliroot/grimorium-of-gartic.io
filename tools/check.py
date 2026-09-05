#!/usr/bin/env python3
"""Repo integrity checker. One run, clear verdict, no loops.
Usage: python3 tools/check.py
Exit 0 = PASS, 1 = FAIL. Fix what it reports (max 2 rounds), then ask the user.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGINS = ROOT / "omni" / "plugins"
REQUIRED_KEYS = ("id", "name", "entry", "mustContain", "version")

fails, warns = [], []


def fail(msg):
    fails.append(msg)


def warn(msg):
    warns.append(msg)


def main():
    index_file = PLUGINS / "index.json"
    if not index_file.is_file():
        return fail("missing omni/plugins/index.json")
    try:
        names = json.loads(index_file.read_text())
    except Exception as e:
        return fail(f"index.json invalid JSON: {e}")
    if not isinstance(names, list):
        return fail("index.json must be a JSON list of folder names")

    on_disk = sorted(p.name for p in PLUGINS.iterdir() if p.is_dir())
    for n in names:
        d = PLUGINS / n
        if not d.is_dir():
            fail(f"index lists '{n}' but folder omni/plugins/{n}/ missing")
            continue
        pj = d / "plugin.json"
        if not pj.is_file():
            fail(f"{n}: missing plugin.json")
            continue
        try:
            meta = json.loads(pj.read_text())
        except Exception as e:
            fail(f"{n}: plugin.json invalid JSON: {e}")
            continue
        for k in REQUIRED_KEYS:
            if k not in meta:
                fail(f"{n}: plugin.json missing key '{k}'")
        if meta.get("id") != n:
            fail(f"{n}: plugin.json id '{meta.get('id')}' != folder name")
        entry = d / str(meta.get("entry", ""))
        if not entry.is_file():
            fail(f"{n}: entry file '{meta.get('entry')}' missing")
        else:
            code = entry.read_text(errors="replace")
            mc = str(meta.get("mustContain", ""))
            if mc and mc not in code:
                fail(f"{n}: mustContain '{mc}' not found in {entry.name}")
            ver = str(meta.get("version", ""))
            if ver and ver not in code:
                warn(f"{n}: version '{ver}' not found in {entry.name} (build syncs it)")
    for d in on_disk:
        if d not in names:
            fail(f"folder omni/plugins/{d}/ exists but not listed in index.json")

    for w in warns:
        print("WARN " + w)
    if fails:
        for f in fails:
            print("FAIL " + f)
        print(f"RESULT: FAIL ({len(fails)} problem(s))")
        return 1
    print(f"RESULT: PASS ({len(names)} plugin(s), {len(warns)} warning(s))")
    return 0


if __name__ == "__main__":
    sys.exit(main())
