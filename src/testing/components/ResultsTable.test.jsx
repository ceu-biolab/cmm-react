import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import ResultsTable from "../../components/search/ResultsTable";

afterEach(cleanup);

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

describe("ResultsTable sorting", () => {
  const renderTable = (props) => render(
    <MemoryRouter><ResultsTable {...props} /></MemoryRouter>
  );
  const rowNames = () => screen.getAllByRole("row").slice(1)
    .map((row) => within(row).getAllByRole("cell")[1].textContent);

  it("preserves initial order and sorts numeric values with stable ties and missing values last", async () => {
    const user = userEvent.setup();
    const results = [
      { compoundName: "Ten", mass: "10" },
      { compoundName: "Missing", mass: null },
      { compoundName: "Two", mass: "2" },
      { compoundName: "Another two", mass: 2 },
    ];
    renderTable({ results });
    expect(rowNames()).toEqual(["Ten", "Missing", "Two", "Another two"]);
    const header = screen.getByRole("columnheader", { name: "Mass" });
    expect(header).toHaveAttribute("aria-sort", "none");

    await user.click(within(header).getByRole("button"));
    expect(rowNames()).toEqual(["Two", "Another two", "Ten", "Missing"]);
    expect(header).toHaveAttribute("aria-sort", "ascending");

    await user.click(within(header).getByRole("button"));
    expect(rowNames()).toEqual(["Ten", "Two", "Another two", "Missing"]);
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(results.map((row) => row.compoundName)).toEqual(["Ten", "Missing", "Two", "Another two"]);
  });

  it("sorts text, IDs, external IDs, pathways and search-specific columns", async () => {
    const user = userEvent.setup();
    renderTable({
      results: [
        { compoundId: 10, compoundName: "Zeta", hmdbID: "HMDB10", pathway: "Zeta pathway", customScore: "10" },
        { compoundId: 2, compoundName: "alpha", hmdbID: "HMDB2", pathway: "Alpha pathway", customScore: "2" },
      ],
      extraColumns: [{ header: "Custom Score", key: "customScore", type: "number" }],
    });
    for (const name of ["Name", "ID", "External IDs", "Pathways", "Custom Score"]) {
      await user.click(screen.getByRole("button", { name }));
      expect(rowNames()).toEqual(["alpha", "Zeta"]);
      await user.click(screen.getByRole("button", { name }));
      expect(rowNames()).toEqual(["Zeta", "alpha"]);
    }
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute("aria-sort", "none");
  });

  it("preserves row identities and selection after keyboard sorting", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    renderTable({
      results: [{ compoundName: "Zeta" }, { compoundName: "Alpha" }],
      getRowId: (_, index) => `match-${index}`,
      isRowSelectable: (_, index) => index === 1,
      selectedRowId: "match-1",
      onRowClick,
    });
    screen.getByRole("button", { name: "Name" }).focus();
    await user.keyboard("{Enter}");
    const rows = screen.getAllByRole("row").slice(1);
    expect(rows[0]).toHaveClass("selected-result-row");
    expect(within(rows[0]).getByRole("link")).toHaveTextContent("2");
    await user.click(within(rows[0]).getByRole("cell", { name: "Alpha" }));
    expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ compoundName: "Alpha" }), "match-1");
    await user.click(within(rows[1]).getByRole("cell", { name: "Zeta" }));
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });
});
