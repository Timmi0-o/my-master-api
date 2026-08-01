export type EmailActionMessages = {
  subject: string;
  title: string;
  intro: string;
  cta: string;
  expires: string;
  ignore: string;
  textIntro: string;
  textLinkLabel: string;
};

export type EmailMessages = {
  layout: {
    brandName: string;
    linkFallback: string;
    footer: string;
  };
  verification: EmailActionMessages;
  passwordReset: EmailActionMessages;
};
