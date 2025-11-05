export type SceneId = string;

export type Choice = {
  label: string;
  target: SceneId;
};

export type Scene = {
  id: SceneId;
  text: string;
  choices?: Choice[];
  meta?: {
    ending?: boolean;
  };
};

export type Story = {
  title: string;
  start: SceneId;
  scenes: Scene[];
};
