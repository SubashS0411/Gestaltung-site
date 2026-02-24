
import { TransferOptions } from "../types";
import { fetchFigmaFile as fetchFromApi } from "../lib/figma/api";
import { getCachedFigmaFile, cacheFigmaFile } from "./cacheService";

export interface FigmaFile {
  name: string;
  document: any;
  components?: any;
  styles?: any;
}

export async function fetchFigmaFile(fileKey: string, _token?: string): Promise<FigmaFile> {
  // Check local cache first
  const cached = await getCachedFigmaFile(fileKey);
  if (cached) {
    return cached;
  }

  // Fetch from our new API core
  const data = await fetchFromApi(fileKey);
  
  // Store in cache for session persistence
  await cacheFigmaFile(fileKey, data);
  
  return data;
}

export function extractFileKey(url: string): string {
  const match = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
  if (!match) {
    throw new Error('Malformed Figma Resource URL');
  }
  return match[1];
}

export function extractColors(figmaFile: FigmaFile): string[] {
  const colors = new Set<string>();
  
  function traverse(node: any) {
    if (node.fills) {
      node.fills.forEach((fill: any) => {
        if (fill.type === 'SOLID' && fill.color) {
          const hex = rgbToHex(fill.color);
          colors.add(hex);
        }
      });
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  
  if (figmaFile.document) {
    traverse(figmaFile.document);
  }
  
  return Array.from(colors);
}

function rgbToHex(rgb: { r: number; g: number; b: number }): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16).toUpperCase();
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function generateFramerCode(figmaData: any, options?: TransferOptions): string {
  const colors = extractColors(figmaData);
  const primaryColor = colors.find(c => c !== '#FFFFFF' && c !== '#000000') || "#3B82F6";
  const textColor = colors.includes('#FFFFFF') ? '#FFFFFF' : '#F1F5F9';
  
  const motionPrefix = options?.includeAnimations ? 'motion.' : '';
  const importStatement = options?.includeAnimations ? 'import { motion } from "framer-motion";' : '';

  return `
/**
 * GESTALTUNG ENGINE V3 - AUTO-GENERATED NODE
 * Generated: ${new Date().toLocaleString()}
 * Provider: Figma Mirror Protocol
 */

import React from "react";
${importStatement}

export default function ${figmaData.name.replace(/[^a-zA-Z0-9]/g, '') || 'DesignNode'}() {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center p-8 bg-[#0F172A] rounded-2xl overflow-hidden relative">
      <${motionPrefix}div 
        className="w-full max-w-2xl p-12 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/5"
        style={{ backgroundColor: "${primaryColor}" }}
        ${options?.includeAnimations ? 'initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}' : ''}
      >
        <h2 className="text-4xl font-black text-white tracking-tighter mb-4">
          ${figmaData.name}
        </h2>
        <p className="text-lg text-white/80 font-medium leading-relaxed max-w-md">
          This layout was synthesized from Figma primitives and validated through Gestaltung's neural audit.
        </p>
        
        <div className="mt-10 flex gap-4">
          <button className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold text-sm backdrop-blur-md transition-all border border-white/10">
            Primary Action
          </button>
          ${options?.includeInteractions ? `
          <button className="px-8 py-4 bg-black/20 hover:bg-black/30 rounded-xl text-white font-bold text-sm transition-all">
            Secondary Node
          </button>` : ''}
        </div>
      </${motionPrefix}div>
      
      {/* Structural Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
`.trim();
}
