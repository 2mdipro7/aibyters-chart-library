import { describe, it, expect } from "vitest";
import { parseDataFrame, isValidDataFrame } from "../data-frame.schema";

describe("DataFrame Schema", () => {
  it("validates a correct data frame", () => {
    const validData = {
      fields: [
        { key: "month", label: "Month", type: "string", role: "dimension" },
        { key: "revenue", label: "Revenue", type: "number", role: "measure", format: "currency" },
      ],
      rows: [
        { month: "Jan", revenue: 100000 },
        { month: "Feb", revenue: 120000 },
      ],
    };

    expect(isValidDataFrame(validData)).toBe(true);
    expect(() => parseDataFrame(validData)).not.toThrow();
  });

  it("rejects invalid data frames", () => {
    const invalidData = {
      fields: [
        { key: "month" }, // missing required fields
      ],
      rows: [],
    };

    expect(isValidDataFrame(invalidData)).toBe(false);
    expect(() => parseDataFrame(invalidData)).toThrow();
  });
});
