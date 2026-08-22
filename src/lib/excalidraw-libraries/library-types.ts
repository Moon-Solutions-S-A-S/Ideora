export interface ExcalidrawLibraryItem {
  id: string;
  status: 'published' | 'unpublished';
  name: string;
  created: string;
  elements: any[];
}

export interface ExcalidrawLibraryPackage {
  type: 'excalidrawlib';
  version: number;
  source?: string;
  libraryItems: ExcalidrawLibraryItem[] | any[][];
}

export interface OfficialLibraryMetaData {
  id: string;
  name: string;
  description: string;
  authorName: string;
  authorUrl?: string;
  source: string;
  preview: string;
  created: string;
  updated: string;
  version: number;
  category: string;
}

export interface RegisteredComponent {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  elements: any[];
  previewSvg?: string;
}
