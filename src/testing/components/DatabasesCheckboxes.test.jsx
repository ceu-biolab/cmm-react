import { render, screen } from "@testing-library/react";
import DatabasesCheckboxes from "../../components/search/DatabasesCheckboxes";
import userEvent from "@testing-library/user-event";
import { expect, it, describe, vi } from "vitest";
import "@testing-library/jest-dom";

describe("DatabasesCheckboxes", () => {
  it("renders checkboxes with correct default state", () => {
    const selectedDatabases = [];
    const handleChange = vi.fn();
  
    render(
      <DatabasesCheckboxes
        selectedDatabases={selectedDatabases}
        onChange={handleChange}
      />
    );
  
    expect(screen.getByText(/Databases/i)).toBeInTheDocument();
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(7);
  
    checkboxes.forEach((cb) => expect(cb).not.toBeChecked());
  });

  it("allows user to select and deselect multiple checkboxes", async () => {
    const selectedDatabases = [];
    const handleChange = vi.fn();

    render(
      <DatabasesCheckboxes
        selectedDatabases={selectedDatabases}
        onChange={handleChange}
      />
    );

    const checkboxHMDB = screen.getByRole("checkbox", { name: "HMDB" });
    const checkboxLipidMaps = screen.getByRole("checkbox", {
      name: "LipidMaps",
    });
    const checkboxAspergillus = screen.getByRole("checkbox", {
      name: "Aspergillus",
    });

    console.log("Before clicking:", checkboxHMDB.checked);

    await userEvent.click(checkboxHMDB);
    await userEvent.click(checkboxLipidMaps);
    await userEvent.click(checkboxAspergillus);

    console.log("After clicking:", checkboxHMDB.checked);

    expect(checkboxHMDB).toBeChecked();
    expect(checkboxLipidMaps).toBeChecked();
    expect(checkboxAspergillus).toBeChecked();

    await userEvent.click(checkboxAspergillus);

    expect(checkboxAspergillus).not.toBeChecked();
  });

  it("calls onChange when a checkbox is selected and deselected", async () => {
    const handleChange = vi.fn();
    const selectedDatabases = [];

    render(
      <DatabasesCheckboxes
        selectedDatabases={selectedDatabases}
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole("checkbox", { name: "HMDB" });

    await userEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);

    await userEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(2);
  });
});
