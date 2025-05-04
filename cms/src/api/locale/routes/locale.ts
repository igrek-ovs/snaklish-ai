// src/api/locale/routes/locale.ts
export default {
    routes: [
      {
        method: 'GET',
        path: '/locales',
        handler: 'locale.findAll',
        config: { auth: false },
      },
    ],
  };