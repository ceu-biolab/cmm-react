import { render, screen } from "@testing-library/react";
import ToleranceSelection from "../../components/search/ToleranceSelection";
import userEvent from "@testing-library/user-event";
import { expect, it, describe, vi } from "vitest";
import "@testing-library/jest-dom";

describe("ToleranceSelection", () => {
  it("renders the radio buttons, label, and input text field", () => {
    render(<ToleranceSelection />);
    const label = screen.getByText(/Tolerance/i);
    const input = screen.getByDisplayValue("10");
    const radio1 = screen.getByRole("radio", { name: "ppm" });
    const radio2 = screen.getByRole("radio", { name: "mDa" });

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(radio1).toBeInTheDocument();
    expect(radio2).toBeInTheDocument();
  });

  it("has 'ppm' selected by default", () => {
    render(<ToleranceSelection />);
    const radio1 = screen.getByRole("radio", { name: "ppm" });
    const radio2 = screen.getByRole("radio", { name: "mDa" });

    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();
  });

  it("allows the user to change the tolerance value", async () => {
    render(<ToleranceSelection />);
    const input = screen.getByDisplayValue("10");

    await userEvent.clear(input);
    await userEvent.type(input, "20");

    expect(input).toHaveValue("20");
  });

  it("selects a radio button on user selection", async () => {
    render(<ToleranceSelection />);
    const radio1 = screen.getByRole("radio", { name: "ppm" });
    const radio2 = screen.getByRole("radio", { name: "mDa" });

    await userEvent.click(radio2);

    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
  });

  it("allows multiple switches between radio buttons", async () => {
    render(<ToleranceSelection />);
    const radio1 = screen.getByRole("radio", { name: "ppm" });
    const radio2 = screen.getByRole("radio", { name: "mDa" });

    await userEvent.click(radio2);
    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();

    await userEvent.click(radio1);
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();
  });

  it("calls the onChange handler when textfield input changes", async () => {
    const handleChange = vi.fn();
    render(<ToleranceSelection onChange={handleChange} />);
    const input = screen.getByDisplayValue("10");

    await userEvent.clear(input);
    await userEvent.type(input, "20");

    expect(input).toHaveValue("20");
    expect(handleChange).toHaveBeenCalled;
  });

  it("calls the onChange handler when radio button selection changes", async () => {
    const handleChange = vi.fn();
    render(<ToleranceSelection onChange={handleChange} />);
    const radio1 = screen.getByRole("radio", { name: "ppm" });
    const radio2 = screen.getByRole("radio", { name: "mDa" });

    await userEvent.click(radio2);

    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
