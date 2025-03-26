import { render, screen } from "@testing-library/react";
import MetabolitesSelection from "../../components/search/MetabolitesSelection";
import userEvent from "@testing-library/user-event";
import { expect, it, describe, vi } from "vitest";
import "@testing-library/jest-dom";

describe("MetabolitesSelection", () => {
  it("renders the radio buttons and label", () => {
    render(<MetabolitesSelection />);
    const label = screen.getByText(/Metabolites/i);
    const radio1 = screen.getByRole("radio", { name: "All except peptides" });
    const radio2 = screen.getByRole("radio", { name: "Only lipids" });
    const radio3 = screen.getByRole("radio", {
      name: "All including peptides",
    });

    expect(label).toBeInTheDocument();
    expect(radio1).toBeInTheDocument();
    expect(radio2).toBeInTheDocument();
    expect(radio3).toBeInTheDocument();
  });

  it("has 'Neutral' selected by default", () => {
    render(<MetabolitesSelection />);
    const radio1 = screen.getByRole("radio", { name: "All except peptides" });
    const radio2 = screen.getByRole("radio", { name: "Only lipids" });
    const radio3 = screen.getByRole("radio", {
      name: "All including peptides",
    });

    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(radio3).not.toBeChecked();
  });

  it("selects a radio button on user selection", async () => {
    render(<MetabolitesSelection />);
    const radio1 = screen.getByRole("radio", { name: "All except peptides" });
    const radio2 = screen.getByRole("radio", { name: "Only lipids" });
    const radio3 = screen.getByRole("radio", {
      name: "All including peptides",
    });

    await userEvent.click(radio2);

    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
    expect(radio3).not.toBeChecked();
  });

  it("allows multiple switches between radio buttons", async () => {
    render(<MetabolitesSelection />);
    const radio1 = screen.getByRole("radio", { name: "All except peptides" });
    const radio2 = screen.getByRole("radio", { name: "Only lipids" });
    const radio3 = screen.getByRole("radio", {
      name: "All including peptides",
    });

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
    render(<MetabolitesSelection onChange={handleChange} />);
    const radio1 = screen.getByRole("radio", { name: "All except peptides" });
    const radio2 = screen.getByRole("radio", { name: "Only lipids" });
    const radio3 = screen.getByRole("radio", {
      name: "All including peptides",
    });

    await userEvent.click(radio2);

    expect(radio1).not.toBeChecked();
    expect(radio2).toBeChecked();
    expect(radio3).not.toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
