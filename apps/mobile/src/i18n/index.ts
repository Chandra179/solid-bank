import { create } from "zustand";
import id from "./locales/id";
import en from "./locales/en";
import type { TranslationShape } from "./locales/id";

export type Locale = "id" | "en";

// id-first: Bahasa Indonesia is the default locale, not an alternate one
// bolted onto an English-first app. This app's target market is Indonesian
// digital-banking users (see research/digital-bank-market-research.md and
// research/indonesia-prep-checklist.md) — shipping id as the default is
// what "translate the app, not just the marketing site" from that research
// actually means in code, not an afterthought behind an `en` flag.
const DEFAULT_LOCALE: Locale = "id";

const RESOURCES: Record<Locale, TranslationShape> = { id, en };

// Recursively builds every dot-separated path through the translation tree
// ("home.quickActions.topUp") as a string-literal union, so `t()` calls get
// real autocomplete/typo-checking against id.ts's shape instead of accepting
// any string. Both locale files are statically shaped the same way (en.ts's
// `satisfies TranslationShape` enforces that), so id.ts alone is enough to
// derive this from.
type Paths<T, Prefix extends string = ""> = T extends string
  ? Prefix extends `${infer P}.`
    ? P
    : never
  : {
      [K in keyof T & string]: Paths<T[K], `${Prefix}${K}.`>;
    }[keyof T & string];

export type TranslationKey = Paths<TranslationShape>;

function resolve(tree: unknown, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((node, segment) => {
    if (node && typeof node === "object" && segment in node) {
      return (node as Record<string, unknown>)[segment];
    }
    return undefined;
  }, tree);
  return typeof value === "string" ? value : undefined;
}

// Simple {{token}} interpolation — matches the placeholder style already
// used in the locale files (e.g. moneyMove.verifyPinSubtitle's
// "{{flowNoun}}") rather than pulling in a full ICU/MessageFormat library
// for what's currently a handful of single-token substitutions.
function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, token: string) =>
    token in params ? String(params[token]) : match
  );
}

// Locale lives in a tiny Zustand store (already a project dependency, see
// store/session.ts) rather than React context: it needs to be readable from
// plain functions too (see utils/greeting.ts callers that aren't
// components), not just from within a component tree, and a global
// language switcher doesn't exist yet — when one does, every `useTranslation()`
// call site already re-renders on a locale change via the store subscription
// below, with no further plumbing needed.
interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: DEFAULT_LOCALE,
  setLocale: (locale) => set({ locale }),
}));

// Non-reactive translate — safe to call from plain utility functions
// (outside a component's render) since it just reads the store's current
// value rather than subscribing to it. Falls back id -> en -> the raw key
// itself (rendering "moneyMove.confirming" instead of a blank string is a
// louder, more debuggable failure than silently showing nothing).
export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const locale = useLocaleStore.getState().locale;
  const value = resolve(RESOURCES[locale], key) ?? resolve(RESOURCES.en, key) ?? key;
  return interpolate(value, params);
}

// Reactive hook for use inside components — re-renders when the locale
// changes (once a language switcher exists to change it) since it
// subscribes to the store rather than reading it once.
export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  return { t, locale, setLocale };
}
