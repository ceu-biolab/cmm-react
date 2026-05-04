import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import CeMsCompoundSelector from "../../components/search/CeMsCompoundSelector";

afterEach(() => {
  cleanup();
});

describe("CeMsCompoundSelector", () => {
  it("shows available compounds first and disables unavailable ones", async () => {
    const onChange = vi.fn();

    render(
      <CeMsCompoundSelector
        label="RMT Reference Compound"
        name="rmt_reference"
        value=""
        onChange={onChange}
        options={["MES", "Paracetamol", "L-Methionine sulfone"]}
        availableOptions={["Paracetamol", "L-Methionine sulfone"]}
      />
    );

    const optionButtons = screen.getAllByRole("button");
    expect(optionButtons.map((button) => button.textContent)).toEqual([
      "Paracetamol",
      "L-Methionine sulfone",
      "MESUnavailable",
    ]);
    expect(optionButtons[2]).toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: "Paracetamol" }));

    expect(onChange).toHaveBeenCalledWith({
      target: {
        name: "rmt_reference",
        type: "text",
        value: "Paracetamol",
      },
    });
  });

  it("filters the compound list from the search input", async () => {
    render(
      <CeMsCompoundSelector
        label="Marker Compound"
        name="marker"
        value=""
        onChange={() => {}}
        options={["MES", "Paracetamol", "L-Methionine sulfone"]}
        availableOptions={["Paracetamol", "L-Methionine sulfone"]}
      />
    );

    await userEvent.type(
      screen.getByRole("searchbox", { name: "Marker Compound search" }),
      "meth"
    );

    expect(
      screen.getByRole("button", { name: "L-Methionine sulfone" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Paracetamol" })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /MES/ })).not.toBeInTheDocument();
  });
});
