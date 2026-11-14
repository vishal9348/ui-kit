import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  effect,
} from '@angular/core';

import {
  UiTreeNode,
  UiTreeNodeEvent,
  UiTreeSelectionMode,
  UiTreeVisibleNode,
} from './ui-tree-view.types';

@Component({
  selector: 'ui-tree-view',
  standalone: true,
  templateUrl: './ui-tree-view.component.html',
  styleUrl: './ui-tree-view.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTreeViewComponent {
  readonly nodes = input<UiTreeNode[]>([]);
  readonly selectionMode = input<UiTreeSelectionMode>('single');

  readonly selectedIds = input<string[]>([]);
  readonly checkedIds = input<string[]>([]);
  readonly expandedIds = input<string[]>([]);

  readonly selectable = input(true);
  readonly checkboxes = input(false);
  readonly searchable = input(false);
  readonly showExpandAll = input(true);
  readonly disabled = input(false);
  readonly id = input('ui-tree-view');

  readonly selectedIdsChange = output<string[]>();
  readonly checkedIdsChange = output<string[]>();
  readonly expandedIdsChange = output<string[]>();

  readonly nodeSelected = output<UiTreeNodeEvent>();
  readonly nodeExpanded = output<UiTreeNodeEvent>();
  readonly nodeChecked = output<UiTreeNodeEvent>();

  readonly searchQuery = signal('');
  readonly focusedId = signal<string | null>(null);
  private readonly internalExpandedIds = signal<string[]>([]);

  constructor() {
    effect(() => {
      this.internalExpandedIds.set(this.expandedIds());
    });
  }

  private readonly allNodes = computed(() => {
    const result = new Map<string, UiTreeNode>();

    const visit = (nodes: UiTreeNode[]): void => {
      for (const node of nodes) {
        result.set(node.id, node);

        if (node.children?.length) {
          visit(node.children);
        }
      }
    };

    visit(this.nodes());
    return result;
  });

  readonly visibleNodes = computed<UiTreeVisibleNode[]>(() => {
    interface FilteredNode {
      node: UiTreeNode;
      children: FilteredNode[];
    }

    const query = this.searchQuery().trim().toLowerCase();
    const expandedIds = new Set(this.internalExpandedIds());
    const selectedIds = new Set(this.selectedIds());
    const checkedIds = new Set(this.checkedIds());

    const filterNodes = (nodes: UiTreeNode[]): FilteredNode[] =>
      nodes
        .map((node): FilteredNode | null => {
          const children = filterNodes(node.children ?? []);
          const matches = !query || node.label.toLowerCase().includes(query);

          if (!matches && children.length === 0) {
            return null;
          }

          return { node, children };
        })
        .filter((item): item is FilteredNode => item !== null);

    const isChecked = (node: UiTreeNode): boolean => {
      if (checkedIds.has(node.id)) {
        return true;
      }

      const descendants = this.getDescendants(node).filter((item) => !item.disabled);

      return descendants.length > 0 && descendants.every((item) => checkedIds.has(item.id));
    };

    const isIndeterminate = (node: UiTreeNode): boolean => {
      const descendants = this.getDescendants(node).filter((item) => !item.disabled);

      if (descendants.length === 0) {
        return false;
      }

      const checkedCount = descendants.filter((item) => checkedIds.has(item.id)).length;

      return checkedCount > 0 && checkedCount < descendants.length;
    };

    const result: UiTreeVisibleNode[] = [];

    const flatten = (items: FilteredNode[], depth: number): void => {
      items.forEach((item, index) => {
        const { node, children } = item;
        const hasChildren = children.length > 0;
        const expanded = hasChildren && (query.length > 0 || expandedIds.has(node.id));

        result.push({
          node,
          id: node.id,
          depth,
          hasChildren,
          expanded,
          selected: selectedIds.has(node.id),
          checked: isChecked(node),
          indeterminate: isIndeterminate(node),
          posInSet: index + 1,
          setSize: items.length,
        });

        if (expanded) {
          flatten(children, depth + 1);
        }
      });
    };

    flatten(filterNodes(this.nodes()), 0);
    return result;
  });

  setSearchQuery(value: string): void {
    this.searchQuery.set(value);
  }

  toggleExpand(item: UiTreeVisibleNode): void {
    if (this.disabled() || item.node.disabled || !item.hasChildren) {
      return;
    }

    const expanded = new Set(this.internalExpandedIds());

    if (expanded.has(item.id)) {
      expanded.delete(item.id);
    } else {
      expanded.add(item.id);
    }

    const next = [...expanded];
    this.internalExpandedIds.set(next);
    this.expandedIdsChange.emit(next);

    this.nodeExpanded.emit({
      node: item.node,
      id: item.id,
    });
  }

  toggleSelection(item: UiTreeVisibleNode): void {
    if (
      this.disabled() ||
      item.node.disabled ||
      item.node.selectable === false ||
      !this.selectable()
    ) {
      return;
    }

    let next: string[];

    if (this.selectionMode() === 'single') {
      next = item.selected ? [] : [item.id];
    } else {
      const selected = new Set(this.selectedIds());

      if (selected.has(item.id)) {
        selected.delete(item.id);
      } else {
        selected.add(item.id);
      }

      next = [...selected];
    }

    this.selectedIdsChange.emit(next);
    this.nodeSelected.emit({
      node: item.node,
      id: item.id,
    });

    this.focusedId.set(item.id);
  }

  toggleCheckbox(item: UiTreeVisibleNode): void {
    if (this.disabled() || item.node.disabled) {
      return;
    }

    const checked = new Set(this.checkedIds());
    const shouldCheck = !item.checked;

    const affectedNodes = [item.node, ...this.getDescendants(item.node)];

    for (const node of affectedNodes) {
      if (node.disabled) {
        continue;
      }

      if (shouldCheck) {
        checked.add(node.id);
      } else {
        checked.delete(node.id);
      }
    }

    // Recalculate ancestors so parent checkboxes reflect their children.
    const ancestors = this.getAncestors(item.id);

    for (const ancestor of ancestors) {
      const descendants = this.getDescendants(ancestor).filter((node) => !node.disabled);

      if (descendants.length > 0 && descendants.every((node) => checked.has(node.id))) {
        checked.add(ancestor.id);
      } else {
        checked.delete(ancestor.id);
      }
    }

    this.checkedIdsChange.emit([...checked]);
    this.nodeChecked.emit({
      node: item.node,
      id: item.id,
    });
  }

  expandAll(): void {
    if (this.disabled()) {
      return;
    }

    const ids = [...this.allNodes().values()]
      .filter((node) => !!node.children?.length)
      .map((node) => node.id);

    this.internalExpandedIds.set(ids);
    this.expandedIdsChange.emit(ids);
  }

  collapseAll(): void {
    if (this.disabled()) {
      return;
    }

    this.internalExpandedIds.set([]);
    this.expandedIdsChange.emit([]);
  }

  onTreeKeydown(event: KeyboardEvent, item: UiTreeVisibleNode): void {
    if (this.disabled()) {
      return;
    }

    const visible = this.visibleNodes();
    const index = visible.findIndex((node) => node.id === item.id);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNode(visible[index + 1]);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusNode(visible[index - 1]);
        break;

      case 'ArrowRight':
        event.preventDefault();

        if (item.hasChildren && !item.expanded) {
          this.toggleExpand(item);
        } else if (item.expanded) {
          this.focusNode(visible[index + 1]);
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();

        if (item.hasChildren && item.expanded) {
          this.toggleExpand(item);
        } else {
          const parent = this.getParent(item.id);

          if (parent) {
            this.focusNode(visible.find((node) => node.id === parent.id));
          }
        }
        break;

      case 'Home':
        event.preventDefault();
        this.focusNode(visible[0]);
        break;

      case 'End':
        event.preventDefault();
        this.focusNode(visible[visible.length - 1]);
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleSelection(item);
        break;
    }
  }

  private focusNode(item?: UiTreeVisibleNode): void {
    if (!item) {
      return;
    }

    this.focusedId.set(item.id);

    requestAnimationFrame(() => {
      const element = document.getElementById(`${this.id()}-node-${item.id}`);

      element?.focus();
    });
  }

  private getDescendants(node: UiTreeNode): UiTreeNode[] {
    const result: UiTreeNode[] = [];

    const visit = (nodes: UiTreeNode[] = []): void => {
      for (const child of nodes) {
        result.push(child);

        if (child.children?.length) {
          visit(child.children);
        }
      }
    };

    visit(node.children);
    return result;
  }

  private getAncestors(id: string): UiTreeNode[] {
    const result: UiTreeNode[] = [];

    const find = (nodes: UiTreeNode[], ancestors: UiTreeNode[]): boolean => {
      for (const node of nodes) {
        if (node.id === id) {
          result.push(...ancestors);
          return true;
        }

        if (node.children?.length && find(node.children, [...ancestors, node])) {
          return true;
        }
      }

      return false;
    };

    find(this.nodes(), []);
    return result;
  }

  private getParent(id: string): UiTreeNode | undefined {
    let parent: UiTreeNode | undefined;

    const find = (nodes: UiTreeNode[]): boolean => {
      for (const node of nodes) {
        if (node.children?.some((child) => child.id === id)) {
          parent = node;
          return true;
        }

        if (node.children?.length && find(node.children)) {
          return true;
        }
      }

      return false;
    };

    find(this.nodes());
    return parent;
  }
}
