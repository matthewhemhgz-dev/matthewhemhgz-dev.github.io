import { ui, defaultLang } from './ui';
import type { Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang in ui) return maybeLang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui[typeof defaultLang]): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, l: string = lang): string {
    return l === defaultLang ? path : `/${l}${path}`;
  };
}

export function getAlternateUrl(url: URL, targetLang: Lang): string {
  const currentLang = getLangFromUrl(url);
  const pathname = url.pathname;
  if (currentLang === defaultLang) {
    return targetLang === defaultLang ? pathname : `/${targetLang}${pathname}`;
  } else {
    const pathWithoutLang = pathname.replace(`/${currentLang}`, '');
    return targetLang === defaultLang ? pathWithoutLang : `/${targetLang}${pathWithoutLang}`;
  }
}
