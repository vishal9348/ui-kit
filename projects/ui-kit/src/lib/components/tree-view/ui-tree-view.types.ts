export type UiTreeSelectionMode = 'single' | 'multiple';

export interface UiTreeNode {
  id: string;
  label: string;
  children?: UiTreeNode[];
  disabled?: boolean;
  selectable?: boolean;
  icon?: string;
  data?: unknown;
}

export interface UiTreeNodeEvent {
  node: UiTreeNode;
  id: string;
}

export interface UiTreeVisibleNode {
  node: UiTreeNode;
  id: string;
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  indeterminate: boolean;
  posInSet: number;
  setSize: number;
}
