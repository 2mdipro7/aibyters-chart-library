
import { ChartErrorBoundary, ChartFrame, type BaseChartProps, type ChartFrameProps } from "@aibyters/core";
import { WidgetCard } from "./WidgetCard";

export interface ChartCardProps
  extends Pick<BaseChartProps, "title" | "description" | "headerAction" | "footer" | "exportData" | "exportColumns" | "className" | "style" | "variant" | "ariaLabel">,
    Omit<ChartFrameProps, "footer" | "className" | "style" | "ariaLabel"> {}

/**
 * WidgetCard + ChartFrame + error boundary. Every chart component renders through this so the
 * card chrome, legend placement, responsive behaviour, and loading/error/empty states are
 * identical across packages.
 */
export function ChartCard({
  title,
  description,
  headerAction,
  footer,
  exportData,
  exportColumns,
  className,
  style,
  variant,
  ariaLabel,
  children,
  ...frame
}: ChartCardProps) {
  return (
    <WidgetCard
      title={title}
      description={description}
      headerAction={headerAction}
      footer={footer}
      exportData={exportData}
      exportColumns={exportColumns}
      className={className}
      style={style}
      variant={variant}
    >
      <ChartErrorBoundary>
        <ChartFrame ariaLabel={ariaLabel ?? (description ? `${title}. ${description}` : title)} {...frame}>
          {children}
        </ChartFrame>
      </ChartErrorBoundary>
    </WidgetCard>
  );
}
