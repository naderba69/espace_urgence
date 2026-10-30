# مطابقة العلامات التجارية مع سجل DPM التونسي — 2026-10-25

## الحالة والنطاق

- المصدر المعتمد: [قائمة الأدوية البشرية ذات AMM لدى DPM](https://dpm.tn/medicament/humain/liste-des-medicaments)، ملف القائمة الحالي: [liste_amm.xls](https://dpm.tn/images/pdf/liste_amm.xls).
- تمت مراجعة المقاطع 1–37، ثم فُحصت سجلات مستهدفة في المقاطع 38–140 و141–352، مع ملاحظة مستهدفة منفصلة في المقطع 344؛ وفي دفعة 2026-10-27 جرى استكمال الفجوات المختارة 45–64 و91–96 و104–112. **لم تُراجع المقاطع 38–352 مراجعة شاملة**. هذا سجل تدقيق مرحلي وليس إثباتاً لاكتمال البحث عن كل علامة لكل دواء.
- ملفات `data/medications*.ts` تحتوي حالياً **73 سجلاً بمعرّفات فريدة**.
- **الحصيلة الحالية بعد التحقق بتاريخ 2026-10-29: 356 صف مطابقة مؤكدة، و530 صف استبعاد موثق، و5 عروض في انتظار إثبات طريق IV/IM (891 صفاً ضمن النطاق المحدث).** عُثر على صورة العبوة الرسمية لـATROPINE SAIPH (`9163801H`)؛ تُظهر SC وIV بطيئاً وIM، وتطابق اسم/عيار/عبوة سجل DPM، فانتقل هذا العرض من الانتظار إلى المطابقة. تبقى خمسة عروض gentamicine قيد التحقق (أربعة GENTAINJECT وCIDOMYCINE 20)، دون نقل الطريق من علامة أو عيار آخر. بعد توثيق GENTA 10/20/40/160، أُعيد فحص عروض hydrocortisone السبعة: عُثر على دليل منتج مطابق لخمسة عروض (BIOCODEX 100 mg، MEDIS 100 mg بعبوتين، MEDO/Medochemie 100 mg، UPJOHN/SERB 100 mg)؛ بقي MEDIS 500 mg وLEURQUIN 100 mg مستبعدين لعدم وجود دليل IV/IM مطابق للعرض المحدد. وفي متابعة ondansétron أُثبتت طريق IV لستة عروض (MEDIS، UNIMED، RENAUDIN)، وأُبقيت خمسة عروض (SAIPH، STERIPHARM، ONDOFREN) مستبعدة لغياب دليل منتج مطابق. توثيق الأدلة وحدودها في `docs/DPM-ROUTE-VERIFICATION-2026-10-27.md`. الأعداد تخص صفوف AMM، لا العلامات الفريدة أو التوفر الفعلي، ولا تعني اكتمال مراجعة الأدوية الـ73 أو التحقق من المخزون؛ إثبات الطريق لا يصادق على الجرعات العامة.
- حُدّثت حقول `brands` لعدد من السجلات بعد مطابقة أسطر DPM؛ يورد الجدول أدناه الاسم وDCI والعيار والشكل والعبوة والمختبر ورقم AMM حيث أمكن نقلها حرفياً. ما زال فحص ملف DPM غير شامل لكل الأدوية الـ73.
- وجود رقم AMM يثبت التسجيل الظاهر في سجل DPM فقط؛ **لا يثبت التوفر الفعلي في الصيدليات أو المخزون الحالي**.
- رُوعي تهجّي DPM كما هو: سجل المعلقين يكتب `ZITROMAX` (AMM `8013021` و`8013022`)، لذلك أُبقيا منفصلين عن `ZITHROMAX` ولم يُطبّع الاسمان إلى علامة واحدة.
- عدم ظهور دواء أو عبوة في المقاطع التي جرى فحصها لا يثبت غياب AMM أو عرض آخر؛ لا يُستكمل أي نقص بالتخمين.

## المطابقات ذات سطر DPM المنقول هنا

تُسجّل العبوات أدناه بالقدر الذي ظهر صراحة في السطر المحفوظ؛ أي تفصيل غير منقول لا يُستكمل بالتخمين.

| معرّف التطبيق | الاسم التجاري في DPM | DCI | العيار | الشكل | العبوة كما وردت | المختبر/صاحب AMM | رقم AMM |
| `ketamine` | KETAMINE PANPHARMA | KETAMINE | 250 mg | محلول للحقن؛ B/25 أمبولة/5 mL | PANPHARMA | 7233011H |
| `ketamine` | KETAMINE PANPHARMA | KETAMINE | 50 mg/mL | محلول للحقن؛ B/5 أمبولات/5 mL | PANPHARMA | 7233012H |
| `ipratropium` | IPROVENT ADULTE | BROMURE D'IPRATROPIUM | 0.500 mg/2 mL | محلول للاستنشاق؛ B/10 وحدات أحادية الجرعة/2 mL | UNIMED | 9093782 |
| `ipratropium` | IPROVENT ENFANT | BROMURE D'IPRATROPIUM | 0.250 mg/2 mL | محلول للاستنشاق؛ B/10 وحدات أحادية الجرعة/2 mL | UNIMED | 9093781 |
|---|---|---|---|---|---|---|---|
| `adrenaline` | ADRENALINE AGUETTANT SANS SULFITES | ADRENALINE | 1 mg/mL | محلول للحقن | B/10 أمبولات/5 mL | LABORATOIRE AGUETTANT | 7093023H |
| `adrenaline` | ADRENALINE MEDIS sans conservateur | ADRENALINE | 1 mg/1 mL | محلول للحقن | B/10/1 mL | LES LABORATOIRES MEDIS | 9233901H |
| `adrenaline` | ADRENALINE MEDIS sans conservateur | ADRENALINE | 5 mg/5 mL | محلول للحقن | B/10/5 mL | LES LABORATOIRES MEDIS | 9233902H |
| `adrenaline` | ADRENALINE RENAUDIN 0.1% | ADRENALINE | 1 mg/mL | محلول للحقن | B/100/1 mL | RENAUDIN | 7713041H |
| `adrenaline` | ADRENALINE RENAUDIN 0.1% | ADRENALINE | 1 mg/mL | محلول للحقن | B/10/1 mL | RENAUDIN | 7713042H |
| `adrenaline` | ADRENALINE SOPHARMA | ADRENALINE | 1 mg/mL | محلول للحقن | B/10 أمبولات/1 mL | SOPHARMA SA | 10793012H |
| `adrenaline` | ADRENOL 1 (SANS SULFITES) | ADRENALINE | 1 mg/mL | محلول للحقن | B/100 أمبولة/1 mL | DORCAS | 9313141H |
| `adrenaline` | ADRENOL 1 (AVEC SULFITE) | ADRENALINE | 1 mg/mL | محلول للحقن | B/100 أمبولة/1 mL | DORCAS | 9313142H |
| `alteplase` | ACTILYSE | ALTEPLASE | 10 mg | مسحوق لتحضير محلول للحقن | B/1 قارورة + قارورة مذيب/10 mL | BOEHRINGER INGELHEIM FRANCE | 5253111H |
| `alteplase` | ACTILYSE | ALTEPLASE | 20 mg | مسحوق لتحضير محلول للحقن | B/1 قارورة + قارورة مذيب/20 mL | BOEHRINGER INGELHEIM FRANCE | 5253112H |
| `alteplase` | ACTILYSE | ALTEPLASE | 50 mg | مسحوق لتحضير محلول للحقن | B/1 قارورة + قارورة مذيب/50 mL | BOEHRINGER INGELHEIM FRANCE | 5253113H |
| `amiodarone` | AMIOCARD | AMIODARONE | 200 mg | قرص مشقوق | B/30 | ADWYA | 9044031 |
| `amiodarone` | RICARDYL | AMIODARONE | 200 mg | قرص مشقوق | B/20 | IBN AL BAYTAR | 9073471 |
| `amiodarone` | SEDACORON | AMIODARONE | 150 mg/3 mL | محلول للحقن | B/5 أمبولات/3 mL | EBEWE Pharma | 6943012 |
| `amiodarone` | CORDARONE | AMIODARONE | 150 mg/3 mL | محلول للحقن | B/6 أمبولات/3 mL | SANOFI-AVENTIS FRANCE | 6260032 |
| `amiodarone` | CORDARONE | AMIODARONE | 200 mg | قرص مشقوق | B/20 | SANOFI AVENTIS PHARMA TUNISIE | ST9263071 |
| `thiamine` | VITAMINE B1 | VITAMINE B1 | 100 mg/2 mL | محلول للحقن | B/4 أمبولات/2 mL | SIPHAT | ST9000371 |
| `thiamine` | VITAMINE B1 | VITAMINE B1 | 100 mg/2 mL | محلول للحقن | B/50 أمبولة/2 mL | SIPHAT | ST9000372H |
| `sufentanil` | SUFENTA | SUFENTANIL | 50 µg/10 mL | محلول للحقن | B/10 أمبولات/10 mL | Piramal Critical Care B.V. | 23693021H |
| `sufentanil` | SUFENTA | SUFENTANIL | 10 µg/2 mL | محلول للحقن | B/5 أمبولات/2 mL | Piramal Critical Care B.V. | 23693022H |
| `sufentanil` | SUFENTA | SUFENTANIL | 250 µg/5 mL | محلول للحقن | B/10 أمبولات/5 mL | Piramal Critical Care B.V. | 2363023H |
| `sufentanil` | SUFENTAMED | SUFENTANIL | 10 µg/2 mL | محلول للحقن | B/5 أمبولات/2 mL | UNIMED | 9093771H |
| `sufentanil` | SUFENTANIL MEDIS | SUFENTANIL | 250 µg/5 mL | محلول للحقن | B/5 أمبولات/5 mL | LES LABORATOIRES MEDIS | 9233671H |
| `sufentanil` | SUFENTANIL VIATRIS | SUFENTANIL | 50 µg/10 mL | محلول للحقن | B/20 أمبولات/10 mL | VIATRIS SANTE | 4923272H |
| `sufentanil` | SUFENTANIL VIATRIS | SUFENTANIL | 10 µg/2 mL | محلول للحقن | B/20 أمبولات/2 mL | VIATRIS SANTE | 4923271H |
| `sulfate-magnesium` | SULFATE DE MAGNESIUM PROAMP | MAGNESIUM | 15% | محلول للحقن | B/50 أمبولات/10 mL | LABORATOIRE AGUETTANT | 7093072H |
| `rocuronium` | RUCORON | ROCURONIUM BROMURE | 50 mg/5 mL | محلول للحقن | B/10 قوارير | HIKMA Pharmaceuticals | 6653811H |
| `rocuronium` | ESMERON | ROCURONIUM BROMURE | 50 mg/5 mL | محلول للحقن | B/10 قوارير/5 mL | MERCK SHARP & DOHME BV | 70131511H |
| `succinylcholine` | SUXAMETHONIUM AGUETTANT | SUXAMETHONIUM | 10 mg/mL | محلول للحقن في محاقن معبأة مسبقاً | B/10 محاقن/10 mL | LABORATOIRE AGUETTANT | 7093341H |
| `succinylcholine` | SUXAMETHONIUM CHLORID VUAB | SUXAMETHONIUM | 100 mg | مسحوق لتحضير معلق للحقن | B/1 قارورة | VUAB PHARMA AS | 19873011H |
| `succinylcholine` | SUXAMETHONIUM-LABESFAL | SUXAMETHONIUM | 100 mg/2 mL | محلول للحقن | B/100 أمبولة/2 mL | LABESFAL - Laboratorios Almiro S.A | 4333051H |
| `terbutaline` | BRICANYL | TERBUTALINE | 0.5 mg/1 mL | محلول للحقن؛ B/8 أمبولات/1 mL | ASTRA ZENECA | 5100012 |
| `terbutaline` | TALIN | TERBUTALINE | 0.5 mg/mL | محلول للحقن | B/8 أمبولات/1 mL | SAIPH | 9163264 |
| `octreotide` | SANDOSTATINE | OCTREOTIDE | 0.05 mg/mL | محلول للحقن | B/5 أمبولات/1 mL | NOVARTIS PHARMA SCHWEIZ AG | 10283181H |
| `octreotide` | SANDOSTATINE | OCTREOTIDE | 0.1 mg/mL | محلول للحقن | B/5 أمبولات/1 mL | NOVARTIS PHARMA SCHWEIZ AG | 10283182H |
| `midazolam` | HIKMA MIDAZOLAM | MIDAZOLAM | 5 mg/mL | محلول للحقن | B/10 أمبولات/1 mL | HIKMA Pharmaceuticals | 6653471H |
| `propofol` | PROPOFOL FRESENIUS | PROPOFOL | 10 mg/mL | مستحلب للحقن | B/10 قوارير/50 mL | FRESENIUS KABI FRANCE | 3153022H |
| `propofol` | PROPOFOL FRESENIUS | PROPOFOL | 10 mg/mL | مستحلب للحقن | B/5 أمبولات/20 mL | FRESENIUS KABI FRANCE | 3153021H |
| `propofol` | PROPOFOL FRESENIUS | PROPOFOL | 1% | مستحلب للحقن | B/10 قوارير/100 mL | FRESENIUS KABI FRANCE | 3153023H |
| `propofol` | PROPOFOL KABI 10MG/ML | PROPOFOL | 10 mg/mL | مستحلب للحقن للتسريب | B/5 أمبولات/20 mL | FRESENIUS KABI FRANCE | 3153221H |
| `propofol` | PROPOFOL KABI 10MG/ML | PROPOFOL | 10 mg/mL | مستحلب للحقن للتسريب | B/10 قوارير/50 mL | FRESENIUS KABI FRANCE | 3153222H |
| `propofol` | PROPOFOL-LIPURO 1% | PROPOFOL | 10 mg/mL | مستحلب للحقن | B/1 قارورة/50 mL | B.BRAUN Melsungen AG | 7353031H |
| `propofol` | PROPOFOL-LIPURO 1% | PROPOFOL | 10 mg/mL | مستحلب للحقن | B/5 أمبولات/20 mL | B.BRAUN Melsungen AG | 7353032H |
| `midazolam` | IPNODIS MEDIS | MIDAZOLAM | 2 mg/2 mL | محلول للحقن | B/10 أمبولات/2 mL | LES LABORATOIRES MEDIS | 9233282H |
| `midazolam` | IPNODIS MEDIS | MIDAZOLAM | 5 mg/1 mL | محلول للحقن | B/10 أمبولات/1 mL | LES LABORATOIRES MEDIS | 9233281H |
| `midazolam` | IPNODIS MEDIS | MIDAZOLAM | 25 mg/5 mL | محلول للحقن | B/5 أمبولات/5 mL | LES LABORATOIRES MEDIS | 9233283H |
| `midazolam` | IPNODIS | MIDAZOLAM | 50 mg/10 mL | محلول للحقن | B/6 أمبولات/10 mL | LES LABORATOIRES MEDIS | 9233284H |
| `midazolam` | ZOLAM 5 | MIDAZOLAM | 5 mg/mL | محلول للحقن | B/50 أمبولات/1 mL | DORCAS | 9313211H |
| `midazolam` | ZOLAM 25 | MIDAZOLAM | 25 mg/5 mL | محلول للحقن | B/50 أمبولات/5 mL | DORCAS | 9313212H |
| `nicardipine` | NICARDIPINE MÉDIS | NICARDIPINE | 10 mg/10 mL | محلول للحقن | B/5 أمبولات/10 mL | LES LABORATOIRES MEDIS | 9233641 |
| `haloperidol` | NEURODOL | HALOPERIDOL | 0.2% (2 mg/mL) | قطرات فموية | قارورة/30 mL | OPALIA PHARMA | 9023211 |
| `haloperidol` | NEURODOL | HALOPERIDOL | 0.2% (2 mg/mL) | قطرات فموية | قارورة/100 mL | OPALIA PHARMA | 9023213H |
| `metronidazole` | NIDAZOL | METRONIDAZOLE | 500 mg | قرص مغلف | B/14 | PHARMACARE | 9343372 |
| `noradrenaline` | NORADRENALINE MEDIS (SANS CONSERVATEUR) | NORADRENALINE | 2 mg/mL (8 mg/4 mL) | محلول للحقن/التسريب | B/10 أمبولات/4 mL | LES LABORATOIRES MEDIS | 9233851H |
| `noradrenaline` | NORADRENALINE MYLAN 2 MG/ML SANS SULFITES | NORADRENALINE | 8 mg/4 mL | محلول للتسريب الوريدي | B/50/4 mL | MYLAN S.A.S | 4923181H |
| `noradrenaline` | NORADRENALINE RENAUDIN 2 MG/ML SANS CONSERVATEUR | NORADRENALINE | 8 mg/4 mL | محلول للتسريب الوريدي | B/10/4 mL | RENAUDIN | 7713081H |
| `noradrenaline` | NORADRENALINE STERIPHARM (SANS CONSERVATEUR) | NORADRENALINE | 8 mg/4 mL | محلول للتسريب الوريدي | B/10/4 mL | STERIPHARM | 9443091H |
| `noradrenaline` | NORALINE (SANS SULFITES) | NORADRENALINE | 8 mg/4 mL | محلول للتسريب الوريدي | B/10/4 mL | UNIMED | 9093691H |
| `noradrenaline` | NORENOL 8 (SANS SULFITES) | NORADRENALINE | 8 mg/4 mL | محلول للتسريب الوريدي | B/10 أمبولات/4 mL | DORCAS | 9313151H |
| `ondansetron` | ZEMITRON | ONDANSETRONE | 8 mg | قرص مغلف | B/10 | ADVANCED PHARMACEUTICAL IND. | 4213031H |
| `ondansetron` | ONDANSETRON MEDIS | ONDANSETRONE | 4 mg | قرص مغلف | B/10 | LES LABORATOIRES MEDIS | 9233333 |
| `ondansetron` | ONDANSETRON MEDIS | ONDANSETRONE | 8 mg | قرص مغلف | B/10 | LES LABORATOIRES MEDIS | 9233334 |
| `ondansetron` | PMS-ONDANSETRON | ONDANSETRONE | 8 mg | قرص مغلف | قارورة/30 | PHARMASCIENCE INC CANADA | 2903032 |
| `salbutamol` | AEROL | SALBUTAMOL | 100 µg/جرعة | بخاخ مضغوط | عبوة مضغوطة/200 جرعة | BERG LIFE SCIENCES | 9283011 |
| `salbutamol` | VENTOL | SALBUTAMOL | 2.5 mg/2.5 mL | محلول للاستنشاق | B/10 أمبولات أحادية الجرعة/2.5 mL | UNIMED | 9094052 |
| `salbutamol` | VENTOL | SALBUTAMOL | 2.5 mg/2.5 mL | محلول للاستنشاق | B/60 أمبولة أحادية الجرعة/2.5 mL | UNIMED | 9094051H |
| `salbutamol` | VENTAXX | SALBUTAMOL | 100 µg/جرعة | بخاخ مضغوط | FL/200 جرعة | VAGA LABORATORIES | 9473011 |
| `salbutamol` | BUTO-ASMA | SALBUTAMOL | 100 µg/جرعة | بخاخ مضغوط؛ FL/200 جرعة | ALDO-UNION S.L | 3013031 |
| `amoxicilline` | CLAMOXYL | AMOXICILLINE | 500 mg | كبسولة | B/12 | ADWYA | 9043151 |
| `amoxicilline` | CLAMOXYL | AMOXICILLINE | 125 mg | مسحوق لتحضير معلق فموي | قارورة/60 mL | ADWYA | 9043154 |
| `amoxicilline` | CLAMOXYL | AMOXICILLINE | 250 mg | مسحوق لتحضير معلق فموي | قارورة/60 mL | ADWYA | 9043153 |
| `amoxicilline` | CLAMOXYL | AMOXICILLINE | 500 mg | مسحوق لتحضير معلق فموي | قارورة/60 mL | ADWYA | 9043152 |
| `amoxicilline` | CLAMOXYL DISPERSIBLE | AMOXICILLINE | 500 mg | قرص ذواب | B/12 | ADWYA | 9043156 |
| `amoxicilline` | CLAMOXYL DISPERSIBLE | AMOXICILLINE | 1 g | قرص ذواب | B/12 | ADWYA | 9043155 |
| `amoxicilline` | AMOXAL | AMOXICILLINE | 250 mg | مسحوق لتحضير معلق فموي | قارورة/100 mL | MEDICEF | 9183045 |
| `amoxicilline` | AMOXAL | AMOXICILLINE | 500 mg | قرص ذواب | B/24 | MEDICEF | 9183047 |
| `amoxicilline` | AMOXAL | AMOXICILLINE | 1 g | قرص ذواب | B/14 | MEDICEF | 9183046 |
| `furosemide` | ANSEMID | FUROSEMIDE | 40 mg | قرص مشقوق | B/30 | WEST PHARMA | 9293101 |
| `furosemide` | ANSEMID | FUROSEMIDE | 40 mg | قرص مشقوق | B/40 | WEST PHARMA | 9293103 |
| `furosemide` | ANSEMID | FUROSEMIDE | 40 mg | قرص مشقوق | B/500 | WEST PHARMA | 9293102H |
| `furosemide` | ANSEMID | FUROSEMIDE | 500 mg | قرص مشقوق | B/36 | WEST PHARMA | 9293191 |
| `levetiracetam` | ANTIOMAL 250 | LEVETIRACETAM | 250 mg | قرص مغلف | B/30 | TAHA PHARMA | 9373151 |
| `levetiracetam` | ANTIOMAL 250 | LEVETIRACETAM | 250 mg | قرص مغلف | B/60 | TAHA PHARMA | 9373154 |
| `levetiracetam` | ANTIOMAL 500 | LEVETIRACETAM | 500 mg | قرص مغلف | B/30 | TAHA PHARMA | 9373152 |
| `levetiracetam` | ANTIOMAL 500 | LEVETIRACETAM | 500 mg | قرص مغلف | B/60 | TAHA PHARMA | 9373156 |
| `levetiracetam` | ANTIOMAL 750 | LEVETIRACETAM | 750 mg | قرص مغلف | B/30 | TAHA PHARMA | 9373155 |
| `levetiracetam` | ANTIOMAL 750 | LEVETIRACETAM | 750 mg | قرص مغلف | B/60 | TAHA PHARMA | 9373153 |
| `levetiracetam` | ANTIOMAL 1000 | LEVETIRACETAM | 1000 mg | قرص مغلف مشقوق | B/30 | TAHA PHARMA | 9373157 |
| `amoxicilline` | AMOXIL | AMOXICILLINE | 0.5 g | مسحوق لتحضير محلول للحقن | B/1 قارورة + مذيب/5 mL | UNIMED | 9093352 |
| `amoxicilline` | AMOXIL | AMOXICILLINE | 1 g | مسحوق لتحضير محلول للحقن | B/1 قارورة + مذيب/5 mL | UNIMED | 9093351 |
| `amoxicilline` | AMOXIL IM IV | AMOXICILLINE | 0.5 g | مسحوق لتحضير محلول للحقن | B/1 قارورة + مذيب/5 mL | UNIMED | 9093353 |
| `amoxicilline` | AMOXICILLINE SANOFI | AMOXICILLINE | 250 mg/5 mL | مسحوق لتحضير معلق فموي | قارورة/60 mL + ملعقة قياس | WINTHROP PHARMA TUNISIE | 9103613 |
| `amoxicilline` | AMOXICILLINE SANOFI | AMOXICILLINE | 500 mg/5 mL | مسحوق لتحضير معلق فموي | قارورة/60 mL + ملعقة قياس | WINTHROP PHARMA TUNISIE | 9103612 |
| `amoxicilline` | AMOXICILLINE SANOFI | AMOXICILLINE | 500 mg | كبسولة | B/24 | SANOFI AVENTIS PHARMA TUNISIE | 9263401 |
| `amoxicilline` | AMOXICILLINE SANOFI | AMOXICILLINE | 1 g | قرص ذواب | B/12 | SANOFI AVENTIS PHARMA TUNISIE | 9263403 |
| `amoxicilline` | AMOXICILLINE SANOFI | AMOXICILLINE | 250 mg/5 mL | مسحوق لتحضير معلق فموي | قارورة/60 mL + ملعقة قياس | SANOFI AVENTIS PHARMA TUNISIE | 9263404 |
| `amoxicilline` | AMOXICILLINE SANOFI | AMOXICILLINE | 500 mg/5 mL | مسحوق لتحضير معلق فموي | قارورة/60 mL + ملعقة قياس | SANOFI AVENTIS PHARMA TUNISIE | 9263405 |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 250 mg | كبسولة | B/120 | SAIPH | 9163039H |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 250 mg | كبسولة | B/12 | SAIPH | 9163038 |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 500 mg/5 mL | مسحوق لتحضير معلق فموي | قارورة/100 mL | SAIPH | 91630317 |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 1 g | قرص مشتت مشقوق | B/24 | SAIPH | 91630316 |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 250 mg/5 mL | مسحوق لتحضير معلق فموي | قارورة/60 mL | SAIPH | 9163031 |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 500 mg | قرص مغلف | B/12 | SAIPH | 9163032 |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 500 mg | قرص مغلف | B/120 | SAIPH | 9163033H |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 500 mg/5 mL | مسحوق لتحضير معلق فموي | قارورة/60 mL | SAIPH | 9163035 |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 125 mg/5 mL | مسحوق لتحضير معلق فموي | قارورة/60 mL | SAIPH | 9163034 |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 1 g | قرص مغلف | B/12 | SAIPH | 9163036 |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 500 mg | قرص مغلف | B/24 | SAIPH | 9163037 |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 250 mg/5 mL | مسحوق لتحضير معلق فموي | قارورة/100 mL | SAIPH | 91630310 |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 500 mg | كبسولة | B/120 | SAIPH | 91630311H |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 500 mg | كبسولة | B/12 | SAIPH | 91630312 |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 1 g | قرص مشتت مشقوق | B/14 | SAIPH | 91630313 |
| `amoxicilline` | SAIFOXYL | AMOXICILLINE | 500 mg | قرص مشتت مشقوق | B/24 | SAIPH | 91630315 |
| `metronidazole` | TAMIZOL | METRONIDAZOLE | 4% | معلق فموي؛ قارورة/125 mL | GALPHARMA | 9223271 |
| `metronidazole` | TAMIZOL | METRONIDAZOLE | 250 mg | قرص ملبس | B/20 | GALPHARMA | 9223272 |
| `metronidazole` | TAMIZOL | METRONIDAZOLE | 500 mg | قرص ملبس مشقوق | B/14 | GALPHARMA | 9223273 |
| `metronidazole` | METROGYL | METRONIDAZOLE | 0.5% | محلول للحقن للتسريب؛ B/25 قوارير/100 mL | SIPHAT | 9003773H |
| `metronidazole` | METROJECT | METRONIDAZOLE | 0.5% | محلول للحقن للتسريب؛ B/25 أكياس/100 mL | UNIMED | 9094031H |
| `metronidazole` | METRONIDAZOLE INFOMED | METRONIDAZOLE | 0.5% | محلول للحقن للتسريب؛ كيس/100 mL | INFOMED Pharma | 9193161H |
| `cefotaxime` | CEFOTAXIME PANPHARMA IM IV | CEFOTAXIME | 500 mg | مسحوق لتحضير محلول للحقن | B/25 قارورة | PANPHARMA | 7233101H |
| `cefotaxime` | CEFOTAXIME PANPHARMA IM IV | CEFOTAXIME | 1 g | مسحوق لتحضير محلول للحقن | B/25 قارورة | PANPHARMA | 7233102H |
| `cefotaxime` | CEFOTIM IM | CEFOTAXIME | 1 g | مسحوق لتحضير محلول للحقن | B/1 قارورة + مذيب/4 mL | UNIMED | 9093361 |
| `cefotaxime` | CEFOTIM IM IV | CEFOTAXIME | 1 g | مسحوق لتحضير محلول للحقن | B/1 قارورة + مذيب/4 mL | UNIMED | 9093261 |
| `cefotaxime` | CEFOTIM IM IV | CEFOTAXIME | 500 mg | مسحوق لتحضير محلول للحقن | B/1 قارورة + مذيب/2 mL | UNIMED | 9093262 |
| `cefotaxime` | CEFOTIM IM IV | CEFOTAXIME | 1 g | مسحوق لتحضير محلول للحقن | B/10 قوارير | UNIMED | 9093362 |
| `ciprofloxacine` | CIPRO 200 | CIPROFLOXACINE | 200 mg/100 mL | محلول للتسريب الوريدي | B/12 قارورة/100 mL | LES LABORATOIRES MEDIS | 9233295H |
| `ciprofloxacine` | CIPRO 200 | CIPROFLOXACINE | 200 mg/100 mL | محلول للتسريب الوريدي | قارورة/100 mL | LES LABORATOIRES MEDIS | 9233291 |
| `ciprofloxacine` | CIPROJECT | CIPROFLOXACINE | 200 mg/100 mL | محلول للتسريب الوريدي | كيس/100 mL | UNIMED | 9093751H |
| `ciprofloxacine` | CIPROJECT | CIPROFLOXACINE | 200 mg/100 mL | محلول للتسريب الوريدي | كيس متعدد الطبقات/100 mL | UNIMED | 9093753H |
| `ciprofloxacine` | CIPROJECT | CIPROFLOXACINE | 400 mg/200 mL | محلول للتسريب الوريدي | كيس/200 mL | UNIMED | 9093752H |
| `ciprofloxacine` | CIPROFLOXACINE KABI | CIPROFLOXACINE | 200 mg/100 mL | محلول للتسريب الوريدي | كيس/100 mL | FRESENIUS KABI FRANCE | 3153072H |
| `ciprofloxacine` | CIPROFLOXACINE KABI | CIPROFLOXACINE | 400 mg/200 mL | محلول للتسريب الوريدي | كيس/200 mL | FRESENIUS KABI FRANCE | 3153071H |
| `ciprofloxacine` | CIFLOXET 200 | CIPROFLOXACINE | 200 mg/100 mL | محلول للحقن؛ والاستطباب يصرح «solution pour perfusion (IV)» | قارورة/100 mL | DORCAS | 9313021H |
| `ciprofloxacine` | CIFLOXET 200 | CIPROFLOXACINE | 200 mg/100 mL | محلول للحقن؛ والاستطباب يصرح «solution pour perfusion (IV)» | B/6 قوارير/100 mL | DORCAS | 9313022H |
| `ciprofloxacine` | QUINOLOX | CIPROFLOXACINE | 500 mg | قرص ملبس | B/14 | ACT PHARMA | 9363091 |
| `ciprofloxacine` | QUINOLOX | CIPROFLOXACINE | 750 mg | قرص ملبس | B/14 | ACT PHARMA | 9363092 |
| `ciprofloxacine` | SIFLOKS | CIPROFLOXACINE | 500 mg | قرص ملبس مشقوق | B/28 | TERIAK | 9253032 |
| `ciprofloxacine` | SIFLOKS | CIPROFLOXACINE | 500 mg | قرص ملبس مشقوق | B/14 | TERIAK | 9253031 |
| `ciprofloxacine` | SIFLOKS | CIPROFLOXACINE | 500 mg | قرص ملبس مشقوق | B/70 | TERIAK | 9253032H |
| `ciprofloxacine` | SIFLOKS | CIPROFLOXACINE | 750 mg | قرص ملبس مشقوق | B/14 | TERIAK | 9253034 |
| `ciprofloxacine` | SIFLOKS | CIPROFLOXACINE | 750 mg | قرص ملبس مشقوق | B/28 | TERIAK | 9253035 |
| `ciprofloxacine` | SIPRODIS | CIPROFLOXACINE | 500 mg | قرص ملبس مشقوق | B/14 | GALPHARMA | 9223621 |
| `ciprofloxacine` | SIPRODIS | CIPROFLOXACINE | 750 mg | قرص ملبس | B/14 | GALPHARMA | 9223622 |
| `ciprofloxacine` | UFEXIL | CIPROFLOXACINE | 200 mg/100 mL | محلول للحقن بالتسريب | B/10 قوارير/100 mL | DEMO SA | 6855101H |
| `ciprofloxacine` | BACTALL | CIPROFLOXACINE | 500 mg | قرص مغلف مشقوق | B/10 | SAIPH | ST9163682 |
| `ciprofloxacine` | BACTALL | CIPROFLOXACINE | 500 mg | قرص مغلف مشقوق | B/70 | SAIPH | 9163683H |
| `ciprofloxacine` | CIFLOXIN | CIPROFLOXACINE | 500 mg | قرص ملبس | B/14 | TERIAK | 9253421 |
| `ciprofloxacine` | CIPRO 500 | CIPROFLOXACINE | 500 mg | قرص ملبس | B/14 | LES LABORATOIRES MEDIS | 9233293 |
| `ciprofloxacine` | CIPRO 750 | CIPROFLOXACINE | 750 mg | قرص ملبس | B/14 | LES LABORATOIRES MEDIS | 9233294 |
| `ciprofloxacine` | CIPROCINE | CIPROFLOXACINE | 500 mg | قرص ملبس مشقوق | B/14 | DAR-ESSAYDALI | 9213441 |
| `ciprofloxacine` | CIPROCINE | CIPROFLOXACINE | 750 mg | قرص ملبس | B/14 | DAR-ESSAYDALI | 9213442 |
| `ciprofloxacine` | CIPRODAR | CIPROFLOXACINE | 500 mg | قرص ملبس مشقوق | B/70 | SAIPH | 9163302H |
| `ciprofloxacine` | CIPROFLEX 500 | CIPROFLOXACINE | 500 mg | قرص ملبس | B/14 | TAHA PHARMA | 9373211 |
| `ciprofloxacine` | CIPROFLEX 500 | CIPROFLOXACINE | 500 mg | قرص ملبس | B/28 | TAHA PHARMA | 9373213 |
| `ciprofloxacine` | CIPROFLEX 750 | CIPROFLOXACINE | 750 mg | قرص ملبس | B/15 | TAHA PHARMA | 9373212 |
| `ciprofloxacine` | CIPROFLO INFO | CIPROFLOXACINE | 2 mg/mL | محلول للحقن بالتسريب | كيس/200 mL | INFOMED Pharma | 9193172H |
| `ciprofloxacine` | CIPROFLO INFO | CIPROFLOXACINE | 2 mg/mL | محلول للحقن بالتسريب | كيس/100 mL | INFOMED Pharma | 9193171H |
| `ciprofloxacine` | CIPROFLOXACINE AGUETTANT | CIPROFLOXACINE | 200 mg/100 mL | محلول للحقن بالتسريب | B/20 أكياس/100 mL | LABORATOIRE AGUETTANT | 7093271H |
| `ciprofloxacine` | CIPROLON 500 | CIPROFLOXACINE | 500 mg | قرص ملبس مشقوق | B/10 | IBN AL BAYTAR | 9073211 |
| `ciprofloxacine` | CIPROLON 500 | CIPROFLOXACINE | 500 mg | قرص ملبس مشقوق | B/14 | IBN AL BAYTAR | 9073212 |
| `ciprofloxacine` | CIPROLON 750 | CIPROFLOXACINE | 750 mg | قرص ملبس مشقوق | B/10 | IBN AL BAYTAR | 9073213 |
| `ciprofloxacine` | CIPROLON 750 | CIPROFLOXACINE | 750 mg | قرص ملبس مشقوق | B/14 | IBN AL BAYTAR | 9073214 |
| `ciprofloxacine` | CIPROMAX 500 | CIPROFLOXACINE | 500 mg | قرص ملبس مشقوق | B/14 | PHARMACARE | 9343441 |
| `ciprofloxacine` | CIPROMAX 750 | CIPROFLOXACINE | 750 mg | قرص ملبس | B/14 | PHARMACARE | 9343442 |
| `ciprofloxacine` | CIPROSAIPH | CIPROFLOXACINE | 500 mg | قرص ملبس مشقوق | B/14 | SAIPH | 9163681 |
| `piperacilline-tazobactam` | PIPERACILLINE/TAZOBACTAM KABI | PIPERACILLINE+TAZOBACTAM | 2 g/250 mg | مسحوق لتحضير محلول للتسريب | B/10 قوارير/50 mL | FRESENIUS KABI FRANCE | 3153151H |
| `piperacilline-tazobactam` | PIPERACILLINE/TAZOBACTAM KABI | PIPERACILLINE+TAZOBACTAM | 4 g/500 mg | مسحوق لتحضير محلول للتسريب | B/10 قوارير | FRESENIUS KABI FRANCE | 3153152H |
| `piperacilline-tazobactam` | PIPERACILLINE/TAZOBACTAM VIATRIS | PIPERACILLINE+TAZOBACTAM | 2 g/250 mg | مسحوق لتحضير محلول للتسريب | B/1 قارورة | VIATRIS SANTE | 4923331H |
| `piperacilline-tazobactam` | PIPERACILLINE/TAZOBACTAM VIATRIS | PIPERACILLINE+TAZOBACTAM | 4 g/500 mg | مسحوق لتحضير محلول للتسريب | B/1 قارورة | VIATRIS SANTE | 4923332H |
| `piperacilline-tazobactam` | PIPERACILLINE-TAZOBACTAM SANDOZ | PIPERACILLINE+TAZOBACTAM | 4 g/500 mg | مسحوق لتحضير محلول للتسريب | B/10 قوارير/100 mL | SANDOZ GmbH | 11073051H |
| `diazepam` | DIAZEPAM APM 10 MG/2 ML IM/IV | DIAZEPAM | 10 mg/2 mL | محلول للحقن | B/100/2 mL | APM | 5063172H |
| `diazepam` | DIAZEPAM APM 10 MG/2 ML IM/IV | DIAZEPAM | 10 mg/2 mL | محلول للحقن | B/5/2 mL | APM | 5063173 |
| `oxytocine` | OXYTOCIN GRINDEKS | OXYTOCINE | 5 UI/mL | محلول للحقن | B/10 أمبولات/1 mL | GRINDEX | 15483011 |
| `oxytocine` | OXYTOCINE | OXYTOCINE | 5 UI | محلول للحقن | B/5 أمبولات/1 mL | GEDEON RICHTER | 6673071 |
| `oxytocine` | OXYTOCINE PANPHARMA | OXYTOCINE | 5 UI/mL | محلول للحقن | B/10 | PANPHARMA | 7233141 |
| `aspirine` | ASPEGIC | ACETYLSALICYLATE DE LYSINE | 1 g | مسحوق لتحضير محلول للحقن | B/6 قوارير + مذيب/5 mL | OPELLA HEALTHACARE FRANCE SAS | 26883012 |
| `aspirine` | ASPEGIC | ACETYLSALICYLATE DE LYSINE | 500 mg | مسحوق لتحضير محلول للحقن | B/20 قوارير | OPELLA HEALTHACARE FRANCE SAS | 26883011H |
| `aspirine` | ASPEGIC | ACETYLSALICYLATE DE LYSINE | 500 mg | مسحوق لتحضير محلول للحقن | B/6 قوارير + مذيب/5 mL | SANOFI-AVENTIS FRANCE | 6480011 |
| `aspirine` | ASPEGIC ADULTES | ACETYLSALICYLATE DE LYSINE | 1000 mg | مسحوق لتحضير محلول فموي | B/16 أكياس | SANOFI AVENTIS PHARMA TUNISIE | 92630112 |
| `aspirine` | ASPEGIC ADULTES | ACETYLSALICYLATE DE LYSINE | 1000 mg | مسحوق لتحضير محلول فموي | B/20 | WINTHROP PHARMA TUNISIE | 9103964 |
| `aspirine` | ASPIRINE | ACIDE ACETYLSALICYLIQUE | 500 mg | قرص | B/20 | SIPHAT | 9000031A |
| `aspirine` | ASPIRINE | ACIDE ACETYLSALICYLIQUE | 500 mg | قرص | B/500 | SIPHAT | 900031AH |
| `aspirine` | ACTALGINE | ACIDE ACETYLSALICYLIQUE | 500 mg | قرص | B/18 | ACT PHARMA | 9363151 |
| `aspirine` | ACETYLSALICYLATE DE LYSINE LABESFAL | ACETYLSALICYLATE DE LYSINE | 900 mg | مسحوق لتحضير محلول للحقن | B/6 قوارير + 6 مذيبات/5 mL | LABESFAL - Laboratorios Almiro S.A | 4333041 |
| `aspirine` | ACETYLSALICYLATE DE LYSINE LABESFAL | ACETYLSALICYLATE DE LYSINE | 900 mg | مسحوق لتحضير محلول للحقن | B/50 قارورة + 50 مذيب/5 mL | LABESFAL - Laboratorios Almiro S.A | 4333042 |
| `aspirine` | KARDEGIC | ACETYLSALICYLATE DE LYSINE | 160 mg | مسحوق لتحضير محلول فموي | B/20 أكياس | SANOFI AVENTIS PHARMA TUNISIE | 9263151 |
| `aspirine` | KARDEGIC | ACETYLSALICYLATE DE LYSINE | 160 mg | مسحوق لتحضير محلول فموي | B/30 أكياس | SANOFI AVENTIS PHARMA TUNISIE | 9263152 |
| `aspirine` | KARDEGIC | ACETYLSALICYLATE DE LYSINE | 160 mg | مسحوق لتحضير محلول فموي | B/30 أكياس | WINTHROP PHARMA TUNISIE | 9103951 |
| `aspirine` | TROMBYL | ACIDE ACETYLSALICYLIQUE | 75 mg | قرص | قارورة/100 | PFIZER AB | 13473011 |
| `aspirine` | CARDIOCINE | ACIDE ACETYLSALICYLIQUE | 100 mg | قرص | B/30 | ACT PHARMA | 9363121 |
| `aspirine` | CARDIOCINE | ACIDE ACETYLSALICYLIQUE | 100 mg | قرص | B/90 | ACT PHARMA | 9363122 |
| `paracetamol` | ANALGAN | PARACETAMOL | 10 mg/mL | محلول للحقن بالتسريب | B/12 قارورة/100 mL | SIPHAT | 9003018 |
| `paracetamol` | ANALGAN ENFANT ET NOURRISSON | PARACETAMOL | 10 mg/mL | محلول للحقن بالتسريب | B/12 قارورة/50 mL | SIPHAT | 9003017 |
| `paracetamol` | STOPALGIC | PARACETAMOL | 500 mg | قرص مشقوق | B/20 | LES LABORATOIRES MEDIS | 9233751 |
| `paracetamol` | STOPALGIC | PARACETAMOL | 10 mg/mL | محلول للحقن بالتسريب | قارورة/100 mL | LES LABORATOIRES MEDIS | 9233752 |
| `paracetamol` | STOPALGIC | PARACETAMOL | 1000 mg | قرص مشقوق | B/8 | LES LABORATOIRES MEDIS | 9233753 |
| `paracetamol` | STOPALGIC | PARACETAMOL | 10 mg/mL | محلول للحقن بالتسريب | قارورة/50 mL | LES LABORATOIRES MEDIS | 9233754 |
| `paracetamol` | STOPALGIC | PARACETAMOL | 10 mg/mL | محلول للحقن بالتسريب | B/12 قوارير/50 mL | LES LABORATOIRES MEDIS | 9233755 |
| `paracetamol` | STOPALGIC | PARACETAMOL | 10 mg/mL | محلول للحقن بالتسريب | B/12 قوارير/100 mL | LES LABORATOIRES MEDIS | 9233756 |
| `paracetamol` | PARAMED | PARACETAMOL | 10 mg/mL | محلول للتسريب الوريدي | B/6 أكياس PVC/50 mL | UNIMED | 9093801 |
| `paracetamol` | PARAMED | PARACETAMOL | 10 mg/mL | محلول للتسريب الوريدي | B/6 أكياس PVC/100 mL | UNIMED | 9093802 |
| `paracetamol` | PARAMED | PARACETAMOL | 10 mg/mL | محلول للتسريب الوريدي | B/6 أكياس متعددة الطبقات/100 mL | UNIMED | 9093803 |
| `paracetamol` | PARAMED | PARACETAMOL | 10 mg/mL | محلول للتسريب الوريدي | B/6 أكياس متعددة الطبقات/50 mL | UNIMED | 9093804 |
| `paracetamol` | PARAC INFO | PARACETAMOL | 10 mg/mL | محلول للحقن بالتسريب | كيس/50 mL | INFOMED Pharma | 9193151 |
| `paracetamol` | PARAC INFO | PARACETAMOL | 10 mg/mL | محلول للحقن بالتسريب | كيس/100 mL | INFOMED Pharma | 9193152 |
| `paracetamol` | PARALGYL 500 | PARACETAMOL | 10 mg/mL | محلول للتسريب | B/6/50 mL | DORCAS | 9313041 |
| `paracetamol` | PARALGYL 1000 | PARACETAMOL | 10 mg/mL | محلول للحقن | B/6/100 mL | DORCAS | 9313042 |
| `paracetamol` | PARALGYL 1000 | PARACETAMOL | 10 mg/mL | محلول للحقن | B/24/100 mL | DORCAS | 9313043 |
| `paracetamol` | PARALGYL 1000 | PARACETAMOL | 10 mg/mL | محلول للحقن | B/1/100 mL | DORCAS | 9313044 |
| `levetiracetam` | LEVET | LEVETIRACETAM | 100 mg/mL | محلول فموي | قارورة/300 mL | SIMED | 9083601 |
| `levetiracetam` | LEVET | LEVETIRACETAM | 500 mg | قرص مشقوق | B/60 | PHILADELPHIA PHARMA | 9353071 |
| `levetiracetam` | LEVET | LEVETIRACETAM | 500 mg | قرص مشقوق | B/30 | PHILADELPHIA PHARMA | 9353072 |
| `levetiracetam` | LEVET | LEVETIRACETAM | 250 mg | قرص | B/60 | PHILADELPHIA PHARMA | 9353073 |
| `levetiracetam` | LEVET | LEVETIRACETAM | 750 mg | قرص | B/60 | PHILADELPHIA PHARMA | 9353074 |
| `levetiracetam` | VETIRA | LEVETIRACETAM | 250 mg | قرص ملبس | B/60 | TERIAK | 9253941 |
| `levetiracetam` | VETIRA | LEVETIRACETAM | 500 mg | قرص ملبس | B/60 | TERIAK | 9253942 |
| `levetiracetam` | VETIRA | LEVETIRACETAM | 750 mg | قرص ملبس | B/60 | TERIAK | 9253943 |
| `dobutamine` | DOBUTAMINE HIKMA | DOBUTAMINE | 250 mg/20 mL | محلول للحقن بالتسريب | B/1 قارورة/20 mL | HIKMA Pharmaceuticals | 6653711H |
| `dobutamine` | DOBUTAMINE VIATRIS | DOBUTAMINE | 250 mg/20 mL | محلول للحقن؛ العبوة محددة للتسريب | B/10 أمبولات/20 mL | VIATRIS SANTE | 4923151H |
| `azithromycine` | AZACINE | AZITHROMYCINE | 500 mg | قرص مغلف مشقوق | B/3 | DAR-ESSAYDALI | 9213411 |
| `azithromycine` | ZOMAX | AZITHROMYCINE | 250 mg | كبسولة | B/6 | IBN AL BAYTAR | 9073421 |
| `azithromycine` | ZOMAX | AZITHROMYCINE | 500 mg | قرص مغلف | B/3 | IBN AL BAYTAR | 9073422 |
| `azithromycine` | ZOMAX | AZITHROMYCINE | 600 mg | مسحوق لمعلق فموي | قارورة/15 mL | IBN AL BAYTAR | 9073423 |
| `azithromycine` | ZOMAX | AZITHROMYCINE | 900 mg | مسحوق لمعلق فموي | قارورة/22.5 mL | IBN AL BAYTAR | 9073424 |
| `azithromycine` | ZOMAX 1500 | AZITHROMYCINE | 40 mg/mL | مسحوق لمعلق فموي | قارورة/37.5 mL | IBN AL BAYTAR | 9073425 |
| `azithromycine` | ZITROCIN | AZITHROMYCINE | 500 mg | قرص مغلف | B/3 | TERIAK | 9253411 |
| `azithromycine` | ZITROCIN 600 MG | AZITHROMYCINE | 40 mg/mL | مسحوق لمعلق فموي | قارورة/15 mL | TERIAK | 9253412 |
| `azithromycine` | ZITHROMAX | AZITHROMYCINE | 500 mg | قرص قابل للشطر | B/3 | PFIZER TUNISIE | 9243053 |
| `azithromycine` | ZITHROMAX | AZITHROMYCINE | 1500 mg/37.5 mL | مسحوق لمعلق فموي | قارورة/37.5 mL | PFIZER HOLDING FRANCE | 6043171 |
| `azithromycine` | ZITHROMAX UNO | AZITHROMYCINE | 500 mg | قرص قابل للشطر | B/2 | PFIZER TUNISIE | 9243054 |
| `azithromycine` | ZITROMAX 600 MG | AZITHROMYCINE | 40 mg/mL | مسحوق لمعلق فموي | قارورة/15 mL | PFIZER Europe MA EEIG | 8013021 |
| `azithromycine` | ZITROMAX 900 MG | AZITHROMYCINE | 40 mg/mL | مسحوق لمعلق فموي | قارورة/22.5 mL | PFIZER Europe MA EEIG | 8013022 |
| `azithromycine` | ZITHROCARE | AZITHROMYCINE | 500 mg | قرص مغلف | B/3 | PHARMACARE | 9343191 |
| `azithromycine` | ZITRO | AZITHROMYCINE | 500 mg | قرص مغلف | B/3 | LES LABORATOIRES MEDIS | 9234021 |
| `azithromycine` | AZITHROCINE 250 | AZITHROMYCINE | 250 mg | كبسولة | B/6 | SIPHAT | 9003781 |
| `azithromycine` | AZITRAL | AZITHROMYCINE | 500 mg | قرص مغلف | B/3 | ACT PHARMA | 9363071 |
| `azithromycine` | AZITROMIN DUO | AZITHROMYCINE | 500 mg | قرص مغلف مشقوق | B/2 | WEST PHARMA | 9293291 |
| `azithromycine` | AZITROMIN TRIO | AZITHROMYCINE | 500 mg | قرص مغلف مشقوق | B/3 | WEST PHARMA | 9293292 |
| `azithromycine` | AZIX | AZITHROMYCINE | 1500 mg/37.5 mL | مسحوق لمعلق فموي | قارورة/37.5 mL | PHARMAGHREB | 9013605 |
| `azithromycine` | AZIX | AZITHROMYCINE | 1200 mg (40 mg/mL) | مسحوق لمعلق فموي | قارورة/30 mL | PHARMAGHREB | 9013604 |
| `azithromycine` | AZIX | AZITHROMYCINE | 500 mg | قرص مغلف | B/3 | PHARMAGHREB | 9013601 |
| `azithromycine` | AZIX 600 | AZITHROMYCINE | 40 mg/mL | مسحوق لمعلق فموي | قارورة/15 mL | PHARMAGHREB | 9013602 |
| `azithromycine` | AZIX 900 | AZITHROMYCINE | 40 mg/mL | مسحوق لمعلق فموي | قارورة/22.5 mL | PHARMAGHREB | 9013603 |
| `azithromycine` | AZOMYCINE | AZITHROMYCINE | 500 mg | قرص مغلف مشقوق | B/3 | PIERRE FABRE MEDICAMENT PRODUCTION TUNISIE | 9323221 |
| `azithromycine` | AZRO | AZITHROMYCINE | 1500 mg/37.5 mL | مسحوق لمعلق فموي | قارورة/37.5 mL | TERIAK | 9253224 |
| `azithromycine` | AZRO | AZITHROMYCINE | 500 mg | قرص مغلف مشقوق | B/3 | TERIAK | 9253221 |
| `azithromycine` | AZRO 600 MG | AZITHROMYCINE | 40 mg/mL | مسحوق لمعلق فموي | قارورة/15 mL | TERIAK | 9253222 |
| `azithromycine` | AZRO 900 MG | AZITHROMYCINE | 40 mg/mL | مسحوق لمعلق فموي | قارورة/22.5 mL | TERIAK | 9253223 |
| `propranolol` | AVLOCARDYL | PROPRANOLOL | 5 mg/5 mL | محلول للحقن | B/5 أمبولات/5 mL | ASTRA ZENECA | 5680011 |
| `propranolol` | NORMOCARDIL | PROPRANOLOL | 40 mg | قرص quadrisécable | B/45 | DAR-ESSAYDALI | 9213091 |
| `propranolol` | NORMOCARDIL | PROPRANOLOL | 40 mg | قرص quadrisécable | B/300 | DAR-ESSAYDALI | 9213092H |
| `ketoprofene` | KETOPROF 100 | KETOPROFENE | 50 mg/mL (100 mg/2 mL) | محلول للحقن | B/5 أمبولات/2 mL | DORCAS | 9313101 |
| `ketoprofene` | KETOPROF 100 | KETOPROFENE | 50 mg/mL (100 mg/2 mL) | محلول للحقن | B/2 أمبولات/2 mL | DORCAS | 9313102 |
| `ketoprofene` | KETOMED IM | KETOPROFENE | 100 mg/2 mL | محلول للحقن | B/5 أمبولات/2 mL | UNIMED | 9093402 |
| `ketoprofene` | KETOMED IM | KETOPROFENE | 100 mg/2 mL | محلول للحقن | B/2 أمبولات/2 mL | UNIMED | 9093401 |
| `ketoprofene` | PROFENID | KETOPROFENE | 100 mg | قرص ملبس | B/30 | SANOFI AVENTIS PHARMA TUNISIE | ST9263392 |
| `ketoprofene` | PROFENID | KETOPROFENE | 100 mg | قرص ملبس | B/15 | SANOFI AVENTIS PHARMA TUNISIE | ST9263391 |
| `ketoprofene` | PROFENID | KETOPROFENE | 100 mg | قرص ملبس | B/30 | WINTHROP PHARMA TUNISIE | 9103521 |
| `ketoprofene` | PROFENID | KETOPROFENE | 100 mg | قرص ملبس | B/15 | WINTHROP PHARMA TUNISIE | 9103524 |
| `ketoprofene` | PROFENID IM | KETOPROFENE | 100 mg/2 mL | محلول للحقن | B/5/2 mL | SANOFI AVENTIS PHARMA TUNISIE | ST9263431 |
| `ketoprofene` | PROFENID IM | KETOPROFENE | 100 mg/2 mL | محلول للحقن | B/5/2 mL | WINTHROP PHARMA TUNISIE | ST9103523 |
| `ketoprofene` | PROFENID IM | KETOPROFENE | 100 mg/2 mL | محلول للحقن | B/2/2 mL | WINTHROP PHARMA TUNISIE | ST9103525 |
| `tamsulosine` | PROSTAM L.P. | TAMSULOSINE | 0.4 mg | كبسولة ممتدة التحرر | B/30 | ADWYA | 9043851 |
| `tamsulosine` | PROSTAM L.P | TAMSULOSINE | 0.4 mg | كبسولة ممتدة التحرر | B/90 | ADWYA | 9043852 |
| `gluconate-calcium` | GLUCONATE DE CALCIUM | CALCIUM | 10% | محلول للحقن | B/100 أمبولة/10 mL | LABORATOIRE AGUETTANT | 7093051H |
| `gluconate-calcium` | GLUCONATE DE CALCIUM B BRAUN | GLUCONATE DE CALCIUM | 10% | محلول للحقن للتسريب | B/20 أمبولة/10 mL | B.BRAUN Melsungen AG | 7353041H |
| `gluconate-calcium` | GLUCONATE DE CALCIUM PROAMP | CALCIUM | 10% | محلول للحقن | B/50 أمبولة/10 mL | LABORATOIRE AGUETTANT | 7093052H |
| `chlorure-potassium` | CHLORURE DE POTASSIUM 10% UNIMED | CHLORURE DE POTASSIUM | 10% | محلول للحقن | B/100 أمبولة/10 mL | UNIMED | 9093082H |
| `glucose30` | GLUCOSE A 30% | GLUCOSE | 30% | محلول للحقن للتسريب | قارورة/500 mL | SIPHAT | 9003631 |
| `glucose30` | GLUCOSE A 30% INFOMED | GLUCOSE | 30% | محلول للحقن للتسريب | كيس/500 mL | INFOMED Pharma | 9193106 |
| `glucose30` | GLUCOSE 30% PROAMP | GLUCOSE | 30% | محلول للحقن للتسريب | B/50 أمبولة/10 mL | LABORATOIRE AGUETTANT | 7093132H |
| `furosemide` | FUROSEMIDE SIPHAT | FUROSEMIDE | 40 mg | قرص | B/20 | SIPHAT | 9000141 |
| `furosemide` | FUROSEMIDE SIPHAT | FUROSEMIDE | 40 mg | قرص | B/600 | SIPHAT | 9000142H |
| `furosemide` | FURANS 20 | FUROSEMIDE | 20 mg | محلول للحقن | B/2 أمبولة/2 mL | DORCAS | 9313171 |
| `furosemide` | FURANS 20 | FUROSEMIDE | 20 mg | محلول للحقن | B/50 أمبولة/2 mL | DORCAS | 9313172H |
| `furosemide` | FURILAN | FUROSEMIDE | 40 mg | قرص | B/20 | LAPROPHAN | 6795101 |
| `furosemide` | FURILAN | FUROSEMIDE | 20 mg | محلول للحقن | B/5 أمبولات/2 mL | LAPROPHAN | 6795102 |
| `furosemide` | FUROLIX | FUROSEMIDE | 20 mg | محلول للحقن | B/50 أمبولة/2 mL | LES LABORATOIRES MEDIS | 9233211H |
| `furosemide` | FUROLIX | FUROSEMIDE | 20 mg | محلول للحقن | B/2 أمبولة/2 mL | LES LABORATOIRES MEDIS | 9233212 |
| `furosemide` | FUROLIX SPECIAL | FUROSEMIDE | 250 mg/25 mL | محلول للحقن | B/5 قوارير/25 mL | LES LABORATOIRES MEDIS | 9233213H |
| `furosemide` | FUROSEMIDE | FUROSEMIDE | 20 mg/2 mL | محلول للحقن | B/100 أمبولة/2 mL | RENAUDIN | 7713031H |
| `furosemide` | FUROSEMIDE STERIPHARM | FUROSEMIDE | 20 mg/2 mL | محلول للحقن | B/50 أمبولة/2 mL | STERIPHARM | 9443071H |
| `furosemide` | FUROXEM | FUROSEMIDE | 20 mg/2 mL | محلول للحقن | B/5 أمبولات/2 mL | UNIMED | 9093331 |
| `furosemide` | LASICARE | FUROSEMIDE | 500 mg | قرص مشقوق | B/50 | PHARMACARE | 9343111 |
| `furosemide` | LASICARE | FUROSEMIDE | 40 mg | قرص مشقوق | B/20 | PHARMACARE | 9343112 |
| `furosemide` | LASICARE | FUROSEMIDE | 40 mg | قرص مشقوق | B/600 | PHARMACARE | 9343113H |
| `furosemide` | LASILIX | FUROSEMIDE | 40 mg | قرص مشقوق | B/20 | SANOFI AVENTIS PHARMA TUNISIE | ST9263361 |
| `furosemide` | LASILIX | FUROSEMIDE | 40 mg | قرص مشقوق | B/20 | WINTHROP PHARMA TUNISIE | 9103231 |
| `furosemide` | LASILIX RETARD | FUROSEMIDE | 60 mg | كبسولة ممتدة التحرر | B/30 | SANOFI-AVENTIS FRANCE | 5660062 |
| `furosemide` | LASILIX SPECIAL | FUROSEMIDE | 500 mg | قرص مشقوق | B/100 | SANOFI-AVENTIS FRANCE | 5660067H |
| `furosemide` | LASILIX SPECIAL | FUROSEMIDE | 250 mg | محلول للحقن | B/6 أمبولات/25 mL | SANOFI-AVENTIS FRANCE | 5660068H |
| `emulsion-lipidique` | INTRALIPIDE | EMULSION DE LIPIDES | 20% | مستحلب للحقن | كيس/500 mL | FRESENIUS KABI FRANCE | 3153061H |
| `amoxicilline` | GALAMOX | AMOXICILLINE | 250 mg/5 mL | مسحوق لمعلق فموي | B/1 قارورة/60 mL | GALPHARMA | 9223661 |
| `amoxicilline` | GALAMOX | AMOXICILLINE | 500 mg/5 mL | مسحوق لمعلق فموي | B/1 قارورة/60 mL | GALPHARMA | 9223662 |
| `amoxicilline` | GALAMOX | AMOXICILLINE | 500 mg | كبسولة | B/12 | GALPHARMA | 9223665 |
| `amoxicilline` | GALAMOX | AMOXICILLINE | 500 mg | قرص قابل للتبعثر | B/12 | GALPHARMA | 9223664 |
| `amoxicilline` | GALAMOX | AMOXICILLINE | 500 mg | قرص قابل للتبعثر | B/24 | GALPHARMA | 9223663 |
| `amoxicilline` | GALAMOX | AMOXICILLINE | 1 g | قرص قابل للتبعثر | B/14 | GALPHARMA | 9223666 |
| `amoxicilline` | NOVAMOX | AMOXICILLINE | 500 mg | قرص قابل للتبعثر | B/12 | ADWYA | 9043971 |
| `amoxicilline` | NOVAMOX | AMOXICILLINE | 1 g | قرص قابل للتبعثر | B/12 | ADWYA | 9043972 |
| `amoxicilline` | NOVAMOX | AMOXICILLINE | 500 mg/5 mL | مسحوق لتحضير معلق فموي | قارورة/60 mL | ADWYA | 9043973 |
| `amoxicilline` | NOVAMOX | AMOXICILLINE | 250 mg/5 mL | مسحوق لتحضير معلق فموي | قارورة/60 mL | ADWYA | 9043974 |
| `amoxicilline` | NOVAMOX | AMOXICILLINE | 500 mg | قرص قابل للتبعثر | B/24 | ADWYA | 9043975 |
| `amoxicilline` | NOVAMOX | AMOXICILLINE | 500 mg | كبسولة | B/12 | ADWYA | 9043976 |
| `amoxicilline` | PENAMOX | AMOXICILLINE | 500 mg | كبسولة | B/400 | MEDICEF | 91830210H |
| `amoxicilline` | PENAMOX | AMOXICILLINE | 250 mg | مسحوق لتحضير معلق فموي | FL/100 mL | MEDICEF | 9183024 |
| `amoxicilline` | PENAMOX | AMOXICILLINE | 500 mg | كبسولة | B/24 | MEDICEF | 9183026 |
| `amoxicilline` | PENAMOX | AMOXICILLINE | 1 g | قرص مغلف مشقوق | B/12 | MEDICEF | 9183028 |
| `amoxicilline` | PENAMOX 500 | AMOXICILLINE | 500 mg | حبيبات لمعلق فموي | قارورة/100 mL | MEDICEF | 9183029 |

| `glucagon` | GLUCAGEN | GLUCAGON | 1 mg/1 UI | مسحوق لتحضير محلول للحقن | B/10 قوارير lyophilisat + 10 قوارير مذيب | NOVO NORDISK A/S Bagsvaerd | 5993033 |
| `glucagon` | GLUCAGEN HYPOKIT | GLUCAGON | 1 mg | مسحوق لتحضير محلول للحقن | قارورة + محقنة/1 mL | NOVO NORDISK A/S Bagsvaerd | 5993031 |

| `nacl-hypertonique` | CHLORURE DE SODIUM PROAMP. | CHLORURE DE SODIUM | 20% (0.2 g/mL) | محلول للحقن بالتسريب | B/50 أمبولة/10 mL | LABORATOIRE AGUETTANT | 7093213H |

## سجلات ليدوكائين لم تُستخدم لمطابقة مستحضر الحقن المفرد

الصفوف الآتية لا تُستخدم كعلامات لبطاقة الليدوكائين المضاد لاضطراب النظم: بعضها موضعي أو ممزوج بالأدرينالين/بريلوكائين، وبعض الحقن يذكر له سجل DPM استعمالاً تخديرياً موضعياً/ناحياً ولا يثبت مطابقة الاستطباب المضاد للنظم؛ سُجّلت هنا لتجنب الخلط:

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد من `brands` لهذه البطاقة |
|---|---|---|---|---|---|---|
| XYLOCAINE URETRAL | LIDOCAINE | 2% | جل إحليلي؛ B/1 محقنة جاهزة/10 g | ASPEN PHARMA TRADING Limited | 15493072 | جل موضعي، لا محلول حقن |
| XYLOCAINE VISQUEUSE | LIDOCAINE | 2% | جل فموي؛ أنبوب/100 g | ASTRA ZENECA | 5103022 | جل موضعي، لا محلول حقن |
| XYLOGEL | LIDOCAINE | 2% | جل فموي؛ أنبوب/60 g | PHARMADERM | 9053231 | جل موضعي، لا محلول حقن |
| LIDOCAINE 10 MG/ML ADRENALINE 0.005 MG/ML AGUETTANT | LIDOCAINE+ADRENALINE | lidocaine 10 mg/mL + adrenaline 0.005 mg/mL | محلول للحقن؛ B/10 أمبولات/10 mL | LABORATOIRE AGUETTANT | 7093321 | تركيبة مع أدرينالين، وليست ليدوكائين مفرداً |
| LIDOCAÏNE 2% MEDIS AVEC ADRENALINE | ADRENALINE+LIDOCAINE | 2% مع أدرينالين | محلول للحقن؛ B/50 carpules/1.8 mL | LES LABORATOIRES MEDIS | 9233621 | تركيبة مع أدرينالين |
| LIDOCAINE 20 MG/ML ADRENALINE 0.005 MG/ML AGUETTANT | LIDOCAINE+ADRENALINE | lidocaine 20 mg/mL + adrenaline 0.005 mg/mL | محلول للحقن؛ B/10 أمبولات/10 mL | LABORATOIRE AGUETTANT | 7093322 | تركيبة مع أدرينالين |
| LIDOCA PLUS | LIDOCAINE+PRILOCAINE | 5% | كريم جلدي؛ أنبوب/30 g | SIMED | 9083691 | مزيج موضعي مع prilocaine |
| EMLA | LIDOCAINE+PRILOCAINE | 5% | كريم جلدي؛ أنبوب/5 g | ASTRA ZENECA | 5103061 | مخدر موضعي جلدي/مخاطي مع prilocaine؛ لا يطابق بطاقة lidocaine الوريدية لاضطراب النظم. |
| LIDOCAINE | LIDOCAINE | 5% | محلول خارجي؛ قارورة/24 mL | LAPROPHAN | 6795131 | مستحضر خارجي، لا محلول حقن |
| LIDOCA | LIDOCAINE | 10 mg/mL، بلا مواد حافظة | محلول للحقن؛ B/10 أمبولات/5 mL | STERIPHARM | 9443151 | سجل DPM يصف استعمالاً تخديرياً موضعياً/ناحياً؛ لم تُثبت مطابقته لبطاقة اضطراب النظم. |
| LIDOCA | LIDOCAINE | 20 mg/mL، بلا مواد حافظة | محلول للحقن؛ B/10 أمبولات/5 mL | STERIPHARM | 9443152 | سجل DPM يصف استعمالاً تخديرياً موضعياً/ناحياً؛ لم تُثبت مطابقته لبطاقة اضطراب النظم. |
| LIDOJECT | LIDOCAINE | 1% | محلول للحقن؛ B/50 أمبولة/10 mL | LABESFAL - Laboratorios Almiro S.A | 4333021H | دواعي التخدير الموضعي/الناحي في DPM؛ لا يُربط ببطاقة اضطراب النظم. |
| LIDOJECT | LIDOCAINE | 2% | محلول للحقن؛ B/50 أمبولة/10 mL | LABESFAL - Laboratorios Almiro S.A | 4333022H | دواعي التخدير الموضعي/الناحي في DPM؛ لا يُربط ببطاقة اضطراب النظم. |
| DOCAINE 2% | LIDOCAINE | 2% | محلول للحقن؛ B/50 أمبولة/5 mL | DORCAS | 9313161H | مستحضر تخدير موضعي/ناحي؛ غير معتمد كعلامة لبطاقة اضطراب النظم. |
| OREX SPRAY | CHLORHEXIDINE+LIDOCAINE | 20 mg/10 mL | مستحضر موضعي للحلق (collutoire)؛ عبوة مضغوطة/30 mL | SIMED | 9083781 | تركيبة موضعية للحلق تحتوي lidocaine؛ ليست مستحضر حقن لاضطراب النظم. |
| OTIPAX | PHENAZONE+LIDOCAINE | غير مذكور | قطرات أذنية؛ قارورة/15 mL | BIOCODEX | 5193041 | تركيبة أذنية موضعية؛ لا تُربط ببطاقة اضطراب النظم. |
| OTIPAX | PHENAZONE+LIDOCAINE | غير مذكور | قطرات أذنية؛ قارورة/15 mL | PHARMAGHREB | 9013281 | تركيبة أذنية موضعية؛ لا تُربط ببطاقة اضطراب النظم. |
| AURIPAX | PHENAZONE+LIDOCAINE | غير مذكور | قطرات أذنية؛ قارورة/15 mL | OPALIA PHARMA | 9023351 | تركيبة أذنية موضعية؛ لا تُربط ببطاقة اضطراب النظم. |
| PRILIA | LIDOCAINE+PRILOCAINE | 5% | كريم جلدي؛ أنبوب/30 g | OPALIA PHARMA | 9023882 | تركيبة موضعية مع prilocaine، وليست lidocaine مفرداً للحقن. |
| PRILIA | LIDOCAINE+PRILOCAINE | 5% | كريم جلدي؛ أنبوب أحادي الجرعة/5 g + ضمادتين انسداديتين | OPALIA PHARMA | 9023881 | تركيبة موضعية مع prilocaine، وليست lidocaine مفرداً للحقن. |
| PRILIA | LIDOCAINE+PRILOCAINE | 5% | كريم جلدي؛ أنبوب أحادي الجرعة/5 g | OPALIA PHARMA | 9023883 | تركيبة موضعية مع prilocaine، وليست lidocaine مفرداً للحقن. |
| PRILOCALM | LIDOCAINE+PRILOCAINE | 5% | كريم جلدي؛ أنبوب/30 g | GALPHARMA | 9223681 | تركيبة موضعية مع prilocaine، وليست lidocaine مفرداً للحقن. |
| PROCTOHEAL | BISMUTH+FLUOCINOLONE+LIDOCAINE | غير مذكور | مرهم شرجي؛ أنبوب/15 g | Dar Al Dawa Development and Investment Co.Ltd | 5403231 | تركيبة شرجية موضعية متعددة المكونات، لا تطابق lidocaine الوريدي المفرد. |
| UNICAINE | LIDOCAINE | 1% | محلول للحقن؛ B/50 قارورة/5 mL | UNIMED | 9093161H | استعمالات تخدير موضعي/ناحي؛ لا يثبت مطابقة بطاقة اضطراب النظم. |
| UNICAINE | LIDOCAINE | 1% | محلول للحقن؛ B/10 قوارير/5 mL | UNIMED | 9093161 | استعمال تخدير موضعي/ناحي؛ لا يثبت مطابقة بطاقة اضطراب النظم. |
| UNICAINE | LIDOCAINE | 2% | محلول للحقن؛ B/10 قوارير/5 mL | UNIMED | 9093162 | استعمال تخدير موضعي/ناحي؛ لا يثبت مطابقة بطاقة اضطراب النظم. |
| UNICAINE | LIDOCAINE | 2% | محلول للحقن؛ B/50 قارورة/5 mL | UNIMED | 9093162H | رغم تصنيف النظام القلبي في DPM، النص المنقول يذكر استعمالات التخدير الموضعي/الناحي ولا يثبت الاستعمال المضاد للنظم. |
| UNICAINE 1% | LIDOCAINE | 1% | محلول للحقن؛ B/50 قارورة/10 mL | UNIMED | 9093163H | استعمالات تخدير موضعي/ناحي؛ لا يثبت مطابقة بطاقة اضطراب النظم. |
| UNICAINE 2% | LIDOCAINE | غير محدد في خانة العيار | محلول للحقن؛ B/50 قارورة/10 mL | UNIMED | 9093164H | استعمالات تخدير موضعي/ناحي؛ لا يثبت مطابقة بطاقة اضطراب النظم. |
| TITANOREINE LIDOCAINE | CARRAGHAHEEN+LIDOCAINE | غير محدد | كريم شرجي؛ أنبوب/20 g | Jhonson & Jhonson Santé Beauté France | 7493072 | تركيبة شرجية موضعية للبواسير؛ لا تطابق lidocaine الوريدي المفرد لاضطراب النظم. |
| AFTAGEL | LIDOCAINE+SULFATE DE ZINC | غير مذكور | جل فموي؛ أنبوب/15 mL | COOPERATION PHARMACEUTIQUE FRANCAISE | 7623081 | مستحضر موضعي لآفات مخاطية الفم؛ لا يطابق lidocaine الوريدي المفرد. |
| CHLORHYDRATE DE LIDOCAINE | LIDOCAINE | 1% | محلول للحقن؛ B/1 قارورة/4 mL | UNIMED | 9093421 | مُصرّح به صراحةً كمذيب لمساحيق الحقن وللاستعمال العضلي فقط؛ لا يطابق بطاقة lidocaine المضادة لاضطراب النظم الوريدية. |
| CHLORHYDRATE DE LIDOCAINE | LIDOCAINE | 1% | محلول للحقن؛ B/1 قارورة/5 mL | UNIMED | 9093422 | مُصرّح به صراحةً كمذيب لمساحيق الحقن وللاستعمال العضلي فقط؛ لا يطابق بطاقة lidocaine المضادة لاضطراب النظم الوريدية. |

## ANAPEN ذاتي الحقن لا يطابق بطاقة الأدرينالين الوريدي

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| ANAPEN | ADRENALINE | 150 microgram/0.3 mL | قلم حقن ذاتي؛ B/2 | BIOPROJET PHARMA | 2853021 | جهاز وعيار مختلفان عن محلول الأدرينالين الوريدي؛ لا يُعامل كأمبولة IV ولا تُنقل الجرعة بينهما. |
| ANAPEN | ADRENALINE | 300 microgram/0.3 mL | قلم حقن ذاتي؛ B/2 | BIOPROJET PHARMA | 2853022 | جهاز وعيار مختلفان عن محلول الأدرينالين الوريدي؛ لا يُعامل كأمبولة IV ولا تُنقل الجرعة بينهما. |

## سجل إبراتروبيوم مستبعد من بطاقة النيبولايزر

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم إدراجه لبطاقة النيبولايزر |
|---|---|---|---|---|---|---|
| ATROVENT | BROMURE D'IPRATROPIUM | 20 µg/جرعة | بخاخ مضغوط؛ FL/200 جرعة | BOEHRINGER INGELHEIM FRANCE | 5213074 | بخاخ مضغوط وليس أمبولة/محلولاً للنيبولايزر؛ لا تُنقل إليه جرعة النيبولايزر. |
| ATROALDO | BROMURE D'IPRATROPIUM | 20 µg/جرعة | بخاخ مضغوط؛ قارورة/10 mL، 200 جرعة | ALDO-UNION S.L | 3013061 | بخاخ مضغوط وليس أمبولة/محلولاً للنيبولايزر؛ لا تُنقل إليه جرعة النيبولايزر. |

هذان الصفان من المقطع 33 لا يثبتان غياب تسجيل أشكال أخرى من الإبراتروبيوم؛ يثبتان فقط أن سجلي ATROVENT وATROALDO المنقولين هنا بخاخان مضغوطان.

## AZYTER قطرة عينية لا تطابق بطاقة azithromycine الجهازية

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| AZYTER | AZITHROMYCINE | 15 mg/g | قطرة عينية أحادية الجرعة؛ B/6 حاويات أحادية/0.25 g | THEA | 8443081 | مستحضر عيني موضعي؛ لا يطابق الأشكال الجهازية ولا تُنقل إليه جرعاتها. |

## قطرتا ATROPINE UNIMED العينيّتان لا تطابقان بطاقة الحقن

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| ATROPINE UNIMED | ATROPINE | 0.5% | قطرة عينية؛ قارورة/5 mL | UNIMED | 9093442 | شكل عيني، لا محلول atropine للحقن. |
| ATROPINE UNIMED | ATROPINE | 1% | قطرة عينية؛ قارورة/5 mL | UNIMED | 9093441 | شكل عيني، لا محلول atropine للحقن. |

## سجل phenylephrine غير مطابق لبطاقة الحقن الوريدي

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم إدراجه لبطاقة الحقن الوريدي |
|---|---|---|---|---|---|---|
| NEOPHRINE | PHENYLEPHRINE | 10% | قطرة عينية؛ FL/10 mL | UNIMED | 9093452 | مستحضر عيني لتوسيع الحدقة؛ لا يطابق بطاقة phenylephrine الوريدية ولا يثبت علامة للحقن. |

## سجلات OSMOMED المركبة غير المطابقة لبطاقة KCl المفرد

| الاسم في DPM | DCI المركبة | العيار المسجل | الشكل والعبوة | المختبر | AMM | سبب عدم إدراجها لبطاقة KCl |
|---|---|---|---|---|---|---|
| OSMOMED | GLUCOSE+CHLORURE DE SODIUM+CHLORURE DE POTASSIUM | 5% | محلول للتسريب؛ قارورة PP/500 mL | UNIMED | 9093623 | محلول متعدد المكونات؛ لا يثبت عيار أو تقديم KCl المفرد 10%. |
| OSMOMED | GLUCOSE+CHLORURE DE SODIUM+CHLORURE DE POTASSIUM | 5% | محلول للتسريب؛ كيس متعدد الطبقات/500 mL | UNIMED | 9093622 | محلول متعدد المكونات؛ لا يثبت عيار أو تقديم KCl المفرد 10%. |
| OSMOMED | GLUCOSE+CHLORURE DE SODIUM+CHLORURE DE POTASSIUM | 5% | محلول للتسريب؛ قارورة/500 mL | UNIMED | 9093591 | محلول متعدد المكونات؛ لا يثبت عيار أو تقديم KCl المفرد 10%. |
| OSMOMED | GLUCOSE+CHLORURE DE SODIUM+CHLORURE DE POTASSIUM | 5% | محلول للتسريب؛ كيس/500 mL مع أنبوبتي تسريب | UNIMED | 9093621 | محلول متعدد المكونات؛ لا يثبت عيار أو تقديم KCl المفرد 10%. |
| POLYONIQUE G 5% MACOPHARMA | GLUCOSE+CHLORURE DE SODIUM+CHLORURE DE POTASSIUM | 5% (كما في اسم المنتج) | محلول للتسريب؛ كيس/500 mL | MACO PHARMA S.A | 10773011 | محلول متعدد المكونات؛ لا يثبت عيار أو تقديم KCl المفرد 10%. |

## CHLORURE DE CALCIUM لا يطابق بطاقة gluconate de calcium

| الاسم في DPM | DCI كما في السجل | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| CHLORURE DE CALCIUM | CALCIUM | 10% | محلول للحقن؛ B/10 أمبولات/5 mL | UNIMED | 9093171A | ملح calcium chloride لا يطابق gluconate de calcium؛ لا تُنقل الجرعات أو الأحجام بين الملحين. |
| CHLORURE DE CALCIUM | CALCIUM | 10% | محلول للحقن؛ B/100 أمبولة/5 mL | UNIMED | 9093171AH | ملح calcium chloride لا يطابق gluconate de calcium؛ لا تُنقل الجرعات أو الأحجام بين الملحين. |
| CHLORURE DE CALCIUM | CALCIUM | 10% | محلول للحقن؛ B/100 أمبولة/10 mL | UNIMED | 9093171BH | ملح calcium chloride لا يطابق gluconate de calcium؛ لا تُنقل الجرعات أو الأحجام بين الملحين. |
| FRUBIOSE CALCIQUE FAIBLE | ERGOCALCIFEROL+CALCIUM GLUCONATE+CALCIUM LACTATE | غير مذكور | أمبولات للشرب؛ C/20 أمبولة/5 mL | SIPHAT | 9003501 | تركيبة فموية متعددة المكونات، لا تطابق gluconate de calcium الحقني. |
| FRUBIOSE CALCIQUE FORTE | ERGOCALCIFEROL+CALCIUM LACTATE+CALCIUM GLUCONATE | غير مذكور | أمبولات للشرب؛ B/20 أمبولة/5 mL | SIPHAT | 9003502 | تركيبة فموية متعددة المكونات، لا تطابق gluconate de calcium الحقني. |
| GLUCALCIUM | CALCIUM | 10% | محلول للحقن؛ B/100 أمبولة/10 mL | RENAUDIN | 7713021H | السطر لا يذكر IV صراحة؛ لا يُفترض طريق الإعطاء لبطاقة gluconate de calcium الوريدي. |
| GLUCONATE DE CALCIUM | CALCIUM | غير مذكور | أمبولات للشرب؛ B/100/10 mL | SIPHAT | 9003171H | شكل فموي، لا يطابق بطاقة gluconate de calcium الوريدي. |

## مستحضرات paracetamol الفموية أو المركبة غير مطابقة لبطاقة الوريد

تُترك هذه السجلات خارج `brands` لبطاقة paracetamol الوريدية: الأقراص الفموية ليست مستحضرات IV، والمستحضرات المركبة لا تطابق paracetamol المفرد.

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط ببطاقة paracetamol IV |
|---|---|---|---|---|---|---|
| PANADOL | PARACETAMOL | 1 g | قرص ملبس مشقوق؛ B/8 | TERIAK | 9253194 | شكل فموي؛ لا يُربط بجرعة IV. |
| PANADOL | PARACETAMOL | 500 mg | قرص ملبس مشقوق؛ B/16 | TERIAK | 9253191 | شكل فموي؛ لا يُربط بجرعة IV. |
| PANADOL | PARACETAMOL | 500 mg | قرص ملبس مشقوق؛ B/8 | TERIAK | 9253192 | شكل فموي؛ لا يُربط بجرعة IV. |
| PANADOL | PARACETAMOL | 500 mg | قرص ملبس مشقوق؛ B/480 | TERIAK | 9253193H | شكل فموي؛ لا يُربط بجرعة IV. |
| ANALGAN | PARACETAMOL | 500 mg | قرص؛ B/20 | SIPHAT | 9003014 | شكل فموي؛ لا يُربط ببطاقة paracetamol الوريدية. |
| ANALGAN | PARACETAMOL | 500 mg | قرص؛ B/500 | SIPHAT | 9003011H | شكل فموي؛ لا يُربط ببطاقة paracetamol الوريدية. |
| ANALGAN CODEINE | PARACETAMOL+CODEINE | 300 mg/25 mg | قرص؛ B/16 | SIPHAT | 9003016 | تركيبة مع codeine؛ لا تطابق paracetamol المفرد الوريدي. |
| ANALGAN CODEINE | PARACETAMOL+CODEINE | 600 mg/50 mg | قرص؛ B/12 | SIPHAT | 9003015 | تركيبة مع codeine؛ لا تطابق paracetamol المفرد الوريدي. |
| ANALGAN CODEINE | PARACETAMOL+CODEINE | 600 mg/50 mg | قرص؛ B/300 | SIPHAT | 9003019H | تركيبة مع codeine؛ لا تطابق paracetamol المفرد الوريدي. |
| ANALGAN EXTRA | PARACETAMOL+CAFEINE | 500 mg/65 mg | قرص مشقوق؛ B/16 | SIPHAT | 9003921 | تركيبة مع cafeine؛ لا تطابق paracetamol المفرد الوريدي. |
| ANALGAN JEUNE ENFANT | PARACETAMOL | 170 mg | تحميلة؛ B/10 | SIPHAT | 9003013 | شكل شرجي؛ لا يطابق بطاقة paracetamol الوريدية. |
| ANALGAN NOURRISSONS | PARACETAMOL | 80 mg | تحميلة؛ B/10 | SIPHAT | 9003012 | شكل شرجي؛ لا يطابق بطاقة paracetamol الوريدية. |
| APYREX PEDIATRIQUE | PARACETAMOL | 3% | معلق فموي؛ قارورة/90 mL | TERIAK | 9253531 | شكل فموي؛ لا يُربط ببطاقة paracetamol الوريدية. |
| ALGESIC | PARACETAMOL | 500 mg | قرص مشقوق؛ B/20 | DAR-ESSAYDALI | 9213351 | شكل فموي؛ لا يُربط ببطاقة paracetamol الوريدية. |
| ALGESIC | PARACETAMOL | 500 mg | قرص مشقوق؛ B/160 | DAR-ESSAYDALI | 9213354H | شكل فموي؛ لا يُربط ببطاقة paracetamol الوريدية. |
| CETAMOL | PARACETAMOL | 500 mg | كبسولة؛ B/16 | GALPHARMA | 9223042 | شكل فموي؛ لا يُربط ببطاقة paracetamol الوريدية. |
| CETAMOL | PARACETAMOL | 500 mg | كبسولة؛ B/20 | GALPHARMA | 9223043 | شكل فموي؛ لا يُربط ببطاقة paracetamol الوريدية. |
| CETAMOL | PARACETAMOL | 1 g | قرص مشقوق؛ B/8 | GALPHARMA | 9223045 | شكل فموي؛ لا يُربط ببطاقة paracetamol الوريدية. |
| CETAMOL | PARACETAMOL | 500 mg | قرص مشقوق؛ B/16 | GALPHARMA | 9223044 | شكل فموي؛ لا يُربط ببطاقة paracetamol الوريدية. |
| CETAMOL | PARACETAMOL | 3% | محلول فموي؛ قارورة/100 mL | GALPHARMA | 9223046 | شكل فموي؛ لا يُربط ببطاقة paracetamol الوريدية. |
| CETRADOL | PARACETAMOL+TRAMADOL | 37.5 mg/325 mg | كبسولة؛ B/20 | GALPHARMA | 9223321 | تركيبة مع tramadol؛ لا تطابق paracetamol المفرد الوريدي. |
| ALGESIC 1000 MG | PARACETAMOL | 1000 mg | قرص مشقوق؛ B/8 | DAR-ESSAYDALI | 9213352 | شكل فموي؛ لا يُربط ببطاقة paracetamol الوريدية. |
| ALGESIC PEDIATRIQUE | PARACETAMOL | 3% | محلول فموي؛ قارورة/90 mL | DAR-ESSAYDALI | 9213357 | شكل فموي؛ لا يُربط ببطاقة paracetamol الوريدية. |
| ALGESIC PLUS | PARACETAMOL+CODEINE | 500 mg/12.8 mg | قرص مشقوق؛ B/16 | DAR-ESSAYDALI | 9213356 | تركيبة مع codeine؛ لا تطابق paracetamol المفرد الوريدي. |
| ALGÉSIC RHUME | PARACETAMOL+PHENYLEPHRINE+CAFEINE | 500 mg/25 mg/5 mg | قرص مغلف؛ B/16 | DAR-ESSAYDALI | 9213355 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |
| PANADOL EXTRA | PARACETAMOL+CAFEINE | غير مذكور | قرص ملبس؛ B/16 | TERIAK | 9253201 | تركيبة مع الكافيين؛ لا تطابق paracetamol المفرد. |
| PANADOL EXTRA | PARACETAMOL+CAFEINE | 500 mg/65 mg | قرص ملبس مشقوق؛ B/8 | TERIAK | 9253202 | تركيبة مع الكافيين؛ لا تطابق paracetamol المفرد. |
| PANADOL RHUME ET GRIPPE | PARACETAMOL+PHENYLEPHRINE+CAFEINE | غير مذكور | قرص ملبس؛ B/16 | TERIAK | 9253801 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد ولا بطاقة الحقن الوريدي. |
| RHINOFEBRAL | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | كبسولة؛ B/20 | McNeil | 7493081 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |
| RHINOSTOP | PARACETAMOL+PSEUDOEPHEDRINE+CHLORPHENIRAMINE | غير مذكور | قرص؛ B/20 | SAIPH | 9163231 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |
| RHINOSTOP | PARACETAMOL+PSEUDOEPHEDRINE+CHLORPHENIRAMINE | غير مذكور | شراب؛ قارورة/100 mL | SIMED | 9083311 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |
| RHUMAGRIP | PARACETAMOL+PSEUDOEPHEDRINE | 500 mg/30 mg | قرص مشقوق؛ B/20 | IBN AL BAYTAR | 9073271 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |
| RHUVEX ADULTE | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | حبيبات لتحضير معلق فموي؛ B/8 أكياس | TERIAK | 9253331 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |
| RHUVEX ADULTE SANS SUCRE | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | حبيبات لتحضير معلق فموي؛ B/8 أكياس | TERIAK | 9253491 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |
| RHUVEX ENFANT | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | حبيبات لتحضير معلق فموي؛ B/8 أكياس | TERIAK | 9253492 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |
| RHUVEX JOUR ET NUIT | PARACETAMOL+PSEUDOEPHEDRINE+CHLORPHENAMINE | غير مذكور | أقراص وكبسولات؛ B/12 قرصاً + 4 كبسولات | TERIAK | 9254111 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |
| RHUVEX RHUME ET FIEVRE | PARACETAMOL+PSEUDOEPHEDRINE+TRIPROLIDINE | غير مذكور | قرص؛ B/16 | TERIAK | 9254131 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |
| RHUVEX VITAMINE C | PARACETAMOL+PSEUDOEPHEDRINE+VITAMINE C | 50 mg/30 mg/250 mg | قرص ملبس؛ B/20 | TERIAK | 9254121 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |
| ROMPALGINE | PARACETAMOL+CAFEINE+CODEINE | 400 mg/50 mg/20 mg | قرص؛ B/16 | GALPHARMA | 9223461 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |
| ROMPALGINE | PARACETAMOL+CAFEINE+CODEINE | 400 mg/50 mg/20 mg | قرص؛ B/20 | GALPHARMA | 9223462 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |
| TRIFED PLUS | PARACETAMOL+PSEUDOEPHEDRINE+TRIPROLIDINE | غير مذكور | قرص مشقوق؛ B/20 | IBN AL BAYTAR | 9073181 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol المفرد الوريدي. |

| CO-ALGESIC | PARACETAMOL+CODEINE | 500 mg/30 mg | قرص مشقوق؛ B/16 | DAR-ESSAYDALI | 9213361 | تركيبة فموية مع codeine؛ لا تطابق بطاقة paracetamol الوريدي. |
| CO-ALGIDOL | PARACETAMOL+CODEINE | 500 mg/30 mg | قرص؛ B/16 | PHARMACARE | 9343211 | تركيبة فموية مع codeine؛ لا تطابق بطاقة paracetamol الوريدي. |
| KLIPAL CODEINE | PARACETAMOL+CODEINE | 600 mg/50 mg | قرص؛ B/12 | PIERRE FABRE MEDICAMENT PRODUCTION TUNISIE | 9323031 | تركيبة فموية مع codeine؛ لا تطابق paracetamol IV. |
| KLIPAL CODEINE | PARACETAMOL+CODEINE | 300 mg/25 mg | قرص؛ B/16 | PIERRE FABRE MEDICAMENT PRODUCTION TUNISIE | 9323032 | تركيبة فموية مع codeine؛ لا تطابق paracetamol IV. |
| LAMALINE | PARACETAMOL+BELLADONA+OPIUM | غير مذكور | تحميلة؛ B/10 | SIPHAT | 9003361 | تركيبة وشرجية؛ لا تطابق paracetamol الوريدي المفرد. |
| LATIFEX PLUS | PARACETAMOL+TRAMADOL | 37.5 mg/325 mg | قرص مغلف؛ B/20 | TAHA PHARMA | 9373411 | تركيبة فموية مع tramadol؛ لا تطابق paracetamol IV. |
| DAFALGAN | PARACETAMOL | 1 g | قرص ملبس؛ B/8 | IPS (Industrie Pharmaceutique Said) | 9133331 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| ADOL | PARACETAMOL | 1000 mg | قرص مشقوق؛ B/8 | SAIPH | 9163285 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| ADOL | PARACETAMOL | 100 mg/mL | قطرات فموية؛ قارورة/15 mL | JULPHAR | 7473083 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| ADOL | PARACETAMOL | 500 mg | قرص؛ B/15 | SAIPH | 9163283 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| ADOL | PARACETAMOL | 500 mg | قرص؛ B/150 | SAIPH | 9163284H | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| DOLIPRANE | PARACETAMOL | 300 mg | مسحوق لمحلول فموي؛ B/12 كيساً | WINTHROP PHARMA TUNISIE | 9103654 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| DOLIPRANE | PARACETAMOL | 500 mg | قرص فوّار؛ B/2 أنبوب × 8 | WINTHROP PHARMA TUNISIE | 9103655 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| DOLIPRANE | PARACETAMOL | 1000 mg | قرص؛ B/8 | WINTHROP PHARMA TUNISIE | 9103657 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| DOLIPRANE | PARACETAMOL | 500 mg | مسحوق لمحلول فموي؛ B/12 كيساً | WINTHROP PHARMA TUNISIE | 9103489 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| DOLIPRANE | PARACETAMOL | 500 mg | كبسولة؛ B/16 | WINTHROP PHARMA TUNISIE | 9103481 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| DOLIPRANE | PARACETAMOL | 500 mg | قرص؛ B/16 | WINTHROP PHARMA TUNISIE | 9103482 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| EFFADOL JEUNE ENFANT | PARACETAMOL | 150 mg | تحميلة؛ B/10 | OPALIA PHARMA | 9023562 | شكل شرجي؛ لا يطابق بطاقة paracetamol الوريدي. |
| EFFADOL NOURRISSONS | PARACETAMOL | 80 mg | تحميلة؛ B/10 | OPALIA PHARMA | 9023561 | شكل شرجي؛ لا يطابق بطاقة paracetamol الوريدي. |
| EFFADOL PEDIATRIQUE | PARACETAMOL | 3% | محلول فموي؛ قارورة/90 mL | OPALIA PHARMA | 9023941 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| EFFERALGAN | PARACETAMOL | 150 mg | تحميلة؛ B/10 | IPS (Industrie Pharmaceutique Said) | 9133062 | شكل شرجي؛ لا يطابق بطاقة paracetamol الوريدي. |
| EFFERALGAN | PARACETAMOL | 80 mg | تحميلة؛ B/10 | IPS (Industrie Pharmaceutique Said) | 9133061 | شكل شرجي؛ لا يطابق بطاقة paracetamol الوريدي. |
| EFFERALGAN | PARACETAMOL | 600 mg | تحميلة؛ B/10 | IPS (Industrie Pharmaceutique Said) | 9133064 | شكل شرجي؛ لا يطابق بطاقة paracetamol الوريدي. |
| EFFERALGAN | PARACETAMOL | 300 mg | تحميلة؛ B/10 | IPS (Industrie Pharmaceutique Said) | 9133063 | شكل شرجي؛ لا يطابق بطاقة paracetamol الوريدي. |
| EFFERALGAN | PARACETAMOL | 1000 mg | قرص فوّار؛ أنبوب/8 | BRISTOL MYERS SQUIBB | 6540025 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| EFFERALGAN 500 | PARACETAMOL | 500 mg | قرص فوّار؛ B/2 أنبوب × 8 | IPS (Industrie Pharmaceutique Said) | 9133021B | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| EFFERALGAN 500 | PARACETAMOL | 500 mg | قرص؛ B/16 | IPS (Industrie Pharmaceutique Said) | 9133065 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| EFFERALGAN PEDIATRIQUE | PARACETAMOL | 3% | محلول فموي؛ قارورة/90 mL | IPS (Industrie Pharmaceutique Said) | 9133023 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدي. |
| EFFERALGAN VITAMINE C | PARACETAMOL+VITAMINE C | 330 mg/200 mg | قرص فوّار؛ B/2 أنبوب × 10 | IPS (Industrie Pharmaceutique Said) | 9133024B | تركيبة فموية مع vitamine C؛ لا تطابق paracetamol المفرد الوريدي. |
| FERVEX ADULTE | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | مسحوق لمحلول فموي؛ B/8 أكياس | IPS (Industrie Pharmaceutique Said) | 9133181 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| FERVEX ADULTE SANS SUCRE | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | مسحوق لمحلول فموي؛ B/8 أكياس | IPS (Industrie Pharmaceutique Said) | 9133182 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| FERVEX ENFANT | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | مسحوق لمحلول فموي؛ B/8 أكياس/3 g | IPS (Industrie Pharmaceutique Said) | 9133183 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| FIBREX ADULTE | PARACETAMOL+PHENIRAMINE+VITAMINE C | 500 mg/25 mg/200 mg | مسحوق لمحلول فموي؛ B/8 أكياس | PHARMACARE | 9343232 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| FIBREX ADULTE | PARACETAMOL+PHENIRAMINE+VITAMINE C | 500 mg/25 mg/200 mg | مسحوق لمحلول فموي؛ B/12 كيساً | PHARMACARE | 9343234 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| FIBREX ENFANT | PARACETAMOL+PHENIRAMINE+VITAMINE C | 280 mg/10 mg/100 mg | حبيبات لمحلول فموي؛ B/8 أكياس | PHARMACARE | 9343231 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| FIBREX SANS SUCRE ADULTE | PARACETAMOL+PHENIRAMINE+VITAMINE C | 500 mg/25 mg/200 mg | حبيبات لمحلول فموي؛ B/8 أكياس | PHARMACARE | 9343233 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| FORTADOL | PARACETAMOL+TRAMADOL | 37.5 mg/325 mg | قرص ملبس؛ B/16 | TERIAK | 9253721 | تركيبة فموية مع tramadol؛ لا تطابق paracetamol المفرد الوريدي. |
| FORTALGIC | PARACETAMOL+CODEINE | 600 mg/50 mg | قرص ملبس مشقوق؛ B/12 | TERIAK | 9254052 | تركيبة فموية مع codeine؛ لا تطابق paracetamol المفرد الوريدي. |
| FORTALGIC | PARACETAMOL+CODEINE | 300 mg/25 mg | قرص ملبس؛ B/12 | TERIAK | 9254051 | تركيبة فموية مع codeine؛ لا تطابق paracetamol المفرد الوريدي. |
| FRESIDOL | PARACETAMOL | 3% | معلق فموي؛ قارورة/90 mL | PHARMADERM | 9053281 | شكل فموي للأطفال؛ لا يطابق بطاقة paracetamol الوريدية. |
| GOLDIX DUO | DEXTROMETHORPHANE+PHENYLEPHRINE+PARACETAMOL+DOXYLAMINE | غير مذكور | شراب؛ B/12 أكياس/15 mL | OPALIA PHARMA | 9024015 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| GOLDIX JOUR | DEXTROMETHORPHANE+PHENYLEPHRINE+PARACETAMOL | غير مذكور | شراب؛ قارورة/150 mL | OPALIA PHARMA | 9024011 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| GOLDIX JOUR | DEXTROMETHORPHANE+PHENYLEPHRINE+PARACETAMOL | غير مذكور | شراب؛ B/12 أكياس | OPALIA PHARMA | 9024013 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| GOLDIX NUIT | DEXTROMETHORPHANE+DOXYLAMINE+PARACETAMOL | غير مذكور | شراب؛ قارورة/90 mL | OPALIA PHARMA | 9024012 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| GOLDIX NUIT | DEXTROMETHORPHANE+DOXYLAMINE+PARACETAMOL | غير مذكور | شراب؛ B/12 أكياس | OPALIA PHARMA | 9024014 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| GRIPEX ADULTES | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | مسحوق لمحلول فموي؛ B/8 أكياس | GALPHARMA | 9223162 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| GRIPEX ADULTES | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | مسحوق لمحلول فموي؛ B/12 كيساً | GALPHARMA | 9223165 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| GRIPEX ENFANTS | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | مسحوق لمحلول فموي؛ B/8 أكياس | GALPHARMA | 9223161 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| GRIPEX ENFANTS | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | مسحوق لمحلول فموي؛ B/12 كيساً | GALPHARMA | 9223164 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| GRIPEX SANS SUCRE ADULTES | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | مسحوق لمحلول فموي؛ B/8 أكياس | GALPHARMA | 9223163 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| GRIPEX SANS SUCRE ADULTES | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | مسحوق لمحلول فموي؛ B/12 كيساً | GALPHARMA | 9223166 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |


| NOVADOL | PARACETAMOL | 500 mg | كبسولة؛ B/16 | ADWYA | 9043932 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| NOVADOL | PARACETAMOL | 1 g | مسحوق لمحلول فموي؛ B/8 أكياس | ADWYA | 9043937 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| NOVADOL | PARACETAMOL | 500 mg | قرص؛ B/12 | ADWYA | 9043936 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| NOVADOL | PARACETAMOL | 1000 mg | قرص؛ B/8 | ADWYA | 9043939 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| NOVADOL | PARACETAMOL | 500 mg | قرص؛ B/16 | ADWYA | 9043938 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| NOVADOL | PARACETAMOL | 500 mg | مسحوق لمحلول فموي؛ B/12 أكياس | ADWYA | 9043931 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| NOVADOL | PARACETAMOL | 300 mg | مسحوق لمحلول فموي؛ B/12 أكياس | ADWYA | 9043935 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| NOVADOL PÉDIATRIQUE | PARACETAMOL | 3% | معلق فموي؛ قارورة/100 mL | ADWYA | 90439310 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| NOVADOL EXTRA | PARACETAMOL+CAFEINE | 500 mg/65 mg | قرص؛ B/16 | ADWYA | 9044281 | تركيبة مع cafeine؛ لا تطابق paracetamol المفرد الوريدي. |
| NOVEX ADULTE | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | مسحوق لمعلق فموي؛ B/8 أكياس | ADWYA | 9044141 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |
| NOVEX ADULTE | PARACETAMOL+PHENIRAMINE+VITAMINE C | غير مذكور | مسحوق لمعلق فموي؛ B/12 أكياس | ADWYA | 9044142 | تركيبة فموية متعددة المكونات؛ لا تطابق paracetamol IV. |


| PARACETYL ADULTES | PARACETAMOL | 6.5% | معلق فموي؛ قارورة/125 mL | PHARMADERM | 9053291 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| PARACETYL PEDIATRIQUE | PARACETAMOL | 3% | محلول فموي؛ قارورة/90 mL | PHARMADERM | 9053122 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| PARALVIT | PARACETAMOL | 1000 mg | قرص فوّار؛ أنبوب/8 | IPS (Industrie Pharmaceutique Said) | 9133321 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| PARALVIT | PARACETAMOL | 1000 mg | قرص مغلف؛ B/8 | IPS (Industrie Pharmaceutique Said) | 9133322 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| PARALVIT | PARACETAMOL | 150 mg | تحميلة؛ B/10 | IPS (Industrie Pharmaceutique Said) | 9273072 | شكل شرجي؛ لا يطابق بطاقة paracetamol الوريدية. |
| PARALVIT | PARACETAMOL | 80 mg | تحميلة؛ B/10 | IPS (Industrie Pharmaceutique Said) | 9273071 | شكل شرجي؛ لا يطابق بطاقة paracetamol الوريدية. |
| PARALVIT | PARACETAMOL | 300 mg | تحميلة؛ B/10 | IPS (Industrie Pharmaceutique Said) | 9273073 | شكل شرجي؛ لا يطابق بطاقة paracetamol الوريدية. |
| PARALVIT | PARACETAMOL | 500 mg | قرص فوّار مشقوق؛ أنبوبان/8 | IPS (Industrie Pharmaceutique Said) | 9273052 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| PARALVIT | PARACETAMOL | 500 mg | قرص؛ B/16 | IPS (Industrie Pharmaceutique Said) | 9273053 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| PARALVIT ADULTES | PARACETAMOL | 600 mg | تحميلة؛ B/10 | IPS (Industrie Pharmaceutique Said) | 9273074 | شكل شرجي؛ لا يطابق بطاقة paracetamol الوريدية. |
| PARALVIT PEDIATRIQUE | PARACETAMOL | 3% | محلول فموي؛ قارورة/90 mL | IPS (Industrie Pharmaceutique Said) | 9273061 | شكل فموي؛ لا يطابق بطاقة paracetamol الوريدية. |
| PARALVIT VITAMINE C | PARACETAMOL+VITAMINE C | غير مذكور | قرص فوّار؛ أنبوبان/10 | IPS (Industrie Pharmaceutique Said) | 9273051 | تركيبة مع vitamine C؛ لا تطابق paracetamol المفرد الوريدي. |

## تركيبات amoxicillin/clavulanate لا تطابق بطاقة amoxicillin المفردة

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| VAAMOX | AMOXICILLINE+ACIDE CLAVULANIQUE | 2 g/200 mg | مسحوق لتحضير مستحضر للحقن؛ B/10 قوارير دون مذيب | UNIMED | 9093389 | تركيبة مع clavulanate؛ لا تطابق بطاقة amoxicillin المفردة. |
| VAAMOX ENFANT | AMOXICILLINE+ACIDE CLAVULANIQUE | 1 g/100 mg | مسحوق لتحضير مستحضر للحقن؛ B/1 قارورة | UNIMED | 9093387 | تركيبة مع clavulanate؛ لا تطابق بطاقة amoxicillin المفردة. |
| VAAMOX ENFANT | AMOXICILLINE+ACIDE CLAVULANIQUE | 1 g/100 mg | مسحوق لتحضير مستحضر للحقن؛ B/10 قوارير | UNIMED | 9093388 | تركيبة مع clavulanate؛ لا تطابق بطاقة amoxicillin المفردة. |
| VAAMOX IV ADULTE | AMOXICILLINE+ACIDE CLAVULANIQUE | 1 g/200 mg | مسحوق لتحضير مستحضر للحقن؛ B/10 قوارير | UNIMED | 9093386 | DCI مركبة مع clavulanate؛ لا تُنسب إلى بطاقة amoxicillin وحدها. |
| VAAMOX IV ADULTE | AMOXICILLINE+ACIDE CLAVULANIQUE | 1 g/200 mg | مسحوق لتحضير مستحضر للحقن؛ B/1 قارورة | UNIMED | 9093385 | DCI مركبة مع clavulanate؛ لا تُنسب إلى بطاقة amoxicillin وحدها. |
| VAAMOX IV ENFANT ET NOURRISSON | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/50 mg | مسحوق لتحضير مستحضر للحقن؛ B/1 قارورة | UNIMED | 9093381 | DCI مركبة مع clavulanate؛ لا تُنسب إلى بطاقة amoxicillin وحدها. |
| VAAMOX IV ENFANT ET NOURRISSON | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/50 mg | مسحوق لتحضير مستحضر للحقن؛ B/10 قوارير | UNIMED | 9093382 | DCI مركبة مع clavulanate؛ لا تُنسب إلى بطاقة amoxicillin وحدها. |
| AMOCLAN | AMOXICILLINE+ACIDE CLAVULANIQUE | 100 mg/12.5 mg/mL | مسحوق لمعلق فموي؛ قارورة/60 mL | MEDICEF | 9183152 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AMOCLAN | AMOXICILLINE+ACIDE CLAVULANIQUE | 100 mg/12.5 mg/mL | مسحوق لمعلق فموي؛ قارورة/30 mL | MEDICEF | 9183151 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AMOCLAN | AMOXICILLINE+ACIDE CLAVULANIQUE | 1 g/125 mg | مسحوق لتحضير معلق فموي؛ B/12 كيساً | MEDICEF | 9183154 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AMOCLAN | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | مسحوق لتحضير معلق فموي؛ B/12 كيساً | MEDICEF | 9183153 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AMOCLAN | AMOXICILLINE+ACIDE CLAVULANIQUE | 1 g/125 mg | مسحوق لتحضير معلق فموي؛ B/24 كيساً | MEDICEF | 9183157 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AMOCLAN | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | مسحوق لتحضير معلق فموي؛ B/24 | MEDICEF | 9183156 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AMOCLAN | AMOXICILLINE+ACIDE CLAVULANIQUE | 600 mg/42.9 mg | مسحوق لمعلق فموي؛ قارورة/100 mL | MEDICEF | 91831510 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AMOCLAN | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | قرص مغلف؛ B/16 | MEDICEF | 9183158 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| CIBLOR | AMOXICILLINE+ACIDE CLAVULANIQUE | 1000 mg/125 mg | مسحوق لمعلق فموي؛ B/12 أكياس جرعات | PIERRE FABRE MEDICAMENT PRODUCTION TUNISIE | ST9323193 | تركيبة بمادة ثانية (clavulanate)؛ لا تطابق amoxicillin المفرد. |
| CIBLOR | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | مسحوق لمعلق فموي؛ B/12 أكياس جرعات | PIERRE FABRE MEDICAMENT PRODUCTION TUNISIE | ST9323192 | تركيبة بمادة ثانية (clavulanate)؛ لا تطابق amoxicillin المفرد. |
| CIBLOR ENFANT | AMOXICILLINE+ACIDE CLAVULANIQUE | 100 mg/12.5 mg/mL | مسحوق لمعلق فموي؛ قارورة/60 mL + محقنة جرعات | PIERRE FABRE MEDICAMENT PRODUCTION TUNISIE | ST9323191 | تركيبة بمادة ثانية (clavulanate)؛ لا تطابق amoxicillin المفرد. |
| AMOCLAN | AMOXICILLINE+ACIDE CLAVULANIQUE | 1 g/200 mg | مسحوق لتحضير مستحضر للحقن؛ B/1 قارورة دون مذيب | HIKMA Pharmaceuticals | 6653389 | تركيبة وعيار/طريق مختلفان؛ لا تطابق amoxicillin المفرد. |
| AMOXI PLUS | AMOXICILLINE+ACIDE CLAVULANIQUE | 1.2 g | مسحوق لتحضير مستحضر للحقن؛ B/50 قارورة دون مذيب | ANTIBIOTICE S.A | 4223071 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AUGMENTIN | AMOXICILLINE+ACIDE CLAVULANIQUE | 1 g/125 mg | مسحوق لمعلق فموي؛ B/24 كيساً | ADWYA | 90435610 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AUGMENTIN | AMOXICILLINE+ACIDE CLAVULANIQUE | 100 mg/12.5 mg/mL | مسحوق لمعلق فموي؛ قارورة/60 mL + محقنة جرعات | ADWYA | 9043563 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AUGMENTIN 8/1 ADULTE | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | قرص مغلف؛ B/24 | ADWYA | 9043568 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AUGMENTIN 8/1 ADULTE | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | قرص مغلف؛ B/16 | ADWYA | 9043565 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AUGMENTIN ADULTE | AMOXICILLINE+ACIDE CLAVULANIQUE | 1 g/125 mg | مسحوق لمعلق فموي؛ B/12 كيساً | ADWYA | 9043564 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AUGMENTIN ENFANT | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | مسحوق لمعلق فموي؛ B/24 كيساً | ADWYA | 9043569 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AUGMENTIN ENFANT | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | مسحوق لمعلق فموي؛ B/12 كيساً | ADWYA | 9043566 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |
| AUGMENTIN NOURRISSONS | AMOXICILLINE+ACIDE CLAVULANIQUE | 100 mg/12.5 mg/mL | مسحوق لمعلق فموي؛ قارورة/30 mL + قطارة | ADWYA | 9043567 | تركيبة بمادة ثانية؛ لا تطابق amoxicillin المفرد. |

| CLAVUMOX | AMOXICILLINE+ACIDE CLAVULANIQUE | 1000 mg/125 mg | مسحوق لمعلق فموي؛ B/12 أكياس | GALPHARMA | 9223673 | تركيبة بمادة clavulanate؛ لا تطابق بطاقة amoxicilline المفردة. |
| CLAVUMOX ENFANT | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | مسحوق لمعلق فموي؛ B/24 أكياس جرعات | GALPHARMA | 9223675 | تركيبة بمادة clavulanate؛ لا تطابق بطاقة amoxicilline المفردة. |
| CLAVUMOX ENFANT | AMOXICILLINE+ACIDE CLAVULANIQUE | 100 mg/12.5 mg/mL | مسحوق لمعلق فموي؛ قارورة/60 mL | GALPHARMA | 9223672 | تركيبة بمادة clavulanate؛ لا تطابق بطاقة amoxicilline المفردة. |
| CLAVUMOX NOURRISSON | AMOXICILLINE+ACIDE CLAVULANIQUE | 100 mg/12.5 mg/mL | مسحوق لمعلق فموي؛ قارورة/30 mL | GALPHARMA | 9223671 | تركيبة بمادة clavulanate؛ لا تطابق بطاقة amoxicilline المفردة. |
| CLAVUMOX | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | قرص ملبس؛ B/24 | GALPHARMA | 9223674 | تركيبة بمادة clavulanate؛ لا تطابق بطاقة amoxicilline المفردة. |


| NOVACLAV | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | قرص مغلف؛ B/16 | ADWYA | 9043944 | تركيبة مع clavulanate؛ لا تطابق بطاقة amoxicillin المفردة. |
| NOVACLAV | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | قرص مغلف؛ B/24 | ADWYA | 9043943 | تركيبة مع clavulanate؛ لا تطابق بطاقة amoxicillin المفردة. |
| NOVACLAV ADULTE | AMOXICILLINE+ACIDE CLAVULANIQUE | 1 g/125 mg | مسحوق لمعلق فموي؛ B/12 أكياس | ADWYA | 9043942 | تركيبة مع clavulanate؛ لا تطابق بطاقة amoxicillin المفردة. |
| NOVACLAV ADULTE | AMOXICILLINE+ACIDE CLAVULANIQUE | 1 g/125 mg | مسحوق لمعلق فموي؛ B/21 أكياس | ADWYA | 9043947 | تركيبة مع clavulanate؛ لا تطابق بطاقة amoxicillin المفردة. |
| NOVACLAV ENFANT | AMOXICILLINE+ACIDE CLAVULANIQUE | 100 mg/12.5 mg/mL | مسحوق لمعلق فموي؛ قارورة/60 mL + محقنة جرعات | ADWYA | 9043941 | تركيبة مع clavulanate؛ لا تطابق بطاقة amoxicillin المفردة. |
| NOVACLAV ENFANTS | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | مسحوق لمعلق فموي؛ B/12 أكياس جرعات | ADWYA | 9043946 | تركيبة مع clavulanate؛ لا تطابق بطاقة amoxicillin المفردة. |
| NOVACLAV ENFANTS | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | مسحوق لمعلق فموي؛ B/21 أكياس جرعات | ADWYA | 9043948 | تركيبة مع clavulanate؛ لا تطابق بطاقة amoxicillin المفردة. |
| NOVACLAV NOURRISSONS | AMOXICILLINE+ACIDE CLAVULANIQUE | 100 mg/12.5 mg/mL | مسحوق لمعلق فموي؛ قارورة/30 mL + محقنة جرعات | ADWYA | 9043945 | تركيبة مع clavulanate؛ لا تطابق بطاقة amoxicillin المفردة. |

## VIGASPIR وCAFENOL تركيبتان لا تطابقان بطاقات المواد المفردة

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| VIGASPIR | PARACETAMOL+ACIDE ACETYLSALICYLIQUE+CODEINE | غير مذكور | قرص؛ B/20 | SIPHAT | 9000511 | تركيبة ثلاثية؛ لا تُربط ببطاقة aspirin أو paracetamol المفردة. |
| CAFENOL | ACIDE ACETYLSALICYLIQUE+CAFEINE | غير مذكور | قرص مشقوق؛ B/20 | TERIAK | 9253291 | تركيبة aspirin مع caféine؛ لا تطابق بطاقة aspirin المفردة. |

## خمس عروض من الإنسولين البشري لا تطابق بطاقة الإنسولين السريع الوريدية

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| GENSULIN R | INSULINE HUMAINE | 100 UI/mL | محلول للحقن؛ B/1 قارورة/10 mL | BIOTON S.A | 18623011 | سطر DPM لا يحدد IV صراحة؛ لا يُفترض الطريق للبطاقة الوريدية. أُزيل من `brands` واختُبر كاستبعاد بحث. |

| INSUGEN R | INSULINE HUMAINE | 100 UI/mL | محلول للحقن؛ B/1 قارورة/10 mL | LES LABORATOIRES MEDIS | 9234091 | صيغة الحقن في سجل DPM لا تحدد IV صراحة؛ أزيل من الربط واختُبر استبعاده بحثياً. |
| JUSLINE R | INSULINE HUMAINE | 100 UI/mL | محلول للحقن؛ B/1 قارورة/10 mL | JULPHAR | 7473192 | سجل DPM يذكر الاستعمال في الحالات الإسعافية لكنه لا يصرّح بالطريق IV؛ لا يُفترض الطريق. |
| JUSLINE N | INSULINE HUMAINE | 100 UI/mL | معلق للحقن؛ B/1 قارورة/10 mL | JULPHAR | 7473191 | معلق إنسولين، لا يطابق بطاقة الإنسولين البشري السريع الذائب. |
| JUSLINE 30/70 | INSULINE HUMAINE | 100 UI/mL | معلق للحقن؛ B/1 قارورة/10 mL | JULPHAR | 7473193 | معلق مخلوط، لا يطابق بطاقة الإنسولين البشري السريع الذائب. |

## نظائر الإنسولين القاعدي لا تطابق بطاقة الإنسولين البشري السريع

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| LANTUS | INSULINE ANALOGUE | 100 UI/mL | محلول للحقن؛ B/5 خراطيش/3 mL | SANOFI-AVENTIS Deutschland GmbH | 1823021 | DPM يصنفه إنسوليناً مماثلاً؛ لا يطابق بطاقة الإنسولين البشري السريع.
| LANTUS SOLOSTAR | INSULINE ANALOGUE | 100 UI/mL | محلول للحقن؛ B/5 أقلام معبأة مسبقاً/3 mL | SANOFI-AVENTIS Deutschland GmbH | 1823025 | نظير إنسولين في قلم؛ لا يطابق الإنسولين البشري السريع. |
| LEVEMIR FLEXPEN | INSULINE ANALOGUE | 100 UI/mL | محلول للحقن؛ B/5 أقلام/3 mL | NOVO NORDISK A/S Bagsvaerd | 5993071 | نظير إنسولين طويل المفعول في قلم؛ لا يطابق الإنسولين البشري السريع. |


| NOVOMIX 30 FLEXPEN | INSULINE ANALOGUE | 100 UI/mL | معلق للحقن؛ B/5 أقلام/3 mL | NOVO NORDISK A/S Bagsvaerd | 5993082 | خليط نظير إنسولين في معلق/قلم؛ لا يطابق الإنسولين البشري السريع. |
| NOVOMIX 50 FLEXPEN | INSULINE ANALOGUE | 100 UI/mL | معلق للحقن؛ B/5 أقلام/3 mL | NOVO NORDISK A/S Bagsvaerd | 5993083 | خليط نظير إنسولين في معلق/قلم؛ لا يطابق الإنسولين البشري السريع. |


| NOVORAPID FLEXPEN | INSULINE ANALOGUE | 100 UI/mL | محلول للحقن؛ B/5 أقلام/3 mL | NOVO NORDISK A/S Bagsvaerd | 5993081 | نظير إنسولين سريع في قلم مسبق التعبئة؛ لا يطابق الإنسولين البشري السريع. |
| RYZODEG FLEX TOUCH | INSULINE ASPARTE+INSULINE DEGLUDEC | 100 U/mL | محلول للحقن؛ B/5 أقلام معبأة مسبقاً/3 mL | NOVO NORDISK A/S Bagsvaerd | 5993141 | مزيج إنسولينين نظيرين؛ لا يطابق الإنسولين البشري السريع المفرد. |

## عروض hydrocortisone والهيبارين التي بقيت مستبعدة لعدم ثبوت IV/IM للعرض المحدد

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الإبقاء على الاستبعاد |
|---|---|---|---|---|---|---|
| HYDROCORTISONE LEURQUIN | HYDROCORTISONE | 100 mg | مسحوق لتحضير محلول للحقن؛ B/100 قارورة | LEURQUIN MEDIOLANUM | 5833042H | مصدر HAS يحدد منتجاً parentéral، لكن لم تُعثر على نشرة IV/IM مطابقة للعرض المحلي B/100؛ لا تُنقل الطريق من علامة أخرى. |
| HYDROCORTISONE MEDIS | HYDROCORTISONE | 500 mg | مسحوق لتحضير محلول للحقن؛ B/1 قارورة + مذيب/5 mL | LES LABORATOIRES MEDIS | 9233592H | نشرة p90 التي عُثر عليها تخص 100 mg فقط؛ لم تُعثر على نشرة 500 mg مطابقة، لذلك لا تُستنتج الطريق من عيار آخر. |
| HEPARINE UNIMED | HEPARINE SODIQUE | 25 000 UI/5 mL | محلول للحقن؛ B/10 قوارير/5 mL | UNIMED | 9094041H | السجل لا يحدد IV صراحة؛ لا يُربط بمضاد التخثر الوريدي اعتماداً على صيغة الحقن وحدها. |
| HEPARINE MEDIS | HEPARINE SODIQUE | 25 000 UI/5 mL | محلول للحقن؛ B/10 قوارير/5 mL | LES LABORATOIRES MEDIS | 9233181H | السجل لا يحدد IV صراحة؛ لا يُربط بمضاد التخثر الوريدي اعتماداً على صيغة الحقن وحدها. |

## عروض phenobarbital لا تثبت مطابقة لطريق البطاقة الوريدي

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| GARDENAL | PHENOBARBITAL | 40 mg | مسحوق لتحضير محلول للحقن؛ B/1 قارورة + مذيب/2 mL | SANOFI-AVENTIS FRANCE | 6390085 | السجل لا يحدد IV صراحة؛ لا يُفترض الطريق للبطاقة الوريدية. |
| GARDENAL | PHENOBARBITAL | 100 mg | قرص؛ B/20 | SANOFI-AVENTIS FRANCE | 6390081 | شكل فموي؛ لا يطابق بطاقة التحميل الوريدي. |
| GARDENAL | PHENOBARBITAL | 10 mg | قرص؛ B/80 | SANOFI-AVENTIS FRANCE | 6390082 | شكل فموي؛ لا يطابق بطاقة التحميل الوريدي. |
| PHENOBARBITAL 50 | PHENOBARBITAL | 50 mg | قرص مشقوق؛ B/30 | SIPHAT | 9000311 | شكل فموي؛ لا يطابق بطاقة التحميل الوريدي. |
| PHENOBARBITAL 50 | PHENOBARBITAL | 50 mg | قرص مشقوق؛ B/750 | SIPHAT | 9000313H | شكل فموي؛ لا يطابق بطاقة التحميل الوريدي. |

## PHENASPIRINE: تركيبة لا تطابق بطاقتي aspirin أو phenobarbital المفردتين

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| PHENASPIRINE 1 CG | ACIDE ACETYLSALICYLIQUE+PHENOBARBITAL | 1 CG | تحميلة؛ B/10 | SIPHAT | 9000301 | تركيبة من مادتين وشكل شرجي؛ ليست مستحضراً مفرداً لأي من البطاقتين. |
| PHENASPIRINE 1 CG | ACIDE ACETYLSALICYLIQUE+PHENOBARBITAL | 1 CG | تحميلة؛ B/100 | SIPHAT | 9000302H | تركيبة من مادتين وشكل شرجي؛ ليست مستحضراً مفرداً لأي من البطاقتين. |
| PHENASPIRINE 2 CG | ACIDE ACETYLSALICYLIQUE+PHENOBARBITAL | 2 CG | تحميلة؛ B/10 | SIPHAT | 9000302 | تركيبة من مادتين وشكل شرجي؛ ليست مستحضراً مفرداً لأي من البطاقتين. |
| PHENASPIRINE 2 CG | ACIDE ACETYLSALICYLIQUE+PHENOBARBITAL | 2 CG | تحميلة؛ B/100 | SIPHAT | 9000303H | تركيبة من مادتين وشكل شرجي؛ ليست مستحضراً مفرداً لأي من البطاقتين. |

## أشكال ketoprofen غير المطابقة لطرق الجرع المسجلة في البطاقة

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| AXEN | KETOPROFENE | 100 mg | مسحوق لتحضير مستحضر للحقن؛ B/5 قوارير + 5 مذيبات/2.5 mL | LES LABORATOIRES MEDIS | 9233311 | DPM لا يحدد طريق الحقن؛ لذلك لم يُترك كعلامة لبطاقة جرعة ذات طريق معين. |
| AXEN | KETOPROFENE | 100 mg | تحميلة؛ B/10 | OPALIA PHARMA | 9023742 | شكل شرجي؛ لا يطابق عرض الحقن أو الطريق المدرج في البطاقة. |
| AXEN | KETOPROFENE | 2.5% | جل جلدي؛ أنبوب/50 g | OPALIA PHARMA | 9023741 | شكل موضعي جلدي؛ لا يطابق عرض الحقن أو الطريق المدرج في البطاقة. |
| RHUTAGEL | KETOPROFENE | 2.5% | جل جلدي؛ أنبوب/50 g | WEST PHARMA | 9293041 | شكل جلدي موضعي؛ لا يثبت مستحضر الحقن/الطريق والجرعة المذكورين في البطاقة. |
| KETOPROGEL | KETOPROFENE | 2.5% | جل جلدي؛ أنبوب/50 g | PHARMADERM | 9053241 | مستحضر موضعي؛ لا يطابق الطرق الجهازية في بطاقة ketoprofene. |
| KETUM | KETOPROFENE | 2.5% | جل جلدي؛ أنبوب/50 g | PHARMAGHREB | 9013251 | مستحضر موضعي؛ لا يطابق الطرق الجهازية في بطاقة ketoprofene. |
| RHUTASUPPO | KETOPROFENE | 100 mg | تحميلة؛ B/10 | WEST PHARMA | 9293042 | شكل شرجي؛ لا يثبت مستحضر الحقن/الطريق والجرعة المذكورين في البطاقة. |

## تركيبات spiramycin+metronidazole غير مطابقة لـmetronidazole المفرد

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| RODOGYL | SPIRAMYCINE+METRONIDAZOLE | 750 mU/125 mg | قرص ملبس؛ B/20 | WINTHROP PHARMA TUNISIE | 9103431 | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| SPIROGYL | SPIRAMYCINE+METRONIDAZOLE | 750 mU/125 mg | قرص ملبس؛ B/500 | SIPHAT | 9003802H | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| SPIROGYL | SPIRAMYCINE+METRONIDAZOLE | 750 mU/125 mg | قرص ملبس؛ B/20 | SIPHAT | 9003801 | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| SPIRAMIZOLE | SPIRAMYCINE+METRONIDAZOLE | 1.5 MUI/250 mg | قرص ملبس مشقوق؛ B/10 | GALPHARMA | 9223631 | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| SPIRAMIZOLE | SPIRAMYCINE+METRONIDAZOLE | 1.5 MUI/250 mg | قرص ملبس مشقوق؛ B/20 | GALPHARMA | 9223632 | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| SPIRAZOL | SPIRAMYCINE+METRONIDAZOLE | 0.75 MUI/125 mg | قرص ملبس؛ B/20 | ADWYA | 9043961 | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| BI-SPIRAZOL | SPIRAMYCINE+METRONIDAZOLE | 1.5 MUI/250 mg | قرص ملبس؛ B/10 | ADWYA | 9043791 | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| BI-SPIRAZOL | SPIRAMYCINE+METRONIDAZOLE | 1.5 MUI/250 mg | قرص ملبس؛ B/20 | ADWYA | 9043792 | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| BI-SPIROGYL | SPIRAMYCINE+METRONIDAZOLE | 1.5 MUI/250 mg | قرص ملبس؛ B/500 | SIPHAT | 9003813H | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| BI-SPIROGYL | SPIRAMYCINE+METRONIDAZOLE | 1.5 MUI/250 mg | قرص ملبس؛ B/20 | SIPHAT | 9003812 | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| BI-SPIROGYL | SPIRAMYCINE+METRONIDAZOLE | 1.5 MUI/250 mg | قرص ملبس؛ B/10 | SIPHAT | 9003811 | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| BIOGYL | SPIRAMYCINE+METRONIDAZOLE | 1.5 MUI/250 mg | قرص ملبس مشقوق؛ B/10 | SAIPH | 9163591 | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| BIOGYL | SPIRAMYCINE+METRONIDAZOLE | 1.5 MUI/250 mg | قرص ملبس مشقوق؛ B/20 | SAIPH | 9163592 | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| OGYL | SPIRAMYCINE+METRONIDAZOLE | 750 mU/125 mg | قرص مغلف؛ B/20 | SAIPH | 9163521 | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |
| BIRODOGYL | SPIRAMYCINE+METRONIDAZOLE | 1.5 MUI/250 mg | قرص ملبس؛ B/10 | WINTHROP PHARMA TUNISIE | 9103432 | تركيبة مضادين حيويين؛ لا تطابق بطاقة metronidazole المفرد. |

## عروض KCl بملح/تركيز أو طريق مختلف لا تطابق بطاقة KCl الوريدية 10%

| الاسم في DPM | DCI كما في السجل | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| CHLORURE DE POTASSIUM UNIMED | CHLORURE DE POTASSIUM | 7.46% | محلول للحقن؛ B/10 أمبولات/10 mL | UNIMED | 9093081A | التركيز غير مطابق لعرض البطاقة 10%؛ لا يُستنتج تكافؤ الحجم أو الجرعة. |
| CHLORURE DE POTASSIUM UNIMED | CHLORURE DE POTASSIUM | 7.46% | محلول للحقن؛ B/100 أمبولة/10 mL | UNIMED | 9093081BH | التركيز غير مطابق لعرض البطاقة 10%؛ لا يُستنتج تكافؤ الحجم أو الجرعة. |
| CHLORURE DE POTASSIUM | POTASSIUM CHLORURE | 500 mg | قرص؛ B/400 | SIPHAT | 9003751H | شكل فموي؛ لا يطابق بطاقة محلول KCl الوريدي. |

## مستحضرات NaCl بتركيز 0.9% أو 10% غير مطابقة لبطاقة NaCl مفرط التوتر 3%

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط ببطاقة NaCl 3% |
|---|---|---|---|---|---|---|
| PHYSIOL | CHLORURE DE SODIUM | 0.9% | محلول عيني/أنفي/أذني معقم وقابل للحقن؛ B/15 قارورة/10 mL | UNIMED | 9093011 | تركيز 0.9% وشكل/استعمال مختلفان؛ لا يثبت مستحضر NaCl 3%. |
| PHYSIOL | CHLORURE DE SODIUM | 0.9% | محلول عيني/أنفي/أذني معقم وقابل للحقن؛ B/100 أمبولة/10 mL | UNIMED | 9093011AH | تركيز 0.9% وشكل/استعمال مختلفان؛ لا يثبت مستحضر NaCl 3%. |
| CHLORURE DE SODIUM UNIMED | CHLORURE DE SODIUM | 10% | محلول للحقن؛ B/10 أمبولات/10 mL | UNIMED | 9093091A | تركيز 10%؛ لا يطابق العبوات 3% المدرجة ولا أستنتج تحضيراً/تخفيفاً لهذا المنتج. |
| CHLORURE DE SODIUM UNIMED | CHLORURE DE SODIUM | 10% | محلول للحقن؛ B/100 أمبولة/10 mL | UNIMED | 9093091BH | تركيز 10%؛ لا يطابق العبوات 3% المدرجة ولا أستنتج تحضيراً/تخفيفاً لهذا المنتج. |
| PHYSIOL | CHLORURE DE SODIUM | 0.9% | محلول عيني/أنفي/أذني معقم وقابل للحقن؛ B/10 أمبولات/5 mL | UNIMED | 9093031 | تركيز 0.9% وشكل/استعمال مختلفان؛ لا يثبت مستحضر NaCl 3%. |
| PHYSIOL | CHLORURE DE SODIUM | 0.9% | محلول عيني/أنفي/أذني معقم وقابل للحقن؛ B/100 أمبولة/5 mL | UNIMED | 9093032H | تركيز 0.9% وشكل/استعمال مختلفان؛ لا يثبت مستحضر NaCl 3%. |
| SET DE TRANSFERT CHLORURE DE SODIUM 9%° | CHLORURE DE SODIUM | 0.9% (النص المعروض «9%°») | كيس/100 mL مع طقم نقل | UNIMED | 9093681 | محلول ملحي عادي 0.9% بحسب الوصف؛ لا يطابق محلول NaCl مفرط التوتر 3%. |
| SOLUTE ISOTONIQUE DE NACL | CHLORURE DE SODIUM | 0.9% | محلول للتسريب؛ قارورة/500 mL | BIEFFE MEDITAL s.p.a italia | 7323081 | محلول متساوي التوتر 0.9%؛ لا يطابق NaCl مفرط التوتر 3%. |
| CHLORURE DE SODIUM A 10% | CHLORURE DE SODIUM | 10% | محلول للحقن بالتسريب؛ قارورة/500 mL | SIPHAT | 9003641 | تركيز 10%؛ لا يطابق مستحضر NaCl 3%، ولا يُستنتج تخفيف هذا المنتج. |

تُظهر المقاطع 62–67 سجلات إضافية كثيرة لـNaCl 0.9% (ومنها عروض SIPHAT وINFOMED وUNIMED) لم تُحصَ كلها صفاً صفاً في هذا الجدول؛ أُضيف حاجز بحث للتركيز 0.9%، ولا يعني هذا الجدول الحصري اكتمال حصر جميع العبوات المسجلة.

## أشكال metronidazole المهبلية أو المركبة غير مطابقة لبطاقة المستحضر المفرد

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| VAGILEN | METRONIDAZOLE | 500 mg | بويضة مهبلية؛ B/10 | OPALIA PHARMA | 9023241 | طريق مهبلي واستطباب موضعي؛ ليس مستحضراً جهازياً مفرداً. |
| VAGILEN | METRONIDAZOLE | 500 mg | بويضة مهبلية؛ B/50 | OPALIA PHARMA | 9023242H | طريق مهبلي واستطباب موضعي؛ ليس مستحضراً جهازياً مفرداً. |
| TERGYNAN | METRONIDAZOLE+NEOMYCINE+NYSTATINE | غير مذكور | قرص مهبلي؛ B/10 | BOUCHARA-RECORDATI | 5220102 | تركيبة مهبلية موضعية متعددة المكونات؛ لا تطابق metronidazole المفرد. |
| TRIPYLORI | BISMUTH+METRONIDAZOLE+TETRACYCLINE | 125 mg metronidazole (ضمن التركيبة) | كبسولة؛ قارورة/120 | SAIPH | 9164271 | تركيبة استئصال جرثومة المعدة متعددة المواد؛ لا تطابق مستحضر metronidazole المفرد. |
| PROTOGYL | METRONIDAZOLE | 500 mg | بويضة؛ B/10 | SIMED | 9083361 | شكل مهبلي موضعي؛ لا يطابق المستحضر الجهازي. |
| PYLERA | BISMUTH+METRONIDAZOLE+TETRACYCLINE | 140 mg/125 mg/125 mg (125 mg metronidazole ضمن التركيبة) | كبسولة؛ قارورة/120 | Allergan Sales LLC | 15373011 | تركيبة فموية متعددة المواد؛ لا تطابق metronidazole المفرد. |

## مستحضرات pipéracilline/tazobactam ذات الشكل/الطريق غير المحسوم

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط حالياً |
|---|---|---|---|---|---|---|
| PIPERACILLINE/TAZOBACTAM | PIPERACILLINE+TAZOBACTAM | 4 g/500 mg | مسحوق لتحضير معلق للحقن؛ B/1 قارورة | STRAGEN UK Limited | 15303012H | السجل لا يحدد perfusion/IV صراحةً ويذكر معلقاً للحقن، بخلاف بطاقة التسريب الوريدي؛ لا يُربط حتى يثبت الطريق والشكل المطابقان. |
| PRIZMA | PIPERACILLINE+TAZOBACTAM | 4 g/500 mg | مسحوق لتحضير مستحضر للحقن؛ B/1 قارورة | HIKMA Pharmaceuticals | 6653521H | الشكل المسجل للحقن لا يحدد perfusion/IV صراحةً؛ لا يُربط ببطاقة التسريب الوريدي قبل ثبوت الطريق. |
| PRIZMA | PIPERACILLINE+TAZOBACTAM | 2 g/250 mg | مسحوق لتحضير مستحضر للحقن؛ B/1 قارورة | HIKMA Pharmaceuticals | 6653522H | الشكل المسجل للحقن لا يحدد perfusion/IV صراحةً؛ لا يُربط ببطاقة التسريب الوريدي قبل ثبوت الطريق. |
| TAZOREX | PIPERACILLINE+TAZOBACTAM | 4 g/500 mg | مسحوق لتحضير مستحضر للحقن؛ B/1 قارورة، دون مذيب مذكور | DEMO SA | 6855091H | سجل الحقن لا يذكر perfusion أو IV صراحةً؛ لم أربطه ببطاقة التسريب الوريدي. |
| TAZOBACT | PIPERACILLINE+TAZOBACTAM | 2 g/250 mg | مسحوق لتحضير مستحضر للحقن؛ B/1 قارورة/20 mL | UNIMED | 9093933H | سجل الحقن لا يذكر perfusion أو IV صراحةً؛ لم أربطه ببطاقة التسريب الوريدي. |
| TAZOBACT | PIPERACILLINE+TAZOBACTAM | 4 g/500 mg | مسحوق لتحضير مستحضر للحقن؛ B/1 قارورة/20 mL | UNIMED | 9093934H | سجل الحقن لا يذكر perfusion أو IV صراحةً؛ لم أربطه ببطاقة التسريب الوريدي. |
| TAZOBACT SET DE TRANSFERT | PIPERACILLINE+TAZOBACTAM | 2 g/250 mg | مسحوق لتحضير مستحضر للحقن؛ قارورة + كيس NaCl 100 mL + طقم نقل | UNIMED | 9093931H | رغم وجود كيس NaCl وطقم نقل، لا يصرح اسم/شكل DPM بطريق IV/perfusion؛ لم أفترض الطريق. |
| TAZOBACT SET DE TRANSFERT | PIPERACILLINE+TAZOBACTAM | 4 g/500 mg | مسحوق لتحضير مستحضر للحقن؛ قارورة + كيس NaCl 100 mL + طقم نقل | UNIMED | 9093932H | رغم وجود كيس NaCl وطقم نقل، لا يصرح اسم/شكل DPM بطريق IV/perfusion؛ لم أفترض الطريق. |
| TAZOCILLINE | PIPERACILLINE+TAZOBACTAM | 4 g/500 mg | مسحوق لتحضير مستحضر للحقن؛ B/1 قارورة، دون مذيب مذكور | PFIZER HOLDING FRANCE | 5803082H | سجل الحقن لا يذكر perfusion أو IV صراحةً؛ لم أربطه ببطاقة التسريب الوريدي. |
| TAZOCILLINE | PIPERACILLINE+TAZOBACTAM | 2 g/250 mg | مسحوق لتحضير مستحضر للحقن؛ B/1 قارورة، دون مذيب مذكور | PFIZER HOLDING FRANCE | 5803081H | سجل الحقن لا يذكر perfusion أو IV صراحةً؛ لم أربطه ببطاقة التسريب الوريدي.

## TALIN LP الفموي لا يطابق بطاقة terbutaline الحقنية تحت الجلد

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| TALIN LP | TERBUTALINE | 5 mg | قرص ممتد التحرر؛ B/30 | SAIPH | 9163263 | شكل فموي ممتد التحرر؛ لا يطابق حقن terbutaline تحت الجلد أو جرعته. |
| TERBUTALINE SIMED | TERBUTALINE | 1.5 mg/5 mL | شراب؛ قارورة/300 mL | SIMED | 9083261 | شكل فموي وليس مستحضر الحقن تحت الجلد؛ لا يطابق جرعة البريكانيال/TALIN SC. |

## مستحضرات terbutaline للاستنشاق لا تطابق بطاقة الحقن تحت الجلد

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| BETANYL | TERBUTALINE | 5 mg/2 mL | محلول للاستنشاق؛ كيس B/5، في كل كيس 10 وحدات أحادية الجرعة | UNIMED | 9093731H | طريق استنشاقي وشكل غير حقني؛ لا يطابق بطاقة terbutaline تحت الجلد. |
| BETANYL | TERBUTALINE | 5 mg/2 mL | محلول للاستنشاق؛ كيس B/1 يحوي 10 وحدات أحادية الجرعة | UNIMED | 9093732 | طريق استنشاقي وشكل غير حقني؛ لا يطابق بطاقة terbutaline تحت الجلد. |
| BRICANYL TURBUHALER | TERBUTALINE | 0.5 mg | مسحوق للاستنشاق الفموي؛ FL/200 جرعة | ASTRA ZENECA | 5100016 | شكل استنشاقي؛ لا يطابق بطاقة terbutaline الحقنية تحت الجلد. |

## SPASMAG IV: لم تُحسم مطابقة الملح لبطاقة magnesium sulfate

| الاسم في DPM | DCI كما في السجل | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط حالياً |
|---|---|---|---|---|---|---|
| SPASMAG IV | MAGNESIUM | 1.2 g | محلول للحقن؛ B/5 أمبولات/10 mL | GRIMBERG | 1073051H | السجل المنقول لا يصرح بملح sulfate؛ لم أربطه ببطاقة magnesium sulfate دون تطابق صريح للمادة الفعالة. |

## تركيبات وطرق غير مطابقة لبطاقة ipratropium بالنيبولايزر

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| BRONCHODUAL | FENOTEROL+IPRATROPIUM | 50 µg/20 µg | محلول للاستنشاق في بخاخ مضغوط؛ FL/200 جرعة | BOEHRINGER INGELHEIM FRANCE | 5213151 | تركيبة دوائية وبخاخ مضغوط، لا مستحضر ipratropium مفرداً للنيبولايزر. |

## عروض salbutamol غير الاستنشاقية غير مطابقة لبطاقة salbutamol الاستنشاقية

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| SALBUMOL | SALBUTAMOL | 0.5 mg/1 mL | محلول للحقن؛ B/6 أمبولات/1 mL | GlaxoSmithKline France | 5610052 | سجل DPM لاستعمال حقني في إيقاف المخاض المبكر؛ لا يطابق بخاخ/محلول الاستنشاق ولا تُنقل الجرعات أو الاستطبابات بين الطرق. |
| SALBUTAMOL SIMED | SALBUTAMOL | 2 mg/5 mL | شراب؛ قارورة/150 mL | SIMED | 9083292 | شكل فموي وليس بخاخاً/محلولاً للاستنشاق؛ لا يطابق جرعة الإنقاذ الاستنشاقية. |
| ALBUTOL | SALBUTAMOL | 2 mg | قرص؛ B/30 | SAIPH | 9163241 | شكل فموي، لا يطابق بطاقة السالبوتامول الاستنشاقي. |
| ALBUTOL | SALBUTAMOL | 2 mg | قرص؛ B/120 | SAIPH | 9163242H | شكل فموي، لا يطابق بطاقة السالبوتامول الاستنشاقي. |
| ALBUTOL | SALBUTAMOL | 2 mg/5 mL | شراب؛ قارورة/100 mL | SIMED | 9083291 | شكل فموي، لا يطابق بطاقة السالبوتامول الاستنشاقي. |
| BUTALIN | SALBUTAMOL | 2 mg | قرص؛ B/20 | JULPHAR | 7473071 | شكل فموي، لا يطابق بطاقة salbutamol الاستنشاقية. |
| BUTALIN (SANS SUCRE) | SALBUTAMOL | 2 mg/5 mL | شراب؛ قارورة/120 mL | JULPHAR | 7473074 | شكل فموي، لا يطابق بطاقة salbutamol الاستنشاقية. |

## مستحضرا ACTRAPID لا يثبتان طريق IV المطابق لبطاقة الإنسولين السريع

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| ACTRAPID | INSULINE HUMAINE | 100 UI/mL | محلول للحقن؛ قارورة/10 mL | NOVO NORDISK A/S Bagsvaerd | 5993016 | قائمة AMM الحالية تذكر الشكل والاستطباب السكري ولا تنص على IV؛ لا تكفي عبارة «solution injectable» لربطه ببطاقة IV. أُزيل من `brands` ومرادفات البحث وأضيف حاجز بحث للاسم. |
| ACTRAPID PENFILL | INSULINE HUMAINE | 100 UI/mL | معلق للحقن؛ 5 خراطيش/3 mL | NOVO NORDISK A/S Bagsvaerd | 5993024 | سجل DPM يذكر «suspension injectable»، فلا يطابق الإنسولين السريع الذائب. أُبقي مستبعداً كما سبق. |

يظل البحث بالمادة العامة `insuline` متاحاً؛ ولا يعني تعليق الاسم أن ACTRAPID غير مسجل، بل أن الطريق IV غير مثبت في سطر DPM الذي روجع.

## AURICULARUM مركب أذني لا يطابق بطاقة dexamethasone للحقن

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| AURICULARUM | DEXAMETHASONE+NYSTATINE+POLYMYXINE B+OXYTETRACYCLINE | غير مذكور | مسحوق أذني + مذيب/10 mL | GRIMBERG | 10173012 | تركيبة متعددة المكونات للأذن؛ لا تُربط ببطاقة dexamethasone للحقن. |

## ARTICAINE MEDIS ADRÉNALINÉE ليست أدريناليناً وريدياً

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| ARTICAINE MEDIS ADRÉNALINÉE | ARTICAINE+ADRENALINE | 1/100 000 | محلول للحقن السني؛ B/50 خرطوشة/1.8 mL | LES LABORATOIRES MEDIS | 9233961 | مزيج مخدر موضعي مع أدرينالين لطريق سني؛ لا يطابق محلول الأدرينالين الوريدي ولا جرعته. |
| PRIMACAINE ADRÉNALINE | ARTICAINE+ADRENALINE | 1/100 000 | محلول للحقن؛ B/50 خرطوشة | PIERRE ROLLAND | 8163061 | مخدر موضعي/ناحي لطب الأسنان مع أدرينالين؛ لا يطابق محلول الأدرينالين الوريدي. |
| PRIMACAINE ADRÉNALINE | ARTICAINE+ADRENALINE | 1/200 000 | محلول للحقن؛ B/50 خرطوشة | PIERRE ROLLAND | 8163062 | مخدر موضعي/ناحي لطب الأسنان مع أدرينالين؛ لا يطابق محلول الأدرينالين الوريدي. |

## APIDRA SOLOSTAR: إنسولين مماثل لا يطابق بطاقة الإنسولين البشري السريع

| الاسم في DPM | التصنيف/المادة كما وردت | العيار | الشكل والعبوة | صاحب AMM | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| APIDRA SOLOSTAR | INSULINE ANALOGUE | 100 UI/mL | محلول للحقن؛ 5 أقلام معبأة مسبقاً/3 mL | SANOFI-AVENTIS Deutschland GmbH | 1823024 | السجل يصفه كإنسولين مماثل، لا كإنسولين بشري؛ لا يُربط ببطاقة الإنسولين البشري السريع أو بجرعتها اعتماداً على تشابه الفئة. |

## قطرات ciprofloxacine العينية لا تطابق البطاقة الجهازية

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| CILOXAN | CIPROFLOXACINE | 0.3% | قطرة عينية؛ قارورة/5 mL | ALCON FRANCE | 6643142 | طريق عيني موضعي؛ لا يطابق بطاقة ciprofloxacine الجهازية. |
| CIPRO | CIPROFLOXACINE | 0.3% | قطرة عينية؛ قارورة/5 mL | LES LABORATOIRES MEDIS | 9233292 | مستحضر عيني موضعي رغم تشارك الاسم CIPRO؛ لا يطابق الأشكال الجهازية. |

## UNIGENTA collyre لا يطابق gentamicin الحقني

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| UNIGENTA | GENTAMICINE | 0.3% | قطرة عين؛ قارورة/5 mL | UNIMED | 9093141 | شكل عيني موضعي؛ لا يطابق gentamicin الحقني ولا جرعته الجهازية. |

## مراجعة المقاطع 136–140

- لم يظهر فيها اسم جديد يحقق تطابقاً مؤكداً مع بطاقة حالية من حيث المادة والتركيز والشكل والطريق.
- سجلا FLUCAND PERFUSION وFLUKAS للـfluconazole الوريدي لا يقابلان بطاقة fluconazole ضمن البطاقات الحالية؛ لم تُنشأ بطاقة جديدة في تدقيق العلامات.
- سُجل FLEXEN وFORTADOL/FORTALGIC ضمن الاستبعادات أدناه، للأسباب المبينة في صفوفها.

## عروض الغلوكوز 5% و10% والمحاليل المركبة لا تطابق بطاقة glucose 30%

أضيفت حواجز بحث للتراكيز المختلفة وللمحاليل متعددة المكونات، حتى لا تظهر كأنها بدائل لبطاقة glucose 30%. استُبعدت 23 عرضاً مفرداً من glucose بتركيزي 5% أو 10%، و5 محاليل إلكتروليتية مركبة:

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| GLUCOSE 5% | GLUCOSE | 5% | محلول للتسريب؛ قارورة/250 mL | SIPHAT | 9003662 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE 5% | GLUCOSE | 5% | محلول للتسريب؛ كيس/250 mL | INFOMED Pharma | 9193102 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE 5% | GLUCOSE | 5% | محلول للتسريب؛ كيس/1000 mL | INFOMED Pharma | 9193104 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE 10% INFOMED | GLUCOSE | 10% | محلول للتسريب؛ كيس/1000 mL | INFOMED Pharma | 9193107H | تركيز 10% لا يطابق بطاقة glucose 30%. |
| GLUCOSE 5% | GLUCOSE | 5% | محلول للتسريب؛ كيس/500 mL | SIPHAT | 9003221 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE 5% UNIMED | GLUCOSE | 5% | محلول للتسريب؛ قارورة/500 mL | UNIMED | 9093603H | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE 5% UNIMED | GLUCOSE | 5% | محلول للتسريب؛ كيس متعدد الطبقات/500 mL | UNIMED | 9093602 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE 5% UNIMED | GLUCOSE | 5% | محلول للتسريب؛ كيس متعدد الطبقات/1000 mL | UNIMED | 9093604H | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE 5% UNIMED | GLUCOSE | 5% | محلول للتسريب؛ كيس متعدد الطبقات/250 mL | UNIMED | 9093606 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE 5% UNIMED | GLUCOSE | 5% | محلول للتسريب؛ كيس/500 mL | UNIMED | 9093601 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE A 10% | GLUCOSE | 10% | محلول للتسريب؛ كيس/500 mL | INFOMED Pharma | 9193105 | تركيز 10% لا يطابق بطاقة glucose 30%. |
| GLUCOSE A 10% | GLUCOSE | 10% | محلول للتسريب؛ قارورة/500 mL | SIPHAT | 9003621 | تركيز 10% لا يطابق بطاقة glucose 30%. |
| GLUCOSE A 10% | GLUCOSE | 10% | محلول للتسريب؛ كيس/500 mL | INFOMED Pharma | 9193025 | تركيز 10% لا يطابق بطاقة glucose 30%. |
| GLUCOSE A 10% | GLUCOSE | 10% | محلول للتسريب؛ كيس/1000 mL | INFOMED Pharma | 9193026 | تركيز 10% لا يطابق بطاقة glucose 30%. |
| GLUCOSE A 5% | GLUCOSE | 5% | محلول للتسريب؛ كيس/500 mL | INFOMED Pharma | 9193021 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE A 5% | GLUCOSE | 5% | محلول للتسريب؛ كيس/250 mL | INFOMED Pharma | 9193024 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE A 5% | GLUCOSE | 5% | محلول للتسريب؛ كيس/1000 mL | INFOMED Pharma | 9193022 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE A 5% | GLUCOSE | 5% | محلول للتسريب؛ كيس/100 mL | INFOMED Pharma | 9193023 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE A 5% UNIMED | GLUCOSE | 5% | محلول للتسريب؛ قارورة/500 mL | UNIMED | 9093571 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE A 5% | GLUCOSE | 5% | محلول للتسريب؛ كيس/500 mL | INFOMED Pharma | 9193103 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE A 5% | GLUCOSE | 5% | محلول للتسريب؛ كيس/100 mL | INFOMED Pharma | 9193101 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE ISOTONIQUE | GLUCOSE | 5% | محلول للتسريب؛ قارورة/500 mL | SIPHAT | 9003661 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSE UNIMED | GLUCOSE | 5% | محلول للتسريب؛ كيس متعدد الطبقات/250 mL مع تغليف | UNIMED | 9093605 | تركيز 5% لا يطابق بطاقة glucose 30%. |
| GLUCOSALINE INFO | GLUCOSE MONOHYDRATE+CHLORURE DE SODIUM | 5%/0.45% | محلول للتسريب؛ كيس/500 mL | INFOMED Pharma | 9193182H | تركيبة وNaCl 0.45%؛ لا تطابق glucose 30% ولا NaCl 3%. |
| GLUCOSALINE INFO | GLUCOSE MONOHYDRATE+CHLORURE DE SODIUM | 5%/0.45% | محلول للتسريب؛ كيس/250 mL | INFOMED Pharma | 9193181H | تركيبة وNaCl 0.45%؛ لا تطابق glucose 30% ولا NaCl 3%. |
| GLUCOSALINE INFO | GLUCOSE MONOHYDRATE+CHLORURE DE SODIUM | 5%/0.18% | محلول للتسريب؛ كيس/250 mL | INFOMED Pharma | 9193183H | تركيبة وNaCl 0.18%؛ لا تطابق glucose 30% ولا NaCl 3%. |
| GLUCOSALINE INFO | GLUCOSE MONOHYDRATE+CHLORURE DE SODIUM | 5%/0.18% | محلول للتسريب؛ كيس/500 mL | INFOMED Pharma | 9193184H | تركيبة وNaCl 0.18%؛ لا تطابق glucose 30% ولا NaCl 3%. |
| GLUKANION 5 | ELECTROLYTES | غير مذكور | محلول للتسريب؛ قارورة/500 mL | SIPHAT | 9003991H | خليط إلكتروليتات متعدد المكونات؛ لا يطابق glucose 30% أو KCl المفرد. |

## مراجعة المقاطع 191–195

- ظهرت سجلات LOVENOX متعددة القوة والعبوة، وكذلك LOXEN 10 mg القابل للحقن؛ المقتطفات المعروضة لا تثبت طريق SC أو IV صراحةً، لذلك لم أضف مطابقة طريق جديدة اعتماداً على اسم العلامة أو صيغة الحقن فقط.
- بقية الأسماء في هذه المقاطع لا تقدم مطابقة جديدة مؤكدة لبطاقات التطبيق؛ لم تُغيّر `brands` أو أعداد الصفوف.

## مراجعة المقاطع 181–190

- أعادت المقاطع تأكيد صفوف KETOMED IM وKETOPROF 100 وLASILIX SPECIAL المسجلة سابقاً؛ لم أكررها في جدول المطابقات.
- استُبعد KETOPROGEL وKETUM لأنهما جلان موضعيان، لا يطابقان بطاقة ketoprofene للطرق الجهازية. أضيفت حواجز بحث واختبارات.
- أضيفت استبعادات أربعة عروض paracetamol غير مطابقة: قرصا KLIPAL CODEINE المركبان، تحميلة LAMALINE المركبة، وقرص LATIFEX PLUS مع tramadol.
- استُبعدت LANTUS وLANTUS SOLOSTAR وLEVEMIR FLEXPEN لأن سجل DPM يصنفها نظائر إنسولين، لا الإنسولين البشري السريع. كما أن سجلات LEVET المنقولة فموية؛ لا تثبت مستحضراً وريدياً جديداً.
- لم تضف بقية السجلات التي روجعت (ومنها مستحضرات ليفوفلوكساسين وعلاجات تخصصية) مطابقة جديدة واضحة لبطاقات التطبيق.

## مراجعة المقاطع 166–180

- أضيف IPROVENT ADULTE وIPROVENT ENFANT لبطاقة ipratropium بالنيبولايزر؛ سطرا DPM يحددان محلول الاستنشاق والتركيزين 0.500 و0.250 mg/2 mL (AMM `9093782` و`9093781`). أضيفت اختبارات البحث لكليهما.
- تأكد سجلا KETAMINE PANPHARMA للحقن (AMM `7233011H` و`7233012H`)؛ يذكر النص الاستعمال بالتسريب الوريدي، ويطابق المادة والشكل بطاقة الكيتامين. أضيفت العبوتان إلى التقرير والبطاقة.
- لم تُربط INSUGEN R ولا JUSLINE R ببطاقة الإنسولين IV لأن السجل لا يذكر الطريق الوريدي صراحة. واستُبعد JUSLINE N وJUSLINE 30/70 لاختلافهما كمعلّقين عن الإنسولين البشري السريع الذائب. أضيفت حواجز البحث والاختبارات.
- ظهر IPPROTON PERFUSION كمستحضر omeprazole وريدي، لكن لا توجد بطاقة omeprazole ضمن الأدوية الـ73. بقية الأسماء التي راجعتها في هذه المقاطع لم تقدم مطابقة جديدة لبطاقات التطبيق.

## مراجعة المقاطع 161–165

- أعادت هذه المقاطع إظهار عرضي HEPARINE UNIMED/MEDIS للحقن، لكن DPM لا يحدد IV؛ أزيلا من الربط ببطاقة الهيبارين الوريدية واختُبر استبعادهما.
- ظهرت سبعة عروض hydrocortisone powder for injection؛ لم يذكر سطر DPM طريق IV صراحة، لذلك أزيلت العلامات السابقة التي لم تثبت طريقها، وأُدرجت جميع العروض في الاستبعادات.
- لم تضف بقية الأسماء الظاهرة (ومنها لقاحات وأدوية غير موجودة في بطاقات التطبيق) مطابقة واضحة جديدة.

## مراجعة المقاطع 156–160

- استُبعدت 11 عرضاً فموياً/مركباً جديداً من paracetamol: خمسة GOLDIX وستة GRIPEX؛ أضيفت حواجز بحث بأسماء العلامات واختبارات عدم الربط ببطاقة paracetamol IV.
- ظهرت أسماء هالوبيريدول وأشكاله الفموية والمحقونة، لكن لا يضيف هذا المقتطف مطابقة جديدة واضحة من حيث طريق الجرعة للبطاقة الحالية؛ لم تُضف علامات.

## مراجعة المقاطع 151–155

- أُضيف سجلا GLUCAGEN 1 mg للـglucagon؛ سجلا DPM يثبتان مسحوقاً لتحضير محلول للحقن ويطابقان بطاقة glucagon من حيث المادة والقوة والشكل.
- استُبعدت 23 صورة glucose 5%/10% من بطاقة glucose 30% بسبب اختلاف التركيز، كما استُبعدت محاليل GLUCOSALINE INFO وGLUKANION متعددة المكونات.
- لم يُربط GLUCALCIUM ببطاقة gluconate de calcium IV لأن DPM لم يذكر الطريق الوريدي صراحة؛ واستُبعد GLUCONATE DE CALCIUM SIPHAT لأنه أمبولات للشرب.

## مراجعة المقاطع 146–150

- لا تحقق سجلات GARDENAL المذكورة مطابقة كاملة: عرض 40 mg حقني لا يحدد IV صراحة، والعياران 10 و100 mg أقراص؛ لذلك أزيلت من ربط بطاقة phenobarbital الوريدية ووُثقت للاستبعاد.
- سجل GENSULIN R (100 UI/mL solution injectable، AMM 18623011) لا يحدد طريق IV في السطر الظاهر؛ أزيل من `brands` واختُبر كاستبعاد بحث.
- بقية الأسماء الظاهرة في هذه المقاطع لا تقابل بطاقة حالية مطابقة، أو لا يثبت سجلها الشكل والطريق اللازمين؛ لم تُضف كعلامات.

## مراجعة المقاطع 141–145

- أُضيفت ستة عروض GALAMOX الفموية للمادة المفردة amoxicilline؛ شكلها وطريقها الفموي داخلان في بطاقة amoxicilline الحالية، وأرقام AMM منقولة في جدول المطابقات.
- استُبعد FRESIDOL الفموي من بطاقة paracetamol IV، واستُبعد عرضا FRUBIOSE CALCIQUE الفمويان المركبان من بطاقة gluconate de calcium الحقني.
- لم تظهر في بقية هذه المقاطع مطابقة جديدة مؤكدة لبطاقة حالية. تظهر أشكال FUCIDINE الحقنية، لكنها لا تقابل بطاقة حالية في التطبيق ولا تُنسب إلى مضاد حيوي آخر.

## FLEXEN للحقن لا يحدد طريقاً مطابقاً لبطاقة ketoprofene

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| FLEXEN | KETOPROFENE | 100 mg | مسحوق لتحضير مستحضر للحقن؛ B/6 قوارير + 6 مذيبات/2.5 mL | ITALFARMACO S.p.A ITALIA | 2033011 | الطريق غير محدد في السجل؛ لا يُفترض أنه IM أو IV ولا يطابق علامة ذات طريق محدد. |

## مستحضرات fentanyl الحقنية دون طريق محدد لا تُطابق بطاقة IV

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| FENTANYL RENAUDIN | FENTANYL | 100 µg/2 mL | محلول للحقن؛ B/10 أمبولات/2 mL | RENAUDIN | 7713071H | صيغة الحقن لا تحدد IV؛ لا يُفترض الطريق من اسم المادة أو الفئة. |
| FENTANYL RENAUDIN 50µG/ML | FENTANYL | 500 µg/10 mL | محلول للحقن؛ B/10 أمبولات/10 mL | RENAUDIN | 7713101H | صيغة الحقن لا تحدد IV؛ لا يُفترض الطريق من اسم المادة أو الفئة. |
| FENTANYL MEDIS | FENTANYL | 100 µg/2 mL | محلول للحقن؛ B/10 أمبولات/2 mL | LES LABORATOIRES MEDIS | 9233311H | صيغة الحقن لا تحدد IV؛ لا يُفترض الطريق من اسم المادة أو الفئة. |
| FENTANYL MEDIS | FENTANYL | 500 µg/10 mL | محلول للحقن؛ B/10 أمبولات/10 mL | LES LABORATOIRES MEDIS | 9233312H | صيغة الحقن لا تحدد IV؛ لا يُفترض الطريق من اسم المادة أو الفئة. |
| FENTANYL MYLAN | FENTANYL | 100 µg/2 mL | محلول للحقن؛ B/10 أمبولات/2 mL | MYLAN S.A.S | 4923111H | صيغة الحقن لا تحدد IV؛ لا يُفترض الطريق من اسم المادة أو الفئة. |
| FENTANYL PIRAMAL | FENTANYL | 100 µg/2 mL | محلول للحقن؛ B/5 أمبولات/2 mL | Piramal Critical Care B.V. | 23693032H | صيغة الحقن لا تحدد IV؛ لا يُفترض الطريق من اسم المادة أو الفئة. |
| FENTANYL PIRAMAL | FENTANYL | 500 µg/10 mL | محلول للحقن؛ B/10 أمبولات/10 mL | Piramal Critical Care B.V. | 23693031H | صيغة الحقن لا تحدد IV؛ لا يُفترض الطريق من اسم المادة أو الفئة. |

### RAPIFEN وREMIFENTANIL: مواد فعالة مختلفة عن fentanyl

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| RAPIFEN | ALFENTANIL | 1 mg (0.5 mg/mL) | محلول للحقن؛ B/5 أمبولات/2 mL | Piramal Critical Care B.V. | 23693041H | المادة alfentanil مختلفة عن fentanyl؛ لا تُربط بسبب التشابه الاسمي/الفئة. |
| RAPIFEN | ALFENTANIL | 1 mg/2 mL | محلول للحقن؛ B/5 أمبولات/2 mL | JANSSEN-CILAG | 5743061H | المادة alfentanil مختلفة عن fentanyl؛ لا تُربط بسبب التشابه الاسمي/الفئة. |
| REMIFENTANIL MEDIS | REMIFENTANIL | 1 mg | مسحوق لتحضير محلول للحقن؛ B/5 قوارير | LES LABORATOIRES MEDIS | 9233651H | remifentanil مادة فعالة مستقلة عن fentanyl. |
| REMIFENTANIL MEDIS | REMIFENTANIL | 5 mg | مسحوق لتحضير محلول للحقن؛ B/5 قوارير | LES LABORATOIRES MEDIS | 9233652H | remifentanil مادة فعالة مستقلة عن fentanyl. |
| REMIFENTANIL MEDIS | REMIFENTANIL | 1 mg | مسحوق لتحضير محلول للحقن؛ B/10 قوارير | LES LABORATOIRES MEDIS | 9233653H | remifentanil مادة فعالة مستقلة عن fentanyl. |
| REMIFENTANIL MEDIS | REMIFENTANIL | 5 mg | مسحوق لتحضير محلول للحقن؛ B/10 قوارير | LES LABORATOIRES MEDIS | 9233654H | remifentanil مادة فعالة مستقلة عن fentanyl. |
| REMIFENTANIL VIATRIS | REMIFENTANIL | 1 mg | مسحوق لتحضير محلول للحقن؛ B/10 قوارير | VIATRIS SANTE | 4923281H | remifentanil مادة فعالة مستقلة عن fentanyl. |
| REMIFENTANIL VIATRIS | REMIFENTANIL | 5 mg | مسحوق لتحضير محلول للحقن؛ B/10 قوارير | VIATRIS SANTE | 4923282H | remifentanil مادة فعالة مستقلة عن fentanyl. |


## DOBUJECT: شكل الحقن لا يحدد طريقه أو كونه للتسريب

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| DOBUJECT | DOBUTAMINE | 250 mg | محلول للحقن؛ B/5 أمبولات/5 mL | BAYER OY | 7243011H | السجل لا يحدد طريق الإعطاء أو التسريب؛ لا يُفترض طريق غير منصوص عليه لبطاقة dobutamine للتسريب. |

## قطرات dexamethasone العينية لا تطابق البطاقة الجهازية

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| DEXACOL | DEXAMETHASONE | 0.1% | قطرة عينية؛ قارورة/3 mL | UNIMED | 9093511 | طريق عيني موضعي؛ لا يطابق بطاقة dexamethasone الجهازية/الحقنية. |
| DEXACOL | DEXAMETHASONE | 0.1% | قطرة عينية؛ قارورة/5 mL | UNIMED | 9093512 | طريق عيني موضعي؛ لا يطابق بطاقة dexamethasone الجهازية/الحقنية. |
| DEXAMEX | DEXAMETHASONE+NEOMYCINE | 0.1% | قطرة عينية؛ قارورة/5 mL | UNIMED | 9093181 | تركيبة عينية موضعية؛ لا تطابق بطاقة dexamethasone الجهازية/الحقنية. |

## DALACINE T TOPIC الموضعي لا يطابق clindamycine الجهازية

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| DALACINE T TOPIC | CLINDAMYCINE | 1% | محلول للاستعمال الخارجي؛ قارورة/30 mL | PFIZER HOLDING FRANCE | 6533062 | مستحضر موضعي لعلاج حب الشباب؛ لا يطابق clindamycine الجهازية. |

## CORTEF الفموي لا يطابق بطاقة hydrocortisone الحقنية

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| CORTEF 10 | HYDROCORTISONE | 10 mg | قرص مشقوق؛ قارورة/100 | PFIZER CANADA ULC. | 10763011 | شكل فموي؛ لا يطابق بطاقة hydrocortisone للحقن. |

## عرض CIPROLON الحقني: طريق الإعطاء غير مثبت في السجل

ظهر CIPROLON بتركيز 200 mg/100 mL بصيغة «solution injectable» (AMM 6653451H)، دون أن يحدد سطر DPM المنقول طريق IV أو التسريب؛ لذلك لم يُضف إلى `brands` ولم يُحسب مطابقة مؤكدة، بخلاف العروض الفموية CIPROLON المدرجة أعلاه.

## مراجعة المقاطع 196–205

- أضيفت ثلاث عروض metronidazole صريحة للتسريب: METROGYL (AMM `9003773H`)، METROJECT (`9094031H`) وMETRONIDAZOLE INFOMED (`9193161H`).
- لم تُضف عروض MEDAXON السبعة لبطاقة dexamethasone: DPM يذكر مستحضراً حقنياً واستعمالاً «par voie générale»، لكنه لا يحدد IV أو IM؛ لذلك لا يُستنتج الطريق من ذلك. واستُبعد MAXIDROL في شكليه العينيين لأنه مركب موضعي للعين.
- استُبعدت عروض MEDICLAV الأربعة لأنها amoxicilline+acide clavulanique وليست amoxicilline مفردة. كما استُبعدت عروض metronidazole الفموية، وأربعة عروض حقنية لا يحدد سجلها طريقاً يطابق بطاقة التسريب.
- ظهرت منتجات أخرى منها omeprazole فموي، esomeprazole فموي/حقني، وmeropenem حقني؛ لا توجد بطاقات مقابلة لها ضمن السجلات الحالية أو لم يثبت شكل/طريق مطابق، فلم تُنشأ بطاقات جديدة.

## MEDAXON الحقني دون طريق إعطاء محدد لا يطابق بطاقة dexamethasone

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| MEDAXON | DEXAMETHASONE | 4 mg | محلول للحقن؛ B/10 أمبولات/1 mL | SAIPH | ST9163942 | يذكر DPM «par voie générale» دون تحديد IV أو IM. |
| MEDAXON | DEXAMETHASONE | 4 mg | محلول للحقن؛ B/1 أمبولة/1 mL | SAIPH | ST9163941 | يذكر DPM «par voie générale» دون تحديد IV أو IM. |
| MEDAXON | DEXAMETHASONE | 4 mg | محلول للحقن؛ B/100 أمبولة/1 mL | SAIPH | ST9163943H | يذكر DPM «par voie générale» دون تحديد IV أو IM. |
| MEDAXON | DEXAMETHASONE | 4 mg/mL | محلول للحقن؛ B/10 أمبولات/1 mL | STERIPHARM | 9443192 | يذكر DPM «par voie générale» دون تحديد IV أو IM. |
| MEDAXON | DEXAMETHASONE | 4 mg/mL | محلول للحقن؛ B/1 أمبولة/1 mL | STERIPHARM | 9443191 | يذكر DPM «par voie générale» دون تحديد IV أو IM. |
| MEDAXON FORT | DEXAMETHASONE | 8 mg | محلول للحقن؛ B/1 أمبولة/2 mL | SAIPH | ST9163944 | يذكر DPM «par voie générale» دون تحديد IV أو IM. |
| MEDAXON FORT | DEXAMETHASONE | 8 mg/2 mL | محلول للحقن؛ B/1 أمبولة/2 mL | STERIPHARM | 9443193 | يذكر DPM «par voie générale» دون تحديد IV أو IM. |

## MAXIDROL العيني المركب وMEDICLAV المركب لا يطابقان البطاقات المفردة

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| MAXIDROL | DEXAMETHASONE+NEOMYCINE+POLYMYXINE B | غير مذكور | قطرة عينية؛ قارورة/3 mL | ALCON FRANCE | 6640031 | تركيبة موضعية عينية؛ لا تطابق dexamethasone الجهازي. |
| MAXIDROL | DEXAMETHASONE+NEOMYCINE+POLYMYXINE B | غير مذكور | مرهم عيني؛ أنبوب/3.5 g | ALCON FRANCE | 6640033 | تركيبة موضعية عينية؛ لا تطابق dexamethasone الجهازي. |
| MEDICLAV | AMOXICILLINE+ACIDE CLAVULANIQUE | 100 mg/12.5 mg/mL | مسحوق لمعلق فموي؛ قارورة/30 mL | MEDICEF | 9183161 | تركيبة وليست amoxicilline مفردة. |
| MEDICLAV | AMOXICILLINE+ACIDE CLAVULANIQUE | 100 mg/12.5 mg/mL | مسحوق لمعلق فموي؛ قارورة/60 mL | MEDICEF | 9183162 | تركيبة وليست amoxicilline مفردة. |
| MEDICLAV | AMOXICILLINE+ACIDE CLAVULANIQUE | 500 mg/62.5 mg | مسحوق لمعلق فموي؛ B/12 أكياس | MEDICEF | 9183163 | تركيبة وليست amoxicilline مفردة. |
| MEDICLAV | AMOXICILLINE+ACIDE CLAVULANIQUE | 1 g/125 mg | مسحوق لمعلق فموي؛ B/12 أكياس | MEDICEF | 9183164 | تركيبة وليست amoxicilline مفردة. |

## عروض metronidazole دون شكل/طريق مطابق لبطاقة التسريب

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| METROGYL | METRONIDAZOLE | 250 mg | قرص مغلف؛ B/500 | SIPHAT | 9003772H | شكل فموي. |
| METROGYL | METRONIDAZOLE | 250 mg | قرص مغلف؛ B/20 | SIPHAT | 9003771 | شكل فموي. |
| METRONIDAZOLE OPALIA | METRONIDAZOLE | 4% | معلق فموي؛ قارورة/120 mL | OPALIA PHARMA | 9023611 | شكل فموي. |
| METRONIDAZOLE INFOMED | METRONIDAZOLE | 0.5% | محلول للحقن؛ كيس/100 mL | INFOMED Pharma | 9193051 | لا يحدد السطر «pour perfusion» أو IV؛ لا يُفترض الطريق. |
| METRONIDAZOLE BAXTER S.P.A | METRONIDAZOLE | 0.5% | محلول للحقن؛ B/25 قوارير/100 mL | BAXTER S.P.A | 16133011H | لا يحدد السطر طريقاً مطابقاً للتسريب IV. |
| METRONIDAZOLE BIOSEDRA | METRONIDAZOLE | 500 mg/100 mL | محلول للحقن؛ قارورة/100 mL | FRESENIUS KABI FRANCE | 3153031H | لا يحدد السطر طريقاً مطابقاً للتسريب IV. |
| METRONIDAZOLE BRAUN | METRONIDAZOLE | 0.5% | محلول للحقن؛ كيس/100 mL | B.BRAUN MEDICAL | 8263041H | لا يحدد السطر طريقاً مطابقاً للتسريب IV. |

## مراجعة المقاطع 206–210

- لم تُربط عروض MIDAZOLAM AGUETTANT الأربعة ببطاقة midazolam: السجل يذكر «solution injectable» والاستطبابات الإجرائية/التخديرية، لكنه لا يحدد IV أو IM أو طريقاً آخر.
- صُحح ربط MORPHINE MEDIS السابق: المقطع 210 يصف خمسة عروض morphine بأنها «solution injectable» فقط ولا يحدد IV. أزيل صف MORPHINE MEDIS من جدول المطابقات، وحُذفت أسماء العلامات المرتبطة بهذه العروض من `brands`؛ بقي البحث بالاسم العام «morphine» متاحاً.
- استُبعد MIXTARD 30 وMIXTARD 30 PENFILL لأن السجل يصفهما معلقين للحقن، لا الإنسولين البشري السريع الذائب. أضيفت اختبارات الاستبعاد.
- ظهرت منتجات أخرى مثل MOPRAL PERFUSION (omeprazole) وMINIRIN (desmopressine)، لكن لا توجد بطاقات مطابقة لها ضمن السجلات الـ73 الحالية؛ لم تُنشأ بطاقات جديدة.

## MIDAZOLAM AGUETTANT وSTERIPHARM للحقن دون طريق محدد

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| MIDAZOLAM AGUETTANT | MIDAZOLAM | 5 mg/mL | محلول للحقن؛ B/10 أمبولات/1 mL | LABORATOIRE AGUETTANT | 7093261H | لا يحدد سطر DPM طريقاً بعينه؛ لا يُفترض IV أو IM. |
| MIDAZOLAM AGUETTANT | MIDAZOLAM | 5 mg/mL | محلول للحقن؛ B/10 أمبولات/10 mL | LABORATOIRE AGUETTANT | 7093262H | لا يحدد سطر DPM طريقاً بعينه؛ لا يُفترض IV أو IM. |
| MIDAZOLAM STERIPHARM | MIDAZOLAM | 5 mg/mL | محلول للحقن؛ B/10 أمبولات/1 mL | STERIPHARM | 9443171H | لا يحدد سطر DPM طريقاً بعينه؛ لا يُفترض IV أو IM. |
| MIDAZOLAM STERIPHARM | MIDAZOLAM | 25 mg/5 mL | محلول للحقن؛ B/5 أمبولات/5 mL | STERIPHARM | 9443172H | لا يحدد سطر DPM طريقاً بعينه؛ لا يُفترض IV أو IM. |

## عروض morphine للحقن دون تصريح IV

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| MORPHINE (CHLORHYDRATE) RENAUDIN | MORPHINE | 10 mg/mL | محلول للحقن؛ B/10 أمبولات/1 mL | RENAUDIN | 7713052H | الحقن مذكور لكن الطريق IV غير محدد. |
| MORPHINE (CHLORHYDRATE) RENAUDIN | MORPHINE | 10 mg/mL | محلول للحقن؛ B/100 أمبولة/1 mL | RENAUDIN | 7713051H | الحقن مذكور لكن الطريق IV غير محدد. |
| MORPHINE CHLORHYDRATE AGUETTANT | MORPHINE | 0.1 mg/mL | محلول للحقن؛ B/10 أمبولات/5 mL | LABORATOIRE AGUETTANT | 7093221H | الحقن مذكور لكن الطريق IV غير محدد. |
| MORPHINE CHLORHYDRATE AGUETTANT | MORPHINE | 10 mg/mL | محلول للحقن؛ B/10 أمبولات/1 mL | LABORATOIRE AGUETTANT | 7093222H | الحقن مذكور لكن الطريق IV غير محدد. |
| MORPHINE MEDIS | MORPHINE | 10 mg/mL | محلول للحقن؛ B/10 أمبولات/1 mL | LES LABORATOIRES MEDIS | 9234031H | الحقن مذكور لكن الطريق IV غير محدد. |

## MIXTARD 30 معلّق إنسولين لا يطابق البطاقة السريعة

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| MIXTARD 30 | INSULINE HUMAINE | 100 UI/mL | معلق للحقن؛ قارورة/10 mL | NOVO NORDISK A/S Bagsvaerd | 5993018 | معلق، لا محلول الإنسولين البشري السريع المفرد. |
| MIXTARD 30 PENFILL | INSULINE HUMAINE | 100 UI/mL | معلق للحقن؛ B/5 خراطيش/3 mL | NOVO NORDISK A/S Bagsvaerd | 5993025 | معلق مختلط في خرطوشة؛ لا يطابق محلول الإنسولين السريع المفرد. |

## مراجعة المقاطع 211–215

- لم تظهر مطابقة جديدة مؤكدة للبطاقات الحالية في هذه المقاطع. استُبعدت أربعة عروض NAKION G/G5 لأنها محاليل تسريب متعددة المكونات (إلكتروليتات مع glucose)، وليست glucose 30% أو NaCl/KCl مفرداً.
- استُبعدت خمسة عروض MOSCONTIN فموية ممتدة التحرر من بطاقة morphine الوريدية، وعرض NATECAL D3 الفموي المركب من calcium + vitamine D من بطاقة calcium gluconate IV.
- صححت مطابقة NATISPRAY: DPM يثبت 0.3 mg/dose و«pulvérisation buccale»، لكنه لا يصرّح بأن الطريق sublingual كما تتطلب البطاقة؛ لذلك أزيل من `brands` وفُصل في البحث. لا يُستدل على الطريق من الاستعمال المعروف للاسم.
- لا تغييرات على الجرعات أو بيانات التخزين.

## NAKION G/G5 متعدد الإلكتروليتات لا يطابق مواداً مفردة

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| NAKION G 5% | ELECTROLYTES | غير مذكور | محلول للحقن للتسريب؛ كيس/1000 mL | INFOMED Pharma | 9193122 | محلول متعدد الإلكتروليتات يحتوي glucose؛ لا يطابق glucose 30% أو KCl/NaCl المفرد. |
| NAKION G 5% | ELECTROLYTES | غير مذكور | محلول للحقن للتسريب؛ كيس/500 mL | INFOMED Pharma | 9193121 | محلول متعدد الإلكتروليتات يحتوي glucose؛ لا يطابق glucose 30% أو KCl/NaCl المفرد. |
| NAKION G5 | ELECTROLYTES | غير مذكور | محلول للحقن للتسريب؛ كيس/1000 mL | INFOMED Pharma | 9193062 | محلول متعدد الإلكتروليتات يحتوي glucose؛ لا يطابق glucose 30% أو KCl/NaCl المفرد. |
| NAKION G5 | ELECTROLYTES | غير مذكور | محلول للحقن للتسريب؛ كيس/500 mL | INFOMED Pharma | 9193061 | محلول متعدد الإلكتروليتات يحتوي glucose؛ لا يطابق glucose 30% أو KCl/NaCl المفرد. |

## MOSCONTIN الفموي وNATECAL D3 لا يطابقان البطاقات الوريدية المفردة

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| MOSCONTIN 10 | MORPHINE | 10 mg | قرص ممتد التحرر؛ B/14 | Napp Pharmaceuticals Limited | 16263011 | شكل فموي ممتد التحرر؛ لا يطابق morphine IV. |
| MOSCONTIN 30 | MORPHINE | 30 mg | قرص ممتد التحرر؛ B/14 | Napp Pharmaceuticals Limited | 16263012 | شكل فموي ممتد التحرر؛ لا يطابق morphine IV. |
| MOSCONTIN 60 | MORPHINE | 60 mg | قرص ممتد التحرر؛ B/14 | Napp Pharmaceuticals Limited | 16263013 | شكل فموي ممتد التحرر؛ لا يطابق morphine IV. |
| MOSCONTIN 100 | MORPHINE | 100 mg | قرص ممتد التحرر؛ B/14 | Napp Pharmaceuticals Limited | 16263014 | شكل فموي ممتد التحرر؛ لا يطابق morphine IV. |
| MOSCONTIN 200 | MORPHINE | 200 mg | قرص ممتد التحرر؛ B/14 | Napp Pharmaceuticals Limited | 16263015 | شكل فموي ممتد التحرر؛ لا يطابق morphine IV. |
| NATECAL D3 | CALCIUM+VITAMINE D | 600 mg/400 UI | قرص فموي متحلل بالفم؛ قارورة/60 | ITALFARMACO S.p.A ITALIA | 2033021 | مستحضر فموي مركب؛ لا يطابق calcium gluconate IV المفرد. |

## NATISPRAY: DPM لا يحدد الطريق تحت اللسان صراحة

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| NATISPRAY | TRINITRINE | 0.3 mg/dose | محلول للرش الفموي؛ قارورة/18 mL (300 جرعة) | TEOFARMA S.R.L | 13353013 | يذكر DPM «pulvérisation buccale» لا الطريق تحت اللسان صراحة؛ لا يُربط ببطاقة sublingual بالافتراض. |

## مراجعة المقاطع 216–220

- أعادت هذه المقاطع عرض NICARDIPINE MÉDIS بعيار 10 mg/10 mL مع ذكر IV صراحة، وعرضي NEURODOL الفمويين؛ جميعها موثقة في جدول المطابقات السابق، لذلك لم أكررها أو أغيّر الأعداد.
- لم تظهر مطابقة جديدة لبطاقات الأدوية الحالية. NEXUS esomeprazole، وعروض pregabaline/gabapentine، وNEFOMED (nefopam) لا تقابل بطاقات ضمن مجموعة التطبيق الحالية؛ لا تُنشأ بطاقات جديدة في هذه المراجعة.
- بقية العروض المرئية في هذه المقاطع أشكال فموية أو أدوية لا تطابق مادة/شكل/طريق بطاقة حالية. لا تغيير في `brands` أو اختبارات البحث أو أعداد المطابقة والاستبعاد.


## مراجعة المقاطع 221–227

- أضاف السجل تطابقاً صريحاً لـNORENOL 8 (DORCAS)، AMM `9313151H`: 8 mg/4 mL، محلول للحقن بالتسريب، ويذكر وصف DPM الاستخدام بالتسريب الوريدي. أُدرج في بطاقة noradrenaline واختُبر الاسم في البحث.
- طابقت عروض NORMOCARDIL (40 mg أقراص quadrisécables؛ AMM `9213091` و`9213092H`) بطاقة propranolol الفموية، وأُضيفت واختُبر البحث عنها. كما أُضيفت العروض الستة لـNOVAMOX (ADWYA؛ AMM `9043971`–`9043976`) إلى amoxicilline: أشكال فموية أحادية المادة، متوافقة مع أشكال البطاقة.
- فُصلت 8 عروض NOVACLAV المركبة عن amoxicilline المفردة، و11 عرضاً لـNOVADOL/NOVADOL EXTRA/NOVEX الفموية أو المركبة عن paracetamol IV، وعرضا NOVOMIX 30/50 FLEXPEN (نظائر إنسولين معلقة) عن الإنسولين البشري السريع. أضيفت اختبارات بحث سلبية لهذه الأسماء.
- نُقلت جميع AMM والأشكال والعبوات في الجداول أعلاه. أصبحت الأعداد **340 مطابقة و379 استبعاداً**؛ المراجعة ما زالت جزئية، ولم تتغير الجرعات أو البيانات السريرية.


## مستحضرات ondansetron الحقنية دون تصريح بطريق IV

لا يحدد سجل DPM طريقاً وريدياً صريحاً لهذه المستحضرات؛ لذلك لا تُربط ببطاقة ondansetron IV على أساس وصف «solution injectable» وحده. ويُفصل عنها قرص ONDANSETRON MEDIS الفموي المسجل في جدول المطابقات.

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| ONDANSETRON UNIMED | ONDANSETRONE | 8 mg/4 mL | محلول للحقن؛ B/10/4 mL | UNIMED | 9093642H | طريق الحقن غير محدد؛ لا يثبت IV. |
| ONDOFREN 8 | ONDANSETRONE | 8 mg/4 mL | محلول للحقن؛ B/50/4 mL | DORCAS | 9313071H | طريق الحقن غير محدد؛ لا يثبت IV. |
| ONDANSETRON SAIPH | ONDANSETRONE | 4 mg/2 mL | محلول للحقن؛ B/5/2 mL | SAIPH | 9163881H | طريق الحقن غير محدد؛ لا يثبت IV. |
| ONDANSETRON SAIPH | ONDANSETRONE | 8 mg/4 mL | محلول للحقن؛ B/5/4 mL | SAIPH | 9163882H | طريق الحقن غير محدد؛ لا يثبت IV. |
| ONDANSETRON STERIPHARM | ONDANSETRONE | 8 mg/4 mL | محلول للحقن؛ B/5/4 mL | STERIPHARM | 9443121H | طريق الحقن غير محدد؛ لا يثبت IV. |
| ONDANSETRON STERIPHARM | ONDANSETRONE | 4 mg/2 mL | محلول للحقن؛ B/5/2 mL | STERIPHARM | 9443122H | طريق الحقن غير محدد؛ لا يثبت IV. |
| ONDANSETRON UNIMED | ONDANSETRONE | 4 mg/2 mL | محلول للحقن؛ B/10/2 mL | UNIMED | 9093641H | طريق الحقن غير محدد؛ لا يثبت IV. |
| ONDANSETRON MEDIS | ONDANSETRONE | 8 mg/4 mL | محلول للحقن؛ B/5/4 mL | LES LABORATOIRES MEDIS | 9233331H | طريق الحقن غير محدد؛ لا يثبت IV. |
| ONDANSETRON MEDIS | ONDANSETRONE | 4 mg/2 mL | محلول للحقن؛ B/5/2 mL | LES LABORATOIRES MEDIS | 9233332H | طريق الحقن غير محدد؛ لا يثبت IV. |
| ONDANSETRON RENAUDIN | ONDANSETRONE | 8 mg/4 mL | محلول للحقن؛ B/10/4 mL | RENAUDIN | 7713092H | طريق الحقن غير محدد؛ لا يثبت IV. |
| ONDANSETRON RENAUDIN | ONDANSETRONE | 4 mg/2 mL | محلول للحقن؛ B/10/2 mL | RENAUDIN | 7713091H | طريق الحقن غير محدد؛ لا يثبت IV. |

## NOVORAPID وOGYL وOCTREOTIDE NEAPOLIS: لا مطابقة مؤكدة

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| NOVORAPID FLEXPEN | INSULINE ANALOGUE | 100 UI/mL | محلول للحقن؛ B/5 أقلام/3 mL | NOVO NORDISK A/S Bagsvaerd | 5993081 | نظير إنسولين في قلم؛ لا يطابق الإنسولين البشري السريع. |
| OGYL | SPIRAMYCINE+METRONIDAZOLE | 750 mU/125 mg | قرص مغلف؛ B/20 | SAIPH | 9163521 | تركيبة من مادتين؛ لا تطابق metronidazole المفرد. |
| OCTREOTIDE NEAPOLIS | OCTREOTIDE | 0.1 mg/mL | محلول للحقن؛ B/10 قوارير | NEAPOLIS PHARMA | 9393181H | DPM لا يحدد طريق الحقن؛ لا يثبت الطريق المطلوب لبطاقة التسريب. |



## مراجعة المقاطع 228–247

- وُثقت عروض paracetamol IV المطابقة من PARAC INFO وPARAMED، وأُضيفت 12 حالة فموية/مركبة من paracetamol (PARACETYL وPARALVIT) إلى سجل الاستبعادات مع مرشحات بحث سلبية.
- أُضيف NOVORAPID FLEXPEN بوصفه نظير إنسولين لا يطابق الإنسولين البشري السريع، وOGYL بوصفه تركيبة spiramycine+metronidazole، وOCTREOTIDE NEAPOLIS إلى الاستبعادات؛ سجل DPM يذكر الحقن دون تحديد طريق IV، فلا يثبت مطابقة بطاقة التسريب.
- طُبّق شرط الطريق صراحةً على ondansetron: نُقلت 11 عرضاً حقنياً من جدول المطابقات إلى الاستبعادات لأن DPM لا يذكر IV. وأُضيف بدلاً منها عرضا ONDANSETRON MEDIS الفمويان (4 mg و8 mg، AMM `9233333` و`9233334`)؛ لذلك بقي عدد المطابقات **340**، وارتفع الاستبعاد إلى **405**. أضيفت اختبارات بحث إيجابية/سلبية مناسبة.
- كان OREX SPRAY وOTIPAX موثقين سابقاً ضمن المستحضرات المحتوية على lidocaine غير المطابقة؛ أُضيفت لهما حواجز واختبارات بحث سلبية من دون تغيير عدد الصفوف.
- لم تتغير الجرعات أو البيانات السريرية؛ بقيت مراجعة سجل DPM والبطاقات الـ73 غير مكتملة.


## مراجعة المقاطع 248–257

- أُضيفت خمس عروض فموية أحادية المادة من PENAMOX (MEDICEF؛ AMM `9183024`, `9183026`, `9183028`, `9183029`, `91830210H`) إلى بطاقة amoxicilline.
- أُضيف PMS-ONDANSETRON 8 mg أقراصاً (PHARMASCIENCE INC CANADA؛ AMM `2903032`) إلى الأشكال الفموية لبطاقة ondansetron. لم تُربط مستحضرات الحقن التي لا يذكر سجل DPM طريقها ببطاقة IV.
- في هذه الدفعة: **6 مطابقات جديدة**، ولا استبعادات جديدة بعد احتساب سجلات PHYSIOL وPHENASPIRINE وPIPERACILLINE/TAZOBACTAM التي كانت موثقة سابقاً. أصبح الإجمالي **346 مطابقة و405 استبعادات موثقة**؛ المراجعة الكاملة ما زالت غير مكتملة.


## مراجعة المقاطع 258–267

- لم تظهر مطابقة جديدة لبطاقات الأدوية الحالية ضمن هذه الدفعة؛ من ذلك سجلات pregabalin التي لا تقابل بطاقة pregabalin في التطبيق، ومستحضرات metoclopramide التي لا تقابل بطاقة حالية.
- أضيف استبعاد PRIMACAINE ADRÉNALINE بعبوتيه (AMM `8163061` و`8163062`) لأنهما مخدران سنيان مركبان، لا أدرينالين وريدي. وأضيف PROTOGYL (AMM `9083361`) كشكل مهبلي، وPYLERA (AMM `15373011`) كتركيبة متعددة المواد؛ لا يطابق أيٌّ منها metronidazole المفرد المقصود في بطاقة الاستخدام الجهازي.
- أضيفت اختبارات بحث سلبية لهذه الأسماء. حصيلة هذه الدفعة **4 استبعادات موثقة جديدة**؛ الإجمالي **346 مطابقة و409 استبعادات**، والتدقيق لا يزال جزئياً.


## مراجعة المقاطع 268–272

- لم تظهر مطابقة جديدة مؤكدة لبطاقات الأدوية الحالية.
- أُضيفت ثمانية استبعادات لمنع الخلط مع بطاقة fentanyl: عرضا RAPIFEN بمادة alfentanil، وستة عروض REMIFENTANYL (أربعة MEDIS واثنان VIATRIS). اختلاف المادة الفعالة يمنع المطابقة رغم التقارب في أسماء الأفيونات.
- أضيفت اختبارات بحث سلبية؛ أصبح الإجمالي **346 مطابقة و417 استبعاداً موثقاً**. لا تزال المراجعة غير شاملة.


## مراجعة المقاطع 273–277

- لا توجد إضافة مؤكدة جديدة لبطاقات الأدوية الحالية ولا استبعادات جديدة لازمة لهذه الدفعة.
- ظهرت سجلات RICARDYL وRHUVEX وRHUTAGEL وRHUTASUPPO التي سبق توثيقها، فلم تُكرر صفوفها. لم تُربط سجلات ranitidine أو risperidone أو rifamycin/rifaximine أو RINGER lactate أو omeprazole بعلامات أخرى؛ لا توجد بطاقات مطابقة لها ضمن مجموعة التطبيق الحالية.
- بقي الإجمالي **346 مطابقة و417 استبعاداً موثقاً**. المرور على كامل سجل DPM والبطاقات الـ73 لم يكتمل.


## مراجعة المقاطع 278–282

- استُبعد RYZODEG FLEX TOUCH (insuline asparte + insuline degludec، AMM `5993141`) من بطاقة الإنسولين البشري السريع؛ إنه مزيج من نظيرين، لا الإنسولين البشري المفرد. أضيف حاجز واختبار بحث سلبي.
- سجلات esomeprazole الفموية باسم RUGDAL لا تقابل بطاقة esomeprazole في التطبيق؛ ولم تُنشأ بطاقة جديدة. RUCORON كان موثقاً سابقاً، كما لم يُربط أيٌّ من أسماء الروكسيترومايسين أو البيفوزاكائين ببطاقة ذات مادة فعالة مختلفة.
- أُضيف استبعاد واحد؛ أصبح الإجمالي **346 مطابقة و418 استبعاداً موثقاً**. المراجعة الكاملة ما زالت غير مكتملة.


## مراجعة المقاطع 283–287

- تطابقت عروض SAIFOXYL (amoxicilline) وSANDOSTATINE 50/100 µg/mL وSEDACORON مع سجلات سبق توثيقها، كما أن استبعاد SALBUMOL وشراب SALBUTAMOL SIMED موثق سابقاً؛ لم تُكرر هذه الصفوف.
- لم تُنشأ بطاقة لـSAIZEN أو الأدوية الأخرى التي لا تقابل بطاقة حالية. وسُجّلت استبعادات الأشكال التي قد تلتبس ببطاقات موجودة:

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| SEEBRI BREEZHALER | GLYCOPYRRONIUM BROMIDE | 44 µg | مسحوق للاستنشاق الفموي؛ B/30 كبسولة + جهاز استنشاق | NOVARTIS EUROPHARM LIMITED IRLANDE | 20833051 | DCI مختلفة وشكل مسحوق للاستنشاق؛ لا يطابق ipratropium في وحدات النيبولايزر. |
| SERETIDE | FLUTICASONE PROPIONATE+SALMETEROL | 50 µg/25 µg لكل جرعة | معلق للاستنشاق؛ قارورة/120 جرعة | GlaxoSmithKline France | 5163111 | تركيبة مستنشقة بمادتين مختلفتين؛ لا تطابق salbutamol المفرد ولا محلول النيبولايزر. |
| SERETIDE DISKUS | SALMETEROL+FLUTICASONE | 250/50 µg | مسحوق للاستنشاق الفموي؛ 60 جرعة | GlaxoSmithKline France | 5163103 | تركيبة مسحوق للاستنشاق بمادتين مختلفتين؛ لا تطابق salbutamol المفرد أو محلول النيبولايزر. |
| SERETIDE DISKUS | SALMETEROL+FLUTICASONE | 500/50 µg | مسحوق للاستنشاق الفموي؛ 60 جرعة | GlaxoSmithKline France | 5163101 | تركيبة مسحوق للاستنشاق بمادتين مختلفتين؛ لا تطابق salbutamol المفرد أو محلول النيبولايزر. |
| SERETIDE DISKUS | SALMETEROL+FLUTICASONE | 100/50 µg | مسحوق للاستنشاق الفموي؛ 60 جرعة | GlaxoSmithKline France | 5163102 | تركيبة مسحوق للاستنشاق بمادتين مختلفتين؛ لا تطابق salbutamol المفرد أو محلول النيبولايزر. |
| SALAMEST | CHLORURE DE SODIUM | غير مذكور | بخاخ أنفي؛ قارورة/25 mL | SIMED | 9083521 | شكل أنفي وتركيز غير مذكور؛ لا يثبت مطابقة محلول NaCl 3% الوريدي. |
| SANDOSTATINE L.A.R. | OCTREOTIDE | 30 mg | مسحوق لمعلق للحقن؛ قارورة + محقنة مذيب + إبر | NOVARTIS PHARMA SCHWEIZ AG | 10283183H | مستحضر طويل المفعول معلق، لا يطابق محلول الأوكتريوتيد قصير المفعول في البطاقة. |
| SANDOSTATINE LAR | OCTREOTIDE | 20 mg | مسحوق لمعلق للحقن؛ قارورة + محقنة مذيب | NOVARTIS PHARMA SCHWEIZ AG | 10283184H | مستحضر طويل المفعول معلق، لا يطابق محلول الأوكتريوتيد قصير المفعول في البطاقة. |
| SEMGLEE | INSULINE GLARGINE | 100 UI/mL | محلول للحقن؛ B/5 أقلام معبأة مسبقاً | VIATRIS LIMITED | 27763011 | سجل DPM يذكر DCI مختلفة (`INSULINE GLARGINE`) وتصنيف Biosimilaire؛ لا يطابق بطاقة `INSULINE HUMAINE`. |
| SEPTANEST ADRENALINEE | ARTICAINE+ADRENALINE | 40 mg/mL (1/200 000) | محلول للحقن السني؛ B/50 خرطوشة/1.7 mL | SEPTODENT | 8533013 | مخدر موضعي/ناحي مع أدرينالين لطب الأسنان؛ لا يطابق الأدرينالين الوريدي. |
| SEPTANEST ADRENALINEE | ARTICAINE+ADRENALINE | 40 mg/mL (1/100 000) | محلول للحقن السني؛ B/50 خرطوشة/1.7 mL | SEPTODENT | 8533014 | مخدر موضعي/ناحي مع أدرينالين لطب الأسنان؛ لا يطابق الأدرينالين الوريدي. |

- أضيفت مرشحات واختبارات بحث سلبية لـSALAMEST وSANDOSTATINE LAR وSEMGLEE وSEPTANEST وSEEBRI وSERETIDE. زادت الاستبعادات الموثقة إلى 11 صفاً في هذه الدفعة؛ أصبح الإجمالي **346 مطابقة و429 استبعاداً موثقاً**. لا تزال مراجعة سجل DPM والبطاقات الـ73 غير مكتملة.


## مراجعة المقاطع 288–292

- تكررت عروض SIFLOKS وSIPRODIS المطابقة لبطاقة ciprofloxacine، وكذلك محلول `SET DE TRANSFERT CHLORURE DE SODIUM 9%°` الموثق سابقاً كـNaCl 0.9%؛ لم تُحسب مرة ثانية.
- لم تُظهر بقية الأسماء في المقاطع بطاقة مطابقة جديدة. أُضيفت استبعادات صريحة للأشكال التي قد تلتبس ببطاقات موجودة:

| الاسم في DPM | DCI | العيار/الطاقة | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| SKENAN LP | MORPHINE | 10 mg | كبسولة ممتدة التحرر؛ B/14 | ETHYPHARM | 17253011 | شكل فموي ممتد التحرر، لا يطابق morphine injection. |
| SKENAN LP | MORPHINE | 30 mg | كبسولة ممتدة التحرر؛ B/14 | ETHYPHARM | 17253012 | شكل فموي ممتد التحرر، لا يطابق morphine injection. |
| SKENAN LP | MORPHINE | 60 mg | كبسولة ممتدة التحرر؛ B/14 | ETHYPHARM | 17253013 | شكل فموي ممتد التحرر، لا يطابق morphine injection. |
| SKENAN LP | MORPHINE | 100 mg | كبسولة ممتدة التحرر؛ B/14 | ETHYPHARM | 17253014 | شكل فموي ممتد التحرر، لا يطابق morphine injection. |
| SMOFKABIVEN E | ACIDES AMINES+GLUCOSE+LIPIDES | 1100 kcal | مستحلب للحقن؛ B/4 أكياس ثلاثية الحجرات/986 mL | FRESENIUS KABI FRANCE | 3153161H | تغذية وريدية متعددة المكونات؛ لا تطابق مستحلب الدهون 20% أحادي المنتج. |
| SMOFKABIVEN E | ACIDES AMINES+GLUCOSE+LIPIDES | 1600 kcal | مستحلب للحقن؛ B/4 أكياس ثلاثية الحجرات/1477 mL | FRESENIUS KABI FRANCE | 3153162H | تغذية وريدية متعددة المكونات؛ لا تطابق مستحلب الدهون 20% أحادي المنتج. |
| SMOFKABIVEN E | ACIDES AMINES+GLUCOSE+LIPIDES | 2200 kcal | مستحلب للحقن؛ B/4 أكياس ثلاثية الحجرات/1970 mL | FRESENIUS KABI FRANCE | 3153163H | تغذية وريدية متعددة المكونات؛ لا تطابق مستحلب الدهون 20% أحادي المنتج. |

- أُضيفت مرشحات واختبارات بحث سلبية لـSKENAN LP وSMOFKABIVEN E. زادت الاستبعادات الموثقة 7 صفوف؛ أصبح الإجمالي **346 مطابقة و436 استبعاداً موثقاً**. المراجعة الكاملة ما زالت غير مكتملة.


## مراجعة المقاطع 293–297

- SOLUTE ISOTONIQUE DE NACL 0.9% وSPASMAG IV كانا موثقين سابقاً؛ لم تتغير أعدادهما. لم تظهر مطابقة جديدة.
- وُثقت الاستبعادات الجديدة التي تتقاطع مكوناتها أو أشكالها مع بطاقات حالية، من دون ربطها بها:

| الاسم في DPM | DCI | العيار/الطاقة | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| SOLUTE ISOTONIQUE GLUCOSE | GLUCOSE | 5% | محلول للتسريب؛ قارورة/500 mL | BIEFFE MEDITAL s.p.a Italia | 7323082 | تركيز 5% لا يطابق glucose 30%. |
| SOLUTION POUR DIALYSE PERITONEALE FORMULE 55 | CALCIUM CHLORURE+GLUCOSE+SODIUM CHLORURE | غير مذكور | محلول للغسيل البريتوني؛ كيس/5000 mL | BIEFFE MEDITAL s.p.a Italia | 7323096H | محلول متعدد المكونات للغسيل البريتوني، لا يطابق حقن calcium gluconate أو glucose 30% أو NaCl 3%. |
| SOLUTION POUR DP AUTOMATISEE FORMULE 055 | CALCIUM CHLORURE+GLUCOSE+SODIUM CHLORURE | غير مذكور | محلول للغسيل البريتوني؛ كيس/2000 mL | BAXTER S.P.A | 16133021H | محلول متعدد المكونات للغسيل البريتوني، لا يطابق الحقن المفردة. |
| SOLUTION POUR DP AUTOMATISEE FORMULE 055 | CALCIUM CHLORURE+GLUCOSE+SODIUM CHLORURE | غير مذكور | محلول للغسيل البريتوني؛ كيس/2000 mL | BIEFFE MEDITAL s.p.a Italia | 7323093H | محلول متعدد المكونات للغسيل البريتوني، لا يطابق الحقن المفردة. |
| SOLUTION POUR DP AUTOMATISEE FORMULE 062 | CALCIUM CHLORURE+GLUCOSE+SODIUM CHLORURE | غير مذكور | محلول للغسيل البريتوني؛ كيس/2000 mL | BAXTER S.P.A | 16133022H | محلول متعدد المكونات للغسيل البريتوني، لا يطابق الحقن المفردة. |
| SOLUTION POUR DP AUTOMATISEE FORMULE 062 | CALCIUM CHLORURE+GLUCOSE+SODIUM CHLORURE | غير مذكور | محلول للغسيل البريتوني؛ كيس/2000 mL | BIEFFE MEDITAL s.p.a Italia | 7323092H | محلول متعدد المكونات للغسيل البريتوني، لا يطابق الحقن المفردة. |
| SOLUTION POUR DPCA FORMULE 055 L3 | CALCIUM CHLORURE+GLUCOSE+SODIUM CHLORURE | غير مذكور | محلول للغسيل البريتوني؛ كيس/2000 mL | BAXTER S.P.A | 16133023H | محلول متعدد المكونات للغسيل البريتوني، لا يطابق الحقن المفردة. |
| SOLUTION POUR DPCA FORMULE 055 L3 | CALCIUM CHLORURE+GLUCOSE+SODIUM CHLORURE | غير مذكور | محلول للغسيل البريتوني؛ كيس/2000 mL | BIEFFE MEDITAL s.p.a Italia | 7323094H | محلول متعدد المكونات للغسيل البريتوني، لا يطابق الحقن المفردة. |
| SOLUTION POUR DPCA FORMULE 091 L3 | CALCIUM CHLORURE+GLUCOSE+SODIUM CHLORURE | غير مذكور | محلول للغسيل البريتوني؛ كيس/2000 mL | BAXTER S.P.A | 16133024H | محلول متعدد المكونات للغسيل البريتوني، لا يطابق الحقن المفردة. |
| SOLUTION POUR DPCA FORMULE 091 L3 | CALCIUM CHLORURE+GLUCOSE+SODIUM CHLORURE | غير مذكور | محلول للغسيل البريتوني؛ كيس/2000 mL | BIEFFE MEDITAL s.p.a Italia | 7323095H | محلول متعدد المكونات للغسيل البريتوني، لا يطابق الحقن المفردة. |
| SOLUTION POUR DPCA FORMULE O62 L3 | CALCIUM CHLORURE+GLUCOSE+SODIUM CHLORURE | غير مذكور | محلول للغسيل البريتوني؛ كيس/2000 mL | BAXTER S.P.A | 16133025H | محلول متعدد المكونات للغسيل البريتوني، لا يطابق الحقن المفردة. |
| SOLUTION POUR DPCA FORMULE O62 L3 | CALCIUM CHLORURE+GLUCOSE+SODIUM CHLORURE | غير مذكور | محلول للغسيل البريتوني؛ كيس/2000 mL | BIEFFE MEDITAL s.p.a Italia | 7323091H | محلول متعدد المكونات للغسيل البريتوني، لا يطابق الحقن المفردة. |
| SOMATULINE LP | LANREOTIDE | 60 mg | محلول للحقن؛ محقنة معبأة مسبقاً/0.5 mL | IPSEN Pharma | 5723032H | DCI مختلفة عن octreotide؛ لا تُربط ببطاقته لمجرد تقارب الفئة. |
| SOMATULINE LP | LANREOTIDE | 90 mg | محلول للحقن؛ محقنة معبأة مسبقاً/0.5 mL | IPSEN Pharma | 5723033H | DCI مختلفة عن octreotide؛ لا تُربط ببطاقته لمجرد تقارب الفئة. |
| SOMATULINE LP | LANREOTIDE | 120 mg | محلول للحقن؛ محقنة معبأة مسبقاً/0.5 mL | IPSEN Pharma | 5723034H | DCI مختلفة عن octreotide؛ لا تُربط ببطاقته لمجرد تقارب الفئة. |
| SPIOLTO RESPIMAT | TIOTROPIUM+OLODATEROL | 2.5 µg/2.5 µg | محلول للاستنشاق؛ خرطوشة/60 بخة + جهاز Respimat | BOEHRINGER ING. INT. GmbH | 11533081 | تركيبة استنشاقية بمادتين مختلفتين؛ لا تطابق ipratropium أو salbutamol المفرد. |
| SPIRIVA | TIOTROPIUM | 18 µg | مسحوق للاستنشاق الفموي؛ B/30 كبسولة + جهاز استنشاق | BOEHRINGER ING. INT. GmbH | 11533013 | DCI مختلفة وشكل مسحوق؛ لا يطابق ipratropium في وحدات النيبولايزر. |
| SPIRIVA | TIOTROPIUM | 18 µg | مسحوق للاستنشاق الفموي؛ B/30 كبسولة | BOEHRINGER ING. INT. GmbH | 11533014 | DCI مختلفة وشكل مسحوق؛ لا يطابق ipratropium في وحدات النيبولايزر. |

- أضيفت مرشحات واختبارات بحث سلبية لـSOLUTE ISOTONIQUE GLUCOSE، محاليل الغسيل البريتوني، SOMATULINE LP، SPIOLTO RESPIMAT وSPIRIVA. زادت الاستبعادات الموثقة 18 صفاً؛ أصبح الإجمالي **346 مطابقة و454 استبعاداً موثقاً**. المراجعة الكاملة ما زالت غير مكتملة.

## مراجعة المقاطع 298–302

- لم تظهر مطابقة جديدة. سجلات STOPALGIC أحادية المادة (الفموي وIV) سبق توثيقها، كما أن سجلات SUFENTA ذات الصلة موجودة في الجدول؛ لم تُكرر هذه الصفوف. لم تُنشأ بطاقة جديدة لـSTIGMINE (neostigmine) أو STELAR (esomeprazole) أو STELARA (ustekinumab)، لعدم وجود بطاقة مطابقة ضمن القائمة الحالية.
- أُضيفت خمسة صفوف استبعاد جديدة: أربعة عروض فموية مركبة تحتوي paracetamol، ومرهم عيني مركب يحتوي dexamethasone. لا يُعامل أي منها كبديل عن الشكل/الطريق الذي تغطيه البطاقة.

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| STER-DEX | DEXAMETHASONE+OXYTETRACYCLINE | غير مذكور | مرهم عيني؛ B/12 عبوة أحادية الجرعة | THEA | 8443091 | مستحضر عيني موضعي مركب، لا يطابق بطاقة dexamethasone الجهازية. |
| STOPALGIC CODEINE 300/25 | PARACETAMOL+CODEINE | 300 mg/25 mg | قرص؛ B/16 | LES LABORATOIRES MEDIS | 9233941 | تركيبة فموية مع codeine، لا تطابق paracetamol IV. |
| STOPALGIC CODEINE 600/50 | PARACETAMOL+CODEINE | 600 mg/50 mg | قرص؛ B/12 | LES LABORATOIRES MEDIS | 9233942 | تركيبة فموية مع codeine، لا تطابق paracetamol IV. |
| STOPALGIC EXTRA | PARACETAMOL+CAFEINE | 500 mg/65 mg | قرص؛ B/14 | LES LABORATOIRES MEDIS | 9233921 | تركيبة فموية مع caffeine، لا تطابق paracetamol IV. |
| SUPRADOL | PARACETAMOL+TRAMADOL | 37.5 mg/325 mg | كبسولة؛ B/16 | ADWYA | 9044001 | تركيبة فموية مع tramadol، لا تطابق paracetamol IV. |

- أضيفت مرشحات واختبارات بحث سلبية لـSTER-DEX وSTOPALGIC CODEINE وSTOPALGIC EXTRA وSUPRADOL. زادت الاستبعادات الموثقة 5 صفوف؛ أصبح الإجمالي **346 مطابقة و459 استبعاداً موثقاً**. المراجعة الكاملة ما زالت غير مكتملة.

## مراجعة المقاطع 303–311

- لم تظهر مطابقة جديدة في هذه المقاطع. عروض SUXAMETHONIUM AGUETTANT/VUAB/LABESFAL وTALIN الحقني وTAMIZOL وTALIN LP وTAZOREX/TAZOBACT/TAZOCILLINE كانت موثقة سابقاً؛ لم تُكرر. كما لم تُنشأ بطاقات جديدة لـlevofloxacine أوbenzathine benzylpenicilline أوteicoplanine.
- وُثقت 12 صفاً جديداً للاستبعاد: SYNALVIC (paracetamol+tramadol)، وSURANIL الفموي، وثلاثة عروض SYMBICORT المركبة، وسبعة عروض teicoplanine المتميزة عن vancomycin.

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| SYNALVIC | PARACETAMOL+TRAMADOL | 37.5 mg/325 mg | قرص ملبس؛ B/20 | LES LABORATOIRES MEDIS | 9233811 | تركيبة فموية مع tramadol، لا تطابق paracetamol IV. |
| SURANIL | HYDROCORTISONE | 10 mg | قرص مشقوق؛ B/60 | ACT PHARMA | 9363141 | شكل فموي، لا يطابق بطاقة hydrocortisone الحقنية. |
| SYMBICORT TURBUHALER | BUDESONIDE+FORMOTEROL | 100 µg/6 µg | مسحوق للاستنشاق الفموي؛ FL/120 جرعة | ASTRA ZENECA | 4833021 | تركيبة استنشاقية لا تحتوي salbutamol؛ لا تطابق بطاقة السالبوتامول. |
| SYMBICORT TURBUHALER | BUDESONIDE+FORMOTEROL | 200 µg/6 µg | مسحوق للاستنشاق الفموي؛ FL/120 جرعة | ASTRA ZENECA | 4833022 | تركيبة استنشاقية لا تحتوي salbutamol؛ لا تطابق بطاقة السالبوتامول. |
| SYMBICORT TURBUHALER | BUDESONIDE+FORMOTEROL | 400 µg/12 µg | مسحوق للاستنشاق الفموي؛ FL/60 جرعة | ASTRA ZENECA | 4833023 | تركيبة استنشاقية لا تحتوي salbutamol؛ لا تطابق بطاقة السالبوتامول. |
| TARGOPLANIN | TEICOPLANINE | 200 mg | مسحوق لتحضير مستحضر حقني؛ B/1 قارورة | HIKMA Pharmaceuticals | 6653621H | DCI مختلفة عن vancomycin؛ لا تُربط به لمجرد الانتماء إلى فئة glycopeptide. |
| TEICO | TEICOPLANINE | 200 mg | مسحوق لتحضير مستحضر حقني؛ B/10 قوارير | LES LABORATOIRES MEDIS | 9233613H | DCI مختلفة عن vancomycin؛ لا تُربط به لمجرد الانتماء إلى فئة glycopeptide. |
| TEICO | TEICOPLANINE | 400 mg | مسحوق لتحضير مستحضر حقني؛ B/10 قوارير | LES LABORATOIRES MEDIS | 9233614H | DCI مختلفة عن vancomycin؛ لا تُربط به لمجرد الانتماء إلى فئة glycopeptide. |
| TEICO | TEICOPLANINE | 200 mg | مسحوق لتحضير مستحضر حقني؛ B/1 قارورة + مذيب/3.2 mL | LES LABORATOIRES MEDIS | 9233611H | DCI مختلفة عن vancomycin؛ لا تُربط به لمجرد الانتماء إلى فئة glycopeptide. |
| TEICO | TEICOPLANINE | 400 mg | مسحوق لتحضير مستحضر حقني؛ B/1 قارورة + مذيب/3.2 mL | LES LABORATOIRES MEDIS | 9233612H | DCI مختلفة عن vancomycin؛ لا تُربط به لمجرد الانتماء إلى فئة glycopeptide. |
| TEGADIS | TEICOPLANINE | 50 mg | مسحوق لتحضير محلول للتسريب؛ B/1 قارورة | LES LABORATOIRES MEDIS | ST9234061H | DCI مختلفة عن vancomycin؛ لا تُربط به لمجرد الانتماء إلى فئة glycopeptide. |
| TEGADIS | TEICOPLANINE | 50 mg | مسحوق لتحضير محلول للتسريب؛ B/10 قوارير | LES LABORATOIRES MEDIS | ST9234062H | DCI مختلفة عن vancomycin؛ لا تُربط به لمجرد الانتماء إلى فئة glycopeptide. |

- أضيفت مرشحات واختبارات بحث سلبية لـSYNALVIC وSURANIL وSYMBICORT وTARGOPLANIN وTEICO وTEGADIS. زادت الاستبعادات الموثقة 12 صفاً؛ أصبح الإجمالي **346 مطابقة و471 استبعاداً موثقاً**. المراجعة الكاملة ما زالت غير مكتملة.

## مراجعة المقاطع 312–318

- لم تظهر مطابقة جديدة. TERGYNAN كانت موثقة سابقاً كتركيبة مهبلية؛ أُضيف مرشح واختبار بحث سلبي لها دون إعادة احتسابها.
- أُضيفت ستة صفوف استبعاد: TEMGESIC (buprenorphine)، وTITANOREINE LIDOCAINE الموضعي، وأربعة أشكال عينية مركبة من dexamethasone+tobramycin. لم تُربط هذه المنتجات ببطاقات morphine أو lidocaine المضادة لاضطراب النظم أو dexamethasone الجهازية.

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| TEMGESIC | BUPRENORPHINE | 0.300 mg | محلول للحقن؛ B/10 أمبولات/1 mL | SCHERING-PLOUGH SA | 6523041BH | مادة فعالة مختلفة عن morphine؛ لا تُربط ببطاقة morphine لمجرد أنهما أفيونان. |
| TITANOREINE LIDOCAINE | CARRAGHAHEEN+LIDOCAINE | غير مذكور | كريم شرجي موضعي؛ أنبوب/20 g | JHONSON & JHONSON SANTÉ BEAUTÉ FRANCE | 7493072 | مستحضر موضعي مركب، لا يطابق lidocaine الوريدي لاضطراب النظم. |
| TOBRACORT | DEXAMETHASONE+TOBRAMYCINE | غير مذكور | قطرة عينية؛ قارورة/5 mL | UNIMED | 9093721 | تركيبة عينية موضعية، لا تطابق dexamethasone الجهازية. |
| TOBRACORT 3M | DEXAMETHASONE+TOBRAMYCINE | غير مذكور | قطرة عينية؛ قارورة/5 mL | UNIMED | 9093722 | تركيبة عينية موضعية، لا تطابق dexamethasone الجهازية. |
| TOBRADEX | DEXAMETHASONE+TOBRAMYCINE | غير مذكور | مرهم عيني؛ أنبوب/3.5 g | NOVARTIS PHARMA SCHWEIZ AG | 10283381 | تركيبة عينية موضعية، لا تطابق dexamethasone الجهازية. |
| TOBRADEX | DEXAMETHASONE+TOBRAMYCINE | 100 mg/300 mg | قطرة عينية؛ قارورة/5 mL | NOVARTIS PHARMA SCHWEIZ AG | 10283382 | تركيبة عينية موضعية، لا تطابق dexamethasone الجهازية. |

- أضيفت مرشحات واختبارات بحث سلبية لـTEMGESIC وTITANOREINE LIDOCAINE وTOBRACORT وTOBRADEX، مع اختبار TERGYNAN. زادت الاستبعادات الموثقة 6 صفوف؛ أصبح الإجمالي **346 مطابقة و477 استبعاداً موثقاً**. المراجعة الكاملة ما زالت غير مكتملة.

## مراجعة المقاطع 319–321

- أُضيفت عشرة صفوف استبعاد مؤكدة: ثلاثة عروض من الإنسولين المماثل TRESIBA/TOUJEO لا تطابق بطاقة الإنسولين البشري السريع، وسبعة عروض ترامادول لا تطابق morphine. لا توجد مطابقة جديدة.

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| TRESIBA FLEXTOUCH | INSULINE DEGLUDEC | 100 U/mL | محلول للحقن؛ B/5 أقلام معبأة مسبقاً/3 mL | NOVO NORDISK A/S Bagsvaerd | 5993131 | إنسولين مماثل (degludec)، وليس الإنسولين البشري السريع. |
| TRESIBA FLEXTOUCH | INSULINE DEGLUDEC | 200 U/mL | محلول للحقن؛ B/3 أقلام معبأة مسبقاً/3 mL | NOVO NORDISK A/S Bagsvaerd | 5993132 | إنسولين مماثل (degludec)، وليس الإنسولين البشري السريع. |
| TOUJEO SOLOSTAR | INSULINE GLARGINE | 300 unités/mL | محلول للحقن؛ B/3 أقلام/1.5 mL | SANOFI-AVENTIS Deutschland GmbH | 1823041 | إنسولين قاعدي مماثل، وليس الإنسولين البشري السريع. |
| TRAMADIS | TRAMADOL | 100 mg/2 mL | محلول للحقن؛ B/5 أمبولات/2 mL | LES LABORATOIRES MEDIS | 9233281 | DCI مختلفة عن morphine؛ لا يُربط ببطاقته لمجرد أن كليهما مسكن أفيوني. |
| TRAMADIS | TRAMADOL | 50 mg | كبسولة؛ B/10 | LES LABORATOIRES MEDIS | 9233282 | DCI مختلفة عن morphine؛ لا يُربط ببطاقته لمجرد أن كليهما مسكن أفيوني. |
| TRAMAL | TRAMADOL | 100 mg | تحميلة؛ B/5 | TERIAK | ST9253304 | DCI مختلفة عن morphine؛ لا يُربط ببطاقته لمجرد أن كليهما مسكن أفيوني. |
| TRAMAL | TRAMADOL | 50 mg | كبسولة؛ B/10 | TERIAK | 9253301 | DCI مختلفة عن morphine؛ لا يُربط ببطاقته لمجرد أن كليهما مسكن أفيوني. |
| TRAMAL | TRAMADOL | 100 mg/mL | قطرات فموية؛ قارورة/10 mL | TERIAK | 9253302 | DCI مختلفة عن morphine؛ لا يُربط ببطاقته لمجرد أن كليهما مسكن أفيوني. |
| TRAMAL | TRAMADOL | 100 mg | محلول للحقن؛ B/5 أمبولات/2 mL | TERIAK | ST9253303 | DCI مختلفة عن morphine؛ لا يُربط ببطاقته لمجرد أن كليهما مسكن أفيوني. |
| TRAMAL RETARD | TRAMADOL | 100 mg | قرص ممتد التحرر؛ B/10 | TERIAK | 9253305 | DCI مختلفة عن morphine؛ لا يُربط ببطاقته لمجرد أن كليهما مسكن أفيوني. |

- أضيفت مرشحات واختبارات بحث سلبية لـTRESIBA FLEXTOUCH وTOUJEO SOLOSTAR وTRAMADIS وTRAMAL. زادت الاستبعادات الموثقة 10 صفوف؛ أصبح الإجمالي **346 مطابقة و487 استبعاداً موثقاً**. المراجعة الكاملة ما زالت غير مكتملة.

## مراجعة المقاطع 322–327

- لم تظهر مطابقة جديدة. TRIPYLORI وTROMBYL وTRIFED PLUS كانت موثقة سابقاً، كما أن UNIDEX وUNIGENTA الحقنيين وقطرة UNIGENTA العينية سبق تقييمها؛ لم تُكرر.
- أُضيفت ثمانية صفوف استبعاد: عرضان سنيان من UBISTESIN (articaine+adrenaline) من بطاقة adrenaline IV، وستة عروض UNICAINE من بطاقة lidocaine المضادة لاضطراب النظم. تسميات UNICAINE في DPM تصف مستحضرات تخدير موضعي/ناحي؛ أحد السطور يذكر حقناً وريدياً بطيئاً ضمن استخدام للألم، وهذا لا يثبت مطابقة استعمال اضطراب النظم.

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| UBISTESIN ADRENALINEE | ARTICAINE+ADRENALINE | 1/200 000 UI | محلول حقن في خرطوشة سنية؛ B/50 خرطوشة/1.7 mL | 3M Deutschland GmbH | 10183012 | مخدر سني موضعي مركب؛ لا يطابق adrenaline IV. |
| UBISTESIN ADRENALINEE | ARTICAINE+ADRENALINE | 1/100 000 UI | محلول حقن في خرطوشة سنية؛ B/50 خرطوشة/1.7 mL | 3M Deutschland GmbH | 10183011 | مخدر سني موضعي مركب؛ لا يطابق adrenaline IV. |
| UNICAINE | LIDOCAINE | 1% | محلول حقن للتخدير الموضعي/الناحي؛ B/50 قارورة/5 mL | UNIMED | 9093161H | لا يثبت استخداماً مضاداً لاضطراب النظم. |
| UNICAINE | LIDOCAINE | 1% | محلول حقن للتخدير الموضعي/الناحي؛ B/10 قوارير/5 mL | UNIMED | 9093161 | لا يثبت استخداماً مضاداً لاضطراب النظم. |
| UNICAINE | LIDOCAINE | 2% | محلول حقن للتخدير الموضعي/الناحي؛ B/10 قوارير/5 mL | UNIMED | 9093162 | لا يثبت استخداماً مضاداً لاضطراب النظم. |
| UNICAINE | LIDOCAINE | 2% | محلول حقن؛ B/50 قارورة/5 mL | UNIMED | 9093162H | رغم تصنيف DPM القلبي في السطر، يصف استعمال التخدير الموضعي/الناحي ولا يثبت استعمال اضطراب النظم. |
| UNICAINE 1% | LIDOCAINE | 1% | محلول حقن؛ B/50 قارورة/10 mL | UNIMED | 9093163H | يستخدم السطر التخدير الموضعي/الناحي؛ لا يثبت مطابقة البطاقة المضادة لاضطراب النظم. |
| UNICAINE 2% | LIDOCAINE | غير مذكور في خانة العيار | محلول حقن؛ B/50 قارورة/10 mL | UNIMED | 9093164H | يذكر السطر حقناً وريدياً بطيئاً في سياق متلازمات ألمية، لا استعمال اضطراب النظم؛ لم يُربط ببطاقة antiarrhythmic. |

- أضيفت مرشحات واختبارات بحث سلبية لـUBISTESIN وUNICAINE. زادت الاستبعادات الموثقة 8 صفوف؛ أصبح الإجمالي **346 مطابقة و495 استبعاداً موثقاً**. المراجعة الكاملة ما زالت غير مكتملة.

## مراجعة المقاطع 328–331

- استُبعدت عشرة صفوف vancomycin من الربط ببطاقة التسريب الوريدي: DPM يصفها كمساحيق لتحضير مستحضر حقني، لكنه لا يذكر طريق IV أو التسريب صراحةً في السطر؛ لذلك لم أفترض الطريق ولم أضف العلامات إلى `brands`. لا توجد مطابقة جديدة.
- سطور VAAMOX السبعة وVAGILEN والعروض الأخرى ذات الصلة كانت موثقة سابقاً ولم تُكرر.

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| VANCO | VANCOMYCINE | 1 g | مسحوق لتحضير مستحضر حقني؛ B/1 قارورة | LES LABORATOIRES MEDIS | 9233223H | السجل لا يحدد IV/perfusion صراحةً؛ لا يُربط ببطاقة vancomycine IV. |
| VANCO 500 | VANCOMYCINE | 500 mg | مسحوق لتحضير مستحضر حقني؛ B/10 قوارير | LES LABORATOIRES MEDIS | 9233222H | السجل لا يحدد IV/perfusion صراحةً؛ لا يُربط ببطاقة vancomycine IV. |
| VANCO 500 | VANCOMYCINE | 500 mg | مسحوق لتحضير مستحضر حقني؛ B/1 قارورة | LES LABORATOIRES MEDIS | 9233221H | السجل لا يحدد IV/perfusion صراحةً؛ لا يُربط ببطاقة vancomycine IV. |
| VANCOLON | VANCOMYCINE | 500 mg | مسحوق لتحضير مستحضر حقني؛ B/1 قارورة دون مذيب | JULPHAR | 7473181H | السجل لا يحدد IV/perfusion صراحةً؛ لا يُربط ببطاقة vancomycine IV. |
| VANCOMED 500 | VANCOMYCINE | 500 mg | مسحوق لتحضير مستحضر حقني؛ B/1 قارورة | UNIMED | ST9093941H | السجل لا يحدد IV/perfusion صراحةً؛ لا يُربط ببطاقة vancomycine IV. |
| VANCOMYCIN HIKMA | VANCOMYCINE | 1000 mg | مسحوق لتحضير مستحضر حقني؛ B/1 قارورة | HIKMA Pharmaceuticals | 6653532H | السجل لا يحدد IV/perfusion صراحةً؛ لا يُربط ببطاقة vancomycine IV. |
| VANCOMYCINE HIKMA 500 | VANCOMYCINE | 500 mg | مسحوق لتحضير مستحضر حقني؛ B/1 قارورة | HIKMA Pharmaceuticals | 6653531H | السجل لا يحدد IV/perfusion صراحةً؛ لا يُربط ببطاقة vancomycine IV. |
| VANCOMYCINE KABI | VANCOMYCINE | 500 mg | مسحوق لتحضير مستحضر حقني؛ B/1 قارورة | FRESENIUS KABI FRANCE | 3153121H | السجل لا يحدد IV/perfusion صراحةً؛ لا يُربط ببطاقة vancomycine IV. |
| VANCOMYCINE KABI | VANCOMYCINE | 1 g | مسحوق لتحضير مستحضر حقني؛ B/1 قارورة | FRESENIUS KABI FRANCE | 3153122H | السجل لا يحدد IV/perfusion صراحةً؛ لا يُربط ببطاقة vancomycine IV. |
| VANCOMYCINE MYLAN | VANCOMYCINE | 500 mg | مسحوق لتحضير مستحضر حقني؛ B/1 قارورة | MYLAN S.A.S | 4923251H | السجل لا يحدد IV/perfusion صراحةً؛ لا يُربط ببطاقة vancomycine IV. |

- أضيفت مرشحات واختبارات بحث سلبية لعلامات VANCO وVANCOLON وVANCOMED وVANCOMYCIN HIKMA/KABI/MYLAN. زادت الاستبعادات الموثقة 10 صفوف؛ أصبح الإجمالي **346 مطابقة و505 استبعادات موثقة**. المراجعة الكاملة ما زالت غير مكتملة.

## مراجعة المقاطع 332–341

- أضيف استبعاد عرضين فمويين من paracetamol تحت WINDOL (AMM 9253532 و9253533)، واستبعاد VOLUVEN من بطاقة NaCl 3% لأن سجل DPM يصفه كمزيج hydroxyethylamidone+chlorure de sodium للتسريب، لا كمحلول NaCl مفرد بتركيز 3%. أضيفت اختبارات بحث سلبية ومرشحات لهذه الأسماء.
- لم تُكرر VIGASPIR، وVETIRA، وVENTOL، وVENTAXX، وVITAMINE B1، وVAAMOX، وVAGILEN، وغيرها من السجلات التي وثقت سابقاً. لم تظهر مطابقة جديدة.

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب الاستبعاد |
|---|---|---|---|---|---|---|
| WINDOL | PARACETAMOL | 1 g | قرص مغلف مشقوق؛ B/8 | TERIAK | 9253532 | شكل فموي؛ لا يطابق بطاقة paracetamol IV. |
| WINDOL | PARACETAMOL | 500 mg | قرص مغلف مشقوق؛ B/16 | TERIAK | 9253533 | شكل فموي؛ لا يطابق بطاقة paracetamol IV. |
| VOLUVEN | HYDROXYETHYLAMIDON+CHLORURE DE SODIUM | غير محدد | محلول حقني للتسريب؛ كيس/500 mL | FRESENIUS KABI FRANCE | 3153041H | محلول غرواني مركب؛ ليس NaCl مفرداً 3%. |

- زادت الاستبعادات الموثقة 3 صفوف؛ أصبح الإجمالي **346 مطابقة و508 استبعادات موثقة**، منها **122** عرضاً فموياً/مركباً من paracetamol. المراجعة الكاملة ما زالت غير مكتملة.

## فحص المقاطع 342–352

- لم تظهر مطابقة جديدة. XABAN/XARELTO (rivaroxaban) وXOLAIR وZIFUR/ZINFORO وZYVOXID لا تطابق بطاقات أخرى بالملفات الحالية؛ ولا توجد بطاقة cefuroxime أو linezolid ضمن الـ73. سطور ZOLAM وZEMITRON وZITROCIN وZOMAX موثقة مسبقاً، كما أن أشكال XYLOCAINE/XYLOGEL الموضعية من المقطع 344 مسجلة كاستبعادات.
- لا يُعاد احتساب أي صف؛ الإجمالي ما زال **346 مطابقة و508 استبعادات موثقة**، ومنها **122** عرضاً فموياً/مركباً من paracetamol. هذا الفحص لا يجعل مراجعة الـ73 شاملة.

## استكمال مطابقة المرشحات في المقاطع 113–140

- لم يظهر في هذا النطاق اسم جديد يجوز إضافته إلى `brands` لبطاقات الأدوية الـ73 بعد تطبيق معيار تطابق المادة والتركيز والشكل والطريق؛ لذلك بقيت المطابقات **346**. أُضيفت **27 صف استبعاد موثقاً** إلى التقرير، فأصبح الإجمالي **535 استبعاداً** (أرقام صفوف لا علامات فريدة):
  - `BICLAVOR` الفموي (AMM `9164191`) و`CLAVEPEN` الحقني (أربعة عروض، AMM `4333071`–`4333074`) و`CLAVOR` الفموي (سبعة عروض، AMM `9163462`–`9163468`): كلها amoxicilline+acide clavulanique، فلا تطابق بطاقة amoxicilline المفردة.
  - `BI-AMDOL` (AMM `9013841`) هو paracétamol+tramadol في كبسولة، لا paracétamol IV.
  - سجلا `COMBIFOR` (budesonide+formoterol؛ AMM `9254081` و`9254082`)، وثلاثة سجلات `CYVAX` وثلاثة `FOSTER` هي مستحضرات استنشاق مركبة، وليست salbutamol مفرداً للنيبولايزر.
  - ثلاث لصقات `DUROGESIC` للفنتانيل عبر الجلد لا تطابق بطاقة fentanyl IV؛ كما لا يُربط fentanyl الحقني بالـIV إذا لم يذكر سجل DPM الطريق صراحة.
  - سجلا `DILUANT PHYSIOLOGIQUE PHÉNOLÉ` (كلوريد صوديوم مع phenol؛ AMM `3653021` و`3653022`) لا يثبتان تركيز NaCl 3%، لذلك لا يطابقان البطاقة hypertonique.
  - `BICARBONATE MONOSODIQUE` بتركيز 1.4% في 500 mL (AMM `9003721`) لا يطابق بطاقة 8.4%/4.2%.
- راجعنا أيضاً سجل dopamine: لا يصرح بسياق الطريق الوريدي المطلوب، ولا توجد بطاقة dopamine بين الـ73؛ لم نربطه بأي بطاقة أخرى ولم نحتسبه استبعاداً من دواء آخر.
- ضُبطت مرشحات البحث واختباراتها للأسماء المركبة والفموية واللصقات والمخفف؛ لم يُمسّ سجل التخزين السابق أو بيانات سريرية.
- هذا استكمال لهذه المرشحات فقط، وليس إعلاناً عن اكتمال المرور على جميع مقاطع DPM أو البطاقات الـ73.


## نقاط بقيت مفتوحة في المراجعة

- لم تُفحص جميع المقاطع الـ352؛ لا يزال استكمال المرور على الأدوية الـ73 ضرورياً قبل وصف مرحلة C بأنها مكتملة.
- سُجل `NEXUS` esomeprazole 40 mg للحقن (AMM `6653641`) و`RUGDAL` esomeprazole فموياً (AMM `9223371` و`9223373`–`9223378`) وسجلات pregabalin مثل `NERGESIC` و`NERVICA` و`NEUROMED` و`NEURYL`، وفي المقاطع المفحوصة أيضاً `PREGAB` (AMM `9073591`–`9073595`) و`PRERICA` (AMM `9343131`–`9343136`). لا توجد بطاقة esomeprazole أو pregabalin ضمن قائمة التطبيق الحالية؛ لذلك لم تُربط هذه العلامات بدواء آخر ولم تُنشأ بطاقات جديدة ضمن تدقيق العلامات هذا.
- الجدول لا يعيد توثيق كل علامة كانت موجودة مسبقاً في حقول `brands`؛ أي اسم غير وارد في الجدول لا يُعدّ مثبتاً أو منفيّاً بواسطة هذه الجولة.
- `LEVET` الذي ظهر في سجل DPM فموي فقط (محلول وأقراص). تبقى `Keppra®` مع `levetiracetam` وفق قرار المستخدم، لكن لا يُستنتج وجود مستحضر وريدي من صفوف LEVET ولا تُنسب مطابقة AMM لـKeppra اعتماداً على ترتيب السجلات.
- تم حذف قوة `Lasilix® 20 mg/2 mL IV` من نص العلامات حتى تُثبت بسطر مطابق؛ صفوف LASILIX المنقولة هنا تثبت أقراص 40 mg وRetard 60 mg وSpecial. لا يعني ذلك إثبات غياب أي عرض آخر من كامل سجل DPM.
- سجل `INTRALIPIDE` المنقول في المقطعين 171–172 يثبت 20% في كيس 500 mL فقط؛ حُذفت الإشارة إلى 100/250 mL من حقل العلامات إلى أن يظهر سطر مطابق. هذا لا يثبت غياب أحجام أخرى من كامل سجل DPM.

## تصحيحات وتحديدات تمنع الخلط

- **CIFLOXET 200**: يبقى الصفان `9313021H` و`9313022H` ضمن المطابقات المؤكدة لبطاقة ciprofloxacine؛ فرغم أن خانة الشكل تقول «Solution injectable»، فإن خانة الاستطباب تصفهما صراحةً بأنهما «solution pour perfusion (IV)»، مع تطابق المادة والتركيز والشكل. لا يتغير العدد الإجمالي بسبب هذا التحقق.
- `NATISPRAY` في السجل الحالي هو **0.3 mg/جرعة**، لا 0.15 mg/جرعة؛ وصف DPM هو رش فموي ولا يحدد بوضوح أن الاستخدام تحت اللسان، لذا لا يُثبت الطريق الذي تتطلبه البطاقة. صفوف XYLOCAINE التي نُقلت في المقطع 344 جل إحليلي/فموي، لا أمبولات حقن؛ لا تُربط بها جرعة الليدوكائين الوريدية. وتُستبعد التركيبات المحتوية على أدرينالين أو prilocaine والمستحضرات الموضعية من مطابقة اللِّيدوكائين المفرد.
- سجل `GARDENAL` الذي ظهر هو **40 mg مسحوقاً للحقن مع مذيب 2 mL**؛ لا يذكر طريق IV صراحة، لذا لا يطابق بطاقة phenobarbital الوريدية. لم يثبت عرض 200 mg/2 mL؛ وسُجلت الأقراص 10 و100 mg وPHENOBARBITAL 50 كأشكال فموية مستبعدة من البطاقة الوريدية.
- `ATROPINE SAIPH` الظاهر في القائمة 0.25 mg/mL؛ لا تُنقل إليه قوة 1 mg/mL أو 0.5 mg/mL لمجرد وجودها في مراجع أخرى. سجل `ATROPINUM SULFURICUM` بقوة 1 mg/mL يتبع SOPHARMA وله AMM مستقل؛ لا تخلط العبوتين.
- `ASPEGIC` له في سجل DPM الحالي عروض حقن 500 mg و1 g؛ AMM `26883012` يخص مسحوق 1 g للحقن مع مذيب/5 mL. لا تخلط ذلك مع `ASPEGIC ADULTES` 1 g الفموي، ولا مع `ASPIRINE SIPHAT` ذي DCI مختلف. وعيارات `ASPEGIC` و`KARDEGIC` المذكورة تخص ملح lysine كما هو مدون في DPM؛ لا تُحوّل إلى مكافئ حمض أسيتيل الساليسيليك أو جرعة اعتماداً على الاسم وحده.
- `AEROL` هو بخاخ 100 µg/جرعة، عبوة 200 جرعة؛ لا يثبت أنه محلول تبخير.
- الأشكال التي ظهرت لـ`LEVET` فموية (محلول وأقراص)؛ لا يُستنتج منها وجود مستحضر وريدي. كما أن صفوف `KARDEGIC` المنقولة هنا 160 mg فموية؛ لا يُستبدل بها شكل آخر دون صف مطابق.
- غلوكوز 30% له في المقتطف ثلاثة عروض DPM: قوارير/أكياس تسريب 500 mL (SIPHAT وINFOMED) وأمبولات 10 mL (PROAMP/Aguettant). عُرضت العبوات منفصلة في `brands`؛ لا تُعامل أكياس 500 mL كأنها أمبولات.
- سجل البيكربونات الذي ظهر سابقاً هو BICARBONATE MONOSODIQUE 1.4%/500 mL، AMM 9003721؛ لا يطابق وحده 8.4% أو 4.2% في بطاقة التطبيق. لم يُضف هذا الاسم إلى `brands` ولم يُستنتج غياب تسجيل تراكيز أخرى.
- لم تُستخدم المطابقة السابقة المبنية على ترتيب العناصر: `Keppra®` يبقى مع `levetiracetam`، وغياب علامة ظاهرة في عينة `amikacine` لا يثبت عدم تسجيل علامة لها.

## دفعة استكمال فجوات المقاطع 38–112 — 2026-10-27

جرت مراجعة المقاطع المختارة 38–64 و91–96 و104–112 من قائمة DPM الحالية. هذه مراجعة موجّهة للأسماء المحتمل اتصالها بالسجلات الـ73، وليست مروراً شاملاً على كل سطر في تلك الصفحات أو على القائمة كلها.

- **38–44:** لم تظهر مطابقة جديدة تستدعي تعديل `brands` أو الأعداد. `BACTALL` (ciprofloxacine، أقراص 500 mg، AMM `ST9163682` و`9163683H`) مسجل مسبقاً كعرض فموي، وهو مناسب للجزء الفموي من بطاقة ciprofloxacine ولا يُعامل بديلاً عن شكل IV. ظهرت أيضاً سجلات `BICARBONATE MONOSODIQUE` 1.4%، و`BICLAVOR`، و`BI-AMDOL`، و`BI-SPIRAZOL`/`BI-SPIROGYL`، و`BETANYL` و`AZYTER`، وجميعها موثقة مسبقاً في المطابقات أو الاستبعادات المناسبة؛ لم يُضف صف استبعاد مكرر ولم تتغير الأعداد.
- **45–59:** عُثر على BRICANYL وTALIN الحقنيين اللذين سبق توثيقهما ضمن بطاقة terbutaline؛ لا تُضاف مطابقة جديدة. بقيت الأشكال الاستنشاقية/الفموية غير المطابقة، مثل BRICANYL TURBUHALER وBETANYL وCAFENOL، مستبعدة كما هو موثق أعلاه.
- **60–64:** عروض CETAMOL فموية وCETRADOL مركب لا تطابق paracetamol الوريدي. عروض NaCl بتركيز 0.9% أو 10% لا تطابق بطاقة NaCl 3%، كما أن calcium chloride ليس gluconate de calcium. الاستبعادات ذات الصلة موثقة سابقاً؛ لا إضافة جديدة إلى `brands`.
- **91–96:** DAFALGAN هنا شكل فموي، فلا يطابق بطاقة paracetamol الوريدي. وأُعيد تدقيق سجلي clindamycine الحقنيين الموثقين سابقاً: DALACINE (600 mg/4 mL، AMM `6533061H`) وCLINDAMYCINE KABI (600 mg/4 mL، AMM `3153131H`) لا يذكر سطر DPM المنقول لأيٍّ منهما طريق الإعطاء. لذلك أُزيلا من المطابقات المؤكدة ومن `brands` في بطاقة clindamycine IV، ووُثّقا كاستبعادين؛ لا يُستنتج IV من عبارة «solution injectable». أما DALACINE T TOPIC فاستبعاده الموضعي قائم بصورة مستقلة.
- **104–112:** DOBUTAMINE HIKMA (AMM `6653711H`) وDOBUTAMINE VIATRIS (AMM `4923151H`) موثقتان سابقاً، والسجل/العبوة يحددان التسريب؛ لا جديد. بقي DOBUJECT مستبعداً لأن سجلّه لا يحدد طريقاً أو تسريباً. DOCAINE مستبعد سابقاً من بطاقة lidocaine المضادة لاضطراب النظم لأنه مخدر موضعي/ناحي. لم تُنشأ بطاقات جديدة لـDOPAMINE أو DOPERAN لعدم وجود سجل دوائي مقابل ضمن البطاقات الحالية؛ واسم DOPAMINE لا يُعامل على أنه DOBUTAMINE.

أضيف اختبارا بحث سلبيان لـDALACINE وCLINDAMYCINE KABI كي لا تظهر سجلاتهما غير المحددة الطريق كعلامات مؤكدة لبطاقة IV. صُحح التصنيف التراكمي بعد نقل الصفين من «مطابق» إلى «استبعاد»: **344 مطابقة مؤكدة و537 استبعاداً موثقاً**. لا تزال المراجعة جزئية، ولا يدل AMM على التوفر في الصيدليات.

| الاسم في DPM | DCI | العيار | الشكل والعبوة | المختبر | AMM | سبب عدم الربط ببطاقة IV |
|---|---|---|---|---|---|---|
| DALACINE | CLINDAMYCINE | 600 mg/4 mL | محلول للحقن؛ B/1 أمبولة/4 mL | PFIZER HOLDING FRANCE | 6533061H | السجل يذكر الحقن ولا يحدد طريق الإعطاء؛ لا يُفترض IV. |
| CLINDAMYCINE KABI | CLINDAMYCINE | 600 mg/4 mL | محلول للحقن؛ B/5 أمبولات/4 mL | FRESENIUS KABI FRANCE | 3153131H | السجل يذكر الحقن ولا يحدد طريق الإعطاء؛ لا يُفترض IV. |

## دفعة فحص موجّهة للمقاطع 65–90 و97–103 — 2026-10-27

- استُخدمت قائمة DPM الرسمية الحالية، والموقع يذكر أن تاريخ تحديث قائمة AMM هو 07/10/2026. شملت هذه الدفعة المقاطع المختارة 65–90 و97–103؛ وهي مراجعة موجّهة وليست فحصاً شاملاً لكل سطر.
- **مسارات gentamicine ما زالت غير محسومة من النص الظاهر:** سجل `CIDOMYCINE 20` (AMM `9163491`) يثبت الاسم والمادة `GENTAMICINE` والعيار `20 mg/2 mL` والشكل «solution injectable»، لكن معاينة الصف تقطع خلية الاستطباب قبل نهايتها. تسجل قائمة DPM أيضاً `GENTA 80` بالعبوات B/50 وB/5 وB/1 وأرقام AMM `9233052H` و`9233051` و`9233054`، و`GENTAINJECT 80` بالعبوتين B/100 وB/5 وأرقام `9443054H` و`9443053`. أما `UNIGENTA` فيظهر لها AMM `9093531`–`9093535` للعيارات 10/20/40/80/160 mg؛ وهناك عرض إضافي 160 mg B/1 برقم `9093536` غير مدرج حالياً في حقل العلامات. خلايا الاستطباب المعروضة لـGENTA وGENTAINJECT وUNIGENTA تقطع قبل أن تحسم عبارة الطريق. هذه الأرقام تثبت بيانات التسجيل/العبوة الظاهرة، لكنها لا تكفي وحدها لإثبات IV ولا لإثبات غيابه من بقية النص. لذلك صُنّفت العلاقات الـ11 على أنها غير محسومة، لا مطابقة ولا استبعاداً طبياً؛ يلزم نص كامل قابل للقراءة قبل القرار النهائي. في متابعة 2026-10-27 أُزيلت مؤقتاً من `brands` ومرادفات البحث حتى لا تُقدّم للمستخدم كعلامات IV قبل ثبوت الطريق؛ التفاصيل في القسم اللاحق.
- **تحقق موازٍ من منشورات DPM الأقدم (للسياق فقط، لا لإثبات AMM نافذ أو الطريق):** محضر CTSP بتاريخ 03/01/2020 يضع GENTA وCIDOMYCINE ضمن «dossiers d’AMM à étudier»، ويصفها بأنها محاليل للحقن؛ ومحضر 12/07/2022 يدرج GENTAINJECT 80 ضمن المنتجات «à évaluer pour la première fois». هذه جداول ملفات قيد الدراسة وليست قائمة AMM النافذة المنشورة بتاريخ 07/10/2026، ولا يذكر أيٌّ منها طريق IV؛ لذلك لم تُستخدم لإعادة العلامات أو لتغيير الأعداد. أُجري أيضاً بحث متوازٍ بالعلامات وأرقام AMM المتاحة عن نص DPM يصرّح بـIV؛ لم يظهر نص حالي يحسم الطريق، وظهرت أساساً جداول CTSP المذكورة أعلاه. عدم ظهور نتيجة بحث لا يثبت غياب الطريق أو التسجيل. روابط المصدرين: [محضر DPM 03/01/2020](https://dpm.tn/28-banner/257-comite-technique-des-specialites-pharmaceutiques-du-03-janvier-2020) و[محضر DPM 12/07/2022](https://dpm.tn/dpm-role-et-mission/28-banner/358-comite-technique-des-specialites-pharmaceutiques-du-12-juillet-2022).
- ظهرت في هذه المقاطع سجلات `GENTA` بعيارات أخرى و`GENTAINJECT` بعيارات أخرى؛ لم تُضف إلى `brands`، إذ لا يكفي شكل «solution injectable» وحده لإثبات طريق IV. ولم تُحتسب استبعادات جديدة قبل حسم ما يقوله سجل DPM الكامل عن الطريق.
- **ملاحظات أخرى في النطاق:** سجل `CHLORURE DE SODIUM PROAMP` 20% (AMM `7093213H`) موجود مسبقاً في بطاقة NaCl hypertonique وفي جدول المطابقات. سجل `CUREX 10` (cisatracurium) يذكر صراحة «administration intraveineuse»، لكن لا توجد بطاقة cisatracurium ضمن السجلات الـ73، فلم يُنشأ سجل جديد ضمن تدقيق العلامات المختارة. سجل `DIAZEPAM APM 10 MG/2 ML IM/IV` (AMM `5063172H` و`5063173`) يثبت الطريقين في الاسم وهو موثق مسبقاً. كما ظهرت سجلات dexamethasone مثل `DEXAMEDIS FORT` و`DEXONE`؛ لم تحسم المعاينة الأولى الطريق. أُعيد فحص الأسطر المتاحة لاحقاً ونُقلت عروض الحقن غير المثبتة للطريق IV من المطابقات إلى الاستبعادات في القسم اللاحق، مع إبقاء قيد اقتطاع السجل موضحاً.
- عند توثيق هذه الدفعة كان التصنيف التاريخي **344 مطابقة و537 استبعاداً**؛ وقد صُحح لاحقاً في أقسام المتابعة أدناه بعد التدقيق الإضافي. لم تُشغّل الاختبارات في تلك الدفعة لعدم وجود تعديل شيفرة آنذاك.

## مراجعة dexamethasone وإزالة المطابقات غير المثبتة — 2026-10-27

في قائمة DPM الحالية، سجلات `DEXAMETHASONE MEDIS` و`DEXAMEDIS FORT` تصف الاستعمال بأنه corticothérapie générale، وسجلات `DEXONE` و`UNIDEX`/`UNIDEX FORT` تذكر طريقاً parentérale أو عاماً، لكنها لا تنص صراحة على IV في النص المعروض. ولأن بطاقة التطبيق هنا وريدية، لا يكفي وصف «solution injectable» أو «voie parentérale» لإثبات طريق IV. أُزيلت هذه العلامات من `brands` ومن مرادفات البحث، وأضيفت كاستبعادات بحث؛ بقيت بطاقة dexamethasone العامة قابلة للبحث باسم المادة. لم يُعتمد `Dectancyl` أو `Soludécadron` لعدم وجود سطر AMM مطابق موثق ضمن المراجعة الحالية؛ عدم العثور عليهما هنا لا يثبت غياب تسجيلهما.

نُقلت الصفوف الـ13 التالية من المطابقات إلى الاستبعادات. جميعها من قائمة DPM الحالية، وتثبت المادة والتركيز والشكل الحقني، لكن السطر لا يثبت IV صراحة:

| العلامة | DCI | العيار والشكل | العبوة | AMM DPM | سبب الاستبعاد |
|---|---|---|---|---|---|
| DEXAMETHASONE MEDIS | DEXAMETHASONE | 4 mg، محلول للحقن | B/50/1 mL | 9233132H | استعمال عام؛ لا يذكر IV صراحة. |
| DEXAMEDIS FORT | DEXAMETHASONE | 8 mg/2 mL، محلول للحقن | B/1/2 mL | 9233133 | استعمال عام/سريع؛ لا يذكر IV صراحة. |
| DEXONE 4 | DEXAMETHASONE | 4 mg، محلول للحقن | B/50/1 mL | 9313031H | يذكر الحاجة إلى طريق parentéral عند تعذر الفموي؛ لا يحدد IV. |
| DEXONE 4 | DEXAMETHASONE | 4 mg، محلول للحقن | B/1/1 mL | 9313035 | يذكر الحاجة إلى طريق parentéral عند تعذر الفموي؛ لا يحدد IV. |
| DEXONE 4 | DEXAMETHASONE | 4 mg، محلول للحقن | B/5/1 mL | 9313034 | يذكر الحاجة إلى طريق parentéral عند تعذر الفموي؛ لا يحدد IV. |
| DEXONE 4 | DEXAMETHASONE | 4 mg/mL، محلول للحقن | B/10/1 mL | 9313036 | corticothérapie عامة؛ لا يذكر IV صراحة. |
| DEXONE 8 | DEXAMETHASONE | 8 mg، محلول للحقن | B/50/2 mL | 9313032H | يذكر الحاجة إلى طريق parentéral عند تعذر الفموي؛ لا يحدد IV. |
| DEXONE 8 | DEXAMETHASONE | 8 mg، محلول للحقن | B/1/2 mL | 9313033 | يذكر الحاجة إلى طريق parentéral عند تعذر الفموي؛ لا يحدد IV. |
| DEXONE 8 | DEXAMETHASONE | 8 mg/2 mL، محلول للحقن | B/10/2 mL | 9313037 | corticothérapie عامة؛ لا يذكر IV صراحة. |
| UNIDEX | DEXAMETHASONE | 4 mg/mL، محلول للحقن | B/50/1 mL | 9093191H | يذكر «voie parentérale» دون تحديد IV. |
| UNIDEX | DEXAMETHASONE | 4 mg/mL، محلول للحقن | B/5/1 mL | 9093194 | يذكر «voie parentérale» دون تحديد IV. |
| UNIDEX FORT | DEXAMETHASONE | 8 mg/2 mL، محلول للحقن | B/1/2 mL | 9093192 | يذكر «voie parentérale» دون تحديد IV. |
| UNIDEX FORT | DEXAMETHASONE | 8 mg/2 mL، محلول للحقن | B/10/2 mL | 9093193 | يذكر «voie parentérale» دون تحديد IV. |

أُضيفت اختبارات بحث سلبية لهذه الأسماء، وحُذفت حالة البحث الإيجابية لـ`unidex fort`. عند هذه المرحلة التاريخية انخفضت المطابقات **13 صفاً** وارتفعت الاستبعادات **13 صفاً**؛ كان الجدول يضم **331 صفاً مدرجاً** منها 11 gentamicine غير محسومة، مقابل **550 استبعاداً**. في القسم اللاحق عُلّقت روابط gentamicine وأُخرجت من عدد المطابقات؛ الحصيلة الحالية موضحة في صدر التقرير.

## تعليق روابط gentamicine غير المثبتة حتى اكتمال النص — 2026-10-27

بما أن قائمة DPM التي أمكن جلبها تثبت الاسم والمادة والعيار والشكل «solution injectable»، بينما تقطع المعاينة خلية الاستطباب قبل أن تحسم الطريق، لم يعد من المناسب إبقاء هذه الأسماء مرتبطة ببطاقة IV. أُفرغ حقل `brands` لبطاقة gentamicine وأزيلت أسماء المنتجات من `synonyms`، وأضيفت أسماء العلامات إلى `searchExclusions`؛ يبقى البحث بالمادة العامة «gentamicine» متاحاً. هذا **تعليق مؤقت للرابط** لا استنتاج بأن المستحضرات غير وريدية ولا استبعاد طبي نهائي؛ إذا أظهر نص DPM الكامل IV يمكن إعادة التقييم. أُزيلت `Gentalline` كذلك من الربط كاسم غير متحقق في القائمة الحالية، من دون احتسابها ضمن صفوف المطابقات/الاستبعادات.

الأسطر الـ11 التي كانت مدرجة سابقاً في جدول المطابقات تُحفظ هنا كسجلات معلّقة، لا تدخل في أي من العدّين الحاليين:

| العلامة | DCI | العيار والشكل | العبوة | AMM DPM | حالة الطريق |
|---|---|---|---|---|---|
| GENTA 80 | GENTAMICINE | 80 mg/2 mL، محلول للحقن | B/50 أمبولة/2 mL | 9233052H | خلية الاستطباب المجلوبة مقطوعة قبل حسم الطريق. |
| GENTA 80 | GENTAMICINE | 80 mg/2 mL، محلول للحقن | B/5 أمبولات/2 mL | 9233051 | خلية الاستطباب المجلوبة مقطوعة قبل حسم الطريق. |
| GENTA 80 | GENTAMICINE | 80 mg/2 mL، محلول للحقن | B/1 أمبولة/2 mL | 9233054 | خلية الاستطباب المجلوبة مقطوعة قبل حسم الطريق. |
| GENTAINJECT 80 | GENTAMICINE | 80 mg/2 mL، محلول للحقن | B/100 أمبولة/2 mL | 9443054H | خلية الاستطباب المجلوبة مقطوعة قبل حسم الطريق. |
| GENTAINJECT 80 | GENTAMICINE | 80 mg/2 mL، محلول للحقن | B/5 أمبولات/2 mL | 9443053 | خلية الاستطباب المجلوبة مقطوعة قبل حسم الطريق. |
| UNIGENTA 10 | GENTAMICINE | 10 mg/1 mL، محلول للحقن | B/2 أمبولات/1 mL | 9093531 | خلية الاستطباب المجلوبة مقطوعة قبل حسم الطريق. |
| UNIGENTA 20 | GENTAMICINE | 20 mg/2 mL، محلول للحقن | B/2 أمبولات/2 mL | 9093532 | خلية الاستطباب المجلوبة مقطوعة قبل حسم الطريق. |
| UNIGENTA 40 | GENTAMICINE | 40 mg/2 mL، محلول للحقن | B/2 أمبولات/2 mL | 9093533 | خلية الاستطباب المجلوبة مقطوعة قبل حسم الطريق. |
| UNIGENTA 80 | GENTAMICINE | 80 mg/2 mL، محلول للحقن | B/2 أمبولات/2 mL | 9093534 | خلية الاستطباب المجلوبة مقطوعة قبل حسم الطريق. |
| UNIGENTA 160 | GENTAMICINE | 160 mg/2 mL، محلول للحقن | B/2 أمبولات/2 mL | 9093535 | خلية الاستطباب المجلوبة مقطوعة قبل حسم الطريق. |
| CIDOMYCINE 20 | GENTAMICINE | 20 mg/2 mL، محلول للحقن | B/5 أمبولات/2 mL | 9163491 | خلية الاستطباب المجلوبة مقطوعة قبل حسم الطريق. |

سُجل في القائمة أيضاً UNIGENTA 160 mg B/1 برقم AMM `9093536`، لكنه لم يكن من العلاقات الـ11 المدرجة ولم يُضف. عند نهاية خطوة تعليق gentamicine كان العدد التاريخي 320 مطابقة و550 استبعاداً؛ وبعد استبعاد ACTRAPID لعدم ثبوت IV في سطر DPM أصبح العدد الحالي **319 مطابقة مؤكدة و551 استبعاداً موثقاً**. وتُذكر العلاقات الـ11 المعلقة منفصلة ولا تُحسب كاستبعادات. أضيفت اختبارات بحث سلبية لعلامات gentamicine وACTRAPID، مع إبقاء البحث بالمادة العامة متاحاً.

## مراجعة المقاطع 6–8 — 2026-10-27

أُعيد فحص المقاطع 6–8 من قائمة AMM الحالية. لم تُضف هذه الجولة علامة جديدة ولم تغيّر الأعداد، لأن السجلات ذات الصلة كانت موثقة مسبقاً:

- `AEROL` (AMM `9283011`): السجل يثبت salbutamol بتركيز 100 µg/جرعة على هيئة بخاخ مضغوط/200 جرعة. يبقى الاسم في نص بطاقة salbutamol بوصفه بخاخاً، لا محلولاً للنيبولايزر.
- `AFTAGEL` (AMM `7623081`): السجل يصف lidocaine مع sulfate de zinc في جل فموي؛ يبقى مستبعداً من بطاقة lidocaine الوريدي.
- سجلا `ADRENALINE MEDIS sans conservateur` (AMM `9233901H` و`9233902H`) يثبتان التركيزين 1 mg/1 mL و5 mg/5 mL والشكل الحقني، مع استطبابات التوقف القلبي والصدمة التأقية/الدورانية. بياناتهما كانت موثقة في جدول المطابقات؛ لم تُستنتج من هذا الفحص طريقة إعطاء إضافية غير ظاهرة في السطر.

الحصيلة بعد الفحص لا تتغير: **319 مطابقة مؤكدة، 551 استبعاداً موثقاً، و11 علاقة gentamicine معلّقة خارج العددين**. هذه مراجعة للمقاطع المحددة وليست إكمالاً شاملاً لقائمة DPM.

## تعليق ربط عروض atropine الحقنية مؤقتاً — 2026-10-27

أُعيد فحص سجلات atropine في قائمة DPM الحالية. المقتطفات تثبت المادة والعيار والشكل والعبوة، لكن خلايا الاستطباب المجلوبة مبتورة قبل حسم الطريق؛ لذلك لا يمكن الجزم بأن النص الكامل لا يذكر IV. التزاماً بمعيار التدقيق، أُزيلت العلامات مؤقتاً من بطاقة atropine الوريدية وحُجبت في البحث حتى يتوفر النص الكامل. هذه حالات معلّقة وليست استبعادات نهائية، ولا تعني أن المنتجات غير مسجلة أو أن طريقها السريري مستحيل.

| الاسم في DPM | DCI | العيار والشكل | العبوة | المختبر | AMM | سبب عدم الربط |
|---|---|---|---|---|---|---|
| ATROPINE SAIPH | ATROPINE | 0.25 mg/mL، محلول للحقن | B/10/1 mL | SAIPH | 9163801H | مقتطف الاستطباب مبتور قبل حسم الطريق. |
| ATROPINE SULFATE AGUETTANT | ATROPINE | 0.250 mg/1 mL، محلول للحقن | B/10/1 mL | LABORATOIRE AGUETTANT | 7093062H | مقتطف الاستطباب مبتور قبل حسم الطريق. |
| ATROPINUM SULFURICUM | ATROPINE | 1 mg/mL، محلول للحقن | B/10/1 mL | SOPHARMA SA | 10793011H | مقتطف الاستطباب مبتور قبل حسم الطريق. |

أُجري بحث موازٍ بأسماء العلامات وأرقام AMM في نطاق DPM؛ لم يُعثر على نص كامل حالي يحسم IV. النتائج المفيدة كانت محاضر/جداول DPM أقدم تتعلق بملفات AMM أو توسعة استطباب، لا تعرض طريقاً حاسماً ولا تحل محل سجل AMM الحالي، لذلك لا تغيّر حالة التعليق.

نُقلت هذه الصفوف الثلاثة من المطابقات إلى الحالات المعلّقة خارج العددين، وحُجبت في البحث مؤقتاً مع إبقاء البحث العام عن `atropine` متاحاً. أصبحت الحصيلة **316 مطابقة مؤكدة و551 استبعاداً موثقاً**، مع **14 علاقة معلّقة** (11 gentamicine وثلاثة atropine).

## الخطوة التالية كما كانت قبل جلب fiches DPM المباشرة (سجل تاريخي)

كان المطلوب حينها الحصول على نص DPM الكامل للعروض الست المعلقة، مع قاعدة مؤقتة تشترط تصريح IV الحرفي. حُسمت هذه الخطوة في الإضافة النهائية أدناه بعد فتح fiches الرسمية وتطبيق قاعدة القرار التي أرسلها المستخدم. تبقى مراجعة جميع الأدوية الـ73 والـ320 عرضاً مراجعة شاملة غير مكتملة؛ لا تُوسم Phase C بأنها مكتملة. لا يُستخدم رقم AMM دليلاً على توفر دواء فعلياً في الصيدليات.

## تقييم الملف المرفق «liste_amm_texte_complet.txt» — 2026-10-27

فُحصت بنية الملف المرفق وتاريخه، واستُخرجت منه صفوف AMM الـ14 المعلقة للتحقق، ولم يُنسخ إلى المستودع. يعرّف الملف نفسه بأنه تصدير من `liste_amm.xls` مع لقطة مؤرخة **يناير 2024** ويذكر 6,059 عرضاً. هذه اللقطة أقدم من سجل DPM الحالي الذي تعرض صفحة DPM تاريخ تحديثه **07/10/2026**؛ لذلك لا تصلح وحدها لإثبات حالة التسجيل الحالية لكل العروض، ولا لتوقيع إكمال Phase C على أساس السجل الحالي.

طوبقت أرقام AMM الـ14 المعلقة على الصفوف الموجودة في الملف، لكن نص الاستطباب في الصفوف المقروءة يتوقف عند نحو 250 حرفاً وقبل عبارة الطريق اللازمة: أسطر GENTA/UNIGENTA تنتهي قبل إكمال «peut être utilisée»، وأسطر GENTAINJECT قبل إكمال «Dans ces conditions»، وسطر CIDOMYCINE قبل اكتمال الجملة؛ أما عروض atropine فالنص ينتهي عند «Limitation» أو شرطة بعد قائمة الاستطبابات. لذلك لا يثبت هذا الملف IV ولا ينفيه، ولا يحسم العلاقات الـ14. لا تُستعمل هذه المقتطفات التاريخية لإعادة أي علامة إلى `brands` أو إزالة تعليقها.

**القرار بعد فحص المرفق:** تبقى الحصيلة **316 مطابقة مؤكدة، و551 استبعاداً موثقاً، و14 علاقة معلّقة** (11 gentamicine وثلاثة atropine). لم يُعلن اكتمال المراجعة الشاملة للأدوية الـ73؛ المطلوب نسخة كاملة غير مبتورة من سجل DPM الحالي بتاريخ 07/10/2026 أو أحدث، بحيث تتضمن الاستطباب/الطريق كاملاً. لا يدل هذا على غياب تسجيل أي عرض، بل على أن المصدر المرفق لا يفي بشرط الحداثة واكتمال النص.

## متابعة fiches DPM المباشرة لـatropine وgentamicine — 2026-10-27

استُخدمت صفحات `fiche.php` الرسمية مباشرةً للتحقق من 8 عروض كانت معلّقة. تعرض كل صفحة المادة والعيار والشكل `Solution injectable` وبيانات AMM، وتعرض الاستطباب كاملاً؛ لكن لا تذكر الصفحة طريق IV صراحةً ولا تحتوي حقلاً مستقلاً لطريق الإعطاء. وجود استطباب مثل بطء القلب/الإنعاش أو عدوى شديدة لا يكفي لاستنتاج الطريق. وبحسب معيار المطابقة المعتمد، لا تُربط هذه الصفوف ببطاقات IV؛ نُقلت من «معلّق» إلى «استبعاد من الربط» دون ادعاء أن الطريق السريري غير وريدي:

| DCI | الاسم في DPM | العيار | AMM | cod_medic | صفحة DPM | نتيجة فحص الطريق |
|---|---|---|---|---:|---|---|
| ATROPINE | ATROPINE SAIPH | 0.25 mg/mL | 9163801H | 10396 | [fiche DPM](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=10396) | حل للحقن؛ الاستطباب الكامل لا يذكر IV. |
| ATROPINE | ATROPINE SULFATE AGUETTANT | 0.250 mg/1 mL | 7093062H | 5947 | [fiche DPM](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=5947) | حل للحقن؛ الاستطباب الكامل لا يذكر IV. |
| GENTAMICINE | GENTA 80 | 80 mg، B/50/2 mL | 9233052H | 7174 | [fiche DPM](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=7174) | حل للحقن؛ الاستطباب الكامل لا يذكر IV. |
| GENTAMICINE | GENTA 80 | 80 mg، B/5/2 mL | 9233051 | 7175 | [fiche DPM](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=7175) | حل للحقن؛ الاستطباب الكامل لا يذكر IV. |
| GENTAMICINE | GENTA 80 | 80 mg، B/1/2 mL | 9233054 | 9287 | [fiche DPM](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=9287) | حل للحقن؛ الاستطباب الكامل لا يذكر IV. |
| GENTAMICINE | GENTAINJECT 80 | 80 mg/2 mL، B/100/2 mL | 9443054H | 17039 | [fiche DPM](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=17039) | حل للحقن؛ الاستطباب الكامل لا يذكر IV. |
| GENTAMICINE | GENTAINJECT 80 | 80 mg/2 mL، B/5/2 mL | 9443053 | 17040 | [fiche DPM](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=17040) | حل للحقن؛ الاستطباب الكامل لا يذكر IV. |
| GENTAMICINE | CIDOMYCINE 20 | 20 mg/2 mL | 9163491 | 8568 | [fiche DPM](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=8568) | حل للحقن؛ الاستطباب الكامل لا يذكر IV. |

المرفق `atropine_gentamicine_fiches_completes.txt` يسرد 20 fiches، لكنه لا يتضمن عروض UNIGENTA الخمسة ولا ATROPINUM SULFURICUM `10793011H`. لذلك بقيت هذه العلاقات الست معلّقة؛ لا يُستعاض عن سجل DPM بموقع المصنع أو بدليل دوائي ثانوي حتى لو ذكر IV/IM.

**الحصيلة التاريخية عند هذا التحديث (قبل المراجعة اللاحقة أدناه):** 316 مطابقة مؤكدة، 559 استبعاداً موثقاً، و6 علاقات معلّقة. تُحفظ هذه الأرقام كسجل زمني ولا تمثل الوضع الحالي.

## حسم سجلات atropine وgentamicine من fiches DPM المباشرة — 2026-10-27

رُوجعت صفحة DPM الرسمية التي تعرض قائمة AMM سارية بتاريخ 07/10/2026، ثم فُتحت fiches الرسمية التالية. لم أتعامل مع تاريخ 2026-10-28 الوارد في المرفق كأنه تاريخ تحقق سابق لليوم؛ تحقق الويب المباشر أُجري بتاريخ 2026-10-27.

### ما تثبته fiches

- `ATROPINUM SULFURICUM` (cod_medic 9212): 1 mg/mL، solution injectable، B/10/1 mL، SOPHARMA SA، AMM `10793011H`. الاستطباب يتضمن ما قبل التخدير، اضطرابات التوصيل/بطء القلب، وبعض الاستعمالات المضادة للكولين.
- `UNIGENTA` العيني (cod_medic 5091): 0,3% collyre، flacon/5 mL، AMM `9093141`؛ يبقى مستبعداً من بطاقة gentamicine الجهازية.
- `UNIGENTA` الحقني: 10 mg، AMM `9093531`؛ 20 mg، `9093532`؛ 40 mg، `9093533`؛ 80 mg، `9093534`؛ 160 mg B/2، `9093535`؛ و160 mg B/1، `9093536` (cod_medic 12313). جميعها مسجلة كـsolution injectable، أمبولات، وDCI gentamicine؛ ficha `9093536` كانت عرضاً إضافياً غير مدرج بالحصر السابق.
- أعيد فتح الصفحات الكاملة لـATROPINE SAIPH (`9163801H`)، ATROPINE SULFATE AGUETTANT (`7093062H`)، GENTA 80 بأحجامه الثلاثة (`9233052H`, `9233051`, `9233054`)، GENTAINJECT 80 بحجمين (`9443054H`, `9443053`) وCIDOMYCINE 20 (`9163491`). تعرض هذه الصفحات الشكل الحقني والهوية/الاستطبابات المناسبة للـDCI الجهازي.

### قاعدة الربط وحدود الإثبات

اتباعاً لتصحيح المستخدم في المرفق: يصنّف هذا التدقيق «solution injectable» مع DCI جهازية واستطباب متوافق كعرض parentéral، ويربطه ببطاقة DCI IV/IM مع التصريح بوضوح أن سجل DPM **لا يذكر IV أو IM صراحةً** وأن الطريق المحدد يجب تأكيده من RCP للمنتج المستخدم. لا يُستنتج طريق IV من كلمة injectable وحدها، ولا يُنقل من مستحضر إلى آخر. هذا التمييز مضاف في نص العرض نفسه.

### النتيجة على التطبيق والعدّ

أُعيدت إلى بطاقة atropine عروض SAIPH وAGUETTANT وATROPINUM SULFURICUM؛ وأُعيدت إلى بطاقة gentamicine عروض GENTA 80 الثلاثة وGENTAINJECT 80 الاثنين وCIDOMYCINE 20، وأضيفت عروض UNIGENTA الحقنية الستة. أبقي UNIGENTA 0,3% العيني محجوباً. الحصيلة المحاسبية من الوضع التاريخي في القسم السابق: 316 + 14 علاقة معلقة/مستبعدة مؤقتاً + عرض UNIGENTA 160 B/1 غير المدرج = **331 صف مطابقة**؛ 559 - 8 استبعادات مؤقتة أُعيد ربطها = **551 استبعاداً**؛ **0 معلّق**. لا يضاف collyre UNIGENTA مرة أخرى إلى الاستبعادات لأنه كان مسجلاً ضمنها سابقاً. Cette conclusion était historique; le statut courant est celui du réexamen du 2026-10-27 décrit dans `docs/DPM-ROUTE-VERIFICATION-2026-10-27.md`.

أضيفت أسماء العروض إلى `brands` لتظهر في بطاقة الدواء، وأزيلت استبعادات البحث الخاصة بالعروض القابلة للحقن، مع إبقاء حجب البحث الصريح عن شكل UNIGENTA العيني. أضيفت اختبارات إيجابية للأشكال القابلة للحقن وسلبية للـcollyre. كل أرقام AMM تدل على التسجيل الظاهر في سجل DPM فقط؛ لا تثبت توفر المخزون بالصيدليات.

المصادر الرسمية التي فُتحت مباشرة:
- [قائمة الأدوية البشرية لدى DPM، تحديث 07/10/2026](https://dpm.tn/medicament/humain/liste-des-medicaments)
- [ATROPINUM SULFURICUM 9212](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=9212)
- [UNIGENTA collyre 5091](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=5091)
- [UNIGENTA injectable 9123, 9125, 9126, 9127, 9128, 12313](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=9123) (تُراجع بقية fiches بالمعرّفات في النص أعلاه)
- [ATROPINE SAIPH 10396](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=10396)، [ATROPINE SULFATE AGUETTANT 5947](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=5947)، [GENTA 80 7174](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=7174)، [GENTA 80 7175](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=7175)، [GENTA 80 9287](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=9287)، [GENTAINJECT 80 17039](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=17039)، [GENTAINJECT 80 17040](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=17040)، [CIDOMYCINE 20 8568](https://dpm.tn/dpm_pharm/medicament/fiche.php?cod_medic=8568).

**حدود الجولة:** هذا يحسم سجلات route-link المذكورة فقط، ولا يعني اكتمال تدقيق العلامات للـ73 دواء أو إدخال سجل الـ320 عرضاً/39 DCI؛ كما أن بيانات DPM لا تثبت التوفر الفعلي. يظل على المهام A وB وC العامة أن تُستكمل وتُختبر، ولا يُعلن اكتمال Phase C.


## تحديث الحالة بعد مراجعة النشرات ومطابقة المنتج — 2026-10-28

الحالة الحالية الواردة في بداية التقرير حُدثت بعد فحص أدلة خاصة بالمنتج، مع إبقاء الجداول والأعداد الأقدم أعلاه كسجل تاريخي مؤرخ لا يُعاد تفسيره على أنه الحالة الحالية. أُضيفت إلى المطابقات خمسة عروض كانت معلّقة: ثلاثة عروض GENTA 80 (MEDIS) بأرقام AMM `9233052H`, `9233051`, `9233054`؛ عرض ATROPINE SULFATE AGUETTANT `7093062H`؛ وعرض ATROPINUM SULFURICUM (SOPHARMA) `10793011H`. انتقلت الحصيلة من `322/551/9` إلى **`327/551/4`**، مع ثبات المجموع عند 882.

الأدلة المفصلة في `docs/DPM-ROUTE-VERIFICATION-2026-10-27.md`: نشرة MEDIS لـGENTA (04/2020) تنص على التسريب الوريدي خلال 30 دقيقة أو الحقن العضلي؛ وملخص خصائص المنتج الرسمي من ANSM لمستحضر ATROPINE (SULFATE) AGUETTANT 0,25 mg/mL يذكر الوريدي/العضلي/تحت الجلد؛ ونشرة Atropin Sopharma 1 mg/mL المنشورة من جهة التنظيم ALIMS عام 2023 تذكر تحت الجلد/العضل/الوريد. طوبقت الأسماء والتركيزات والأشكال والمصانع والعبوات المحلية مع سجلات DPM المعنية. تثبت هذه الأدلة مسارات المنتجات المحددة فقط؛ لا تصادق على جرعات البطاقات ولا تثبت توفر المخزون. لم تُنقل أي طريق إلى ATROPINE SAIPH أو GENTAINJECT أو CIDOMYCINE؛ بقيت أربعة عروض معلّقة: ATROPINE SAIPH، عرضان GENTAINJECT 80، وCIDOMYCINE 20. مراجعة الأدوية الـ73 ما تزال مفتوحة.

## استكمال مطابقة gentamicine — 2026-10-28

استُكملت قراءة المقاطع ذات الصلة من النشرة الرسمية لـMEDIS (`p21.pdf`) وقورنت أرقام AMM والتقديمات مباشرةً بملف سجل DPM الحالي المؤرخ في الصفحة 07/10/2026. النشرة تحدد IV بالتسريب 30 دقيقة أو IM وتغطي GENTA 10 و20 و40 و80 mg؛ لذلك أضيفت ستة عروض محلية جديدة مؤكدة: GENTA 10 (`9233093`, `9233094H`)، GENTA 20 (`9233091`, `9233092H`) وGENTA 40 (`9233101`, `9233102H`). رُبطت هذه العلامات في بطاقة gentamicine، واختُبرت نتائج البحث الإيجابية.

بعدها عُثر على نشرة MEDIS منفصلة خاصة بـGENTA 160 mg (`p240.pdf`, révision 06/2019)، تنص صراحة على IV بالتسريب 30 دقيقة أو IM وتذكر AMM `9233053` والعبوة B/1/2 mL؛ طابقت ذلك مع السطر نفسه في سجل DPM، فأُضيف العرض إلى `brands` والبحث الإيجابي. بقيت GENTAINJECT 40 (`9443052`) وGENTAINJECT 160 (`9443051`) وGENTAINJECT 80 (عرضان) وCIDOMYCINE 20 وATROPINE SAIPH معلّقة. الحصيلة الجديدة **334 مطابقة، 551 استبعاداً، 6 معلّقة؛ المجموع ضمن النطاق المحدّث 891 صف AMM**. اختبارات البحث الإيجابية/السلبية موافقة للتصنيف. المصادر: [قائمة AMM الرسمية لدى DPM](https://dpm.tn/images/pdf/liste_amm.xls)، [نشرة MEDIS GENTA p21](https://medis.com.tn/sites/default/files/produits/p21.pdf) و[نشرة GENTA 160 p240](https://www.medis.com.tn/sites/default/files/produits/p240.pdf). لا يثبت التسجيل أو النشرة توفر المخزون، ولا تُعد هذه المطابقة تصديقاً للجرعات العامة أو مراجعة سريرية مستقلة.
