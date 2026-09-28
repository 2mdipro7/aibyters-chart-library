import { useTooltipStore } from "@aibyters/core";
import { motion, AnimatePresence } from "framer-motion";

export function TooltipOverlay() {
  const { isVisible, x, y, data, title } = useTooltipStore();

  return (
    <AnimatePresence>
      {isVisible && data && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 pointer-events-none rounded-md shadow-card border"
          style={{
            left: x + 16,
            top: y + 16,
            backgroundColor: "var(--vi-color-surface-elevated)",
            borderColor: "var(--vi-color-surface-border)",
            padding: "var(--vi-space-3)",
            minWidth: "150px",
          }}
        >
          {title && (
            <div className="font-semibold mb-2 text-sm text-primary">
              {title}
            </div>
          )}
          <div className="flex flex-col gap-1 text-xs">
            {Object.entries(data).map(([key, val]) => (
              <div key={key} className="flex justify-between gap-4">
                <span className="text-secondary capitalize">{key}:</span>
                <span className="font-medium text-primary">{String(val)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
