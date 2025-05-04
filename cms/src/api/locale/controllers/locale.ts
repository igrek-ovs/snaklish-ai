  // src/api/locale/controllers/locale.ts
  export default {
    async findAll(ctx) {
      ctx.body = await strapi.plugin('i18n').service('locales').find();
    },
  };
  