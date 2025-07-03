# Vercel এ ডেপ্লয় করার গাইড

## ধাপ ১: GitHub এ Repository তৈরি করুন

1. **GitHub.com এ যান** এবং লগইন করুন
2. **"New repository" ক্লিক করুন**
3. **Repository নাম দিন**: `islamic-guide-app`
4. **Public সিলেক্ট করুন**
5. **"Create repository" ক্লিক করুন**

## ধাপ ২: কোড GitHub এ আপলোড করুন

```bash
# আপনার প্রজেক্টে এই কমান্ডগুলি রান করুন:

# GitHub repository যোগ করুন
git remote add origin https://github.com/YOUR_USERNAME/islamic-guide-app.git

# Main branch এ push করুন
git branch -M main
git push -u origin main
```

## ধাপ ৩: Vercel এ ডেপ্লয় করুন

1. **Vercel.com এ যান**
2. **GitHub দিয়ে লগইন করুন**
3. **"New Project" ক্লিক করুন**
4. **আপনার repository সিলেক্ট করুন**
5. **Framework Preset**: Next.js (অটো-ডিটেক্ট হবে)
6. **"Deploy" ক্লিক করুন**

## ধাপ ৪: Environment Variables (যদি প্রয়োজন হয়)

Vercel Dashboard → Project Settings → Environment Variables এ গিয়ে:

```
NODE_ENV=production
```

## ধাপ ৫: Custom Domain (যদি চান)

Vercel Dashboard → Settings → Domains এ গিয়ে আপনার custom domain যোগ করুন।

## ✅ সম্পন্ন!

আপনার অ্যাপ্লিকেশন এখন লাইভ হবে: `https://your-project-name.vercel.app`

## 🔄 অটো-ডেপ্লয়

প্রতিবার GitHub এ push করলে Vercel স্বয়ংক্রিয়ভাবে নতুন ভার্সন ডেপ্লয় করবে। 