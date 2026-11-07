'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Box,
  Palette,
  RotateCw,
  Printer,
  TrendingUp,
  Search,
  Shirt,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { DEFAULT_GARMENTS } from '@/constants/default-garments';
import { localDb, LocalProjectRecord } from '@/lib/storage/dexie-db';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<LocalProjectRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGarmentFilter, setSelectedGarmentFilter] = useState('ALL');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const records = await localDb.projects.reverse().toArray();
      if (records.length === 0) {
        // Seed default starter project if empty
        const defaultProject: LocalProjectRecord = {
          id: 'proj-atelier-tee-01',
          name: 'ATELIER ZERO // HEAVYWEIGHT TEE DROP',
          updatedAt: new Date().toISOString(),
          data: {
            id: 'proj-atelier-tee-01',
            name: 'ATELIER ZERO // HEAVYWEIGHT TEE DROP',
            garmentId: 'garment-oversized-tee',
            garmentColor: '#0B0B0D',
            layers: {
              FRONT: [
                {
                  id: 'layer-text-1',
                  name: 'Brand Typography',
                  type: 'TEXT',
                  surface: 'FRONT',
                  x: 50,
                  y: 42,
                  width: 60,
                  height: 15,
                  rotation: 0,
                  scaleX: 1,
                  scaleY: 1,
                  opacity: 1,
                  isLocked: false,
                  isVisible: true,
                  zIndex: 1,
                  text: 'ATELIER ZERO',
                  fontFamily: 'Impact, sans-serif',
                  fontSize: 36,
                  fillColor: '#E2F952',
                  letterSpacing: 2,
                  lineHeight: 1.2,
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
              ],
              BACK: [],
              LEFT_SLEEVE: [],
              RIGHT_SLEEVE: [],
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
        await localDb.projects.add(defaultProject);
        setProjects([defaultProject]);
      } else {
        setProjects(records);
      }
    } catch (err) {
      console.error('Failed to load local projects:', err);
    }
  };

  const handleCreateNewProject = async (garmentId = 'garment-oversized-tee') => {
    const garment = DEFAULT_GARMENTS.find((g) => g.id === garmentId) || DEFAULT_GARMENTS[0];
    const newProjectId = `proj-${Date.now().toString(36)}`;
    const newProject: LocalProjectRecord = {
      id: newProjectId,
      name: `NEW ${garment.shortName.toUpperCase()} PROJECT`,
      updatedAt: new Date().toISOString(),
      data: {
        id: newProjectId,
        name: `NEW ${garment.shortName.toUpperCase()} PROJECT`,
        garmentId: garment.id,
        garmentColor: '#0B0B0D',
        layers: {
          FRONT: [],
          BACK: [],
          LEFT_SLEEVE: [],
          RIGHT_SLEEVE: [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    await localDb.projects.add(newProject);
    toast.success(`Created project for ${garment.name}`);
    router.push(`/studio/${newProjectId}`);
  };

  const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    await localDb.projects.delete(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success('Project removed');
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8 space-y-10 max-w-7xl mx-auto font-mono">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-brand-volt mb-1.5 font-bold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-brand-volt animate-ping" />
            <span>OPERATING SYSTEM READY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Welcome back, {user?.brandName || user?.fullName || 'Creator'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Manage your apparel projects, inspect 3D garments, build gang sheets, and track margins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleCreateNewProject()}
            className="flex items-center gap-2 rounded-sm bg-brand-volt px-4 py-2.5 text-xs font-bold text-black hover:bg-brand-volt/90 transition-all shadow-md shadow-brand-volt/10"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>NEW APPAREL PROJECT</span>
          </button>
        </div>
      </div>

      {/* Quick Launch Workspaces Grid */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
          QUICK LAUNCH WORKSPACES
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            href="/studio/default"
            className="group rounded-sm border border-border bg-[#0C0D10] p-4 hover:border-brand-volt/50 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-surface text-brand-volt border border-border mb-3 group-hover:scale-105 transition-transform">
              <Palette className="h-4 w-4" />
            </div>
            <div className="text-xs font-bold text-white uppercase">2D Design Studio</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Vector & Canvas CAD</div>
          </Link>

          <Link
            href="/mockups"
            className="group rounded-sm border border-border bg-[#0C0D10] p-4 hover:border-brand-volt/50 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-surface text-brand-volt border border-border mb-3 group-hover:scale-105 transition-transform">
              <Box className="h-4 w-4" />
            </div>
            <div className="text-xs font-bold text-white uppercase">3D Garment Studio</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Real-time PBR Drape</div>
          </Link>

          <Link
            href="/motion"
            className="group rounded-sm border border-border bg-[#0C0D10] p-4 hover:border-brand-volt/50 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-surface text-brand-volt border border-border mb-3 group-hover:scale-105 transition-transform">
              <RotateCw className="h-4 w-4" />
            </div>
            <div className="text-xs font-bold text-white uppercase">360° Turntable</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Video Loops (9:16 / 1:1)</div>
          </Link>

          <Link
            href="/production"
            className="group rounded-sm border border-border bg-[#0C0D10] p-4 hover:border-brand-volt/50 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-surface text-brand-volt border border-border mb-3 group-hover:scale-105 transition-transform">
              <Printer className="h-4 w-4" />
            </div>
            <div className="text-xs font-bold text-white uppercase">DTF Gang Sheet</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">MaxRects 22"/24" Bin Packing</div>
          </Link>

          <Link
            href="/products"
            className="group rounded-sm border border-border bg-[#0C0D10] p-4 hover:border-brand-volt/50 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-surface text-brand-volt border border-border mb-3 group-hover:scale-105 transition-transform">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-xs font-bold text-white uppercase">Profit Calculator</div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Unit Margin Economics</div>
          </Link>
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              PROJECTS & SAVED DRAFTS
            </div>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Saved automatically to your local browser storage via Dexie IndexedDB.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-sm border border-border bg-[#0C0D10] py-1.5 pl-8 pr-3 text-xs text-white placeholder-zinc-600 focus:border-brand-volt focus:outline-none"
            />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="rounded-sm border border-dashed border-border p-12 text-center">
            <Shirt className="h-8 w-8 text-zinc-600 mx-auto mb-3" />
            <div className="text-xs font-bold text-white uppercase">No Projects Found</div>
            <p className="text-xs text-zinc-500 font-sans mt-1">
              Create a new apparel project below to start designing.
            </p>
            <button
              onClick={() => handleCreateNewProject()}
              className="mt-4 inline-flex items-center gap-1.5 rounded-sm bg-brand-volt px-4 py-2 text-xs font-bold text-black"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>CREATE FIRST PROJECT</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => {
              const garment =
                DEFAULT_GARMENTS.find((g) => g.id === project.data.garmentId) ||
                DEFAULT_GARMENTS[0];
              const layerCount = Object.values(project.data.layers).reduce(
                (sum, arr) => sum + arr.length,
                0
              );

              return (
                <div
                  key={project.id}
                  onClick={() => router.push(`/studio/${project.id}`)}
                  className="group cursor-pointer rounded-sm border border-border bg-[#0C0D10] p-5 hover:border-brand-volt/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Garment Color Chip & Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full border border-zinc-700"
                          style={{ backgroundColor: project.data.garmentColor || '#0B0B0D' }}
                        />
                        <span className="text-[10px] text-brand-volt uppercase font-bold">
                          {garment.shortName}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteProject(e, project.id)}
                        title="Delete project"
                        className="text-zinc-600 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <h3 className="text-xs font-bold text-white uppercase group-hover:text-brand-volt transition-colors truncate">
                      {project.name}
                    </h3>

                    <div className="mt-3 flex items-center gap-4 text-[10px] text-zinc-500">
                      <span>{layerCount} Artwork Layers</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Open Studio</span>
                    <ArrowRight className="h-3.5 w-3.5 text-brand-volt group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Streetwear Garment Blanks Quick-Start Selector */}
      <div className="border-t border-border pt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              CREATE FROM APPAREL BLANK
            </div>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Select one of the 10 core streetwear silhouettes to begin an apparel design.
            </p>
          </div>
          <Link href="/mockups" className="text-xs text-brand-volt hover:underline flex items-center gap-1">
            <span>View in 3D</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {DEFAULT_GARMENTS.map((garment) => (
            <button
              key={garment.id}
              onClick={() => handleCreateNewProject(garment.id)}
              className="text-left rounded-sm border border-border bg-[#0C0D10] p-4 hover:border-brand-volt/60 hover:bg-surface/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Shirt className="h-4 w-4 text-brand-volt" />
                  <span className="text-[10px] text-zinc-500 font-bold">
                    ${garment.baseCostUSD.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs font-bold text-white uppercase truncate">
                  {garment.shortName}
                </div>
                <div className="text-[10px] text-zinc-500 mt-1 line-clamp-2 font-sans">
                  {garment.description}
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-brand-volt font-bold">
                <span>CREATE</span>
                <Plus className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
