import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import DatabasesCheckboxes from "../../components/search/DatabasesCheckboxes";
import {
  DATABASE_OPTIONS,
  toggleDatabaseSelection,
} from "../../utils/databaseSelection";

const StatefulDatabasesCheckboxes = ({
  initialSelection = [],
  onSelectionChange = () => {},
}) => {
  const [selectedDatabases, setSelectedDatabases] = useState(initialSelection);

  const handleChange = (event) => {
    const { value, checked } = event.target;
    const nextSelection = toggleDatabaseSelection(
      selectedDatabases,
      value,
      checked
    );
    setSelectedDatabases(nextSelection);
    onSelectionChange(nextSelection);
  };

  return (
    <DatabasesCheckboxes
      selectedDatabases={selectedDatabases}
      onChange={handleChange}
    />
  );
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("DatabasesCheckboxes", () => {
  it("renders all configured database options unchecked by default", () => {
    render(<StatefulDatabasesCheckboxes />);

    expect(screen.getByText(/Databases/i)).toBeInTheDocument();
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(DATABASE_OPTIONS.length);
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());
  });

  it("allows user to select and deselect multiple databases", async () => {
    render(<StatefulDatabasesCheckboxes />);

    const checkboxHMDB = screen.getByRole("checkbox", { name: "HMDB" });
    const checkboxLipidMaps = screen.getByRole("checkbox", {
      name: "LIPIDMAPS",
    });
    const checkboxAspergillus = screen.getByRole("checkbox", {
      name: "ASPERGILLUS",
    });

    await userEvent.click(checkboxHMDB);
    await userEvent.click(checkboxLipidMaps);
    await userEvent.click(checkboxAspergillus);

    expect(checkboxHMDB).toBeChecked();
    expect(checkboxLipidMaps).toBeChecked();
    expect(checkboxAspergillus).toBeChecked();

    await userEvent.click(checkboxAspergillus);
    expect(checkboxAspergillus).not.toBeChecked();
  });

  it("calls onSelectionChange when a database selection changes", async () => {
    const onSelectionChange = vi.fn();
    render(
      <StatefulDatabasesCheckboxes onSelectionChange={onSelectionChange} />
    );

    const checkbox = screen.getByRole("checkbox", { name: "HMDB" });
    await userEvent.click(checkbox);
    await userEvent.click(checkbox);

    expect(onSelectionChange).toHaveBeenCalledTimes(2);
  });
});

