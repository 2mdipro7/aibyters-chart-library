import { create } from "zustand";

export interface TooltipState {
  isVisible: boolean;
  x: number;
  y: number;
  data: Record<string, any> | null;
  title?: string;
  show: (x: number, y: number, data: Record<string, any>, title?: string) => void;
  hide: () => void;
}

export const useTooltipStore = create<TooltipState>((set) => ({
  isVisible: false,
  x: 0,
  y: 0,
  data: null,
  title: undefined,
  show: (x, y, data, title) => set({ isVisible: true, x, y, data, title }),
  hide: () => set({ isVisible: false, data: null }),
}));
