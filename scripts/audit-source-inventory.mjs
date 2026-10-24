import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const ROOT = process.cwd();
const DATA = join(ROOT, "data");
const TODAY = "2026-10-24";

function propName(prop) {
  if (!prop?.name) return null;
  if (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name) || ts.isNumericLiteral(prop.name)) return prop.name.text;
  return null;
}

function evaluate(node, constants) {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isIdentifier(node)) return constants.get(node.text);
  if (ts.isParenthesizedExpression(node)) return evaluate(node.expression, constants);
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression?.(node)) return evaluate(node.expression, constants);
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = evaluate(node.left, constants);
    const right = evaluate(node.right, constants);
    if (left !== undefined && right !== undefined) return String(left) + String(right);
  }
  if (ts.isArrayLiteralExpression(node)) return node.elements.map((element) => evaluate(element, constants));
  if (ts.isObjectLiteralExpression(node)) {
    const object = {};
    for (const property of node.properties) {
      if (ts.isPropertyAssignment(property)) {
        const key = propName(property);
        if (key !== null) object[key] = evaluate(property.initializer, constants);
      }
    }
    return object;
  }
  return undefined;
}

function property(node, name) {
  if (!node || !ts.isObjectLiteralExpression(node)) return undefined;
  for (const item of node.properties) {
    if (ts.isPropertyAssignment(item) && propName(item) === name) return item.initializer;
  }
  return undefined;
}

function firstLocalized(record, constants) {
  for (const key of ["title", "name", "label", "service", "q"]) {
    const value = evaluate(property(record, key), constants);
    if (value && typeof value.fr === "string") return value.fr;
  }
  const fr = evaluate(property(record, "fr"), constants);
  return typeof fr === "string" ? fr : "";
}

function getRecordSources(record, constants) {
  const meta = property(record, "meta");
  const metaSources = meta ? evaluate(property(meta, "sources"), constants) : undefined;
  const directSources = evaluate(property(record, "sources"), constants);
  const source = evaluate(property(record, "source"), constants);
  const lastReviewed = meta
    ? evaluate(property(meta, "lastReviewed"), constants)
    : evaluate(property(record, "lastReviewed"), constants);
  const sources = [];
  if (Array.isArray(metaSources)) {
    for (const item of metaSources) {
      if (typeof item === "string") sources.push({ label: item, url: "" });
      else if (item && typeof item.label === "string") sources.push({ label: item.label, url: typeof item.url === "string" ? item.url : "" });
    }
  }
  if (Array.isArray(directSources)) {
    for (const item of directSources) {
      if (typeof item === "string") sources.push({ label: item, url: "" });
      else if (item && typeof item.label === "string") sources.push({ label: item.label, url: typeof item.url === "string" ? item.url : "" });
    }
  }
  if (typeof source === "string") sources.push({ label: source, url: "" });
  return { sources: [...new Map(sources.map((s) => [`${s.label}\n${s.url}`, s])).values()], lastReviewed: typeof lastReviewed === "string" ? lastReviewed : "" };
}

function listTsFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "issues" ? [] : listTsFiles(path);
    return entry.isFile() && entry.name.endsWith(".ts") ? [path] : [];
  });
}

function groupFor(file) {
  const base = file.split(sep).at(-1);
  if (/^protocols(?:-p\d+)?\.ts$/.test(base)) return "protocols";
  if (/^medications(?:-p\d+)?\.ts$/.test(base)) return "medications";
  if (base === "calculators.ts") return "calculators";
  if (base === "procedures.ts") return "procedures";
  if (base === "trees.ts") return "trees";
  if (base === "ecg.ts") return "ecg";
  if (base === "triage.ts") return "triage";
  if (base === "perfusions.ts") return "perfusions";
  if (base === "checklists.ts") return "checklists";
  if (base === "atb-renal.ts") return "atb-renal";
  if (base === "guidage.ts") return "guidage";
  if (base === "quiz.ts") return "quiz";
  if (base === "reval.ts") return "reval";
  if (base === "med-tools.ts") return "med-tools";
  if (base === "protocol-categories.ts") return "protocol-categories";
  if (base === "abbr.ts") return "abbreviations";
  if (base === "motifs.ts") return "motifs";
  if (base === "quickref.ts") return "quickref";
  return null;
}

const referenceRecords = [];
const constantsByFile = new Map();
const sourceFiles = listTsFiles(DATA);

for (const file of sourceFiles) {
  const group = groupFor(file);
  if (!group) continue;
  const code = readFileSync(file, "utf8");
  const ast = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const constants = new Map();
  for (const statement of ast.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer) {
        const value = evaluate(declaration.initializer, constants);
        if (value !== undefined) constants.set(declaration.name.text, value);
      }
    }
  }
  constantsByFile.set(file, constants);
  const visit = (node) => {
    if (ts.isObjectLiteralExpression(node)) {
      const idNode = property(node, "id");
      const drugIdNode = property(node, "drugId");
      const id = evaluate(idNode, constants);
      const drugId = evaluate(drugIdNode, constants);
      const hasReferences = ["meta", "sources", "source", "lastReviewed"].some((key) => property(node, key));
      const isPageCitedAtb = group === "atb-renal" && property(node, "page");
      const isKnownRecord = typeof id === "string" && hasReferences;
      const isPerfusion = group === "perfusions" && typeof drugId === "string" && hasReferences;
      if (isKnownRecord || isPerfusion || isPageCitedAtb) {
        const ref = getRecordSources(node, constants);
        const pos = ast.getLineAndCharacterOfPosition(node.getStart(ast));
        referenceRecords.push({
          group,
          id: typeof id === "string" ? id : typeof drugId === "string" ? drugId : "",
          label: firstLocalized(node, constants),
          file: relative(ROOT, file).replaceAll(sep, "/"),
          line: pos.line + 1,
          lastReviewed: ref.lastReviewed,
          sources: ref.sources,
          page: isPageCitedAtb ? evaluate(property(node, "page"), constants) : null,
        });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
}

function readCollectionItems(file, exportName, itemKey, labelKey) {
  const fullPath = join(DATA, file);
  const code = readFileSync(fullPath, "utf8");
  const ast = ts.createSourceFile(fullPath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const constants = constantsByFile.get(fullPath) ?? new Map();
  const asText = (value) => typeof value === "string" || typeof value === "number"
    ? String(value)
    : value && typeof value.fr === "string" ? value.fr : "";
  const items = [];
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === exportName) {
      if (ts.isArrayLiteralExpression(node.initializer)) {
        for (const item of node.initializer.elements) {
          if (!ts.isObjectLiteralExpression(item)) continue;
          const key = evaluate(property(item, itemKey), constants);
          const label = evaluate(property(item, labelKey), constants);
          items.push({ id: asText(key), label: asText(label) });
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return items;
}

function recordsFromObjectMap(file, exportName) {
  const fullPath = join(DATA, file);
  const code = readFileSync(fullPath, "utf8");
  const ast = ts.createSourceFile(fullPath, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const result = [];
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === exportName && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
      for (const prop of node.initializer.properties) {
        if (!ts.isPropertyAssignment(prop)) continue;
        const key = propName(prop);
        if (key) result.push(key);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return result;
}

// The collection categories without a per-record citation are enumerated, not sampled.
const noRecordCitation = [];
const addNoCitation = (group, entries, basis) => {
  for (const entry of entries) noRecordCitation.push({ group, id: entry.id, label: entry.label ?? "", basis });
};
addNoCitation("guidage", readCollectionItems("guidage.ts", "GCASES", "id", "fr"), "Aucune source/date au niveau du cas; les liens vers des outils ne sont pas une citation.");
addNoCitation("abbreviations", readCollectionItems("abbr.ts", "ABBREVIATIONS", "abbr", "abbr"), "Aucune source/date au niveau de l'entrée; certaines définitions contiennent des seuils.");
addNoCitation("motifs", readCollectionItems("motifs.ts", "MOTIFS", "id", "fr"), "Aucune source/date au niveau de l'entrée.");
addNoCitation("quiz", readCollectionItems("quiz.ts", "QUIZ", "cat", "q"), "Aucune source primaire ni référence d'étude au niveau de la question; commentaire du fichier: dérivé du contenu du projet.");
addNoCitation("reval", recordsFromObjectMap("reval.ts", "revals").map((id) => ({ id, label: "" })), "Sources générales en commentaire de fichier uniquement; aucune référence par protocole/action.");
addNoCitation("med-tools", recordsFromObjectMap("med-tools.ts", "MED_TOOLS").map((id) => ({ id, label: "" })), "Aucune source/date au niveau de l'outil; plusieurs paramètres produisent des doses calculées.");
addNoCitation("protocol-categories", readCollectionItems("protocol-categories.ts", "protocolCategories", "id", "label"), "Catégories de navigation; aucune référence clinique au niveau de la catégorie.");
addNoCitation("glasgow", [
  { id: "adult-eyes", label: "Adulte — ouverture des yeux" },
  { id: "adult-verbal", label: "Adulte — réponse verbale" },
  { id: "adult-motor", label: "Adulte — réponse motrice" },
  { id: "pediatric-eyes", label: "Pédiatrie préverbale — ouverture des yeux" },
  { id: "pediatric-verbal", label: "Pédiatrie préverbale — réponse verbale" },
  { id: "pediatric-motor", label: "Pédiatrie préverbale — réponse motrice" },
], "Les six sections sont listées dans app/calculateurs/gcs/page.tsx et data/calculators.ts; référence parente Teasdale & Jennett 1974 / ATLS 10e dans l'enregistrement calculateur, sans page/version précise ni validation des adaptations pédiatriques.");

// Vital-sign reference rows and Tunisian emergency numbers are separate, uncited collections.
addNoCitation("quickref-vitalSigns", readCollectionItems("quickref.ts", "vitalSigns", "label", "label"), "Aucune source primaire/date de vérification au niveau de la ligne.");
addNoCitation("quickref-emergencyNumbers", readCollectionItems("quickref.ts", "emergencyNumbers", "number", "service"), "Aucune source primaire/date de vérification au niveau de la ligne.");

// Partial citations: sources exist, but do not identify a precise version/page or per-entry review date.
const partialCitation = referenceRecords.filter((r) => ["triage", "perfusions"].includes(r.group));

const expected = {
  protocols: 98, medications: 73, calculators: 131, procedures: 10, trees: 9,
  ecg: 11, checklists: 3, triage: 22, perfusions: 28, "atb-renal": 93,
  guidage: 41, quiz: 42, reval: 98, "med-tools": 15, "protocol-categories": 8,
  abbreviations: 47, motifs: 6, "quickref-vitalSigns": 4, "quickref-emergencyNumbers": 5, glasgow: 6,
};

const byGroup = new Map();
for (const row of referenceRecords) byGroup.set(row.group, [...(byGroup.get(row.group) ?? []), row]);
for (const row of noRecordCitation) byGroup.set(row.group, [...(byGroup.get(row.group) ?? []), row]);

const registryMap = new Map();
for (const record of referenceRecords) {
  for (const source of record.sources) {
    const current = registryMap.get(source.label) ?? { label: source.label, records: [], urls: new Set(), groups: new Set() };
    current.records.push(`${record.group}/${record.id || "—"}`);
    current.groups.add(record.group);
    if (source.url) current.urls.add(source.url);
    registryMap.set(source.label, current);
  }
}
const citationRegistry = [...registryMap.values()]
  .map((entry) => ({ ...entry, records: [...new Set(entry.records)].sort(), urls: [...entry.urls].sort(), groups: [...entry.groups].sort(), usageCount: entry.records.length }))
  .sort((a, b) => a.label.localeCompare(b.label));

const output = {
  date: TODAY,
  scope: "Exhaustive provenance inventory of source-bearing data records and enumerated source-free collections; not clinical validation.",
  expectedCounts: expected,
  referenceRecords: referenceRecords.sort((a, b) => a.group.localeCompare(b.group) || a.id.localeCompare(b.id) || a.line - b.line),
  citationRegistry,
  partialCitationRecords: partialCitation.sort((a, b) => a.group.localeCompare(b.group) || a.id.localeCompare(b.id)),
  noRecordCitationRecords: noRecordCitation.sort((a, b) => a.group.localeCompare(b.group) || a.id.localeCompare(b.id)),
  foundCounts: Object.fromEntries([...byGroup.entries()].map(([key, values]) => [key, values.length])),
};

if (process.argv.includes("--check")) {
  const actualTotal = Object.values(output.foundCounts).reduce((sum, count) => sum + count, 0);
  const missingOrMismatched = Object.entries(expected).filter(([group, count]) => output.foundCounts[group] !== count);
  const unexpected = Object.keys(output.foundCounts).filter((group) => !(group in expected));
  if (actualTotal !== Object.values(expected).reduce((sum, count) => sum + count, 0) || missingOrMismatched.length || unexpected.length) {
    console.error("Source inventory count check failed.");
    for (const [group, count] of missingOrMismatched) {
      console.error(`- ${group}: expected ${count}, found ${output.foundCounts[group] ?? 0}`);
    }
    for (const group of unexpected) console.error(`- unexpected group: ${group} (${output.foundCounts[group]})`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`Source inventory OK: ${actualTotal} entries across ${Object.keys(expected).length} groups.\n`);
  }
} else if (process.argv.includes("--json")) {
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
} else {
  const lines = [
    `# جرد الإسناد المرجعي الشامل — ${TODAY}`,
    "",
    "> **حدود:** هذا جرد آلي شامل لحقول الإسناد على مستوى السجل، وليس اعتماداً سريرياً أو مطابقة جرعة بجرعة. اسم المصدر أو تاريخ المراجعة لا يثبت أن كل عبارة/رقم مدعوم به. لم يُجرِ البرنامج فتح كل دراسة أو RCP أو مقارنة كل جملة بمصدرها.",
    "",
    "## خلاصة التغطية المرجعية المستخرجة",
    "",
    `- السجلات/المدخلات المفهرسة: **${Object.values(expected).reduce((sum, count) => sum + count, 0)}**.`,
    `- **${referenceRecords.filter((r) => r.sources.length && r.lastReviewed).length}** سجلًا فيها حقلا مصدر وتاريخ مراجعة معلنَان في metadata؛ هذا لا يثبت الاطلاع على الوثيقة أو مقابلة كل ادعاء.`,
    `- **${partialCitation.length}** سجل فرز/تسريب فيه اسم مصدر مختصر فقط، بلا تاريخ أو صفحة على مستوى السجل.`,
    `- **${referenceRecords.filter((r) => r.group === "atb-renal" && r.page !== null).length}** صفًا للمضادات يشير إلى صفحة في PDF مشترك؛ RCP/GPR/ePOPI ليس مربوطًا بكل جرعة/خلية.`,
    `- لفحص الأعداد: \`npm run audit:reference-inventory:check\`; لإعادة توليد هذا التقرير: \`node scripts/audit-source-inventory.mjs > docs/REFERENCE-INVENTORY-2026-10-24.md\`.`,
    "- التوليد الآلي لا يقرأ أو يثبت النص السريري ولا يراجع الترجمات؛ وظيفة الأداة جرد المصادر والمواضع فقط.",
    `- **${noRecordCitation.length}** مدخلًا بلا إحالة أولية على مستوى السجل.`,
    `- **${citationRegistry.reduce((sum, source) => sum + source.usageCount, 0)}** ذكرًا خامًا للمصادر و**${citationRegistry.length}** تسمية مصدر فريدة؛ منها **${citationRegistry.filter((source) => source.urls.length).length}** فقط لها URL في metadata (بعضها رابط موقع عام لا للوثيقة).`,
    "- مخطط `ReviewMeta` يحفظ أسماء مصادر كنصوص وتاريخ `AAAA-MM` فقط؛ لا يفرض DOI، الإصدار الكامل، الصفحة/الجدول، النص الداعم، تاريخ الاطلاع، أو اسم المراجع.",
    "",
    "## تغطية مجموعات البيانات",
    "",
    "| المجموعة | العدد المتوقع | السجلات المفهرسة | حالة الإسناد |",
    "|---|---:|---:|---|",
  ];
  for (const [group, count] of Object.entries(expected)) {
    const records = referenceRecords.filter((r) => r.group === group);
    const noCitation = noRecordCitation.filter((r) => r.group === group || group.startsWith("quickref-") && r.group === "quickref");
    let status = "لا يوجد مصدر على مستوى السجل";
    if (group === "atb-renal") status = "PDF + رقم الصفحة؛ المرجع الأولي الدقيق لكل جرعة غير مربوط";
    else if (["triage", "perfusions"].includes(group)) status = "اسم مصدر عام؛ لا تاريخ/صفحة/نسخة على مستوى السجل";
    else if (["quickref-vitalSigns", "quickref-emergencyNumbers"].includes(group)) status = "لا مصدر أولي/تاريخ تحقق لكل سطر";
    else if (records.length) status = records.every((r) => r.lastReviewed && r.sources.length) ? "حقول مصدر وتاريخ موجودة؛ ليست تحققاً مستقلاً" : "مصدر موجود جزئياً أو تاريخ مفقود";
    const included = Math.max(records.length, noCitation.length);
    lines.push(`| ${group} | ${count} | ${Math.min(included, count)} | ${status} |`);
  }
  lines.push("", "## سجل جميع تسميات المصادر الفريدة كما وردت", "", "| التسمية كما في البيانات | عدد مرات الاستشهاد | المجموعات | السجلات المرتبطة | URL المسجل |", "|---|---:|---|---|---|");
  for (const source of output.citationRegistry) {
    lines.push(`| ${source.label.replaceAll("|", "\\|")} | ${source.usageCount} | ${source.groups.join(", ")} | ${source.records.join(", ")} | ${source.urls.join(" · ") || "—"} |`);
  }
  lines.push("", "## سجل كل سجل ذي مصدر مُدخل", "", "| المجموعة | المعرّف | الاسم/العنوان الفرنسي | المصدر كما هو مسجل / نطاقه | URL | الصفحة | lastReviewed | الملف:السطر |", "|---|---|---|---|---|---:|---|---|");
  for (const r of output.referenceRecords) {
    const citation = r.group === "atb-renal"
      ? "OMEDIT Pays de la Loire V2.3, avril 2026 (en-tête commun; RCP/GPR/ePOPI non relié à cette ligne)"
      : r.sources.map((s) => s.label).join(" · ") || "—";
    const urls = r.sources.map((s) => s.url).filter(Boolean).join(" · ") || "—";
    const label = r.label.replaceAll("|", "\\|");
    lines.push(`| ${r.group} | ${r.id || "—"} | ${label || "—"} | ${citation.replaceAll("|", "\\|")} | ${urls} | ${r.page ?? "—"} | ${r.lastReviewed || "—"} | ${r.file}:${r.line} |`);
  }
  lines.push("", "## كل السجلات التي لا تملك استشهاداً أولياً على مستوى السجل", "", "| المجموعة | المعرّف | النص التعريفي إن توفر | سبب عدم كفاية الإسناد |", "|---|---|---|---|");
  for (const r of output.noRecordCitationRecords) {
    const label = String(r.label ?? "").replaceAll("|", "\\|");
    lines.push(`| ${r.group} | ${r.id || "—"} | ${label || "—"} | ${r.basis} |`);
  }
  lines.push("", "## سجلات ذات إحالة جزئية فقط", "", "| المجموعة | المعرّف | الاسم/العنوان | المصدر المسجل | الملف:السطر |", "|---|---|---|---|---|");
  for (const r of output.partialCitationRecords) {
    lines.push(`| ${r.group} | ${r.id} | ${r.label.replaceAll("|", "\\|") || "—"} | ${r.sources.map((s) => s.label.replaceAll("|", "\\|")).join(" · ")} | ${r.file}:${r.line} |`);
  }
  lines.push("", "## قاعدة التصنيف", "", "- **مصدر/تاريخ موجودان:** يثبت وجود حقول نصية في الكود فقط. لا يثبت أن المرجع موجود بالاسم المسجل، أو أن نسخته صحيحة، أو أنه يسند كل رقم وشرط وترجمة.",
    "- **إحالة جزئية:** تسمية عامة بلا رقم إصدار/صفحة/جدول أو تاريخ مراجعة لكل سجل.",
    "- **لا يوجد استشهاد أولي:** السجل غير قابل للاعتماد المرجعي حتى يضاف مصدر محدد ويطابقه مختص.",
    "- **الجداول المنقولة من PDF:** رقم الصفحة يتيح التتبع إلى ملف OMEDIT، لكنه لا يثبت أن كل الجرعات فيه حديثة أو متوافقة مع RCP تونسي.",
    "- **لا توجد أي حالة مصنفة معتمدة سريرياً في هذا الجرد.**", "");
  process.stdout.write(lines.join("\n"));
}
