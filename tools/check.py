#!/usr/bin/env python3
"""Repo integrity checker. One run, clear verdict, no loops.
Usage: python3 tools/check.py
Exit 0 = PASS, 1 = FAIL. Fix what it reports (max 2 rounds), then ask the user.
Supports .js entries (mustContain) and .fs entries (tag + manifest + signature).
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


def _fnv1a(data: bytes) -> int:
    h = 0x811C9DC5
    for b in data:
        h ^= b
        h = (h * 0x01000193) & 0xFFFFFFFF
    return h


def check_packed(n, entry):
    # .fs entries: tag + manifest + signature verified (markers hide inside).
    try:
        lines = entry.read_text(errors="replace").split("\n")
    except Exception as e:
        fail(f"{n}: cannot read {entry.name}: {e}")
        return
    if not lines or lines[0] != "FS:2":
        fail(f"{n}: {entry.name} missing FS:2 tag")
        return
    try:
        m = json.loads(lines[1])
        blobs = [b for b in lines[2:] if b]
        if sorted(m.get("o", [])) != list(range(len(blobs))):
            fail(f"{n}: {entry.name} bad manifest order")
            return
        ordered = [blobs[m["o"].index(e)] for e in range(len(blobs))]
        sig = "%08x" % _fnv1a(("FS:2\n" + ",".join(map(str, m["o"])) + "\n" + "".join(ordered)).encode())
        if sig != m.get("s"):
            fail(f"{n}: {entry.name} signature mismatch")
    except Exception as e:
        fail(f"{n}: {entry.name} manifest invalid: {e}")


def main():
    index_file = PLUGINS / "index.json"
    if not index_file.is_file():
        fail("missing omni/plugins/index.json")
        return 1
    try:
        names = json.loads(index_file.read_text())
    except Exception as e:
        fail(f"index.json invalid JSON: {e}")
        return 1
    if not isinstance(names, list):
        fail("index.json must be a JSON list of folder names")
        return 1

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
        elif entry.suffix == ".fs":
            check_packed(n, entry)
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
