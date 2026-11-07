'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
  Shirt,
  Sparkles,
  Calculator,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useProductStore } from '@/stores/product-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { ProductItem } from '@/types/product';
import { toast } from 'sonner';

export default function ProductsPage() {
  const {
    products,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    calculateEconomics,
  } = useProductStore();

  // Profit Calculator State
  const [calcRetail, setCalcRetail] = useState(58.0);
  const [calcBlank, setCalcBlank] = useState(11.5);
  const [calcPrint, setCalcPrint] = useState(5.0);
  const [calcPackaging, setCalcPackaging] = useState(3.0);
  const [calcBatchUnits, setCalcBatchUnits] = useState(100);

  // New Product Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(DEFAULT_GARMENTS[0].category);
  const [newRetail, setNewRetail] = useState(58.0);
  const [newBlank, setNewBlank] = useState(11.5);
  const [newPrint, setNewPrint] = useState(5.0);
  const [newPackaging, setNewPackaging] = useState(3.0);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const currentEcon = calculateEconomics(
    calcRetail,
    calcBlank,
    calcPrint,
    calcPackaging
  );

  const batchRevenue = calcRetail * calcBatchUnits;
  const batchTotalCosts = (calcBlank + calcPrint + calcPackaging) * calcBatchUnits;
  const batchNetProfit = currentEcon.grossProfitUSD * calcBatchUnits;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Product title is required');
      return;
    }

    const econ = calculateEconomics(newRetail, newBlank, newPrint, newPackaging);

    await addProduct({
      title: newTitle.toUpperCase(),
      slug: newTitle.toLowerCase().replace(/\s+/g, '-'),
      description: 'Manufactured with StartTheBrand apparel production specs.',
      category: newCategory,
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      colors: [
        { name: 'Pitch Black', hex: '#0B0B0D' },
        { name: 'Heather Gray', hex: '#8C8D91' },
      ],
      images: [],
      economics: econ,
      status: 'published',
      isPublic: true,
    });

    toast.success(`Created SKU: ${newTitle}`);
    setModalOpen(false);
    setNewTitle('');
  };

  return (
    <div className="p-6 sm:p-8 space-y-10 max-w-7xl mx-auto font-mono text-xs">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-brand-volt mb-1 font-bold uppercase tracking-wider">
            <Calculator className="h-4 w-4" />
            <span>COMMERCE & REVENUE ENGINE</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Merchandise Economics & Catalog
          </h1>
          <p className="text-zinc-400 font-sans text-xs mt-1">
            Calculate exact unit profit margins, break-even unit volumes, and manage product drops.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-sm bg-brand-volt px-4 py-2.5 text-xs font-bold text-black hover:bg-brand-volt/90 transition-all shadow-md shadow-brand-volt/20"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>NEW APPAREL SKU</span>
        </button>
      </div>

      {/* SECTION 1: INTERACTIVE UNIT PROFIT CALCULATOR */}
      <div className="rounded-sm border border-border bg-[#0C0D10] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-brand-volt font-bold">
              TRANSPARENT UNIT ECONOMICS
            </div>
            <h2 className="text-sm font-black text-white uppercase mt-0.5">
              Live Gross Margin & Profit Calculator
            </h2>
          </div>
          <div className="text-[10px] text-zinc-500">
            Formulas: Retail − (Blank + Print + Polymailer + 2.9% + $0.30)
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded border border-border bg-[#07080A] p-3 space-y-2">
            <div className="flex justify-between text-[10px] uppercase text-zinc-400">
              <span>Retail Price</span>
              <span className="text-brand-volt font-bold">${calcRetail.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="20"
              max="250"
              step="1"
              value={calcRetail}
              onChange={(e) => setCalcRetail(parseFloat(e.target.value))}
              className="w-full accent-brand-volt"
            />
          </div>

          <div className="rounded border border-border bg-[#07080A] p-3 space-y-2">
            <div className="flex justify-between text-[10px] uppercase text-zinc-400">
              <span>Blank Cost</span>
              <span className="text-white font-bold">${calcBlank.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="4"
              max="50"
              step="0.5"
              value={calcBlank}
              onChange={(e) => setCalcBlank(parseFloat(e.target.value))}
              className="w-full accent-brand-volt"
            />
          </div>

          <div className="rounded border border-border bg-[#07080A] p-3 space-y-2">
            <div className="flex justify-between text-[10px] uppercase text-zinc-400">
              <span>Print Cost</span>
              <span className="text-white font-bold">${calcPrint.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="0.5"
              value={calcPrint}
              onChange={(e) => setCalcPrint(parseFloat(e.target.value))}
              className="w-full accent-brand-volt"
            />
          </div>

          <div className="rounded border border-border bg-[#07080A] p-3 space-y-2">
            <div className="flex justify-between text-[10px] uppercase text-zinc-400">
              <span>Packaging / Ship</span>
              <span className="text-white font-bold">${calcPackaging.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={calcPackaging}
              onChange={(e) => setCalcPackaging(parseFloat(e.target.value))}
              className="w-full accent-brand-volt"
            />
          </div>

          <div className="rounded border border-border bg-[#07080A] p-3 space-y-2">
            <div className="flex justify-between text-[10px] uppercase text-zinc-400">
              <span>Production Batch</span>
              <span className="text-white font-bold">{calcBatchUnits} Units</span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={calcBatchUnits}
              onChange={(e) => setCalcBatchUnits(parseInt(e.target.value))}
              className="w-full accent-brand-volt"
            />
          </div>
        </div>

        {/* Live KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div className="rounded-sm border border-brand-volt/40 bg-brand-volt/5 p-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">
              Gross Profit / Unit
            </span>
            <div className="text-2xl font-black text-brand-volt mt-1">
              ${currentEcon.grossProfitUSD.toFixed(2)}
            </div>
            <span className="text-[9px] text-zinc-500">Per garment sold</span>
          </div>

          <div className="rounded-sm border border-border bg-[#07080A] p-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">
              Gross Margin %
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {currentEcon.grossMarginPercent}%
            </div>
            <span className="text-[9px] text-emerald-400 font-bold">
              {currentEcon.markupMultiplier}x Cost Markup
            </span>
          </div>

          <div className="rounded-sm border border-border bg-[#07080A] p-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">
              Batch Gross Revenue
            </span>
            <div className="text-2xl font-black text-white mt-1">
              ${batchRevenue.toLocaleString()}
            </div>
            <span className="text-[9px] text-zinc-500">From {calcBatchUnits} units</span>
          </div>

          <div className="rounded-sm border border-emerald-500/40 bg-emerald-500/5 p-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">
              Batch Net Profit
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              ${batchNetProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[9px] text-emerald-400">Take-home earnings</span>
          </div>

          <div className="rounded-sm border border-border bg-[#07080A] p-4">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">
              Break-Even Run
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {currentEcon.breakEvenUnits} Units
            </div>
            <span className="text-[9px] text-zinc-500">To recover initial batch costs</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: APPAREL SKU CATALOG */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              ACTIVE PRODUCT DROPS ({products.length})
            </div>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Configured apparel SKUs with size runs and attached garment blanks.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {products.map((product) => {
            const garment =
              DEFAULT_GARMENTS.find((g) => g.category === product.category) ||
              DEFAULT_GARMENTS[0];

            return (
              <div
                key={product.id}
                className="rounded-sm border border-border bg-[#0C0D10] p-5 hover:border-zinc-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
                        product.status === 'published'
                          ? 'bg-brand-volt text-black'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {product.status}
                    </span>
                    <span className="text-[10px] text-brand-volt font-bold uppercase">
                      {garment.shortName}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-white uppercase">{product.title}</h3>
                  <p className="text-xs text-zinc-400 font-sans">{product.description}</p>

                  <div className="flex items-center gap-4 text-[10px] text-zinc-500 pt-1">
                    <span>Sizes: {product.sizes.join(', ')}</span>
                    <span>•</span>
                    <span>Colors: {product.colors.map((c) => c.name).join(', ')}</span>
                  </div>
                </div>

                {/* Economics Specs */}
                <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6">
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500 uppercase">Retail Price</div>
                    <div className="text-base font-black text-white">
                      ${product.economics.retailPrice.toFixed(2)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500 uppercase">Margin</div>
                    <div className="text-base font-black text-brand-volt">
                      {product.economics.grossMarginPercent}%
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500 uppercase">Gross Profit</div>
                    <div className="text-base font-black text-emerald-400">
                      +${product.economics.grossProfitUSD.toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
                    title="Delete SKU"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE PRODUCT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-sm border border-border bg-[#0C0D10] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-white uppercase text-sm">
                Create New Apparel SKU
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                  Product Drop Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ATELIER ZERO // DROP 02 SWEATPANTS"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded border border-border bg-[#07080A] py-1.5 px-2.5 text-xs text-white uppercase focus:border-brand-volt focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                  Garment Silhouette
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full rounded border border-border bg-[#07080A] py-1.5 px-2 text-xs text-white focus:border-brand-volt focus:outline-none"
                >
                  {DEFAULT_GARMENTS.map((g) => (
                    <option key={g.id} value={g.category}>
                      {g.name} (${g.baseCostUSD.toFixed(2)} Base)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                    Retail Selling Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newRetail}
                    onChange={(e) => setNewRetail(parseFloat(e.target.value) || 0)}
                    className="w-full rounded border border-border bg-[#07080A] py-1.5 px-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                    Blank Garment Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newBlank}
                    onChange={(e) => setNewBlank(parseFloat(e.target.value) || 0)}
                    className="w-full rounded border border-border bg-[#07080A] py-1.5 px-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                    Print Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newPrint}
                    onChange={(e) => setNewPrint(parseFloat(e.target.value) || 0)}
                    className="w-full rounded border border-border bg-[#07080A] py-1.5 px-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-zinc-400 block mb-1">
                    Packaging / Polymailer ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newPackaging}
                    onChange={(e) => setNewPackaging(parseFloat(e.target.value) || 0)}
                    className="w-full rounded border border-border bg-[#07080A] py-1.5 px-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-sm bg-brand-volt px-5 py-2 font-bold text-black hover:bg-brand-volt/90"
                >
                  SAVE PRODUCT SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
