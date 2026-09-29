export interface ToggleGameCompletionRequest {
  steamId: string;
  appid: string;
  completed: boolean;
  currentCompleted: string[];
}
