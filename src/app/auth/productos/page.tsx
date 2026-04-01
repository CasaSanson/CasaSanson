"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase";
import { Edit, Plus, Save, X, AlertTriangle, ChevronRight, EyeOff, Eye, Archive, Package, Search } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ORDEN_TALLAS = ["XS", "S", "M", "L", "XL"];

export default function CasaSansonHub() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'active' | 'archived'>('active');
    const [searchTerm, setSearchTerm] = useState("");

    const [panelMode, setPanelMode] = useState<'create' | 'edit' | null>(null);
    const [step, setStep] = useState(1);
    const [archiveId, setArchiveId] = useState<string | null>(null);
    const [mainFile, setMainFile] = useState<File | null>(null);

    const [formData, setFormData] = useState<any>({
        name: "", description: "", base_price: "", active: true, maquila: false, personalizacion: false
    });
    const [variants, setVariants] = useState<any[]>([]);

    useEffect(() => { fetchProducts(); }, [view]);

    async function fetchProducts() {
        setLoading(true);
        const { data, error } = await supabase
            .from("products")
            .select(`*, product_variants(*)`)
            .eq('active', view === 'active')
            .order('created_at', { ascending: false });

        if (!error) setProducts(data);
        else toast.error("Error al sincronizar datos");
        setLoading(false);
    }

    const resetForm = () => {
        setFormData({ name: "", description: "", base_price: "", active: true, maquila: false, personalizacion: false });
        setVariants([]);
        setMainFile(null);
        setStep(1);
        setPanelMode(null);
    };

    const handleEditOpen = (product: any) => {
        setFormData({ ...product, base_price: product.base_price?.toString() || "" });
        setVariants(product.product_variants || []);
        setPanelMode('edit');
    };

    async function saveProduct() {
        setLoading(true);
        const loadToast = toast.loading("Guardando cambios...");

        try {
            let imageUrl = formData.image || "";
            if (mainFile) {
                const fileName = `${Date.now()}_${mainFile.name.replace(/\s/g, '_')}`;
                const { error: storageError } = await supabase.storage.from("product-images").upload(fileName, mainFile);
                if (storageError) throw storageError;
                const { data: pub } = supabase.storage.from("product-images").getPublicUrl(fileName);
                imageUrl = pub.publicUrl;
            }

            const productPayload = {
                name: formData.name,
                description: formData.description,
                base_price: parseFloat(formData.base_price) || 0,
                active: formData.active,
                maquila: formData.maquila,
                personalizacion: formData.personalizacion,
                image: imageUrl
            };

            let productId = formData.id;

            if (panelMode === 'create') {
                const { data, error } = await supabase.from("products").insert(productPayload).select().single();
                if (error) throw error;
                productId = data.id;
            } else {
                const { error } = await supabase.from("products").update(productPayload).eq('id', productId);
                if (error) throw error;
            }

            if (variants.length > 0) {
                const nuevas = variants.filter(v => !v.id).map((v, i) => ({
                    product_id: productId,
                    size: v.size,
                    stock: parseInt(v.stock?.toString() || "0"),
                    sku: v.sku || `CS-${productId.slice(0, 4)}-${v.size}-${Date.now()}-${i}`,
                    active: true
                }));

                const existentes = variants.filter(v => v.id).map(v => ({
                    id: v.id,
                    product_id: productId,
                    size: v.size,
                    stock: parseInt(v.stock?.toString() || "0"),
                    sku: v.sku,
                    active: true
                }));

                if (nuevas.length > 0) await supabase.from("product_variants").insert(nuevas);
                if (existentes.length > 0) await supabase.from("product_variants").upsert(existentes, { onConflict: 'sku' });
            }

            toast.update(loadToast, { render: "Cambios guardados", type: "success", isLoading: false, autoClose: 2000 });
            resetForm();
            fetchProducts();
        } catch (err: any) {
            toast.update(loadToast, { render: `Error: ${err.message}`, type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    }

    async function toggleProductStatus(targetId: string, currentStatus: boolean) {
        const loadToast = toast.loading(currentStatus ? "Archivando..." : "Restaurando...");
        try {
            const { error } = await supabase
                .from("products")
                .update({ active: !currentStatus })
                .eq('id', targetId);

            if (error) throw error;

            toast.update(loadToast, { render: currentStatus ? "Producto archivado" : "Producto restaurado", type: "success", isLoading: false, autoClose: 2000 });
            setArchiveId(null);
            fetchProducts();
        } catch (err: any) {
            toast.update(loadToast, { render: "Error al cambiar estado", type: "error", isLoading: false, autoClose: 3000 });
        }
    }

    const toggleSize = (size: string) => {
        let newVariants;
        const exists = variants.find(v => v.size === size);
        if (exists) {
            newVariants = variants.filter(v => v.size !== size);
        } else {
            newVariants = [...variants, { size, stock: 0 }];
        }
        newVariants.sort((a, b) => ORDEN_TALLAS.indexOf(a.size) - ORDEN_TALLAS.indexOf(b.size));
        setVariants(newVariants);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0b0d10] text-white">
            <ToastContainer position="top-right" theme="dark" />

            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.06]">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Package size={13} strokeWidth={1.5} className="text-white/30" />
                            <p className="text-[9px] uppercase tracking-[0.4em] text-white/25">Inventario</p>
                        </div>
                        <h1 className="font-serif text-xl text-white/85">Productos</h1>
                    </div>
                    <button
                        onClick={() => { resetForm(); setPanelMode('create'); }}
                        className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.09] hover:border-white/[0.18] transition-all duration-200 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] text-white/70"
                    >
                        <Plus size={12} strokeWidth={2} />
                        Nuevo producto
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" strokeWidth={1.5} />
                        <input
                            placeholder="Buscar producto..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.07] text-[12px] text-white/70 placeholder:text-white/20 outline-none focus:border-white/[0.15] transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex border border-white/[0.07] overflow-hidden">
                        <button
                            onClick={() => setView('active')}
                            className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-all duration-150 ${view === 'active' ? "bg-white/[0.07] text-white/80" : "text-white/25 hover:text-white/50"}`}
                        >
                            Activos
                        </button>
                        <div className="w-px bg-white/[0.07]" />
                        <button
                            onClick={() => setView('archived')}
                            className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-all duration-150 ${view === 'archived' ? "bg-white/[0.07] text-white/80" : "text-white/25 hover:text-white/50"}`}
                        >
                            Archivados
                        </button>
                    </div>
                </div>

                {/* Product grid */}
                {loading && products.length === 0 ? (
                    <div className="py-24 text-center text-[11px] text-white/20 uppercase tracking-[0.3em]">
                        Cargando...
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="py-24 text-center text-[11px] text-white/20 uppercase tracking-[0.3em]">
                        Sin productos
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                className="group bg-white/[0.025] border border-white/[0.055] hover:border-white/[0.1] transition-all duration-200 overflow-hidden"
                            >
                                {/* Image */}
                                <div className="relative h-52 bg-white/[0.03] overflow-hidden">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                            alt={product.name}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package size={28} strokeWidth={1} className="text-white/10" />
                                        </div>
                                    )}
                                    {/* Hover actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleEditOpen(product)}
                                            className="flex items-center gap-1.5 bg-white/10 border border-white/20 hover:bg-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white transition-all"
                                        >
                                            <Edit size={11} strokeWidth={1.5} />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => setArchiveId(product.id)}
                                            className="flex items-center gap-1.5 bg-white/10 border border-white/20 hover:bg-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white transition-all"
                                        >
                                            {product.active ? <EyeOff size={11} strokeWidth={1.5} /> : <Eye size={11} strokeWidth={1.5} />}
                                            {product.active ? "Archivar" : "Restaurar"}
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-serif text-[13px] text-white/80 uppercase tracking-tight leading-snug">
                                            {product.name}
                                        </h3>
                                        <p className="text-[13px] text-cs-verde-musgo font-medium ml-2 flex-shrink-0">
                                            ${product.base_price}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {product.product_variants
                                            ?.sort((a: any, b: any) => ORDEN_TALLAS.indexOf(a.size) - ORDEN_TALLAS.indexOf(b.size))
                                            .map((v: any) => (
                                                <div
                                                    key={v.id}
                                                    className="flex items-center gap-1.5 text-[9px] bg-white/[0.04] border border-white/[0.07] px-2 py-1 uppercase tracking-wider"
                                                >
                                                    <span className="text-white/40">{v.size}</span>
                                                    <span className={v.stock > 0 ? "text-white/70" : "text-red-400/70"}>
                                                        {v.stock}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit / Create Modal */}
            {panelMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0f1115] border border-white/[0.08] w-full max-w-4xl flex flex-col max-h-[90vh] shadow-2xl">

                        {/* Modal header / steps */}
                        <div className="flex items-center border-b border-white/[0.06]">
                            <button
                                onClick={() => setStep(1)}
                                className={`flex-1 py-4 text-[10px] uppercase tracking-[0.3em] transition-all border-b-2 ${step === 1 ? "border-cs-verde-musgo text-white/80" : "border-transparent text-white/25 hover:text-white/50"}`}
                            >
                                01 · Atributos
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                className={`flex-1 py-4 text-[10px] uppercase tracking-[0.3em] transition-all border-b-2 ${step === 2 ? "border-cs-verde-musgo text-white/80" : "border-transparent text-white/25 hover:text-white/50"}`}
                            >
                                02 · Existencias
                            </button>
                            <button
                                onClick={resetForm}
                                className="px-5 py-4 text-white/25 hover:text-white/60 transition-colors border-l border-white/[0.06]"
                            >
                                <X size={16} strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Modal body */}
                        <div className="p-8 overflow-y-auto flex-1">
                            {step === 1 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left: text fields */}
                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">
                                                Nombre
                                            </label>
                                            <input
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/80 outline-none focus:border-cs-verde-musgo/50 transition-colors placeholder:text-white/20"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">
                                                Descripción
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[13px] text-white/80 outline-none focus:border-cs-verde-musgo/50 transition-colors resize-none h-28 placeholder:text-white/20"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">
                                                    Precio
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.base_price}
                                                    onChange={e => setFormData({ ...formData, base_price: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.07] text-[16px] text-cs-verde-musgo font-medium outline-none focus:border-cs-verde-musgo/50 transition-colors"
                                                />
                                            </div>
                                            <div className="flex items-end pb-3">
                                                <label className="flex items-center gap-2.5 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.active}
                                                        onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                                        className="w-4 h-4 accent-cs-verde-musgo"
                                                    />
                                                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Disponible</span>
                                                </label>
                                            </div>
                                        </div>
                                        {/* Flags */}
                                        <div className="grid grid-cols-2 gap-3 pt-1">
                                            <label className="flex items-center gap-2.5 p-3 bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.05] transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.maquila}
                                                    onChange={e => setFormData({ ...formData, maquila: e.target.checked })}
                                                    className="w-3.5 h-3.5 accent-cs-verde-musgo"
                                                />
                                                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Maquila</span>
                                            </label>
                                            <label className="flex items-center gap-2.5 p-3 bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.05] transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.personalizacion}
                                                    onChange={e => setFormData({ ...formData, personalizacion: e.target.checked })}
                                                    className="w-3.5 h-3.5 accent-cs-verde-musgo"
                                                />
                                                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Personalizar</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Right: image upload */}
                                    <div>
                                        <label className="text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-1.5">
                                            Imagen
                                        </label>
                                        <div className="relative h-64 bg-white/[0.03] border border-dashed border-white/[0.1] hover:border-white/[0.2] transition-colors flex items-center justify-center overflow-hidden">
                                            {mainFile || formData.image ? (
                                                <img
                                                    src={mainFile ? URL.createObjectURL(mainFile) : formData.image}
                                                    className="w-full h-full object-cover"
                                                    alt=""
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <Plus size={20} strokeWidth={1} className="mx-auto mb-2 text-white/20" />
                                                    <p className="text-[9px] uppercase tracking-[0.25em] text-white/20">
                                                        Subir imagen
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                onChange={e => e.target.files && setMainFile(e.target.files[0])}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="max-w-2xl mx-auto">
                                    <p className="text-[9px] uppercase tracking-[0.4em] text-white/25 mb-6">
                                        Selecciona tallas
                                    </p>

                                    {/* Size toggles */}
                                    <div className="flex gap-2 mb-8 flex-wrap">
                                        {ORDEN_TALLAS.map(size => {
                                            const isActive = variants.find(v => v.size === size);
                                            return (
                                                <button
                                                    key={size}
                                                    onClick={() => toggleSize(size)}
                                                    className={`w-14 h-14 text-[11px] uppercase tracking-[0.15em] transition-all duration-150 border ${
                                                        isActive
                                                            ? "bg-cs-verde-musgo/20 border-cs-verde-musgo/50 text-cs-verde-musgo"
                                                            : "bg-white/[0.03] border-white/[0.07] text-white/25 hover:border-white/[0.15] hover:text-white/50"
                                                    }`}
                                                >
                                                    {size}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Stock inputs */}
                                    <div className="space-y-2">
                                        {variants.map((v, i) => (
                                            <div
                                                key={v.size}
                                                className="flex items-center gap-4 px-5 py-4 bg-white/[0.03] border border-white/[0.06]"
                                            >
                                                <span className="w-8 text-[11px] text-cs-verde-musgo uppercase tracking-wider flex-shrink-0">
                                                    {v.size}
                                                </span>
                                                <div className="flex-1">
                                                    <label className="text-[8px] uppercase tracking-[0.3em] text-white/25 block mb-0.5">
                                                        Stock
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={v.stock}
                                                        onChange={e => {
                                                            const nv = [...variants];
                                                            nv[i].stock = parseInt(e.target.value) || 0;
                                                            setVariants(nv);
                                                        }}
                                                        className="bg-transparent text-[18px] text-white/80 font-medium outline-none w-full focus:text-white transition-colors"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => toggleSize(v.size)}
                                                    className="text-white/20 hover:text-white/50 transition-colors"
                                                >
                                                    <X size={14} strokeWidth={1.5} />
                                                </button>
                                            </div>
                                        ))}
                                        {variants.length === 0 && (
                                            <div className="py-12 text-center text-[10px] text-white/20 uppercase tracking-[0.3em] border border-dashed border-white/[0.06]">
                                                Selecciona tallas arriba
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal footer */}
                        <div className="px-8 py-5 border-t border-white/[0.06] flex justify-between items-center">
                            <button
                                onClick={() => setStep(step === 1 ? 2 : 1)}
                                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors"
                            >
                                {step === 1 ? (
                                    <>Inventario <ChevronRight size={12} strokeWidth={1.5} /></>
                                ) : (
                                    "← Atributos"
                                )}
                            </button>
                            <button
                                onClick={saveProduct}
                                disabled={loading}
                                className="flex items-center gap-2 bg-white/[0.07] border border-white/[0.12] hover:bg-white/[0.12] hover:border-cs-verde-musgo/40 disabled:opacity-30 transition-all duration-200 px-6 py-2.5 text-[10px] uppercase tracking-[0.25em] text-white/70"
                            >
                                <Save size={12} strokeWidth={1.5} />
                                {loading ? "Guardando..." : "Guardar cambios"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Archive confirmation modal */}
            {archiveId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0f1115] border border-white/[0.08] p-8 max-w-sm w-full shadow-2xl">
                        <div className="flex items-center gap-3 mb-5">
                            <EyeOff size={16} strokeWidth={1.5} className="text-white/40" />
                            <h2 className="text-[12px] uppercase tracking-[0.25em] text-white/75">
                                Archivar producto
                            </h2>
                        </div>
                        <p className="text-[11px] text-white/35 leading-relaxed mb-8">
                            El producto dejará de aparecer en el catálogo activo. El historial de ventas se conserva.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setArchiveId(null)}
                                className="flex-1 py-3 text-[10px] uppercase tracking-[0.2em] bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white/60 hover:border-white/[0.15] transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    const prod = products.find(p => p.id === archiveId);
                                    toggleProductStatus(archiveId, prod?.active);
                                }}
                                className="flex-1 py-3 text-[10px] uppercase tracking-[0.2em] bg-cs-vino/30 border border-cs-vino/40 text-white/70 hover:bg-cs-vino/50 transition-all"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
