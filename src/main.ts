import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { select } from "@inquirer/prompts";

import type { Story, Scene, SceneId, Choice } from "./types.ts";

// resolve current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// separator
const hr = (title?: string) =>
  console.log(`\n=== ${title ?? "============================"} ===\n`);

// load story.json
function loadStory(): Story {
  const filePath = path.join(__dirname, "story.json");
  return JSON.parse(readFileSync(filePath, "utf8"));
}

// build lookup map
const createSceneMap = (scenes: Scene[]) =>
  new Map<SceneId, Scene>(scenes.map((s) => [s.id, s]));

const renderScene = (scene: Scene) => {
  hr(scene.id);
  console.log(scene.text + "\n");
};

const promptChoices = (choices: Choice[]) =>
  choices.map((c) => ({ name: c.label, value: c.target }));

async function run() {
  const story = loadStory();
  const map = createSceneMap(story.scenes);

  let current: SceneId = story.start;

  console.log(`\n✨ ${story.title} ✨\n`);

  while (true) {
    const scene = map.get(current);

    if (!scene) {
      console.error(`Scene not found: ${current}`);
      break;
    }

    renderScene(scene);

    // ending scene aka no chioces
    if (!scene.choices?.length) {
      hr("THE END");

      const action = await select({
        message: "What would you like to do?",
        choices: [
          { name: "Restart the adventure", value: "restart" },
          { name: "Quit", value: "quit" }
        ]
      });

      if (action === "restart") {
        current = story.start;
        continue;
      }

      console.log("\nThanks for playing — may your next letter arrive by owl!\n");
      break;
    }

    current = (await select({
      message: "Choose an action:",
      choices: promptChoices(scene.choices)
    })) as SceneId;
  }
}

// autorun
run().catch((err) => {
  console.error(err);
  process.exit(1);
});

export { loadStory, createSceneMap, promptChoices };
