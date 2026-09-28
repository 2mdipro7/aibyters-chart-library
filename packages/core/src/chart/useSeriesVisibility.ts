import { useCallback, useMemo, useState } from "react";

export interface SeriesVisibility {
  hidden: ReadonlySet<string>;
  highlighted: string | null;
  isVisible: (key: string) => boolean;
  toggle: (key: string) => void;
  solo: (key: string) => void;
  showAll: () => void;
  setHighlighted: (key: string | null) => void;
}

/** Legend-driven show / hide state for multi-series charts. */
export function useSeriesVisibility(allKeys: string[]): SeriesVisibility {
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const toggle = useCallback(
    (key: string) => {
      setHidden((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else {
          // Never allow hiding the last visible series.
          if (allKeys.length - next.size <= 1) return prev;
          next.add(key);
        }
        return next;
      });
    },
    [allKeys]
  );

  const solo = useCallback(
    (key: string) => {
      setHidden(new Set(allKeys.filter((k) => k !== key)));
    },
    [allKeys]
  );

  const showAll = useCallback(() => setHidden(new Set()), []);
  const isVisible = useCallback((key: string) => !hidden.has(key), [hidden]);

  return useMemo(
    () => ({ hidden, highlighted, isVisible, toggle, solo, showAll, setHighlighted }),
    [hidden, highlighted, isVisible, toggle, solo, showAll]
  );
}
