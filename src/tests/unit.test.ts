import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import type { Story } from "../types";

describe("Unit test: Scene mapping", () => {
  const filePath = path.join(__dirname, "../story.json");
  const story: Story = JSON.parse(readFileSync(filePath, "utf8"));
  const map = new Map(story.scenes.map((s) => [s.id, s]));

  it("should contain all scenes by ID", () => {
    story.scenes.forEach((scene) => {
      expect(map.has(scene.id)).toBe(true);
    });
  });

  it("should properly return scene text and choices", () => {
    const scene = map.get("arrival");
    expect(scene).toBeDefined();
    expect(scene?.text).toContain("A pale owl drops a wax-sealed envelope");
    expect(scene?.choices?.length).toBe(3);
  });
});
