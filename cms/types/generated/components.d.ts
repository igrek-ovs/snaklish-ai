import type { Schema, Struct } from '@strapi/strapi';

export interface SharedFaqTab extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_tabs';
  info: {
    description: '';
    displayName: 'Faq Tab';
  };
  attributes: {
    answer: Schema.Attribute.Text;
    isVisible: Schema.Attribute.Boolean;
    question: Schema.Attribute.Text;
  };
}

export interface WidgetsFaqList extends Struct.ComponentSchema {
  collectionName: 'components_widgets_faq_lists';
  info: {
    description: '';
    displayName: 'Faq List';
  };
  attributes: {
    faqList: Schema.Attribute.Component<'shared.faq-tab', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface WidgetsLinkItemWidget extends Struct.ComponentSchema {
  collectionName: 'components_widgets_link_item_widgets';
  info: {
    displayName: 'Link Item Widget';
  };
  attributes: {
    isNewTab: Schema.Attribute.Boolean;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface WidgetsLinkWidget extends Struct.ComponentSchema {
  collectionName: 'components_widgets_link_widgets';
  info: {
    displayName: 'Link Widget';
  };
  attributes: {
    isImportant: Schema.Attribute.Boolean;
    linkList: Schema.Attribute.Component<'widgets.link-item-widget', true>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.faq-tab': SharedFaqTab;
      'widgets.faq-list': WidgetsFaqList;
      'widgets.link-item-widget': WidgetsLinkItemWidget;
      'widgets.link-widget': WidgetsLinkWidget;
    }
  }
}
