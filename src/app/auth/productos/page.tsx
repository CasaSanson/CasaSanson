"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase";
import { Edit, Plus, Save, X, AlertTriangle, ChevronRight, EyeOff, Eye, Archive, Package, Search } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ORDEN_TALLAS = ["XS", "S", "M", "L", "XL"];

export default function CasaSansonHub() {
    // --- ESTADOS ---
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

    // --- LÓGICA DE DATOS ---
    async function fetchProducts() {
        setLoading(true);
        const { data, error } = await supabase
            .from("products")
            .select(`*, product_variants(*)`)
            .eq('active', view === 'active') // Filtro dinámico
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

    // --- GUARDADO ROBUSTO ---
    async function saveProduct() {
        setLoading(true);
        const loadToast = toast.loading("Actualizando Casa Sansón...");
        
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
                // Tallas nuevas: SIN propiedad 'id' para que la DB genere el UUID
                const nuevas = variants.filter(v => !v.id).map((v, i) => ({
                    product_id: productId,
                    size: v.size,
                    stock: parseInt(v.stock?.toString() || "0"),
                    sku: v.sku || `CS-${productId.slice(0, 4)}-${v.size}-${Date.now()}-${i}`,
                    active: true
                }));

                // Tallas existentes: CON su 'id' para actualizar stock
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

            toast.update(loadToast, { render: "Sincronización Exitosa", type: "success", isLoading: false, autoClose: 2000 });
            resetForm();
            fetchProducts();
        } catch (err: any) {
            toast.update(loadToast, { render: `Error: ${err.message}`, type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    }

    // --- BORRADO LÓGICO (ARCHIVAR) ---
    async function toggleProductStatus(targetId: string, currentStatus: boolean) {
        const loadToast = toast.loading(currentStatus ? "Archivando..." : "Restaurando...");
        try {
            const { error } = await supabase
                .from("products")
                .update({ active: !currentStatus }) // Invertimos el estado
                .eq('id', targetId);

            if (error) throw error;

            toast.update(loadToast, { render: currentStatus ? "Oculto del catálogo" : "Restaurado al catálogo", type: "success", isLoading: false, autoClose: 2000 });
            setArchiveId(null);
            fetchProducts();
        } catch (err: any) {
            toast.update(loadToast, { render: "Error en cambio de estado", type: "error", isLoading: false, autoClose: 3000 });
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
        newVariants.sort((a, b) => ORDEN_TALLAS.indexOf(a.size) - ORDEN_TALLAS.indexOf(b.size)); // Orden XS-XL
        setVariants(newVariants);
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <main className="min-h-screen bg-[#fcfcfc] p-6 lg:p-12 font-sans text-slate-900">
            <ToastContainer position="top-right" theme="dark" />
            
            {/* Header Pro */}
            <div className="max-w-7xl mx-auto mb-16 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-6xl font-black tracking-tighter italic uppercase leading-none">CASA SANSÓN <span className="text-blue-600">HUB</span></h1>
                        <div className="flex items-center gap-3 mt-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Live Inventory Cloud System</p>
                        </div>
                    </div>
                    <button onClick={() => { resetForm(); setPanelMode('create'); }} className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs tracking-widest hover:bg-blue-600 transition-all shadow-2xl active:scale-95 flex items-center gap-3 uppercase">
                        <Plus size={18}/> Nuevo Producto
                    </button>
                </div>

                {/* Toolbar: Filtros y Buscador */}
                <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm items-center">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20}/>
                        <input 
                            placeholder="Buscar en el catálogo..." 
                            className="w-full pl-14 pr-8 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex p-1 bg-slate-100 rounded-2xl">
                        <button onClick={() => setView('active')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'active' ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>Activos</button>
                        <button onClick={() => setView('archived')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${view === 'archived' ? "bg-white text-orange-600 shadow-sm" : "text-slate-400"}`}>Archivados</button>
                    </div>
                </div>
            </div>

            {/* Grid de Productos */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group border-b-8 border-b-slate-200">
                        <div className="h-80 relative bg-slate-200 overflow-hidden">
                            <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                            <div className="absolute top-6 right-6 flex gap-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                <button onClick={() => handleEditOpen(product)} className="bg-white p-4 rounded-2xl shadow-xl hover:text-blue-600 transition-colors"><Edit size={22}/></button>
                                <button onClick={() => setArchiveId(product.id)} className="bg-white p-4 rounded-2xl shadow-xl hover:text-orange-600 transition-colors">
                                    {product.active ? <EyeOff size={22}/> : <Eye size={22}/>}
                                </button>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="font-black text-2xl uppercase tracking-tighter text-slate-800 leading-none">{product.name}</h3>
                                <p className="text-xl font-black text-blue-600 italic">${product.base_price}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product.product_variants?.sort((a:any,b:any) => ORDEN_TALLAS.indexOf(a.size) - ORDEN_TALLAS.indexOf(b.size)).map((v:any) => (
                                    <div key={v.id} className="text-[10px] font-black bg-slate-50 border-2 border-slate-100 px-3 py-2 rounded-xl flex items-center gap-2">
                                        <span className="text-slate-400 uppercase">{v.size}</span>
                                        <span className={v.stock > 0 ? "text-slate-900" : "text-red-500"}>{v.stock}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Control (Datos + Stock) */}
            {panelMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4">
                    <div className="bg-white w-full max-w-6xl rounded-[4rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                        <div className="flex border-b bg-slate-50/50">
                            <button onClick={() => setStep(1)} className={`flex-1 p-8 font-black text-xs tracking-[0.4em] transition-all uppercase ${step === 1 ? "bg-white text-blue-600 shadow-[inset_0_-4px_0_0_#2563eb]" : "text-slate-400"}`}>01. Atributos</button>
                            <button onClick={() => setStep(2)} className={`flex-1 p-8 font-black text-xs tracking-[0.4em] transition-all uppercase ${step === 2 ? "bg-white text-blue-600 shadow-[inset_0_-4px_0_0_#2563eb]" : "text-slate-400"}`}>02. Existencias</button>
                            <button onClick={resetForm} className="px-14 text-slate-400 hover:text-red-500 transition-colors border-l"><X size={32}/></button>
                        </div>

                        <div className="p-12 overflow-y-auto flex-1 text-center">
                            {step === 1 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
                                    <div className="space-y-8">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Nombre</label>
                                            <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full mt-2 p-6 bg-slate-50 rounded-3xl outline-none ring-2 ring-transparent focus:ring-blue-500 font-bold text-xl" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Descripción</label>
                                            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full mt-2 p-6 bg-slate-50 rounded-3xl h-44 outline-none ring-2 ring-transparent focus:ring-blue-500 resize-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Precio</label>
                                                <input type="text" value={formData.base_price} onChange={e => setFormData({...formData, base_price: e.target.value})} className="w-full mt-2 p-6 bg-slate-50 rounded-3xl outline-none ring-2 ring-transparent focus:ring-blue-500 font-black text-2xl text-blue-600" />
                                            </div>
                                            <div className="flex items-center justify-center gap-4 pt-6 italic">
                                                <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-8 h-8 accent-blue-600" />
                                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Disponible</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="h-72 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-400 transition-all">
                                            {mainFile || formData.image ? (
                                                <img src={mainFile ? URL.createObjectURL(mainFile) : formData.image} className="w-full h-full object-cover shadow-inner" />
                                            ) : (
                                                <div className="text-center opacity-30">
                                                    <Plus className="mx-auto mb-2" size={48}/>
                                                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Subir Imagen</p>
                                                </div>
                                            )}
                                            <input type="file" onChange={e => e.target.files && setMainFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                        </div>
                                        <div className="bg-slate-900 p-8 rounded-[3rem] grid grid-cols-2 gap-6 shadow-2xl">
                                            <label className="flex items-center gap-3 p-5 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                                                <input type="checkbox" checked={formData.maquila} onChange={e => setFormData({...formData, maquila: e.target.checked})} className="w-6 h-6 accent-blue-400" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Maquila</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-5 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all">
                                                <input type="checkbox" checked={formData.personalizacion} onChange={e => setFormData({...formData, personalizacion: e.target.checked})} className="w-6 h-6 accent-blue-400" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Personalizar</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="max-w-4xl mx-auto space-y-12">
                                    <h3 className="text-4xl font-black uppercase tracking-tighter mb-10 italic">Configurar Inventario</h3>
                                    
                                    <div className="flex justify-center gap-4 mb-16 flex-wrap">
                                        {ORDEN_TALLAS.map(size => {
                                            const isActive = variants.find(v => v.size === size);
                                            return (
                                                <button key={size} onClick={() => toggleSize(size)} className={`w-24 h-24 rounded-[2.5rem] font-black text-2xl transition-all border-4 flex items-center justify-center ${isActive ? "bg-blue-600 border-blue-600 text-white shadow-2xl scale-110" : "bg-slate-50 border-slate-100 text-slate-300 hover:border-slate-300"}`}>
                                                    {size}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                                        {variants.map((v, i) => (
                                            <div key={v.size} className="flex items-center gap-6 bg-slate-50 p-8 rounded-[3.5rem] border-2 border-slate-100 animate-in zoom-in-95 duration-500">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-3xl text-blue-600 shadow-sm border italic">{v.size}</div>
                                                <div className="flex-1 text-left">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase italic leading-none ml-1">Stock</label>
                                                    <input type="number" value={v.stock} onChange={e => {
                                                        const nv = [...variants];
                                                        nv[i].stock = parseInt(e.target.value) || 0;
                                                        setVariants(nv);
                                                    }} className="w-full bg-transparent font-black text-4xl outline-none focus:text-blue-600 transition-all" />
                                                </div>
                                                <button onClick={() => toggleSize(v.size)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={32}/></button>
                                            </div>
                                        ))}
                                        {variants.length === 0 && <div className="md:col-span-2 py-20 text-slate-300 font-black uppercase tracking-widest italic border-2 border-dashed rounded-[3rem]">Selecciona tallas arriba para gestionar existencias</div>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-10 bg-slate-50 border-t flex justify-between items-center px-16">
                            <button onClick={() => setStep(step === 1 ? 2 : 1)} className="font-black text-[11px] uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-all flex items-center gap-2">
                                {step === 1 ? <>Siguiente: Inventario <ChevronRight size={18}/></> : "← Volver a Datos"}
                            </button>
                            <button onClick={saveProduct} disabled={loading} className="bg-slate-900 text-white px-20 py-6 rounded-[2.5rem] font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-600 shadow-2xl active:scale-95 disabled:bg-slate-300 transition-all">
                                {loading ? "Sincronizando..." : "Finalizar Cambios"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Archivado (Soft Delete) */}
            {archiveId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4 text-center">
                    <div className="bg-white p-16 rounded-[4.5rem] max-w-sm w-full shadow-2xl border-b-8 border-orange-500 animate-in zoom-in-95">
                        <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce"><EyeOff size={48}/></div>
                        <h2 className="font-black text-3xl mb-4 italic tracking-tighter uppercase text-slate-900 leading-none">¿Ocultar Producto?</h2>
                        <p className="text-slate-400 font-medium mb-12">No romperemos el historial de ventas, pero ya no aparecerá en el catálogo activo de Casa Sansón.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setArchiveId(null)} className="flex-1 p-5 font-black text-xs bg-slate-100 rounded-[1.5rem] uppercase">No</button>
                            <button 
                                onClick={() => {
                                    const prod = products.find(p => p.id === archiveId);
                                    toggleProductStatus(archiveId, prod?.active);
                                }} 
                                className="flex-1 p-5 font-black text-xs bg-orange-600 text-white rounded-[1.5rem] shadow-xl uppercase"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}