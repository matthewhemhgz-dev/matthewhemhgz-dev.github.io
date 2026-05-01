export interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  lang?: 'zh' | 'en';
}

export interface ShareLabels {
  shareLabel: string;
  wechat: string;
  weibo: string;
  twitter: string;
  linkedin: string;
  copyLink: string;
  copied: string;
  scanToShare: string;
  shareOnX: string;
  shareOnWeibo: string;
  shareOnLinkedIn: string;
  shareOnWeChat: string;
  copyLinkAria: string;
}
