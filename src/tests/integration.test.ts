import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import type { Story } from "../types";

describe("Integration test: mini game simulation", () => {
  it("should navigate from 'arrival' to 'ignore' ending", () => {
    const filePath = path.join(__dirname, "../story.json");
    const story: Story = JSON.parse(readFileSync(filePath, "utf8"));
    const map = new Map(story.scenes.map((s) => [s.id, s]));

    let current = story.start;

    // Simulate player choosing the second option "Ignore it — it's probably a prank"
    const scene = map.get(current);
    expect(scene).toBeDefined();

    const choices = scene?.choices ?? [];
    const selected = choices[1].target; // second option
    current = selected;

    const nextScene = map.get(current);
    expect(nextScene?.choices?.length).toBe(0); // ending scene
    expect(nextScene?.text).toContain("THE END — Curiosity Waits");
  });
});
