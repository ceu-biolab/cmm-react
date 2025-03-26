import { render, screen } from "@testing-library/react";
import IonizationSelection from "../../components/search/IonizationSelection";
import userEvent from "@testing-library/user-event";
import { expect, it, describe, vi } from "vitest";
import "@testing-library/jest-dom";

describe("IonizationSelection", () => {
  it("renders the radio buttons and label", () => {
    render(<IonizationSelection />);
    const label = screen.getByText(/Ionization Mode/i);
    const radio1 = screen.getByRole("radio", { name: "Neutral" });
    const radio2 = screen.getByRole("radio", { name: "Positive Mode" });
    const radio3 = screen.getByRole("radio", { name: "Negative Mode" });
    
    expect(label).toBeInTheDocument();
    expect(radio1).toBeInTheDocument();
    expect(radio2).toBeInTheDocument();
    expect(radio3).toBeInTheDocument();
  });

  it("has 'Neutral' selected by default", () => {
    render(<IonizationSelection />);
    const radio1 = screen.getByRole("radio", { name: "Neutral" });
    const radio2 = screen.getByRole("radio", { name: "Positive Mode" });
    const radio3 = screen.getByRole("radio", { name: "Negative Mode" });

    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(radio3).not.toBeChecked();
  });

  it("selects a radio button on user selection", async () => {
    render(<IonizationSelection />);
    const radio1 = screen.getByRole("radio", { name: "Neutral" });
    const radio2 = screen.getByRole("radio", { name: "Positive Mode" });
    const radio3 = screen.getByRole("radio", { name: "Negative Mode" });

    await userEvent.click(radio2);

    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
    expect(radio3).not.toBeChecked();
  });

  it("allows multiple switches between radio buttons", async () => {
    render(<IonizationSelection />);
    const radio1 = screen.getByRole("radio", { name: "Neutral" });
    const radio2 = screen.getByRole("radio", { name: "Positive Mode" });
    const radio3 = screen.getByRole("radio", { name: "Negative Mode" });

    await userEvent.click(radio3);
    expect(radio3).toBeChecked();
    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();

    await userEvent.click(radio1);
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(radio3).not.toBeChecked();
  });

  it("calls the onChange handler when selection changes", async () => {
    const handleChange = vi.fn();
    render(<IonizationSelection onChange={handleChange} />);
    const radio1 = screen.getByRole("radio", { name: "Neutral" });
    const radio2 = screen.getByRole("radio", { name: "Positive Mode" });
    const radio3 = screen.getByRole("radio", { name: "Negative Mode" });

    await userEvent.click(radio2);

    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
    expect(radio3).not.toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
