import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import MsMsSearch from "../../pages/lcmsSearch/MsMsSearch";
import "@testing-library/jest-dom/vitest";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

beforeEach(() => {
  axios.get.mockRejectedValue(new Error("Network disabled for tests"));
  axios.post.mockRejectedValue(new Error("Network disabled for tests"));
});

describe("MsMsSearch", () => {
  it("toggles adduct selection via checkboxes", async () => {
    const user = userEvent.setup();
    render(<MsMsSearch />);

    const adductNa = screen.getByRole("checkbox", { name: "[M+Na]+" });

    expect(adductNa).toBeChecked();

    await user.click(adductNa);
    expect(adductNa).not.toBeChecked();

    await user.click(adductNa);
    expect(adductNa).toBeChecked();
  });
});
