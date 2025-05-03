export type LocaleResponse = {
    id: number;
    documentId: string;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    isDefault: boolean;
  };
  
  export interface StrapiResponse<T> {
    data: T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta: any;
  }
  
  export interface FooterResponse {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    copyright: Copyright;
    linkGroupList: LinkGroupList[];
    contact: Contact;
  }
  
  export interface Copyright {
    id: number;
    copyright: string;
    termsOfService: TermsOfService;
    privacyPolicy: PrivacyPolicy;
    cookiesPolicy: CookiesPolicy;
  }
  
  export interface TermsOfService {
    id: number;
    title: string;
    url: string;
  }
  
  export interface PrivacyPolicy {
    id: number;
    title: string;
    url: string;
  }
  
  export interface CookiesPolicy {
    id: number;
    title: string;
    url: string;
  }
  
  export interface LinkGroupList {
    id: number;
    title: string;
    linkList: LinkList[];
  }
  
  export interface LinkList {
    id: number;
    title: string;
    url: any;
  }
  
  export interface Contact {
    id: number;
    title: string;
    subTitle: string;
    contactList: ContactList[];
  }
  
  export interface ContactList {
    id: number;
    title: string;
    subTitle: string;
    icon: Icon;
  }
  
  export interface Icon {
    id: number;
    documentId: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    width: number;
    height: number;
    formats: string[];
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string;
    provider: string;
    provider_metadata: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
  
  export interface HeaderLogoResponse {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    image: Image;
    mobileImage: Image;
  }
  
  export interface AuthenticationLogoResponse {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    desktopLogo: Image;
    tabletLogo: Image;
    mobileLogo: Image;
  }
  
  export interface Image {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: string[];
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string;
    provider: string;
    provider_metadata: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface TokenData {
    token: string;
    refreshToken: string;
  }
  
  export interface RefreshTokenPayload {
    accessToken: string;
    refreshToken: string;
  }
  
  export interface AdPreferences {
    offersOn: boolean;
    newsletterOn: boolean;
    personalTipsOn: boolean;
  }
  
  export interface CloudStorageBannerWidget {
    id: string;
    primaryTitle: string;
    primaryBackgroundImage: {
      url: string;
    };
    secondaryTitle: string;
    storageIcon: {
      url: string;
    };
    secondaryBackgroundColor: string;
    price: string;
    priceWithDiscount: string;
    info: string;
    startDate: Date;
    endDate: Date;
    isImportant: boolean;
    secondarySubTitleInactive: string;
    secondarySubTitleActive: string;
    primaryButtonTitleActive: string;
    primaryButtonUrlActive: string;
    secondaryButtonTitleInactive: string;
    secondaryButtonUrlInactive: string;
    primaryButtonTitleInactive: string;
  }
  
  export interface FaqWidget {
    title: string;
    subTitle: string;
    faqList: FaqItemWidget[];
  }
  
  export interface LinkWidget {
    title: string;
    linkList: LinkItemWidget[];
  }
  
  export interface MiniBannerListWidget {
    bannerList: MiniBannerWidget[];
    startDate: Date;
    endDate: Date;
  }
  
  export interface MiniBannerWidget {
    id: string;
    title: string;
    subTitle: string;
    icon: {
      url: string;
    };
    backgroundImage: {
      url: string;
    };
    linkIcon: string;
    googlePlayUrl: string;
    appStoreUrl: string;
    isMobileAppBanner: boolean;
    url: string;
    startDate: Date;
    endDate: Date;
  }
  
  export interface MobileAppBannerWidget {
    id: string;
    primaryTitle: string;
    primaryBackgroundImage: {
      url: string;
    };
    secondaryTitle: string;
    secondarySubTitle: string;
    secondaryBackgroundColor: string;
    appStoreUrl: string;
    googlePlayUrl: string;
    standOutImage: {
      url: string;
    };
    startDate: Date;
    endDate: Date;
  }
  
  export interface LinkItemWidget {
    title: string;
    url: string;
    isNewTab: boolean;
  }
  
  export interface FaqItemWidget {
    question: string;
    answer: string;
    answer2: string;
  }
  
  export enum WidgetType {
    CloudStorageBannerWidget = 'CloudStorageBannerWidget',
    FaqWidget = 'FaqWidget',
    LinkWidget = 'LinkWidget',
    MiniBannerListWidget = 'MiniBannerListWidget',
    MiniBannerWidget = 'MiniBannerWidget',
    MobileAppBannerWidget = 'MobileAppBannerWidget',
  }
  
  export interface WidgetResponse {
    id: number;
    __component: string;
  }
  
  export interface Widget {
    type: WidgetType;
    data: any;
  }
  
  export interface Page {
    translationMap: string;
    widgetList: Widget[];
  }
  
  export enum CmsPageUrl {
    Overview = 'overview-page',
    Subscription = 'subscription-page',
    Usage = 'usage-page',
    TopUp = 'top-up-page',
    Invoices = 'invoices-page',
    DataOutsideEu = 'data-outside-eu-page',
    PremiumWallet = 'premium-wallet-page',
    ChangeSUbscription = 'change-subscription',
    AddSubscription = 'add-subscription-page',
    PaymentSettings = 'payment-settings-page',
    CloudStorage = 'cloud-storage-page',
    Settings = 'settings-page',
    CommunicationAndPrivacy = 'communication-and-privacy-page',
    SimcardSettigns = 'sim-card-settings-page',
    NetworkSettings = 'network-settings-page',
  }
  
  export interface NavigationSubLink {
    label: string;
    path: string;
    notLimited?: boolean;
  }
  
  export interface NavigationLink {
    label: string;
    path: string;
    notLimited?: boolean;
    icon?: string;
    subLinks: NavigationSubLink[];
  }
  
  export enum VisibleFor {
    All = 'All',
    MyEnvironment = 'My Environment',
    Main = 'Main',
  }
  
  export interface FaqCategoryResponse {
    id: number;
    documentId: string;
    name: string;
    isHidden: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    visibleFor: VisibleFor;
    faq_questions: FaqQuestionResponse[];
  }
  
  export interface FaqQuestionResponse {
    publishedAt: string;
    id: number;
    documentId: string;
    question: string;
    answer: string;
    isHidden: boolean;
    createdAt: string;
    updatedAt: string;
    locale: string;
    visibleFor: VisibleFor;
  }
  
  export interface WhyBlock {
    id: number;
    title: string;
    description: string;
    link: string;
    url: string;
    icon: Image;
  }
  
  export interface ServicePageResponse {
    id: number;
    documentId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    whyBlocks: WhyBlock[];
  }
  
  export interface Image {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: string[];
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string;
    provider: string;
    provider_metadata: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }