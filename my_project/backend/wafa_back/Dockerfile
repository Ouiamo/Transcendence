# Dockerfile
# استخدام صورة Node.js رسمية كقاعدة (يمكنك اختيار إصدار LTS)
FROM node:20-slim

# تعيين دليل العمل داخل الحاوية
WORKDIR /usr/src/app

# نسخ ملفات المشروع الأساسية
COPY package*.json ./

# تنصيب الاعتماديات (Dependencies)
RUN npm install

# نسخ جميع ملفات المشروع إلى دليل العمل
COPY . .

# تعرض الحاوية المنفذ الذي يستمع عليه Fastify
EXPOSE 3000

# الأمر الذي سيتم تنفيذه عند تشغيل الحاوية
CMD [ "npm", "start" ]