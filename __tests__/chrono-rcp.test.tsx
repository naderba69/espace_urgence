// @vitest-environment jsdom
// Régression chronomètre RCP : reset sans fuite de temps, pause/reprise et alarme de cycle.
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/Providers", () => ({ useApp: () => ({ t: (key: string) => key }) }));
vi.mock("@/components/SearchBar", () => ({ useRegisterRecent: () => {} }));
vi.mock("@/lib/hooks", () => ({ useWakeLock: () => {} }));
vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));
vi.mock("@/lib/audio", () => ({
  cycleAlarm: vi.fn(),
  metronomeTick: vi.fn(),
  unlockAudio: vi.fn(),
}));

import { cycleAlarm, unlockAudio } from "@/lib/audio";
import CprTimerPage from "@/app/calculateurs/chrono-rcp/page";

let monotonicNow = 0;

beforeEach(() => {
  vi.useFakeTimers();
  monotonicNow = 0;
  vi.spyOn(performance, "now").mockImplementation(() => monotonicNow);
  vi.mocked(cycleAlarm).mockClear();
  vi.mocked(unlockAudio).mockClear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Chronomètre RCP", () => {
  it("un reset en cours annule les anciens ticks et repart de zéro", () => {
    render(<CprTimerPage />);
    const timer = screen.getByRole("timer");

    fireEvent.click(screen.getByRole("button", { name: "rcp.start" }));
    monotonicNow = 5_000;
    act(() => vi.advanceTimersByTime(200));
    expect(timer.textContent).toBe("00:05");

    fireEvent.click(screen.getByRole("button", { name: "common.reset" }));
    expect(timer.textContent).toBe("00:00");
    fireEvent.click(screen.getByRole("button", { name: "rcp.start" }));
    monotonicNow = 6_000;
    act(() => vi.advanceTimersByTime(200));
    expect(timer.textContent).toBe("00:01");
  });

  it("préserve le temps à la pause, reprend sans compter l’arrêt et signale le cycle de 2 min", () => {
    render(<CprTimerPage />);
    const timer = screen.getByRole("timer");

    fireEvent.click(screen.getByRole("button", { name: "rcp.start" }));
    expect(unlockAudio).toHaveBeenCalledTimes(1);
    monotonicNow = 15_000;
    act(() => vi.advanceTimersByTime(200));
    fireEvent.click(screen.getByRole("button", { name: "rcp.stop" }));
    expect(timer.textContent).toBe("00:15");

    monotonicNow = 50_000;
    act(() => vi.advanceTimersByTime(5_000));
    expect(timer.textContent).toBe("00:15");
    fireEvent.click(screen.getByRole("button", { name: "rcp.start" }));
    monotonicNow = 55_000;
    act(() => vi.advanceTimersByTime(200));
    expect(timer.textContent).toBe("00:20");

    monotonicNow = 155_000;
    act(() => vi.advanceTimersByTime(200));
    expect(timer.textContent).toBe("02:00");
    expect(screen.getByText("2")).toBeTruthy();
    expect(cycleAlarm).toHaveBeenCalledTimes(1);
  });
});
