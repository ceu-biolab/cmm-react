import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import LcMsMsSearch from "../../pages/lcmsSearch/LcMsMsSearch";
import "@testing-library/jest-dom/vitest";

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

beforeEach(() => {
  axios.get.mockRejectedValue(new Error("Network disabled for tests"));
  axios.post.mockReset();
});

describe("LcMsMsSearch", () => {
  it("renders compounds returned under the backend msmsFeatures key", async () => {
    const user = userEvent.setup();

    axios.post.mockResolvedValueOnce({
      data: {
        msmsFeatures: [
          {
            feature: {
              mzValue: 132.101905,
              rtValue: 5.2,
            },
            msmsList: [
              {
                msmsId: 273,
                compound: {
                  compoundId: 27412,
                  compoundName: "L-Isoleucine",
                  formula: "C6H13NO2",
                  mass: 131.094628665,
                  hmdbID: "HMDB0000172",
                },
                adduct: "[M+H]+",
                spectrumSource: "experimental",
                msmsCosineScore: 1,
                collisionEnergy: 40,
                spectrum: {
                  peaks: [{ mz: 41.305, intensity: 1 }],
                },
              },
            ],
            experimentalSpectrum: {
              peaks: [{ mz: 41.305, intensity: 100 }],
            },
          },
          {
            feature: {
              mzValue: 287.236,
              rtValue: 6.8,
            },
            msmsList: [],
            experimentalSpectrum: {
              peaks: [{ mz: 55.301, intensity: 12.753 }],
            },
          },
        ],
      },
    });

    render(
      <BrowserRouter>
        <LcMsMsSearch />
      </BrowserRouter>
    );

    await user.click(screen.getByRole("button", { name: /load demo data/i }));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith(
        "/api/lcmsms-search",
        expect.any(Object),
        expect.any(Object)
      )
    );

    expect(
      await screen.findByRole("button", { name: /\[M\+H\]\+ \(1 compounds\)/i })
    ).toBeInTheDocument();
  });
});
