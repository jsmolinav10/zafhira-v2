'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  METALS, BAND_PROFILES, BAND_FINISHES, SETTINGS, GEMS, GEM_SHAPES, SIZES, CARAT_OPTIONS, WIDTH_OPTIONS 
} from './RingBuilderData'
import { RingBand, SettingMount, GemStone } from './RingBuilderSVG'

export default function RingBuilderClient() {
  const [config, setConfig] = useState({
    metalId: 'oro-amarillo-18k',
    profile: 'comfort-fit',
    width: 2.5,
    finish: 'pulido',
    settingId: 'solitario-4',
    gemId: 'diamante',
    gemShape: 'brillante',
    carat: 1,
    size: 7
  })

  const [activeTab, setActiveTab] = useState('metal')

  // Calculated properties
  const selectedMetal = useMemo(() => METALS.find(m => m.id === config.metalId), [config.metalId])
  const selectedSetting = useMemo(() => SETTINGS.find(s => s.id === config.settingId), [config.settingId])
  const selectedGem = useMemo(() => GEMS.find(g => g.id === config.gemId), [config.gemId])
  
  const totalPrice = useMemo(() => {
    let total = 0
    if (selectedMetal) total += selectedMetal.price
    if (selectedSetting) total += selectedSetting.price
    if (selectedGem) {
      if (selectedGem.fixedPrice !== undefined) {
        total += selectedGem.fixedPrice
      } else {
        total += selectedGem.pricePerCt * config.carat
      }
    }
    return total
  }, [selectedMetal, selectedSetting, selectedGem, config.carat])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#FAFAFA] text-zinc-900 font-sans overflow-hidden">
      
      {/* Visualizer Area */}
      <div className="flex-1 relative flex items-center justify-center bg-gradient-to-br from-[#F5F5F5] to-[#EAEAEA]">
        
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-transparent to-transparent pointer-events-none" />

        {/* Ring Canvas */}
        <div className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px] scale-105 transition-transform duration-500 hover:scale-110">
           {/* Shadow */}
           <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[250px] h-[30px] bg-black/20 blur-xl rounded-full" />
           
           {/* SVG Components stack */}
           <RingBand config={config} metals={METALS} />
           <SettingMount config={config} settings={SETTINGS} metals={METALS} />
           <GemStone config={config} gems={GEMS} shapes={GEM_SHAPES} />
        </div>

        {/* Price Tag floating */}
        <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/50">
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-semibold mb-1">Inversión Estimada</p>
          <p className="text-3xl font-serif text-zinc-900">{formatPrice(totalPrice)}</p>
        </div>
      </div>

      {/* Control Panel Area */}
      <div className="w-full md:w-[450px] bg-white border-l border-zinc-200 flex flex-col h-full shadow-[-10px_0_30px_rgba(0,0,0,0.03)] z-30">
        
        <div className="p-8 border-b border-zinc-100 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-3xl font-serif tracking-tight mb-2">Taller de Alta Joyería</h1>
          <p className="text-zinc-500 text-sm leading-relaxed">Configura cada aspecto técnico de tu obra de arte. Diseño hiperrealista en tiempo real.</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-zinc-100 px-4 bg-zinc-50 overflow-x-auto no-scrollbar">
          {[
            { id: 'metal', label: '1. Estructura' },
            { id: 'gem', label: '2. Gema Central' },
            { id: 'setting', label: '3. Engaste' },
            { id: 'summary', label: 'Resumen' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            
            {activeTab === 'metal' && (
              <motion.div key="metal" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-10">
                {/* Metales */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-zinc-300"></span> Aleación Base
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {METALS.map(m => (
                      <button key={m.id} onClick={() => setConfig({...config, metalId: m.id})}
                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                          config.metalId === m.id ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900/10' : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full border border-black/10 shadow-sm" style={{ background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[2]})` }} />
                        <div>
                          <p className="text-sm font-medium text-zinc-900 leading-tight">{m.name}</p>
                          {m.price > 0 && <p className="text-[10px] text-zinc-500 mt-0.5">+{formatPrice(m.price)}</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Perfil de Banda */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-zinc-300"></span> Perfil Arquitectónico
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                     {BAND_PROFILES.map(p => (
                       <button key={p.id} onClick={() => setConfig({...config, profile: p.id})}
                         className={`p-3 rounded-xl border text-left text-sm transition-all ${config.profile === p.id ? 'border-zinc-900 bg-zinc-50 font-medium' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                       >
                         {p.name}
                       </button>
                     ))}
                  </div>
                </section>

                {/* Acabado */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-zinc-300"></span> Textura Superficial
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                     {BAND_FINISHES.map(f => (
                       <button key={f.id} onClick={() => setConfig({...config, finish: f.id})}
                         className={`p-3 rounded-xl border text-left text-sm transition-all ${config.finish === f.id ? 'border-zinc-900 bg-zinc-50 font-medium' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                       >
                         {f.name}
                       </button>
                     ))}
                  </div>
                </section>
                
                {/* Ancho */}
                <section>
                   <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center justify-between">
                     <span className="flex items-center gap-2"><span className="w-4 h-[1px] bg-zinc-300"></span> Calibre (Ancho)</span>
                     <span className="text-zinc-900">{config.width}mm</span>
                   </h3>
                   <input type="range" min="1.5" max="6.0" step="0.5" value={config.width} onChange={(e) => setConfig({...config, width: parseFloat(e.target.value)})}
                     className="w-full accent-zinc-900 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer" />
                   <div className="flex justify-between text-[10px] text-zinc-400 mt-2">
                     <span>1.5mm (Ultra Fino)</span>
                     <span>6.0mm (Grueso)</span>
                   </div>
                </section>

              </motion.div>
            )}

            {activeTab === 'gem' && (
              <motion.div key="gem" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-10">
                {/* Tipo de Gema */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-zinc-300"></span> Especie Gemológica
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {GEMS.map(g => (
                      <button key={g.id} onClick={() => setConfig({...config, gemId: g.id})}
                        className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                          config.gemId === g.id ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900/10' : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <span className="text-2xl drop-shadow-sm">{g.icon}</span>
                        <div className="text-left flex-1">
                          <p className="text-sm font-medium text-zinc-900">{g.name}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{g.details}</p>
                        </div>
                        <div className="text-right">
                          {g.fixedPrice !== undefined ? (
                            <p className="text-xs text-zinc-500">{formatPrice(g.fixedPrice)}</p>
                          ) : (
                            <p className="text-xs text-zinc-500">{formatPrice(g.pricePerCt)}/ct</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Corte de Gema */}
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-zinc-300"></span> Geometría (Corte)
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                     {GEM_SHAPES.map(s => (
                       <button key={s.id} onClick={() => setConfig({...config, gemShape: s.id})}
                         className={`p-2 rounded-lg border text-center text-[11px] leading-tight transition-all ${
                           config.gemShape === s.id ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                         }`}
                       >
                         {s.name}
                       </button>
                     ))}
                  </div>
                </section>

                {/* Quilates */}
                <section>
                   <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center justify-between">
                     <span className="flex items-center gap-2"><span className="w-4 h-[1px] bg-zinc-300"></span> Peso (Quilates/Ct)</span>
                     <span className="text-zinc-900">{config.carat} ct</span>
                   </h3>
                   <input type="range" min="0.5" max="3" step="0.25" value={config.carat} onChange={(e) => setConfig({...config, carat: parseFloat(e.target.value)})}
                     className="w-full accent-zinc-900 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer" />
                   <div className="flex justify-between text-[10px] text-zinc-400 mt-2 px-1">
                     {CARAT_OPTIONS.filter(c => c===0.5 || c===1 || c===2 || c===3).map(c => (
                        <span key={c}>{c}ct</span>
                     ))}
                   </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'setting' && (
              <motion.div key="setting" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-6">
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-zinc-300"></span> Arquitectura de Montura
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {SETTINGS.map(s => (
                      <button key={s.id} onClick={() => setConfig({...config, settingId: s.id})}
                        className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                          config.settingId === s.id ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900/10' : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <span className="text-2xl opacity-80 grayscale">{s.icon}</span>
                        <div className="text-left flex-1">
                          <p className="text-sm font-medium text-zinc-900">{s.name}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{s.desc}</p>
                        </div>
                        {s.price > 0 && (
                          <div className="text-right">
                            <p className="text-xs text-zinc-500">+{formatPrice(s.price)}</p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'summary' && (
              <motion.div key="summary" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-8">
                
                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                   <h2 className="text-lg font-serif mb-6 border-b border-zinc-200 pb-4">Especificaciones Técnicas</h2>
                   
                   <dl className="space-y-4 text-sm">
                      <div className="flex justify-between">
                         <dt className="text-zinc-500">Metal Base</dt>
                         <dd className="font-medium text-right">{selectedMetal?.name}</dd>
                      </div>
                      <div className="flex justify-between">
                         <dt className="text-zinc-500">Perfil & Acabado</dt>
                         <dd className="font-medium text-right capitalize">{config.profile.replace('-',' ')} • {config.finish}</dd>
                      </div>
                      <div className="flex justify-between">
                         <dt className="text-zinc-500">Calibre</dt>
                         <dd className="font-medium text-right">{config.width} mm</dd>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-zinc-200">
                         <dt className="text-zinc-500">Centro Gemológico</dt>
                         <dd className="font-medium text-right">{selectedGem?.name}</dd>
                      </div>
                      <div className="flex justify-between">
                         <dt className="text-zinc-500">Corte & Peso</dt>
                         <dd className="font-medium text-right capitalize">{config.gemShape} • {config.carat} ct</dd>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-zinc-200">
                         <dt className="text-zinc-500">Montura Estructural</dt>
                         <dd className="font-medium text-right">{selectedSetting?.name}</dd>
                      </div>
                   </dl>
                </div>

                <button className="w-full bg-zinc-900 text-white py-4 rounded-xl text-sm font-semibold tracking-wide hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20">
                  SOLICITAR FABRICACIÓN
                </button>
                <p className="text-xs text-center text-zinc-500">Tiempo estimado de elaboración artesanal: 15-20 días hábiles.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
