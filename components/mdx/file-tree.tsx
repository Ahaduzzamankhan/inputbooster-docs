import { FileCode2, FileText, Folder, FolderOpen } from "lucide-react";

type Tree = {
  name: string;
  dir: boolean;
  children: Map<string, Tree>;
};

function buildTree(paths: string[]): Tree {
  const root: Tree = { name: "", dir: true, children: new Map() };
  for (const raw of paths) {
    const parts = raw.replace(/\\/g, "/").split("/").filter(Boolean);
    let cursor = root;
    parts.forEach((part, index) => {
      const isDir = index < parts.length - 1;
      const existing = cursor.children.get(part);
      if (!existing) {
        const node: Tree = { name: part, dir: isDir, children: new Map() };
        cursor.children.set(part, node);
        cursor = node;
      } else {
        if (isDir) existing.dir = true;
        cursor = existing;
      }
    });
  }
  return root;
}

function extensionIcon(name: string) {
  if (/\.(java|kt|ts|tsx|js|json|gradle|properties|toml|yml|yaml|mdx?)$/i.test(name)) {
    return <FileCode2 size={13} />;
  }
  return <FileText size={13} />;
}

function Rows({ node, depth }: { node: Tree; depth: number }) {
  const entries = [...node.children.values()].sort((a, b) => {
    if (a.dir !== b.dir) return a.dir ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      {entries.map((entry) => (
        <div key={`${depth}-${entry.name}`}>
          <div
            className="file-tree-row"
            data-dir={entry.dir ? "true" : "false"}
            style={{ paddingLeft: `${depth * 0.9}rem` }}
          >
            {entry.dir ? <Folder size={13} /> : extensionIcon(entry.name)}
            <span>{entry.name}</span>
            {entry.dir ? <span className="text-fog-500">/</span> : null}
          </div>
          {entry.children.size > 0 ? <Rows node={entry} depth={depth + 1} /> : null}
        </div>
      ))}
    </>
  );
}

export function FileTree({ items, title }: { items: string[]; title?: string }) {
  const tree = buildTree(items);
  return (
    <div className="file-tree">
      <div className="file-tree-head">
        <span className="inline-flex items-center gap-1.5">
          <FolderOpen size={13} aria-hidden />
          {title ?? "Files"}
        </span>
      </div>
      <div className="file-tree-body">
        <Rows node={tree} depth={0} />
      </div>
    </div>
  );
}
