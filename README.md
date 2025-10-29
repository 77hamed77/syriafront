# 🇸🇾 SyriaGPT | مساعد ذكاء اصطناعي باللهجة السورية

**مشروع ذكاء اصطناعي حواري متقدم، تم تصميمه ببنية تحتية حديثة لتقديم تجربة دردشة ذكية باللغة العربية مع فهم عميق للسياق واللهجة السورية، مع التركيز على الأداء العالي وتقليل التكاليف التشغيلية.**

<p align="center">
  <a href="https://syriachatgpt.vercel.app/ar" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo">
  </a>
</p>

<!-- 🎬 CRITICAL: A GIF showing a conversation in the Syrian dialect, and maybe the file upload feature, would be extremely powerful here. -->
<!-- <p align="center"><img src="path/to/your/syriagpt-demo.gif" width="90%"></p> -->

---

### 🛠️ التقنيات والبنية التحتية (Tech & Architecture)

تم بناء SyriaGPT على بنية حديثة ومفككة (Decoupled Architecture) لضمان الأداء العالي والقابلية للتطوير.

| Frontend (Vercel) | Backend (Render) | Database & Cache |
| :---: | :---: | :---: |
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) | ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | ![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white) | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | ![LangChain](https://img.shields.io/badge/LangChain-000000?style=for-the-badge) | ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white) |
| ![i18next](https://img.shields.io/badge/i18next-26A69A?style=for-the-badge&logo=i18next&logoColor=white) | ![Celery](https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=white) | ![Qdrant](https://img.shields.io/badge/Qdrant-AC140A?style=for-the-badge) |

---

### ✨ الميزات الرئيسية (Key Features)

- **💬 واجهة دردشة تفاعلية وسريعة:** تجربة مستخدم سلسة مع دعم كامل للكتابة من اليمين لليسار (RTL).
- **📄 تحليل المستندات (RAG):** القدرة على رفع الملفات (PDF, Word) وتحليلها للسماح للمستخدمين بالدردشة مع مستنداتهم الخاصة.
- **💰 نظام ذكي للتخزين المؤقت (Caching):** آلية متقدمة لتخزين وإعادة صياغة الأسئلة المتكررة لتقليل تكاليف استدعاء واجهات برمجة التطبيقات (LLM APIs) بنسبة تصل إلى 90%.
- **🛡️ تصفية المحتوى غير اللائق:** حماية مدمجة لمنع الأسئلة والأجوبة غير الأخلاقية.
- ** scalability وقابلية التوسع:** مصمم ببنية قابلة للتوسع باستخدام أفضل الممارسات لدعم آلاف المستخدمين.

---

<details>
<summary>🚀 <strong>دليل الإعداد والتشغيل (Local Setup & Run)</strong></summary>

هذا المشروع يتكون من جزأين: الواجهة الخلفية (Backend) والواجهة الأمامية (Frontend). يجب تشغيل كل منهما بشكل منفصل.

#### 1. الواجهة الخلفية (Django Backend)

# استنساخ مستودع الواجهة الخلفية
git clone <رابط_مستودع_الباك_اند>
cd <مجلد_الباك_اند>

# إعداد البيئة الافتراضية وتثبيت المكتبات
python -m venv venv
source venv/bin/activate  # أو .\venv\Scripts\activate
pip install -r requirements.txt

# إعداد متغيرات البيئة (ملف .env)
# ...

# تطبيق ترحيل قاعدة البيانات وتشغيل الخادم
python manage.py migrate
python manage.py runserver
2. الواجهة الأمامية (Next.js Frontend)
code
Bash
# استنساخ مستودع الواجهة الأمامية
git clone <رابط_مستودع_الفرونت_اند>
cd <مجلد_الفرونت_اند>

# تثبيت الحزم
npm install

# إعداد متغيرات البيئة (ملف .env.local)
# يجب أن يحتوي على عنوان URL للواجهة الخلفية
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# تشغيل خادم التطوير
npm run dev
</details>
👨‍💻 المؤلف (Author)
حامد محمد المرعي
<p>
<a href="https://github.com/77hamed77" target="_blank">
<img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
</a>
<a href="https://www.linkedin.com/in/hamidmuhammad" target="_blank">
<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
</a>
</p>
```
والآن، لنضفه إلى LinkedIn
هذا المشروع يبرز قدراتك في التخطيط والهندسة المعمارية الحديثة للبرمجيات.
1. اسم المشروع (Project Name):
code
Code
SyriaGPT | AI Chat Platform with Cost-Optimization Architecture
2. رابط المشروع (Project URL):
(ضع رابط الواجهة الأمامية التي يتفاعل معها المستخدم)
code
Code
https://syriachatgpt.vercel.app/ar
3. الوصف (Description):
(انسخ هذا النص بالكامل والصقه في حقل الوصف)
code
Code
مشروع ذكاء اصطناعي حواري متقدم، تم تصميمه وهندسته لتقديم تجربة دردشة ذكية باللهجة السورية، مع التركيز بشكل أساسي على الأداء العالي وتقليل التكاليف التشغيلية.

🔹 **أبرز الإنجازات الهندسية:**
• **بنية تحتية ذكية لتقليل التكاليف:** تصميم وتنفيذ نظام تخزين مؤقت (Caching) متعدد الطبقات (Redis & Qdrant) نجح في تقليل تكاليف استدعاء واجهات برمجة التطبيقات (LLM APIs) بنسبة تصل إلى 90%.
• **بنية مفككة (Decoupled Architecture):** تطوير واجهة أمامية سريعة باستخدام Next.js (منشورة على Vercel) تتواصل مع واجهة خلفية قوية مبنية بـ Django (منشورة على Render).
• **الدردشة مع المستندات (RAG):** بناء نظام يتيح للمستخدمين رفع ملفاتهم الخاصة والتفاعل معها من خلال الدردشة.

🛠️ **التقنيات المستخدمة (Tech Stack):**
• **الواجهة الخلفية:** Django, LangChain, Qdrant, Redis
• **الواجهة الأمامية:** Next.js, React, Tailwind CSS
• **قاعدة البيانات والنشر:** Supabase (PostgreSQL), Vercel, Render```
