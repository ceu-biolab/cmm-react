import { render, screen } from "@testing-library/react";
import ExperimentalMassInput from "../../components/search/ExperimentalMassInput";
import userEvent from "@testing-library/user-event";
import { expect, it, describe, vi } from "vitest";
import "@testing-library/jest-dom";

describe("ExperimentalMassInput", () => {
  it("renders the input and label", () => {
    render(<ExperimentalMassInput />);
    const label = screen.getByText(/Experimental Mass/i);
    const input = screen.getByPlaceholderText(/Enter mass value/i);

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it("updates value when typing in the input", async () => {
    render(<ExperimentalMassInput />);
    const input = screen.getByPlaceholderText(/Enter mass value/i);

    await userEvent.type(input, "757.5667");

    expect(input).toHaveValue("757.5667");
  });

  it("calls the onChange handler when value changes", async () => {
    const handleChange = vi.fn();
    render(<ExperimentalMassInput onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/Enter mass value/i);

    await userEvent.type(input, "757.5667");

    expect(handleChange).toHaveBeenCalled;
  });
});
