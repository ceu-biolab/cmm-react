import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ResultsTable from "../../components/search/ResultsTable";

describe("ResultsTable GC-MS retention index errors", () => {
  it("shows absolute and relative RI error columns", () => {
    render(
      <MemoryRouter>
        <ResultsTable
          results={[
            {
              compoundId: 123,
              compoundName: "Example compound",
              experimentalRI: 1500,
              riError: 146,
              riErrorPct: (146 / 1500) * 100,
            },
          ]}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("columnheader", { name: "RI Error (absolute)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "RI Error (%)" })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "146.00" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "9.73" })).toBeInTheDocument();
  });
});
