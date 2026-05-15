export interface ExtractedCode {
  code: string;
  language: string;
  previewType: 'web' | 'code' | 'none';
}
export function extractLatestCodeBlock(markdown: string): ExtractedCode | null {
  if (!markdown) return null;
  // Regex to find markdown code blocks: ```language [code] ```
  const regex = /```(\w*)\n([\s\S]*?)(?:```|$)/g;
  let match;
  const blocks: ExtractedCode[] = [];
  while ((match = regex.exec(markdown)) !== null) {
    const lang = (match[1] || 'typescript').toLowerCase();
    const code = match[2].trim();
    // Determine if this block is previewable
    let previewType: 'web' | 'code' | 'none' = 'code';
    if (['html', 'htm', 'xml', 'svg'].includes(lang)) {
      previewType = 'web';
    } else if (['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx'].includes(lang)) {
      // Heuristic: if it looks like a component or has DOM manipulation, it might be web-previewable
      if (code.includes('document.') || code.includes('React.') || code.includes('export default') || code.includes('</div>')) {
        previewType = 'web';
      }
    }
    blocks.push({
      language: lang,
      code,
      previewType
    });
  }
  if (blocks.length === 0) return null;
  // Prioritize "web" previewable blocks for the final result
  const webBlocks = blocks.filter(b => b.previewType === 'web');
  if (webBlocks.length > 0) {
    return webBlocks[webBlocks.length - 1]; // Return latest web block
  }
  return blocks[blocks.length - 1]; // Fallback to latest code block
}