import { useState, useEffect, useRef } from "react";
import Select from "@/shared/ui/Select";

export default function CategoryPicker({ categories, value, onChange, error }) {
  const [path, setPath] = useState([]);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (!value || !categories.length) {
      setPath([]);
      return;
    }
    const chain = [];
    let current = findCategoryById(categories, value.id);
    while (current) {
      chain.unshift(current);
      current = current.parentId
        ? findCategoryById(categories, current.parentId)
        : null;
    }
    setPath(chain);
  }, [value, categories]);

  function findCategoryById(tree, id) {
    for (const cat of tree) {
      if (cat.id === id) return cat;
      if (cat.children?.length) {
        const found = findCategoryById(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  function getChildren(tree, parentId) {
    if (!parentId) return tree;
    const parent = findCategoryById(tree, parentId);
    return parent?.children ?? [];
  }

  function handleSelect(levelIndex, catId) {
    if (!catId) {
      setPath((prev) => prev.slice(0, levelIndex));
      isInternalChange.current = true;
      onChange(null);
      return;
    }
    const tree = levelIndex === 0 ? categories : getChildren(categories, path[levelIndex - 1]?.id);
    const selected = tree.find((c) => c.id === Number(catId));
    if (!selected) return;

    const newPath = [...path.slice(0, levelIndex), selected];
    setPath(newPath);
    isInternalChange.current = true;
    onChange(selected);
  }

  function handleBack(levelIndex) {
    setPath((prev) => prev.slice(0, levelIndex));
    onChange(levelIndex > 0 ? path[levelIndex - 1] : null);
  }

  const levels = [];
  let currentTree = categories;

  for (let i = 0; i <= path.length; i++) {
    if (currentTree.length === 0) break;
    levels.push({ tree: currentTree, selectedId: path[i]?.id ?? null });
    if (path[i]) {
      currentTree = path[i].children ?? [];
    }
  }

  return (
    <div className="space-y-3">
      {path.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          {path.map((cat, i) => (
            <span key={cat.id} className="flex items-center gap-1">
              {i > 0 && <span>/</span>}
              <button
                type="button"
                onClick={() => handleBack(i)}
                className="hover:text-brand-600 transition-colors"
              >
                {cat.name}
              </button>
            </span>
          ))}
        </div>
      )}

      {levels.map((level, i) => {
        const parentName = i === 0 ? "Catégorie principale" : `Sous-catégorie`;
        return (
          <div key={i} className="relative">
            <Select
              label={i === 0 ? "Catégorie principale" : `Niveau ${i + 1}`}
              placeholder={`Sélectionnez ${i === 0 ? "une catégorie" : "une sous-catégorie"}`}
              options={level.tree.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              value={level.selectedId ?? ""}
              onChange={(val) => handleSelect(i, val)}
              error={i === 0 ? error : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
