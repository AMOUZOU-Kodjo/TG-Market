import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Save,
  X,
  ArrowUpDown,
  Hash,
  Palette,
  Smile,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ListPlus,
  Settings2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import toast from "react-hot-toast";
import Badge from "@/shared/ui/Badge";

const ICONS = [
  "Smartphone", "Car", "Laptop", "Sofa", "Shirt", "Home",
  "Refrigerator", "Gamepad2", "Dumbbell", "Sparkles", "Baby",
  "Apple", "Briefcase", "PawPrint", "BookOpen", "Music",
  "Palette", "TreePine", "GraduationCap", "Crown", "Scissors",
  "Hammer", "Wrench", "PartyPopper", "Camera", "Bike",
  "Footprints", "ShoppingBag", "Gem", "Flower2", "Sun",
  "Package", "Star", "MapPin", "Users", "PackageCheck",
  "ShieldCheck", "CheckCircle2", "Download", "Play", "BadgeCheck",
  "Zap", "Shield", "Send", "FileText", "MessageSquare", "Heart",
];

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getRandomColor() {
  const colors = [
    "#01796F", "#2563EB", "#7C3AED", "#DB2777", "#EA580C",
    "#16A34A", "#0891B2", "#BE123C", "#4338CA", "#0F766E",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(new Set());
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", icon: "Package", color: getRandomColor(), parentId: null, sortOrder: 0, isActive: true });
  const [specModal, setSpecModal] = useState(null);
  const [specForm, setSpecForm] = useState({ label: "", inputType: "text", options: "", required: false });
  const [specEditingId, setSpecEditingId] = useState(null);
  const [mobilePath, setMobilePath] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => api.get("/admin/categories").then((r) => r.data),
  });

  const { data: specTemplatesData, isLoading: specLoading } = useQuery({
    queryKey: ["adminCategorySpecTemplates", specModal?.categoryId],
    queryFn: () => api.get(`/admin/categories/${specModal.categoryId}/spec-templates`).then((r) => r.data),
    enabled: !!specModal?.categoryId,
  });
  const specTemplates = specTemplatesData?.data ?? [];

  const createSpecMutation = useMutation({
    mutationFn: (data) => api.post(`/admin/categories/${specModal.categoryId}/spec-templates`, data).then((r) => r.data.data),
    onSuccess: () => { toast.success("Champ ajouté"); resetSpecForm(); qc.invalidateQueries({ queryKey: ["adminCategorySpecTemplates", specModal.categoryId] }); qc.invalidateQueries({ queryKey: ["categorySpecTemplates"] }); },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur"),
  });

  const updateSpecMutation = useMutation({
    mutationFn: ({ templateId, data }) => api.put(`/admin/categories/spec-templates/${templateId}`, data).then((r) => r.data.data),
    onSuccess: () => { toast.success("Champ modifié"); resetSpecForm(); qc.invalidateQueries({ queryKey: ["adminCategorySpecTemplates", specModal.categoryId] }); qc.invalidateQueries({ queryKey: ["categorySpecTemplates"] }); },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur"),
  });

  const deleteSpecMutation = useMutation({
    mutationFn: (templateId) => api.delete(`/admin/categories/spec-templates/${templateId}`).then((r) => r.data),
    onSuccess: () => { toast.success("Champ supprimé"); qc.invalidateQueries({ queryKey: ["adminCategorySpecTemplates", specModal.categoryId] }); qc.invalidateQueries({ queryKey: ["categorySpecTemplates"] }); },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/admin/categories", data).then((r) => r.data.data),
    onSuccess: () => { toast.success("Catégorie créée"); closeModal(); qc.invalidateQueries({ queryKey: ["adminCategories"] }); qc.invalidateQueries({ queryKey: ["categories"] }); },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/categories/${id}`, data).then((r) => r.data.data),
    onSuccess: () => { toast.success("Catégorie modifiée"); closeModal(); qc.invalidateQueries({ queryKey: ["adminCategories"] }); qc.invalidateQueries({ queryKey: ["categories"] }); },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur"),
  });

  const reorderMutation = useMutation({
    mutationFn: (updates) => api.put("/admin/categories/reorder", { updates }).then((r) => r.data),
    onSuccess: () => { toast.success("Ordre mis à jour"); qc.invalidateQueries({ queryKey: ["adminCategories"] }); qc.invalidateQueries({ queryKey: ["categories"] }); },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/categories/${id}`).then((r) => r.data),
    onSuccess: () => { toast.success("Catégorie supprimée"); qc.invalidateQueries({ queryKey: ["adminCategories"] }); qc.invalidateQueries({ queryKey: ["categories"] }); },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur"),
  });

  const categories = data?.data ?? [];
  const roots = categories.filter((c) => c.parentId === null);

  const currentNode = mobilePath.length
    ? categories.find((c) => c.id === mobilePath[mobilePath.length - 1])
    : null;
  const showRoot = mobilePath.length === 0 || !currentNode;
  const push = (id) => setMobilePath((prev) => [...prev, id]);
  const pop = () => setMobilePath((prev) => prev.slice(0, -1));

  const openCreate = (parentId = null) => {
    setForm({ name: "", slug: "", icon: "Package", color: getRandomColor(), parentId, sortOrder: 0, isActive: true });
    setModal({ type: "create", parentId });
  };

  const openEdit = (cat) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      color: cat.color,
      parentId: cat.parentId,
      sortOrder: cat.sortOrder,
      isActive: true,
    });
    setModal({ type: "edit", id: cat.id });
  };

  const closeModal = () => {
    setModal(null);
    setForm({ name: "", slug: "", icon: "Package", color: getRandomColor(), parentId: null, sortOrder: 0, isActive: true });
  };

  const openSpecModal = (cat) => {
    setSpecEditingId(null);
    setSpecForm({ label: "", inputType: "text", options: "", required: false });
    setSpecModal({ categoryId: cat.id, categoryName: cat.name });
  };

  const closeSpecModal = () => {
    setSpecModal(null);
    resetSpecForm();
  };

  const resetSpecForm = () => {
    setSpecEditingId(null);
    setSpecForm({ label: "", inputType: "text", options: "", required: false });
  };

  const startEditSpec = (t) => {
    setSpecEditingId(t.id);
    setSpecForm({ label: t.label, inputType: t.inputType, options: (t.options || []).join(", "), required: t.required });
  };

  const handleSpecSubmit = (e) => {
    e.preventDefault();
    if (!specForm.label.trim()) return toast.error("Le libellé est requis");
    const payload = {
      label: specForm.label.trim(),
      inputType: specForm.inputType,
      options: specForm.inputType === "select" ? specForm.options.split(",").map((o) => o.trim()).filter(Boolean) : [],
      required: specForm.required,
    };
    if (specEditingId) updateSpecMutation.mutate({ templateId: specEditingId, data: payload });
    else createSpecMutation.mutate(payload);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Le nom est requis");
    if (modal.type === "create") createMutation.mutate(form);
    else updateMutation.mutate({ id: modal.id, data: form });
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const moveCategory = (id, direction) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const siblings = categories
      .filter((c) => c.parentId === cat.parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = siblings.findIndex((c) => c.id === id);
    if (idx === -1) return;
    const newIdx = idx + (direction === "up" ? -1 : 1);
    if (newIdx < 0 || newIdx >= siblings.length) return;

    const a = siblings[idx];
    const b = siblings[newIdx];
    reorderMutation.mutate([
      { id: a.id, sortOrder: b.sortOrder },
      { id: b.id, sortOrder: a.sortOrder },
    ]);
  };

  const canMoveUp = (cat) => {
    const siblings = categories
      .filter((c) => c.parentId === cat.parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = siblings.findIndex((c) => c.id === cat.id);
    return idx > 0;
  };

  const childrenOf = (parentId) => categories.filter((c) => c.parentId === parentId).sort((a, b) => a.sortOrder - b.sortOrder);

  const MobileCategoryCard = ({ cat, onClick }) => {
    const kids = childrenOf(cat.id);
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3.5 text-left shadow-sm active:scale-[0.99] transition-transform"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
          style={{ backgroundColor: `${cat.color}20` }}
        >
          <span style={{ color: cat.color }}>{cat.icon === "Package" ? "📦" : "★"}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{cat.name}</p>
          <p className="text-xs text-gray-400 truncate">
            {kids.length > 0
              ? `${kids.length} sous-catégorie${kids.length > 1 ? "s" : ""}`
              : `${cat.productCount ?? 0} annonce${cat.productCount > 1 ? "s" : ""}`}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
      </button>
    );
  };

  const CategoryNode = ({ cat, level = 0 }) => {
    const kids = childrenOf(cat.id);
    const hasChildren = kids.length > 0;
    const isExpanded = expanded.has(cat.id);

    return (
      <>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ paddingLeft: `${16 + level * 24}px` }}
          className={`flex flex-wrap items-center gap-2 rounded-xl transition-colors ${
            level === 0
              ? "bg-white border border-gray-200  px-3 py-3"
              : "py-2.5 hover:bg-gray-50"
          }`}
        >
          <div
            onClick={() => hasChildren && toggleExpand(cat.id)}
            className={`flex flex-1 items-center gap-2 min-w-0 ${hasChildren ? "cursor-pointer" : ""}`}
          >
            <span
              className={`w-6 h-6 flex items-center justify-center text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
            >
              {hasChildren ? <ChevronRight className="w-4 h-4" /> : <div className="w-4 h-4" />}
            </span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
              style={{ backgroundColor: `${cat.color}20` }}
            >
              <span style={{ color: cat.color }}>{cat.icon === "Package" ? "📦" : "★"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{cat.name}</p>
              <p className="text-xs text-gray-400 truncate">{cat.slug}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {cat.productCount} annonces
            </Badge>
            {cat.specTemplateCount > 0 && (
              <Badge variant="primary" className="text-xs shrink-0">
                <span className="flex items-center gap-1">
                  <Settings2 className="w-3 h-3" /> {cat.specTemplateCount} champ{cat.specTemplateCount > 1 ? "s" : ""}
                </span>
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
            <button onClick={() => moveCategory(cat.id, "up")} className="p-2 sm:p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700" title="Monter" disabled={!canMoveUp(cat)}><ChevronUp className="w-4 h-4" /></button>
            <button onClick={() => moveCategory(cat.id, "down")} className="p-2 sm:p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700" title="Descendre"><ChevronDown className="w-4 h-4" /></button>
            <button onClick={() => openEdit(cat)} className="p-2 sm:p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700" title="Modifier"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => openCreate(cat.id)} className="p-2 sm:p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700" title="Sous-catégorie"><Plus className="w-4 h-4" /></button>
            <button onClick={() => openSpecModal(cat)} className="p-2 sm:p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700" title="Champs personnalisés"><Settings2 className="w-4 h-4" /></button>
            <button onClick={() => deleteMutation.mutate(cat.id)} className="p-2 sm:p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {kids.map((kid) => <CategoryNode key={kid.id} cat={kid} level={level + 1} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-900">Catégories</h1>
        <button onClick={() => openCreate()} className="hidden lg:flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 rounded-xl text-white text-sm font-medium">
          <Plus className="w-4 h-4" /> Nouvelle catégorie
        </button>
      </div>

      {/* Mobile : navigation descendante par cartes */}
      <div className="lg:hidden space-y-3">
        {showRoot ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">Mega-catégories</p>
              <button onClick={() => openCreate()} className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 rounded-lg text-white text-xs font-medium">
                <Plus className="w-3.5 h-3.5" /> Nouvelle
              </button>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
              </div>
            ) : roots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <FolderTree className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">Aucune catégorie</p>
              </div>
            ) : (
              roots.map((root) => (
                <MobileCategoryCard key={root.id} cat={root} onClick={() => push(root.id)} />
              ))
            )}
          </>
        ) : currentNode ? (
          <>
            <div className="flex items-center gap-2">
              <button onClick={pop} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500" title="Retour">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="flex-1 min-w-0 truncate text-base font-bold text-gray-900">{currentNode.name}</h2>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-400 flex-wrap">
              <button onClick={() => setMobilePath([])} className="hover:text-brand-600">Catégories</button>
              {mobilePath.slice(0, -1).map((id, i) => {
                const c = categories.find((x) => x.id === id);
                if (!c) return null;
                return (
                  <span key={id} className="flex items-center gap-1">
                    <span>/</span>
                    <button onClick={() => setMobilePath(mobilePath.slice(0, i + 1))} className="hover:text-brand-600">{c.name}</button>
                  </span>
                );
              })}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{currentNode.name}</p>
                <p className="text-xs text-gray-400">/{currentNode.slug}</p>
                <p className="text-xs text-gray-400 mt-1">{currentNode.productCount ?? 0} annonces · {currentNode.specTemplateCount ?? 0} champ{currentNode.specTemplateCount > 1 ? "s" : ""} perso</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openSpecModal(currentNode)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-brand-50 text-brand-700 text-xs font-medium" title="Champs personnalisés">
                  <Settings2 className="w-4 h-4" /> Champs perso
                </button>
                <button onClick={() => openEdit(currentNode)} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium" title="Modifier">
                  <Edit2 className="w-4 h-4" /> Modifier
                </button>
                <button onClick={() => deleteMutation.mutate(currentNode.id)} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium" title="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button onClick={() => openCreate(currentNode.id)} className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium hover:border-brand-400 hover:text-brand-600">
              <Plus className="w-4 h-4" /> Ajouter une sous-catégorie
            </button>

            {childrenOf(currentNode.id).map((kid) => (
              <MobileCategoryCard key={kid.id} cat={kid} onClick={() => push(kid.id)} />
            ))}
          </>
        ) : null}
      </div>

      {/* Desktop : arbre déroulant */}
      <div className="hidden lg:block bg-white  border-gray-200  overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FolderTree className="w-12 h-12 mb-3 opacity-50" />
            <p>Aucune catégorie</p>
            <button onClick={() => openCreate()} className="mt-4 text-sm text-brand-600 hover:underline">Créer la première</button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {roots.map((root) => <CategoryNode key={root.id} cat={root} />)}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {modal.type === "create" ? (modal.parentId ? "Nouvelle sous-catégorie" : "Nouvelle catégorie") : "Modifier la catégorie"}
                </h2>
                <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nom</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (!form.slug) setForm({ ...form, slug: slugify(e.target.value) });
                    }}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    placeholder="Ex: Téléphones"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    placeholder="Ex: telephones"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Icône</label>
                    <select
                      value={form.icon}
                      onChange={(e) => setForm({ ...form, icon: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    >
                      {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Couleur</label>
                    <input
                      type="color"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      className="w-full h-10 rounded-lg border border-gray-700 cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Catégorie parente</label>
                  <select
                    value={form.parentId ?? ""}
                    onChange={(e) => setForm({ ...form, parentId: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  >
                    <option value="">— Aucune (mega-catégorie) —</option>
                    {categories.filter((c) => c.parentId === null).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Ordre d'affichage</label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    min="0"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">Annuler</button>
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50">
                    {(createMutation.isPending || updateMutation.isPending) ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {specModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={closeSpecModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Champs personnalisés</h2>
                  <p className="text-xs text-gray-400">{specModal.categoryName}</p>
                </div>
                <button onClick={closeSpecModal} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                {specLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
                  </div>
                ) : specTemplates.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <ListPlus className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucun champ personnalisé pour cette catégorie</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {specTemplates.map((t) => (
                      <div key={t.id} className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {t.label}
                            {t.required && <span className="ml-1 text-red-500">*</span>}
                          </p>
                          <p className="text-xs text-gray-400">
                            {t.inputType === "select" ? `Liste — ${(t.options || []).length} choix` : t.inputType === "number" ? "Nombre" : "Texte"}
                          </p>
                        </div>
                        <button onClick={() => startEditSpec(t)} className="p-2 sm:p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700" title="Modifier"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => deleteSpecMutation.mutate(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-gray-100 pt-5">
                  <h3 className="mb-4 text-sm font-semibold text-gray-900">
                    {specEditingId ? "Modifier le champ" : "Ajouter un champ"}
                  </h3>
                  <form onSubmit={handleSpecSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Libellé</label>
                      <input
                        type="text"
                        value={specForm.label}
                        onChange={(e) => setSpecForm({ ...specForm, label: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                        placeholder="Ex: Marque, Modèle, Année, Couleur, Stock..."
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                        <select
                          value={specForm.inputType}
                          onChange={(e) => setSpecForm({ ...specForm, inputType: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                        >
                          <option value="text">Texte</option>
                          <option value="number">Nombre</option>
                          <option value="select">Liste de choix</option>
                        </select>
                      </div>
                      <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={specForm.required}
                            onChange={(e) => setSpecForm({ ...specForm, required: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300 text-brand-600"
                          />
                          Requis
                        </label>
                      </div>
                    </div>
                    {specForm.inputType === "select" && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Choix (séparés par des virgules)
                        </label>
                        <input
                          type="text"
                          value={specForm.options}
                          onChange={(e) => setSpecForm({ ...specForm, options: e.target.value })}
                          className="w-full px-4 py-2 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                          placeholder="Ex: Noir, Blanc, Rouge"
                        />
                      </div>
                    )}
                    <div className="flex gap-3 pt-1">
                      {specEditingId && (
                        <button type="button" onClick={resetSpecForm} className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                          Annuler
                        </button>
                      )}
                      <button type="submit" disabled={createSpecMutation.isPending || updateSpecMutation.isPending} className="flex-1 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50">
                        {(createSpecMutation.isPending || updateSpecMutation.isPending) ? "Enregistrement..." : (specEditingId ? "Enregistrer" : "Ajouter")}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}