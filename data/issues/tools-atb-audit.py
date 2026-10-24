#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""تدقيق قابل لإعادة التشغيل لخلايا جدول OMEDIT-ATB-IR V2.3 مقابل بيانات التطبيق.

تُعاد قراءة الخلايا من PDF، ثم يُعاد بناء صفوف المصدر، ثم يُعاد توليد بيانات التطبيق
إلى ملفات مؤقتة؛ لا يُعدّل هذا البرنامج ملفات الإنتاج. يُنتج تقريراً يغطي كل دواء ×
كل مرحلة (93 × 5) إضافةً إلى الملاحظات والأسماء والترجمات العربية.

يتطلب Python وPyMuPDF (pymupdf). التشغيل الافتراضي من جذر المستودع:
  python data/issues/tools-atb-audit.py
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import subprocess
import sys
import tempfile
import unicodedata
from collections import Counter
from decimal import Decimal, InvalidOperation
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ISSUES = Path(__file__).resolve().parent
STAGES = [
    ("normorenal", "طبيعي", "Normorénal"),
    ("legere", "خفيف", "IRC légère"),
    ("moderee", "متوسط", "IRC modérée"),
    ("severe", "شديد", "IRC sévère"),
    ("terminale", "نهائي", "IRC terminale"),
]

NUMBER_RE = re.compile(r"(?<![\w])(?:\d+(?:[.,]\d+)?|[½¼¾])(?![\w])")
UNIT_RE = re.compile(
    r"(?i)(?<![\w])(?:mg\s*/\s*kg|mcg\s*/\s*kg|µg\s*/\s*kg|μg\s*/\s*kg|"
    r"mg|mcg|µg|μg|kg|g|ml|l|h|j|jours?|heures?|injections?|prises?)(?![\w])"
)
FRACTIONS = {"½": Decimal("0.5"), "¼": Decimal("0.25"), "¾": Decimal("0.75")}


def normalize_text(value: str) -> str:
    value = unicodedata.normalize("NFC", value)
    value = value.replace("’", "'").replace("‘", "'").replace("ʼ", "'")
    value = value.replace("  ", " ")
    value = value.replace("2me", "2ᵉ").replace("3me", "3ᵉ")
    return re.sub(r"\s+", " ", value).strip()


def format_signature(value: str) -> str:
    value = normalize_text(value).casefold()
    value = value.replace("–", "-").replace("—", "-").replace("−", "-")
    return re.sub(r"\s*([/:;,])\s*", r"\1", value)


def numeric_signature(values: list[str]) -> tuple[Decimal | str, ...]:
    result: list[Decimal | str] = []
    for value in values:
        # Les exposants ordinaux sont des corrections typographiques (2ᵉ/3ᵉ), pas un nombre nouveau.
        value = value.replace("ᵉ", "")
        for token in NUMBER_RE.findall(value):
            if token in FRACTIONS:
                result.append(FRACTIONS[token])
                continue
            try:
                result.append(Decimal(token.replace(",", ".")))
            except InvalidOperation:
                result.append(token)
    return tuple(result)


def unit_signature(values: list[str]) -> tuple[str, ...]:
    return tuple(
        re.sub(r"\s+", "", unit).casefold()
        for value in values
        for unit in UNIT_RE.findall(value)
    )


def classify_values(
    source: list[str],
    app: list[str],
    *,
    app_notes: list[str] = (),
    patch_keys: list[str] = (),
    source_review: bool = False,
) -> str:
    if any("Cellules source multiples" in value for value in app):
        return "خلايا مصدر متعددة داخل الشريحة؛ لم تُنتقَ جرعة مفردة"
    if source == app:
        return "مطابق حرفياً"
    if [normalize_text(x) for x in source] == [normalize_text(x) for x in app]:
        return "فرق ترميز/مسافات/اقتباس فقط"
    if [format_signature(x) for x in source] == [format_signature(x) for x in app]:
        return "تنسيق/ترقيم فقط"
    if any("Cellule fusionnée" in x for x in app):
        return "إعادة تمثيل خلية مدمجة"

    # Consigne déplacée de la grille de doses vers les notes du médicament.
    stripped: list[str] = []
    moved = False
    for value in source:
        remainder = normalize_text(value)
        for note in app_notes:
            note_norm = normalize_text(note)
            if not note_norm:
                continue
            if remainder == note_norm:
                remainder = ""
                moved = True
                break
            if note_norm in remainder:
                remainder = remainder.replace(note_norm, "", 1).strip(" ;:–—-")
                moved = True
        if remainder:
            stripped.append(remainder)
    if moved and [normalize_text(x) for x in stripped] == [normalize_text(x) for x in app]:
        return "ملاحظة مصدرية نُقلت إلى ملاحظات الصف؛ الجرعة مطابقة"

    same_numbers = numeric_signature(source) == numeric_signature(app)
    same_units = unit_signature(source) == unit_signature(app)
    if "source_text_correction" in patch_keys and same_numbers and same_units:
        return "تصحيح نصي بعد مقارنة صورة PDF؛ الأرقام والوحدات محفوظة"
    if "move_lines_containing_to_notes" in patch_keys and source:
        return "نقل بنيوي معلن في PATCH؛ راجع الملاحظة أسفل الجدول"
    if "extra_notes" in patch_keys and source_review:
        return "إعادة بناء يدوية بعد تعثر هندسي؛ قارن صورة PDF"
    if "lines" in patch_keys and same_numbers and same_units:
        return "فصل/إعادة توزيع أسطر معلن في PATCH؛ الأرقام والوحدات متطابقة"
    if "info" in patch_keys and same_numbers and same_units:
        return "تنظيم نص معلوماتي معلن في PATCH؛ الأرقام والوحدات متطابقة"
    if patch_keys and source_review:
        return "PATCH مع استخراج هندسي معلّم؛ قارن صورة PDF"
    if same_numbers and same_units:
        return "النص مختلف؛ الأرقام والوحدات متطابقة"
    if source_review:
        return "استخراج هندسي معلّم؛ اختلاف الأرقام غير محسوم حتى مراجعة PDF"
    return "اختلاف أرقام/وحدات/بنية — مراجعة يدوية لازمة"


def classify_notes(
    source: list[str], app: list[str], patch_keys: list[str], ambiguous_stages: list[str] = (),
    source_unselected: bool = False,
) -> str:
    if source == app:
        return "مطابقة حرفية"
    if [normalize_text(x) for x in source] == [normalize_text(x) for x in app]:
        return "فرق ترميز/مسافات فقط"
    if "source_text_correction" in patch_keys:
        return "تصحيح نص ملاحظة بعد مقارنة صورة PDF؛ راجع النص الخام"
    if "editorial_notes" in patch_keys and "group" in patch_keys:
        return "ملاحظة مشتركة مستعادة من خلية مدمجة مع سياق تحريري خارجي عن PDF"
    if "editorial_notes" in patch_keys:
        return "ملاحظة تحريرية خارج PDF؛ مرجعها مستقل عن خلايا الجرعات"
    if "group" in patch_keys:
        return "ملاحظة مشتركة مستعادة من خلايا مدمجة"
    if "extra_notes" in patch_keys:
        return "ملاحظة مستعادة/مقيّدة بمرحلة من خلية المصدر"
    if "move_lines_containing_to_notes" in patch_keys:
        return "ملاحظة منقولة من سطر جرعة إلى ملاحظات الصف"
    if ambiguous_stages:
        return "النصوص المصدرية المتعددة محفوظة ضمن ملاحظات مقيّدة بالمرحلة"
    if source_unselected:
        return "نص خلية لم يختره الإسقاط محفوظ مع طلب مراجعة PDF"
    return "اختلاف في قائمة الملاحظات — راجع خلية المصدر"


def display_values(values: list[str]) -> str:
    if not values:
        return "∅"
    rows = []
    for i, value in enumerate(values, 1):
        safe = html.escape(value, quote=False).replace("|", "&#124;").replace("`", "&#96;")
        rows.append(f"L{i}: {safe}")
    return "<br>".join(rows)


def source_fragments_for_stage(source_row: dict, stage_key: str) -> list[str]:
    """كل خلية PDF فعلية يتقاطع مجالها الأفقي مع شريحة المرحلة، لا قيمة منتقاة واحدة."""
    fragments = []
    for line_index, line in enumerate(source_row.get("lines", []), 1):
        by_id = {cell.get("id"): cell for cell in line.get("source_cells", [])}
        for cell_id in line.get("stage_cells", {}).get(stage_key, []):
            cell = by_id.get(cell_id)
            if not cell:
                continue
            fragments.append(
                f"C{cell_id} x={cell.get('x0', '—')}–{cell.get('x1', '—')}: {cell.get('text', '')}"
            )
    return fragments


def markdown_escape(value: str) -> str:
    return html.escape(value, quote=False).replace("|", "&#124;").replace("`", "&#96;")


def clean_for_report(value: str) -> str:
    # يطابق قواعد النص الأساسية في مولّد بيانات التطبيق.
    return normalize_text(value)


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def run(command: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, text=True, capture_output=True, check=True)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pdf", type=Path, default=ISSUES / "OMEDIT-ATB-IR-V2.3-avril2026.pdf")
    parser.add_argument("--archived-rows", type=Path, default=ISSUES / "OMEDIT-ATB-IR-V2.3.rows.json")
    parser.add_argument("--app-data", type=Path, default=ROOT / "data" / "atb-renal.ts")
    parser.add_argument("--report", type=Path, default=ROOT / "docs" / "AUDIT-ATB-CELLULES-2026-10-23.md")
    args = parser.parse_args()

    generator = ISSUES / "tools-gen-atb-ts.py"
    grid_extractor = ISSUES / "tools-atb-grid.py"
    row_builder = ISSUES / "tools-atb-rows.py"
    for required in (args.pdf, args.archived_rows, args.app_data, generator, grid_extractor, row_builder):
        if not required.exists():
            parser.error(f"fichier manquant : {required}")

    with tempfile.TemporaryDirectory(prefix="eutn-atb-audit-") as tmp:
        tmpdir = Path(tmp)
        cells_path = tmpdir / "cells.json"
        fresh_rows_path = tmpdir / "rows.json"
        generated_ts = tmpdir / "atb-renal.ts"
        generated_json = tmpdir / "atb-renal.json"

        grid_result = run([sys.executable, str(grid_extractor), str(args.pdf), str(cells_path)])
        rows_result = run([sys.executable, str(row_builder), str(cells_path), str(fresh_rows_path)])
        generator_result = run([
            sys.executable, str(generator), str(fresh_rows_path), str(args.pdf),
            str(generated_ts), str(generated_json),
        ])

        cells = json.loads(cells_path.read_text(encoding="utf-8"))
        fresh_source = json.loads(fresh_rows_path.read_text(encoding="utf-8"))
        archived_source = json.loads(args.archived_rows.read_text(encoding="utf-8"))
        app_rows = json.loads(generated_json.read_text(encoding="utf-8"))
        archived_matches = fresh_source == archived_source
        app_matches_generator = generated_ts.read_bytes() == args.app_data.read_bytes()

        integrity_match = re.search(r"contrôle intégrité\s*:\s*(\d+) span", grid_result.stdout)
        bad_spans = int(integrity_match.group(1)) if integrity_match else None
        source_by_label = {clean_for_report(row["label"]): row for row in fresh_source}
        app_by_label = {clean_for_report(row["fr"]): row for row in app_rows}
        missing_in_app = sorted(set(source_by_label) - set(app_by_label))
        extra_in_app = sorted(set(app_by_label) - set(source_by_label))

        statuses: Counter[str] = Counter()
        cell_rows: list[str] = []
        for source_label, source_row in source_by_label.items():
            app_row = app_by_label.get(source_label)
            if not app_row:
                continue
            stage_values: dict[str, list[str]] = {}
            for key, stage_ar, stage_fr in STAGES:
                source_values = [
                    line.get("values", {}).get(key, "")
                    for line in source_row.get("lines", [])
                    if line.get("values", {}).get(key, "").strip()
                ]
                stage_index = [s[0] for s in STAGES].index(key)
                app_values = [
                    line["d"][stage_index]
                    for line in app_row.get("lines", [])
                    if line.get("d", [""] * 5)[stage_index].strip()
                ]
                audit = app_row.get("audit", {})
                patch_keys = audit.get("patch_keys", [])
                app_note_texts = [note.get("fr", "") for note in app_row.get("notes", []) if note.get("fr", "").strip()]
                status = classify_values(
                    source_values,
                    app_values,
                    app_notes=app_note_texts,
                    patch_keys=patch_keys,
                    source_review=bool(audit.get("source_review")),
                )
                statuses[status] += 1
                source_line_review = []
                source_line_ambiguous = []
                source_line_unselected = []
                for i, line in enumerate(source_row.get("lines", []), 1):
                    if not line.get("review"):
                        continue
                    if key in (line.get("filled") or []) or key in (line.get("missing") or []):
                        source_line_review.append(str(i))
                    if key in (line.get("ambiguous_stages") or []):
                        source_line_ambiguous.append(str(i))
                    if set(line.get("unselected_cell_ids", [])) & set(line.get("stage_cells", {}).get(key, [])):
                        source_line_unselected.append(str(i))
                flags = []
                if source_line_review:
                    flags.append("استكمال هندسي معلّم: السطر " + ",".join(source_line_review))
                if source_line_ambiguous:
                    flags.append("خلايا مصدر مختلفة متداخلة: السطر " + ",".join(source_line_ambiguous))
                if source_line_unselected:
                    flags.append("خلايا مصدرية لم ينتقها الإسقاط: السطر " + ",".join(source_line_unselected))
                if audit.get("source_review") and not (source_line_review or source_line_ambiguous or source_line_unselected):
                    flags.append("الصف معلّم للمراجعة هندسياً")
                if audit.get("patch_keys"):
                    flags.append("PATCH=" + ",".join(audit["patch_keys"]))
                if not app_matches_generator:
                    flags.append("ملف التطبيق ليس مطابقاً لخرج المولّد")
                flag_text = "؛ ".join(flags) or "—"
                source_fragments = source_fragments_for_stage(source_row, key)
                page = source_row["page"]
                cell_rows.append(
                    f"| {markdown_escape(source_row['label'])} | {stage_ar}<br><small>{stage_fr}</small> | p.{page} | "
                    f"{markdown_escape(status)} | {display_values(source_fragments) or '∅'} | "
                    f"{display_values(source_values)} | {display_values(app_values)} | "
                    f"{markdown_escape(flag_text)} |"
                )

        notes_rows: list[str] = []
        note_statuses: Counter[str] = Counter()
        for label, source_row in source_by_label.items():
            app_row = app_by_label.get(label)
            if not app_row:
                continue
            source_notes = [note for note in source_row.get("notes", []) if note.strip()]
            app_notes = [note.get("fr", "") for note in app_row.get("notes", []) if note.get("fr", "").strip()]
            audit = app_row.get("audit", {})
            patch_keys = audit.get("patch_keys", [])
            status = classify_notes(
                source_notes, app_notes, patch_keys, audit.get("source_ambiguous_stages", []),
                bool(audit.get("source_unselected_cells")),
            )
            note_statuses[status] += 1
            scoped_notes = []
            for note in app_row.get("notes", []):
                text = clean_for_report(note.get("fr", ""))
                if note.get("stages"):
                    text += " [المراحل: " + ", ".join(note["stages"]) + "]"
                scoped_notes.append(text)
            notes_rows.append(
                f"| {markdown_escape(source_row['label'])} | p.{source_row['page']} | {markdown_escape(status)} | "
                f"{display_values(source_notes)} | {display_values(scoped_notes)} |"
            )

        arabic_rows: list[str] = []
        missing_ar_names = []
        missing_ar_notes = []
        for label, app_row in app_by_label.items():
            if not app_row.get("ar", "").strip():
                missing_ar_names.append(label)
            ar_notes = [note.get("ar", "").strip() for note in app_row.get("notes", [])]
            if any(not text for text in ar_notes):
                missing_ar_notes.append(label)
            arabic_rows.append(
                f"| {markdown_escape(app_row['fr'])} | {markdown_escape(app_row.get('ar', '') or '—')} | "
                f"{display_values([text for text in ar_notes if text])} |"
            )

        page_cell_counts = {str(page["page"]): len(page.get("cells", [])) for page in cells if not page.get("skipped")}
        raw_line_count = sum(len(row.get("lines", [])) for row in fresh_source)
        review_lines = [
            (row["label"], i, line)
            for row in fresh_source
            for i, line in enumerate(row.get("lines", []), 1)
            if line.get("review")
        ]
        ambiguous_stage_pairs = [
            (row, i, line, stage)
            for row in fresh_source
            for i, line in enumerate(row.get("lines", []), 1)
            for stage in line.get("ambiguous_stages", [])
        ]
        unselected_cells = [
            (row, i, line, cell_id)
            for row in fresh_source
            for i, line in enumerate(row.get("lines", []), 1)
            for cell_id in line.get("unselected_cell_ids", [])
        ]
        ambiguous_medication_stage_count = len({
            (row["label"], stage) for row, _, _, stage in ambiguous_stage_pairs
        })
        ambiguous_stage_counts = Counter(stage for _, _, _, stage in ambiguous_stage_pairs)
        unselected_missing_in_app = []
        for row, line_index, line, cell_id in unselected_cells:
            cell = next((cell for cell in line.get("source_cells", []) if cell.get("id") == cell_id), {})
            app_row = app_by_label.get(clean_for_report(row["label"]))
            app_texts = []
            if app_row:
                app_texts.extend(value for dose_line in app_row.get("lines", []) for value in dose_line.get("d", []))
                app_texts.extend(note.get("fr", "") for note in app_row.get("notes", []))
            source_text = clean_for_report(cell.get("text", ""))
            if source_text and not any(source_text in clean_for_report(text) for text in app_texts):
                unselected_missing_in_app.append((row, line_index, cell_id, source_text))
        patch_rows = [row for row in app_rows if row.get("audit", {}).get("patch_keys")]
        report = [
            "# تدقيق خلايا جدول المضادات الكلوية — مقارنة شاملة قابلة لإعادة التشغيل",
            "",
            "> **حدود مهمة:** هذا تدقيق نقل/استخراج ومقارنة نصية، وليس اعتماداً سريرياً. لا أستطيع فحص بيانات التدريب الخاصة بالمساعد أو استرجاع مصادر منها؛ لم تُستخدم المعرفة التدريبية كمرجع طبي. لا يثبت التطابق الآلي صحة الجرعة ولا حداثة التوصية بعد تاريخ المرجع.",
            "",
            "## النطاق والمنهج",
            "",
            f"- PDF: `{args.pdf.name}` — SHA-256: `{sha256(args.pdf)}`.",
            f"- إعادة الاستخراج: {len(cells)} صفحة معالجة، {sum(page_cell_counts.values())} خلية جدول، {bad_spans if bad_spans is not None else 'غير متاح'} spans خارج/مكررة بحسب فحص الحدود الهندسي.",
            f"- ناتج الصفوف: {len(fresh_source)} دواءً، {raw_line_count} سطراً خاماً، {len(review_lines)} سطراً موسوماً آلياً للمراجعة.",
            f"- التداخل الهندسي: {len(ambiguous_stage_pairs)} حالة سطر×مرحلة تحتوي نصوص خلايا مصدرية مختلفة؛ {ambiguous_medication_stage_count} تركيبة دواء×مرحلة. الخلايا غير المختارة من الإسقاط البسيط: {len(unselected_cells)}؛ نصوصها الممثلة في بيانات التطبيق: {len(unselected_cells) - len(unselected_missing_in_app)}/{len(unselected_cells)}.",
            f"- تظل كل الخلايا غير المختارة ظاهرة بإحداثياتها ونصها في سجل المصدر أدناه؛ غير الممثلة في التطبيق: {len(unselected_missing_in_app)}.",
            "- التوزيع حسب الشريحة الهندسية: " + "؛ ".join(f"{key}={ambiguous_stage_counts.get(key, 0)}" for key, _, _ in STAGES) + ".",
            f"- التطبيق: {len(app_rows)} دواءً و{sum(len(row.get('lines', [])) for row in app_rows)} سطراً؛ {len(STAGES)} مراحل لكل دواء = {len(app_rows) * len(STAGES)} خلية دواء×مرحلة.",
            "- التداخلات ملاحظات على إحداثيات PDF فقط؛ لا تُستخدم لاستخراج أو اقتراح حدود DFG سريرية. في كل مرحلة ملتبسة تُحفظ النصوص المتقاطعة وتُحجب الجرعة المفردة الآلية.",
            f"- JSON الصفوف المؤرشف يطابق إعادة الاستخراج: **{'نعم' if archived_matches else 'لا'}**.",
            f"- `data/atb-renal.ts` مطابق بايتاً لخرج المولّد الحالي: **{'نعم' if app_matches_generator else 'لا'}**.",
            f"- مطابقة الأسماء بين المصدر والتطبيق: {len(source_by_label) - len(missing_in_app)} مشتركة؛ مفقود بالتطبيق: {len(missing_in_app)}؛ زائد بالتطبيق: {len(extra_in_app)}.",
            "- المقارنة تعرض القيم المستخرجة لكل مرحلة مقابل القيم التي يولدها سكريبت البيانات؛ النصوص العربية ترجمات تحريرية لا يقابلها نص عربي في PDF.",
            "- تمت مقارنة النصوص حرفياً ثم بعد تطبيع الاقتباس/المسافات وبعض علامات الترقيم؛ كما سُجل اختلاف الأرقام والوحدات. أي `PATCH` أو `review` ظاهر في الجدول ولا يُعد تصحيحاً سريرياً معتمداً.",
            "",
            "### تعريف الفئات الآلية",
            "",
            "- **مطابق حرفياً:** النص الخام بعد قواعد التنظيف المعلنة متساوٍ.",
            "- **فرق ترميز/مسافات/اقتباس** أو **تنسيق/ترقيم فقط:** لا يتغير المحتوى بعد التطبيع المحدود.",
            "- **النص مختلف؛ الأرقام والوحدات متطابقة:** تغير لفظي محتمل؛ لا يُحسم أنه آمن سريرياً.",
            "- **إعادة تمثيل خلية مدمجة:** خلية المصدر ممثلة بعلامة/ملاحظة بدلاً من جرعة مستنتجة.",
            "- **خلايا مصدر متعددة داخل الشريحة:** تُعرض كل النصوص الهندسية المتقاطعة في عمود الخلايا، ولا تُختار جرعة واحدة حتى توثيق النطاق من المصدر ومراجعته.",
            "- **اختلاف أرقام/وحدات/بنية:** يحتاج فتح الخلية الأصلية في PDF ومراجعتها يدوياً قبل أي تعديل سريري.",
            "",
            "## فهرس استخراج الخلايا حسب الصفحة",
            "",
            "| الصفحة | الخلايا الهندسية المستخرجة |",
            "|---:|---:|",
        ]
        report.extend(f"| {page} | {count} |" for page, count in page_cell_counts.items())
        report.extend([
            "",
            "## مقارنة جميع الخلايا: 93 دواءً × 5 مراحل",
            "",
            "كل سطر أدناه مرحلة واحدة. عمود «الخلايا المصدرية المتقاطعة» يسرد كل خلية PDF هندسية تمس الشريحة وإحداثياتها؛ لذلك قد يظهر أكثر من نص. «الإسقاط إلى المرحلة» هو القيمة التي كان تحويل الصفوف سيختارها، وليس إثباتاً أن المرحلة حدّ جرعة سريري. `L1`, `L2` تعني أسطر الجرعة/النص.",
            "",
            "| الدواء (FR) | المرحلة | الصفحة | النتيجة الآلية | الخلايا المصدرية المتقاطعة (x) | الإسقاط إلى المرحلة | بيانات التطبيق | ملاحظات التدقيق |",
            "|---|---|---:|---|---|---|---|---|",
        ])
        report.extend(cell_rows)
        report.extend([
            "",
            "### توزيع نتائج خلايا المراحل",
            "",
            "| الفئة | عدد الخلايا |",
            "|---|---:|",
        ])
        report.extend(f"| {markdown_escape(status)} | {count} |" for status, count in statuses.most_common())
        report.extend([
            "",
            "## فحص الملاحظات الفرنسية لكل دواء",
            "",
            "تُظهر هذه القائمة ملاحظات المصدر كما استخرجت، ثم ملاحظات التطبيق الفرنسية مع نطاق المرحلة إن وُجد. اختلاف القائمة قد يكون نقل ملاحظة من خلية إلى ملاحظات الصف، لذلك يلزم قراءة خانة المقارنة أعلاه وفتح PDF؛ لا يُخفى أي اختلاف بنيوي.",
            "",
            "| الدواء | الصفحة | النتيجة الآلية | ملاحظات المصدر | ملاحظات التطبيق (FR) |",
            "|---|---:|---|---|---|",
        ])
        report.extend(notes_rows)
        report.extend([
            "",
            "### توزيع نتائج الملاحظات",
            "",
            "| الفئة | عدد الأدوية |",
            "|---|---:|",
        ])
        report.extend(f"| {markdown_escape(status)} | {count} |" for status, count in note_statuses.most_common())
        report.extend([
            "",
            "## النص العربي المولّد: جميع الأسماء والملاحظات",
            "",
            "> لا توجد ترجمة عربية مقابلة في PDF المرجعي؛ إدراجها هنا يحصر النصوص العربية المضمّنة في بيانات هذا الجدول، لكنه لا يعدّ مراجعة لغوية أو طبية مستقلة.",
            "",
            "| الاسم الفرنسي | الاسم العربي في التطبيق | الملاحظات العربية في التطبيق |",
            "|---|---|---|",
        ])
        report.extend(arabic_rows)
        report.extend([
            "",
            "## أسطر المصدر التي علّمها الاستخراج الآلي للمراجعة",
            "",
            "| الدواء | السطر الخام | y تقريبية بالصفحة | مراحل التداخل متعدد النصوص | المراحل المستكملة هندسياً | كل الخلايا المصدرية المتقاطعة | الإسقاط الافتراضي لكل مرحلة |",
            "|---|---:|---:|---|---|---|---|",
        ])
        for label, index, line in review_lines:
            fragments = []
            for key, stage_ar, _ in STAGES:
                stage_fragments = source_fragments_for_stage({"lines": [line]}, key)
                if stage_fragments:
                    fragments.append(f"{stage_ar}: " + " / ".join(stage_fragments))
            values = [f"{stage_ar}: {line.get('values', {}).get(key, '')}" for key, stage_ar, _ in STAGES]
            report.append(
                f"| {markdown_escape(label)} | {index} | {line.get('y', '—')} | "
                f"{markdown_escape(', '.join(line.get('ambiguous_stages') or []) or '—')} | "
                f"{markdown_escape(', '.join(line.get('filled') or []) or '—')} | "
                f"{display_values(fragments)} | {display_values(values)} |"
            )
        report.extend([
            "",
            "## الخلايا التي لم يخترها الإسقاط الافتراضي",
            "",
            "هذه ليست خلايا محذوفة من سجل المصدر. تظهر هنا كل خلية هندسية لم تُستخدم كأساس لقيمة مرحلة واحدة في الإسقاط البسيط، مع نصها وإحداثياتها والمراحل التي تتقاطع معها؛ ولا يُستنتج من ذلك حدّ DFG سريري.",
            "",
            "| الدواء | الصفحة | السطر الخام | الخلية | مجال x | المراحل المتقاطعة | نص الخلية كما استُخرج |",
            "|---|---:|---:|---:|---:|---|---|",
        ])
        for row, line_index, line, cell_id in unselected_cells:
            cell = next((cell for cell in line.get("source_cells", []) if cell.get("id") == cell_id), {})
            intersecting = [key for key, ids in line.get("stage_cells", {}).items() if cell_id in ids]
            report.append(
                f"| {markdown_escape(row['label'])} | p.{row['page']} | {line_index} | {cell_id} | "
                f"{cell.get('x0', '—')}–{cell.get('x1', '—')} | {markdown_escape(', '.join(intersecting) or 'خارج حدود المراحل')} | "
                f"{markdown_escape(cell.get('text', ''))} |"
            )
        report.extend([
            "",
            "## الصفوف ذات المعالجة اليدوية المعلنة في المولّد",
            "",
            "| الدواء | الصفحة | مفاتيح المعالجة | تحذير المصدر |",
            "|---|---:|---|---|",
        ])
        for row in patch_rows:
            audit = row.get("audit", {})
            report.append(
                f"| {markdown_escape(row['fr'])} | {row['page']} | {markdown_escape(', '.join(audit.get('patch_keys', [])))} | "
                f"{'معلّم للمراجعة الهندسية' if audit.get('source_review') else 'لا'} |"
            )
        report.extend([
            "",
            "## سلامة المقارنة وإعادة التشغيل",
            "",
            f"- نتيجة فحص الهندسة: `{bad_spans if bad_spans is not None else 'لم يُلتقط عدد spans'}` spans خارج الخلايا أو مكررة؛ يجب أن تكون 0.",
            f"- الأرشيف يطابق الاستخراج الحديث: `{'نعم' if archived_matches else 'لا'}`.",
            f"- ملف التطبيق يطابق ما يولده السكريبت من PDF الحالي: `{'نعم' if app_matches_generator else 'لا'}`.",
            f"- ملخص أداة الخلايا: `{grid_result.stdout.strip().replace(chr(10), ' | ')}`.",
            f"- ملخص أداة الصفوف: `{rows_result.stdout.strip().replace(chr(10), ' | ')}`.",
            f"- ملخص المولّد: `{generator_result.stdout.strip().replace(chr(10), ' | ')}`.",
            "- التشغيل: `python data/issues/tools-atb-audit.py` من جذر المستودع؛ يتطلب PyMuPDF في بيئة Python المستخدمة.",
            "- هذا التقرير يقارن جدول OMEDIT المحدد فقط. لا يفحص كل بروتوكولات/أدوية التطبيق الأخرى ولا يتحقق خارجياً من RCP/GPR/ePOPI؛ يتطلب ذلك مصادر أصلية محددة ومراجعة صيدلي/طبيب.",
            "",
        ])

        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text("\n".join(report), encoding="utf-8")
        print(f"تقرير التدقيق: {args.report}")
        print(f"الخلايا: {sum(statuses.values())} | الفئات: {dict(statuses)}")
        print(f"ملاحظات: {sum(note_statuses.values())} | byte-match التطبيق: {app_matches_generator}")
        print(f"نصوص الخلايا غير المختارة المحفوظة في التطبيق: {len(unselected_cells) - len(unselected_missing_in_app)}/{len(unselected_cells)}")
        if bad_spans != 0 or not archived_matches or not app_matches_generator or missing_in_app or extra_in_app or unselected_missing_in_app:
            return 2
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
