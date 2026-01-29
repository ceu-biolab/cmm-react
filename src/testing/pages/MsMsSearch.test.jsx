import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import MsMsSearch from "../../pages/lcmsSearch/MsMsSearch";
import "@testing-library/jest-dom/vitest";

describe("MsMsSearch", () => {
  it("toggles adduct selection via checkboxes", async () => {
    const user = userEvent.setup();
    render(<MsMsSearch />);

    const adductNa = screen.getByRole("checkbox", { name: "[M+Na]+" });

    expect(adductNa).not.toBeChecked();

    await user.click(adductNa);
    expect(adductNa).toBeChecked();

    await user.click(adductNa);
    expect(adductNa).not.toBeChecked();
  });
});
