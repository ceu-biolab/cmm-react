import { render, screen } from "@testing-library/react";
import AdductsCheckboxes from "../../components/search/AdductsCheckboxes";
import userEvent from "@testing-library/user-event";
import { expect, it, describe, vi } from "vitest";
import "@testing-library/jest-dom";

describe("AdductsCheckboxes", () => {
  it("renders the checkboxes and label", () => {
    render(<AdductsCheckboxes />);
    const label = screen.getByText(/Adducts/i);
    const checkboxes = screen.getAllByRole("checkbox");

    expect(label).toBeInTheDocument();
    expect(checkboxes).toHaveLength(44);
  });

  it("checkboxes are unchecked by default", () => {
    render(<AdductsCheckboxes />);
    const checkboxes = screen.getAllByRole("checkbox");
  
    checkboxes.forEach(cb => expect(cb).not.toBeChecked());
  });

  it("allows user to select and deselect multiple checkboxes", async () => {
    render(<AdductsCheckboxes />);

    const checkboxMH = screen.getByRole("checkbox", { name: "M+H" });
    const checkboxNa = screen.getByRole("checkbox", { name: "M+Na" });
    const checkboxK = screen.getByRole("checkbox", { name: "M+K" });

    await userEvent.click(checkboxMH);
    await userEvent.click(checkboxNa);
    await userEvent.click(checkboxK);

    expect(checkboxMH).toBeChecked();
    expect(checkboxNa).toBeChecked();
    expect(checkboxK).toBeChecked();

    await userEvent.click(checkboxNa);

    expect(checkboxNa).not.toBeChecked();
  });

  it("calls onChange when a checkbox is selected and deselected", async () => {
    const handleChange = vi.fn();
    render(<AdductsCheckboxes onChange={handleChange} />);
  
    const checkbox = screen.getByRole("checkbox", { name: "M+H" });
    await userEvent.click(checkbox);
  
    expect(handleChange).toHaveBeenCalledTimes(1);

    await userEvent.click(checkbox);
  
    expect(handleChange).toHaveBeenCalledTimes(2);
  });
});
