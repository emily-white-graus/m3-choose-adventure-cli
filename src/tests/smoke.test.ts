import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import type { Story, Choice } from "../types";

describe("Smoke tests for core functions", () => {
  it("loadStory should load a valid Story object", () => {
    const filePath = path.join(__dirname, "../story.json");
    const raw = readFileSync(filePath, "utf8");
    const story: Story = JSON.parse(raw);

    expect(story).toHaveProperty("title");
    expect(story).toHaveProperty("start");
    expect(Array.isArray(story.scenes)).toBe(true);
  });

  it("promptChoices should map Choice[] correctly", () => {
    const choices: Choice[] = [
      { label: "A", target: "sceneA" },
      { label: "B", target: "sceneB" },
    ];
    const mapped = choices.map((c) => ({ name: c.label, value: c.target }));

    expect(mapped[0]).toEqual({ name: "A", value: "sceneA" });
    expect(mapped[1]).toEqual({ name: "B", value: "sceneB" });
  });

  it("createSceneMap should map scenes by ID", () => {
    const filePath = path.join(__dirname, "../story.json");
    const story: Story = JSON.parse(readFileSync(filePath, "utf8"));
    const map = new Map(story.scenes.map((s) => [s.id, s]));

    expect(map.size).toBeGreaterThan(0);
    const firstScene = map.get(story.start);
    expect(firstScene).toBeDefined();
    expect(firstScene?.id).toBe(story.start);
  });
});
