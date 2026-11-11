export interface UiBreadcrumbItem {
  label: string;
  href?: string;
  disabled?: boolean;
}

export interface UiBreadcrumbConfig {
  items?: UiBreadcrumbItem[];
  separator?: string;
  ariaLabel?: string;
}
