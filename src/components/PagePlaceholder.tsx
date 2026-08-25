import { useI18n, type TranslationKey } from "@/lib/i18n";

export function PagePlaceholder({
  titleKey,
  subKey,
  children,
}: {
  titleKey: TranslationKey;
  subKey: TranslationKey;
  children?: React.ReactNode;
}) {
  const { t } = useI18n();

  return (
    <div className="rise-anime mx-auto max-w-4xl px-4 py-10 md:px-8">
      <h1 className="text-4xl font-semibold text-foreground md:text-5xl">{t(titleKey)}</h1>
      <p className="mt-3 text-muted-foreground">{t(subKey)}</p>
      <div className="mt-8 rounded-2xl border border-border petal-gradient p-6 shadow-petal">
        {children ?? <p className="text-sm text-secondary-foreground">{t("soon")}</p>}
      </div>
    </div>
  );
}
