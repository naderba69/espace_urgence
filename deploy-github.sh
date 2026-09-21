#!/data/data/com.termux/files/usr/bin/bash
# ════════════════════════════════════════════════════════════════════
# Espace Urgence TN — نشر الزيب على GitHub من Termux
# يحذف كامل ملفات المستودع القديمة ويستبدلها بمحتوى الزيب (force-push)،
# مع الحفاظ على سيرفر GitHub Pages (.github/workflows/deploy.yml داخل الزيب).
#
# الاستعمال على Termux :
#   bash deploy-github.sh /مسار/الزيب.zip
# مثال :
#   bash deploy-github.sh ~/storage/shared/Download/espace_urgence_v9.3.zip
# ════════════════════════════════════════════════════════════════════
set -e

ZIP="${1:-}"
if [ -z "$ZIP" ] || [ ! -f "$ZIP" ]; then
  echo "❌ مرّر مسار ملف الزيب :  bash $0 /مسار/الملف.zip"
  exit 1
fi

# 0) الاعتماديات + الوصول للتخزين
pkg install -y git unzip >/dev/null
termux-setup-storage 2>/dev/null || true

# 1) الهوية + التوكن (إدخال مخفي — لا يُحفظ في التاريخ)
read -rp "اسم المستخدم على GitHub : " U
read -rp "اسم المستودع (repo)        : " R
read -sp  "PAT (توكن شخصي)          : " T; echo
[ -n "$U" ] && [ -n "$R" ] && [ -n "$T" ] || { echo "❌ بيانات ناقصة"; exit 1; }

git config --global user.name  "${GIT_NAME:-dev}"  2>/dev/null || true
git config --global user.email "${GIT_MAIL:-dev@local}" 2>/dev/null || true

# 2) فك الضغط في مجلد نظيف
WORK="$HOME/eutn-deploy"
rm -rf "$WORK"; mkdir -p "$WORK"; cd "$WORK"
unzip -oq "$ZIP"

# 3) مستودع جديد من الصفر (يتضمن .github/workflows = Pages يبقى)
git init -q -b main
git add -A
git commit -qm "Espace Urgence TN v9.3 — remplacement complet du dépôt"

# 4) الدفع القسري = حذف كل الملفات القديمة + رفع الجديدة
git remote add origin "https://$U:$T@github.com/$U/$R.git"
DEF="$(git ls-remote --symref origin HEAD 2>/dev/null | awk '/refs\/heads\//{print $2; exit}' | sed 's|refs/heads/||')"
[ -z "$DEF" ] && DEF="main"
echo "➡️  الفرع الافتراضي على GitHub : $DEF"
git push -fq origin "main:$DEF"

# 5) تنظيف التوكن من إعدادات المستودع فوراً
git remote set-url origin "https://github.com/$U/$R.git"
cd "$HOME"; rm -rf "$WORK"

echo ""
echo "✅ تم حذف الملفات القديمة ورفع المشروع الجديد على الفرع '$DEF'"
echo "🔗 https://github.com/$U/$R"
echo "⏳ GitHub Pages سيُعاد نشره تلقائياً عبر .github/workflows/deploy.yml"
