import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import axios from "axios";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

const StatefulAdductsCheckboxes = ({
  initialSelection = [],
  onSelectionChange = () => {},
  ionizationMode,
}) => {
  const [selectedAdducts, setSelectedAdducts] = useState(initialSelection);

  const handleSelectionChange = (nextSelection) => {
    setSelectedAdducts(nextSelection);
    onSelectionChange(nextSelection);
  };

  return (
    <AdductsCheckboxes
      selectedAdducts={selectedAdducts}
      onSelectionChange={handleSelectionChange}
      ionizationMode={ionizationMode}
    />
  );
};

beforeEach(() => {
  axios.get.mockRejectedValue(new Error("Network disabled for tests"));
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("AdductsCheckboxes", () => {
  it("renders adduct checkboxes and label", () => {
    render(<StatefulAdductsCheckboxes />);

    expect(screen.getByText(/Adducts/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Select All" })).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /\[M\+H\]\+/ })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(2);
  });

  it("allows user to select and deselect adducts", async () => {
    render(<StatefulAdductsCheckboxes />);

    const checkboxMH = screen.getByRole("checkbox", { name: /\[M\+H\]\+/ });
    const checkboxNa = screen.getByRole("checkbox", { name: /\[M\+Na\]\+/ });
    const checkboxK = screen.getByRole("checkbox", { name: /\[M\+K\]\+/ });

    expect(checkboxMH).not.toBeChecked();
    expect(checkboxNa).not.toBeChecked();
    expect(checkboxK).not.toBeChecked();

    await userEvent.click(checkboxMH);
    await userEvent.click(checkboxNa);
    await userEvent.click(checkboxK);

    expect(checkboxMH).toBeChecked();
    expect(checkboxNa).toBeChecked();
    expect(checkboxK).toBeChecked();

    await userEvent.click(checkboxNa);
    expect(checkboxNa).not.toBeChecked();
  });

  it("calls onSelectionChange when adducts are selected or deselected", async () => {
    const onSelectionChange = vi.fn();
    render(
      <StatefulAdductsCheckboxes onSelectionChange={onSelectionChange} />
    );

    const checkboxMH = screen.getByRole("checkbox", { name: /\[M\+H\]\+/ });

    await userEvent.click(checkboxMH);
    await userEvent.click(checkboxMH);

    expect(onSelectionChange).toHaveBeenCalledTimes(2);
  });

  it("defaults to the first six available adducts for the selected ionization mode", async () => {
    const onSelectionChange = vi.fn();
    render(
      <StatefulAdductsCheckboxes
        ionizationMode="POSITIVE"
        onSelectionChange={onSelectionChange}
      />
    );

    await waitFor(() =>
      expect(onSelectionChange).toHaveBeenCalledWith([
        "[M+Na]+",
        "[M+2H]2+",
        "[M+H]+",
        "[M+K]+",
        "[M+NH4]+",
        "[M+H-H2O]+",
      ])
    );

    expect(screen.getByRole("checkbox", { name: /\[M\+Na\]\+/ })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /\[M\+Li\]\+/ })).not.toBeChecked();
  });
});
