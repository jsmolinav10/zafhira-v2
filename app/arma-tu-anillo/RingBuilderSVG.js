import React from 'react';

// Helpers to create complex SVG paths and gradients
export const RingBand = ({ config, metals }) => {
  const metal = metals.find(m => m.id === config.metalId) || metals[0];
  const isSatin = config.finish === 'satinado';
  const isHammered = config.finish === 'martillado';
  const profile = config.profile || 'comfort-fit';
  const width = config.width || 2.5;

  // Determine width visual scale: base width 2.5 maps to 40px stroke width, scale accordingly
  const widthScale = width / 2.5;
  const strokeWidth = 40 * widthScale;

  // Render logic...
  return (
    <svg viewBox="0 0 400 400" className="absolute top-0 left-0 w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={metal.gradient[0]} />
          <stop offset="50%" stopColor={metal.gradient[1]} />
          <stop offset="100%" stopColor={metal.gradient[2]} />
        </linearGradient>
        
        {/* Filtros para texturas de acabado */}
        <filter id="satin">
           <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
           <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0" in="noise" result="coloredNoise" />
           <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
        </filter>

        <filter id="hammered">
           <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
           <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
           <feSpecularLighting in="noise" surfaceScale="5" specularConstant="1" specularExponent="20" lightingColor={metal.pbr} result="specOut">
             <fePointLight x="200" y="50" z="200" />
           </feSpecularLighting>
           <feBlend in="SourceGraphic" in2="specOut" mode="screen" />
        </filter>
        
        {/* Iluminación PBR Base */}
        <filter id="pbrLighting">
           <feSpecularLighting surfaceScale="2" specularConstant="1.5" specularExponent="30" lightingColor="#ffffff">
              <fePointLight x="100" y="50" z="200" />
           </feSpecularLighting>
           <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>
      </defs>

      <g>
         <ellipse cx="200" cy="220" rx="120" ry="80" 
           fill="none" 
           stroke="url(#bandGrad)" 
           strokeWidth={strokeWidth} 
           filter={isHammered ? "url(#hammered)" : isSatin ? "url(#satin)" : "url(#pbrLighting)"} 
           className="transition-all duration-700 ease-in-out" />
         
         {profile === 'knife-edge' && (
            <ellipse cx="200" cy="220" rx="120" ry="80" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
         )}
         {profile === 'd-shape' && (
            <ellipse cx="200" cy="220" rx="100" ry="60" fill="none" stroke="#000000" strokeWidth={strokeWidth/2} opacity="0.1" />
         )}
      </g>
    </svg>
  );
};

export const SettingMount = ({ config, settings, metals }) => {
  const setting = settings.find(s => s.id === config.settingId) || settings[0];
  const metal = metals.find(m => m.id === config.metalId) || metals[0];

  return (
    <svg viewBox="0 0 400 400" className="absolute top-0 left-0 w-full h-full z-10 drop-shadow-md pointer-events-none">
      <defs>
        <linearGradient id="settingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={metal.gradient[0]} />
          <stop offset="50%" stopColor={metal.gradient[1]} />
          <stop offset="100%" stopColor={metal.gradient[2]} />
        </linearGradient>
      </defs>
      
      {/* Lógica de renderizado según tipo de montura */}
      {setting.id.includes('solitario') && (
        <g>
          {/* Garras básicas */}
          <path d="M160,160 Q170,120 180,100" fill="none" stroke="url(#settingGrad)" strokeWidth="8" strokeLinecap="round" />
          <path d="M240,160 Q230,120 220,100" fill="none" stroke="url(#settingGrad)" strokeWidth="8" strokeLinecap="round" />
          {setting.id === 'solitario-6' && (
            <>
               <path d="M140,150 Q160,130 170,110" fill="none" stroke="url(#settingGrad)" strokeWidth="6" strokeLinecap="round" />
               <path d="M260,150 Q240,130 230,110" fill="none" stroke="url(#settingGrad)" strokeWidth="6" strokeLinecap="round" />
            </>
          )}
        </g>
      )}
      {setting.id === 'bisel' && (
        <ellipse cx="200" cy="110" rx="55" ry="30" fill="none" stroke="url(#settingGrad)" strokeWidth="12" />
      )}
      {setting.id === 'halo' && (
        <g>
           <ellipse cx="200" cy="110" rx="65" ry="35" fill="none" stroke="url(#settingGrad)" strokeWidth="8" />
           {/* Diamantes del halo representados como pequeños puntos brillantes */}
           {[...Array(20)].map((_, i) => {
             const angle = (i / 20) * Math.PI * 2;
             const x = 200 + Math.cos(angle) * 65;
             const y = 110 + Math.sin(angle) * 35;
             return <circle key={i} cx={x} cy={y} r="3" fill="#ffffff" filter="drop-shadow(0px 0px 2px rgba(255,255,255,0.8))" />
           })}
        </g>
      )}
      {/* Agrega más lógica para cintillo, tension, etc, de forma simplificada por ahora */}
      {setting.id === 'tension' && (
         <g>
            <path d="M130,140 Q170,140 180,110" fill="none" stroke="url(#settingGrad)" strokeWidth="15" strokeLinecap="round" />
            <path d="M270,140 Q230,140 220,110" fill="none" stroke="url(#settingGrad)" strokeWidth="15" strokeLinecap="round" />
         </g>
      )}
      {setting.id === 'cintillo' && (
        <g>
           <path d="M160,160 L180,110 M240,160 L220,110" stroke="url(#settingGrad)" strokeWidth="8" />
           {[...Array(6)].map((_, i) => (
             <circle key={i} cx={140 + i*24} cy={165 + Math.sin(i)*10} r="4" fill="#ffffff" />
           ))}
        </g>
      )}
    </svg>
  );
};

export const GemStone = ({ config, gems, shapes }) => {
  const gem = gems.find(g => g.id === config.gemId) || gems[0];
  const shape = config.gemShape || 'brillante';
  const sizeMultiplier = 1 + ((config.carat - 1) * 0.2); // Escalar basado en quilataje (base 1ct = scale 1.0)

  // Función para generar reflexiones internas basadas en Refracción
  return (
    <svg viewBox="0 0 400 400" className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none drop-shadow-2xl">
      <defs>
        <radialGradient id="gemRefraction" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor={gem.sparkle} stopOpacity="0.9" />
          <stop offset="50%" stopColor={gem.inner} stopOpacity="0.8" />
          <stop offset="100%" stopColor={gem.color} stopOpacity="0.9" />
        </radialGradient>
        
        {/* Brillo espectacular de diamante/gemas */}
        <filter id="diamondSparkle">
           <feGaussianBlur stdDeviation="1.5" result="blur" />
           <feMerge>
             <feMergeNode in="blur" />
             <feMergeNode in="SourceGraphic" />
           </feMerge>
        </filter>
      </defs>

      <g transform={`translate(200, 100) scale(${sizeMultiplier})`} filter="url(#diamondSparkle)">
        {/* Representación según corte */}
        {shape === 'brillante' && (
          <g>
             <polygon points="0,-40 35,-15 25,25 -25,25 -35,-15" fill="url(#gemRefraction)" stroke={gem.sparkle} strokeWidth="1" opacity="0.9" />
             <polygon points="-15,-40 15,-40 35,-15 0,0 -35,-15" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
             <polygon points="0,0 25,25 -25,25" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
             {/* Facetas estrella */}
             <path d="M0,0 L0,-40 M0,0 L35,-15 M0,0 L25,25 M0,0 L-25,25 M0,0 L-35,-15" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
          </g>
        )}
        
        {shape === 'princesa' && (
          <g>
             <polygon points="-30,-30 30,-30 30,30 -30,30" fill="url(#gemRefraction)" stroke={gem.sparkle} strokeWidth="1" />
             <path d="M-30,-30 L0,0 L30,-30 M30,30 L0,0 M-30,30 L0,0" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
             <polygon points="-15,-15 15,-15 15,15 -15,15" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.8" />
          </g>
        )}

        {shape === 'esmeralda' && (
          <g>
             <polygon points="-20,-35 20,-35 30,-20 30,20 20,35 -20,35 -30,20 -30,-20" fill="url(#gemRefraction)" stroke={gem.sparkle} strokeWidth="1" />
             <rect x="-15" y="-25" width="30" height="50" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
             <rect x="-8" y="-15" width="16" height="30" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.8" />
          </g>
        )}
        
        {shape === 'ovalo' && (
          <g>
             <ellipse cx="0" cy="0" rx="25" ry="35" fill="url(#gemRefraction)" stroke={gem.sparkle} strokeWidth="1" />
             <ellipse cx="0" cy="0" rx="15" ry="25" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
             <path d="M0,-35 L0,35 M-25,0 L25,0" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
          </g>
        )}
        
        {shape === 'gota' && (
          <g>
             <path d="M0,-40 Q30,0 30,20 A30,30 0 0,1 -30,20 Q-30,0 0,-40" fill="url(#gemRefraction)" stroke={gem.sparkle} strokeWidth="1" />
             <path d="M0,-25 L15,15 L-15,15 Z" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
             <path d="M0,-40 L0,50" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
          </g>
        )}
        
        {shape === 'cushion' && (
          <g>
             <rect x="-30" y="-30" width="60" height="60" rx="15" ry="15" fill="url(#gemRefraction)" stroke={gem.sparkle} strokeWidth="1" />
             <rect x="-15" y="-15" width="30" height="30" rx="5" ry="5" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
             <path d="M-30,-30 L0,0 L30,-30 M30,30 L0,0 L-30,30" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
          </g>
        )}

        {shape === 'marquesa' && (
          <g>
             <path d="M0,-45 Q30,0 0,45 Q-30,0 0,-45" fill="url(#gemRefraction)" stroke={gem.sparkle} strokeWidth="1" />
             <path d="M0,-30 L10,0 L0,30 L-10,0 Z" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
             <path d="M0,-45 L0,45 M-15,0 L15,0" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
          </g>
        )}

        {shape === 'asscher' && (
          <g>
             <polygon points="-20,-30 20,-30 30,-20 30,20 20,30 -20,30 -30,20 -30,-20" fill="url(#gemRefraction)" stroke={gem.sparkle} strokeWidth="1" />
             <rect x="-15" y="-15" width="30" height="30" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
             <rect x="-8" y="-8" width="16" height="16" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.8" />
             <path d="M-30,-30 L30,30 M-30,30 L30,-30" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
          </g>
        )}

        {shape === 'rosa' && (
          <g>
             <circle cx="0" cy="0" r="30" fill="url(#gemRefraction)" stroke={gem.sparkle} strokeWidth="1" />
             <polygon points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.8" />
             <path d="M0,0 L0,-30 M0,0 L26,-15 M0,0 L26,15 M0,0 L0,30 M0,0 L-26,15 M0,0 L-26,-15" stroke="#ffffff" strokeWidth="0.5" opacity="0.5" />
          </g>
        )}

      </g>
    </svg>
  );
};
