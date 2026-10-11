// i18n.ts — كل نصوص الصفحة باللغتين

export type Lang = 'ar' | 'en';
export type SectionId = 'home' | 'services' | 'about' | 'contact';

interface NavLink { id: SectionId; label: string; }

const AR = {
  langSwitch: { label: 'English', aria: 'Switch to English' },

  nav: {
    aria: 'القائمة الرئيسية',
    brandAria: 'Apx الصفحة الرئيسية',
    toggle: 'فتح القائمة',
    register: 'إنشاء حساب',
    login: 'تسجيل الدخول',
  },

  links: <NavLink[]>[
    { id: 'home', label: 'الرئيسية' },
    { id: 'services', label: 'خدماتنا' },
    { id: 'about', label: 'من نحن' },
    { id: 'contact', label: 'اتصل بنا' },
  ],

  hero: {
    chip: 'متاحون لمشاريع جديدة هذا الشهر',
    title: 'نبني منتجات رقمية تأخذ أعمالك إلى القمة',
    lead: 'في Apx نصمم ونطوّر المواقع والتطبيقات والأنظمة السحابية للشركات، من الفكرة الأولى حتى الإطلاق والدعم المستمر.',
    cta: 'اطلب استشارة مجانية',
    secondary: 'استعرض خدماتنا',
    stats: [
      { value: '+150', label: 'مشروع منجز' },
      { value: '+80', label: 'عميل في المنطقة' },
      { value: '24/7', label: 'دعم فني' },
    ],
    artAria: 'شعار Apx: قمة متدرجة',
    satisfaction: 'رضا العملاء',
    launching: 'مشروع قيد الإطلاق',
    projectName: 'منصة متجر إلكتروني',
    progress: '78% مكتمل',
  },

  services: {
    title: 'الخدمات التي نقدمها',
    subtitle: 'فريق واحد يغطي كل مراحل مشروعك الرقمي، فلا تحتاج إلى التنسيق بين أكثر من جهة.',
    cta: 'ابدأ مشروعك',
    featured: {
      icon: 'desktop',
      title: 'تطوير المواقع والمنصات',
      text: 'مواقع ومنصات ويب سريعة ومتجاوبة، مع لوحة تحكم تتيح لفريقك إدارة المحتوى بسهولة.',
      points: ['تصميم واجهات حديثة', 'متاجر إلكترونية', 'لوحات تحكم مخصصة', 'تحسين الظهور في محركات البحث'],
    },
    items: [
      { icon: 'mobile', title: 'تطبيقات الجوال', text: 'تطبيقات iOS وAndroid بتجربة سلسة، ونتولى نشرها على المتاجر.' },
      { icon: 'cloud', title: 'الحلول السحابية', text: 'نقل أنظمتك إلى السحابة مع نسخ احتياطي تلقائي وتوسّع حسب الحاجة.' },
      { icon: 'chart', title: 'تحليل البيانات', text: 'لوحات معلومات وتقارير تساعدك على اتخاذ قرارات مبنية على الأرقام.' },
      { icon: 'shield', title: 'الأمن السيبراني', text: 'فحص الثغرات وتأمين البيانات وحماية أنظمتك من الاختراقات.' },
      { icon: 'headset', title: 'الدعم والصيانة', text: 'تحديثات دورية واستجابة سريعة لأي مشكلة على مدار الساعة.' },
    ],
  },

  about: {
    title: 'من نحن',
    text: 'Apx شركة تقنية تأسست عام 2022 على يد مهندسين ومصممين، هدفنا مساعدة الشركات الناشئة والمؤسسات على تحويل أفكارها إلى منتجات رقمية حقيقية تعمل بكفاءة.',
    stats: [
      { value: '8', label: 'سنوات خبرة' },
      { value: '35', label: 'خبيراً في الفريق' },
      { value: '12', label: 'دولة نخدمها' },
    ],
    values: [
      { icon: 'checkCircle', title: 'التزام بالمواعيد', text: 'جدول زمني واضح من اليوم الأول.' },
      { icon: 'users', title: 'فريق متكامل', text: 'مطورون ومصممون ومختصو أمن معاً.' },
      { icon: 'dollar', title: 'أسعار شفافة', text: 'عرض سعر مفصّل بلا تكاليف مخفية.' },
      { icon: 'refresh', title: 'شراكة مستمرة', text: 'نبقى معك بعد الإطلاق.' },
    ],
    processTitle: 'كيف نعمل معك',
    steps: [
      { title: 'نفهم احتياجك', text: 'جلسة لتحديد الأهداف والجمهور والميزانية.' },
      { title: 'نصمم ونخطط', text: 'نماذج أولية توافق عليها قبل بدء التطوير.' },
      { title: 'نطوّر ونختبر', text: 'تسليم على مراحل مع تقرير تقدم أسبوعي.' },
      { title: 'نطلق وندعم', text: 'إطلاق المشروع ومتابعته وتطويره بعد التسليم.' },
    ],
  },

  contact: {
    title: 'اتصل بنا',
    subtitle: 'أخبرنا عن مشروعك وسنرد عليك خلال يوم عمل واحد.',
    infoTitle: 'معلومات التواصل',
    addressLabel: 'العنوان',
    address: 'الولايات المتحدة الأمريكية، إنديانا',
    phoneLabel: 'الهاتف',
    emailLabel: 'البريد الإلكتروني',
    hoursLabel: 'ساعات العمل',
    hours: 'الأحد – الخميس، 9 صباحاً – 6 مساءً',
    form: {
      name: 'الاسم الكامل',
      nameErr: 'اكتب اسمك.',
      email: 'البريد الإلكتروني',
      emailErr: 'اكتب بريداً إلكترونياً صحيحاً.',
      phone: 'رقم الجوال',
      optional: '(اختياري)',
      service: 'الخدمة المطلوبة',
      servicePlaceholder: 'اختر الخدمة',
      serviceErr: 'اختر الخدمة التي تهمك.',
      message: 'تفاصيل المشروع',
      messageErr: 'اكتب نبذة عن مشروعك (10 أحرف على الأقل).',
      submit: 'إرسال الرسالة',
      sent: 'تم إرسال رسالتك. سنتواصل معك قريباً.',
    },
    // value ثابتة لا تتغير مع اللغة حتى تبقى قيمة النموذج صحيحة عند التبديل
    serviceOptions: [
      { value: 'web', label: 'تطوير المواقع' },
      { value: 'mobile', label: 'تطبيقات الجوال' },
      { value: 'cloud', label: 'الحلول السحابية' },
      { value: 'data', label: 'تحليل البيانات' },
      { value: 'security', label: 'الأمن السيبراني' },
      { value: 'support', label: 'الدعم والصيانة' },
    ],
  },

  footer: {
    about: 'حلول رقمية متكاملة للشركات: مواقع، تطبيقات، أنظمة سحابية ودعم مستمر.',
    quickLinks: 'روابط سريعة',
    contactUs: 'تواصل معنا',
    address: 'الولايات المتحدة الأمريكية، إنديانا',
    rights: 'جميع الحقوق محفوظة.',
    privacy: 'سياسة الخصوصية',
    terms: 'الشروط والأحكام',
  },

  auth: {
    loginTitle: 'مرحباً بعودتك',
    registerTitle: 'أنشئ حسابك في Apx',
    close: 'إغلاق',
    loginTab: 'تسجيل الدخول',
    registerTab: 'إنشاء حساب',
    name: 'الاسم الكامل',
    nameErr: 'اكتب اسمك.',
    email: 'البريد الإلكتروني',
    emailErr: 'اكتب بريداً إلكترونياً صحيحاً.',
    password: 'كلمة المرور',
    passwordErr: 'كلمة المرور 6 أحرف على الأقل.',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    remember: 'تذكرني',
    forgot: 'نسيت كلمة المرور؟',
    loginBtn: 'تسجيل الدخول',
    or: 'أو',
    google: 'المتابعة باستخدام Google',
    terms: 'أوافق على الشروط والأحكام',
    termsErr: 'يجب الموافقة على الشروط للمتابعة.',
    registerBtn: 'إنشاء حساب',
    messages: {
      login: 'تم تسجيل الدخول بنجاح.',
      register: 'تم إنشاء حسابك بنجاح.',
    },
  },
};

export type Translation = typeof AR;
export type AuthMsgKey = keyof Translation['auth']['messages'];

const EN: Translation = {
  langSwitch: { label: 'العربية', aria: 'التبديل إلى العربية' },

  nav: {
    aria: 'Main navigation',
    brandAria: 'Apx home',
    toggle: 'Open menu',
    register: 'Sign up',
    login: 'Log in',
  },

  links: [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ],

  hero: {
    chip: 'Taking on new projects this month',
    title: 'We build digital products that take your business to the top',
    lead: 'At Apx we design and develop websites, apps and cloud systems for businesses, from the first idea through launch and ongoing support.',
    cta: 'Get a free consultation',
    secondary: 'Explore our services',
    stats: [
      { value: '150+', label: 'Projects delivered' },
      { value: '80+', label: 'Clients in the region' },
      { value: '24/7', label: 'Technical support' },
    ],
    artAria: 'Apx logo: a layered peak',
    satisfaction: 'Client satisfaction',
    launching: 'Launching soon',
    projectName: 'E-commerce platform',
    progress: '78% complete',
  },

  services: {
    title: 'What we offer',
    subtitle: 'One team covers every stage of your digital project, so you never have to coordinate between vendors.',
    cta: 'Start your project',
    featured: {
      icon: 'desktop',
      title: 'Web & platform development',
      text: 'Fast, responsive websites and web platforms with an admin panel that lets your team manage content easily.',
      points: ['Modern interface design', 'E-commerce stores', 'Custom admin dashboards', 'Search engine optimization'],
    },
    items: [
      { icon: 'mobile', title: 'Mobile apps', text: 'iOS and Android apps with a smooth experience, published to the app stores for you.' },
      { icon: 'cloud', title: 'Cloud solutions', text: 'Move your systems to the cloud with automatic backups and on-demand scaling.' },
      { icon: 'chart', title: 'Data analytics', text: 'Dashboards and reports that help you make decisions based on the numbers.' },
      { icon: 'shield', title: 'Cybersecurity', text: 'Vulnerability scanning, data protection and defense against breaches.' },
      { icon: 'headset', title: 'Support & maintenance', text: 'Regular updates and fast response to any issue, around the clock.' },
    ],
  },

  about: {
    title: 'About us',
    text: 'Apx is a technology company founded in 2022 by engineers and designers. We help startups and enterprises turn their ideas into real digital products that work.',
    stats: [
      { value: '8', label: 'Years of experience' },
      { value: '35', label: 'Experts on the team' },
      { value: '12', label: 'Countries served' },
    ],
    values: [
      { icon: 'checkCircle', title: 'On-time delivery', text: 'A clear timeline from day one.' },
      { icon: 'users', title: 'A complete team', text: 'Developers, designers and security specialists together.' },
      { icon: 'dollar', title: 'Transparent pricing', text: 'A detailed quote with no hidden costs.' },
      { icon: 'refresh', title: 'Ongoing partnership', text: 'We stay with you after launch.' },
    ],
    processTitle: 'How we work with you',
    steps: [
      { title: 'We understand your needs', text: 'A session to define goals, audience and budget.' },
      { title: 'We design and plan', text: 'Prototypes you approve before development starts.' },
      { title: 'We build and test', text: 'Delivery in stages with a weekly progress report.' },
      { title: 'We launch and support', text: 'Launching the project, then monitoring and improving it after delivery.' },
    ],
  },

  contact: {
    title: 'Contact us',
    subtitle: 'Tell us about your project and we’ll reply within one business day.',
    infoTitle: 'Contact information',
    addressLabel: 'Address',
    address: 'Indiana, United States',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    hoursLabel: 'Working hours',
    hours: 'Sunday – Thursday, 9 AM – 6 PM',
    form: {
      name: 'Full name',
      nameErr: 'Enter your name.',
      email: 'Email',
      emailErr: 'Enter a valid email address.',
      phone: 'Mobile number',
      optional: '(optional)',
      service: 'Service needed',
      servicePlaceholder: 'Choose a service',
      serviceErr: 'Choose the service you’re interested in.',
      message: 'Project details',
      messageErr: 'Describe your project (at least 10 characters).',
      submit: 'Send message',
      sent: 'Message sent. We’ll be in touch soon.',
    },
    serviceOptions: [
      { value: 'web', label: 'Web development' },
      { value: 'mobile', label: 'Mobile apps' },
      { value: 'cloud', label: 'Cloud solutions' },
      { value: 'data', label: 'Data analytics' },
      { value: 'security', label: 'Cybersecurity' },
      { value: 'support', label: 'Support & maintenance' },
    ],
  },

  footer: {
    about: 'End-to-end digital solutions for businesses: websites, apps, cloud systems and ongoing support.',
    quickLinks: 'Quick links',
    contactUs: 'Get in touch',
    address: 'Indiana, United States',
    rights: 'All rights reserved.',
    privacy: 'Privacy policy',
    terms: 'Terms & conditions',
  },

  auth: {
    loginTitle: 'Welcome back',
    registerTitle: 'Create your Apx account',
    close: 'Close',
    loginTab: 'Log in',
    registerTab: 'Sign up',
    name: 'Full name',
    nameErr: 'Enter your name.',
    email: 'Email',
    emailErr: 'Enter a valid email address.',
    password: 'Password',
    passwordErr: 'Password must be at least 6 characters.',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    loginBtn: 'Log in',
    or: 'or',
    google: 'Continue with Google',
    terms: 'I agree to the terms and conditions',
    termsErr: 'You must accept the terms to continue.',
    registerBtn: 'Sign up',
    messages: {
      login: 'You’re logged in.',
      register: 'Your account has been created.',
    },
  },
};

export const I18N: Record<Lang, Translation> = { ar: AR, en: EN };