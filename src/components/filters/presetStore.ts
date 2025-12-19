// presetStore.ts
import { Store } from "@tanstack/store";

export interface PresetItem {
  id: string;
  name: string;
  date: string;
  filters: any;
}

const storageKey = (pageKey?: string) =>
  `FILTER_PRESETS_${pageKey ?? "default"}`;

function loadInitial(pageKey: string) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(pageKey)) || "[]");
  } catch {
    return [];
  }
}

export const presetStore = new Store<Record<string, PresetItem[]>>({});


export const getPresets = (pageKey: string): PresetItem[] => {
  const current = presetStore.state[pageKey];
  if (current) return current;

  const loaded = loadInitial(pageKey);

  presetStore.setState((prev) => ({
    ...prev,
    [pageKey]: loaded,
  }));

  return loaded;
};

export const savePresets = (pageKey: string, items: PresetItem[]) => {
  presetStore.setState((prev) => ({
    ...prev,
    [pageKey]: items,
  }));

  localStorage.setItem(storageKey(pageKey), JSON.stringify(items));
};

export const deletePreset = (pageKey: string, id: string) => {
  const next = getPresets(pageKey).filter((p) => p.id !== id);
  savePresets(pageKey, next);
};

export const addPreset = (pageKey: string, item: PresetItem) => {
  const next = [item, ...getPresets(pageKey)];
  savePresets(pageKey, next);
};
