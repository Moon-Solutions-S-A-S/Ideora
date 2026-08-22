export type CatalogCategory = 
  | 'basic'
  | 'software'
  | 'uml'
  | 'database'
  | 'data'
  | 'electronics'
  | 'iot'
  | 'networking'
  | 'telecom'
  | 'cloud'
  | 'devops'
  | 'ai'
  | 'security'
  | 'ux'
  | 'custom';

export type DiagramMode = 
  | 'general'
  | 'software'
  | 'uml'
  | 'database'
  | 'data'
  | 'electronics'
  | 'iot'
  | 'networking'
  | 'telecom'
  | 'cloud'
  | 'devops'
  | 'ai'
  | 'security'
  | 'ux';

export interface ConnectionPoint {
  id: string;
  label?: string;
  type?: 'input' | 'output' | 'bidirectional' | 'pin' | 'power' | 'ground' | 'data';
  xPercent: number; // 0 to 1
  yPercent: number; // 0 to 1
}

export interface DiagramComponentDefinition {
  id: string;
  name: string;
  category: CatalogCategory;
  subcategory?: string;
  description?: string;
  keywords: string[];
  iconName: string; // Lucide icon name identifier
  color: string; // Tailwind color class e.g. text-indigo-400
  strokeColor?: string;
  backgroundColor?: string;
  elementType: 'rectangle' | 'ellipse' | 'diamond' | 'text' | 'arrow' | 'line' | 'group' | 'custom_shape';
  supportsText?: boolean;
  supportsConnections?: boolean;
  connectionPoints?: ConnectionPoint[];
  tags?: string[];
  defaultProperties?: Record<string, any>;
  factory: (cx: number, cy: number, options?: any) => any[];
}
