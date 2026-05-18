interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * GTEx MCP.
 *
 * Auth: none. Docs: https://gtexportal.org/api/v2/
 */


const BASE = 'https://gtexportal.org/api/v2';
const UA = 'pipeworx-mcp-gtex/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'gene',
    description: 'Gene metadata by Gencode id or symbol.',
    inputSchema: {
      type: 'object',
      properties: { gencode_id_or_symbol: { type: 'string' } },
      required: ['gencode_id_or_symbol'],
    },
  },
  {
    name: 'median_expression',
    description: 'Median expression across tissues for a gene (TPM).',
    inputSchema: {
      type: 'object',
      properties: { gene: { type: 'string', description: 'Gencode id or symbol.' } },
      required: ['gene'],
    },
  },
  {
    name: 'top_expressed_genes',
    description: 'Top expressed genes for a tissue.',
    inputSchema: {
      type: 'object',
      properties: {
        tissue: { type: 'string', description: 'GTEx tissueSiteDetailId (e.g. "Liver", "Whole_Blood")' },
        filter_mt_gene: { type: 'boolean', description: 'Exclude mitochondrial genes (default true).' },
        num: { type: 'number', description: '1-1000 (default 50).' },
        datasetId: { type: 'string', description: 'gtex_v8 (default) | gtex_v10' },
      },
      required: ['tissue'],
    },
  },
  {
    name: 'single_tissue_eqtls',
    description: 'Significant single-tissue eQTLs for a gene.',
    inputSchema: {
      type: 'object',
      properties: {
        gencode_id: { type: 'string' },
        tissue: { type: 'string' },
      },
      required: ['gencode_id'],
    },
  },
  {
    name: 'tissues',
    description: 'List of tissues.',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'gene': {
      const p = new URLSearchParams({ geneId: reqStr(args, 'gencode_id_or_symbol', '"BRCA1"') });
      return gtGet(`/reference/gene?${p}`);
    }
    case 'median_expression': {
      const p = new URLSearchParams({ gencodeId: reqStr(args, 'gene', '"BRCA1"') });
      return gtGet(`/expression/medianGeneExpression?${p}`);
    }
    case 'top_expressed_genes': {
      const p = new URLSearchParams({
        tissueSiteDetailId: reqStr(args, 'tissue', '"Liver"'),
        filter_mt_gene: args.filter_mt_gene === false ? 'false' : 'true',
        num: String(Math.min(1000, Math.max(1, (args.num as number) ?? 50))),
      });
      if (args.datasetId) p.set('datasetId', String(args.datasetId));
      return gtGet(`/expression/topExpressedGene?${p}`);
    }
    case 'single_tissue_eqtls': {
      const p = new URLSearchParams({ gencodeId: reqStr(args, 'gencode_id', '"ENSG00000012048.23"') });
      if (args.tissue) p.set('tissueSiteDetailId', String(args.tissue));
      return gtGet(`/association/singleTissueEqtl?${p}`);
    }
    case 'tissues':
      return gtGet('/dataset/tissueSiteDetail');
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function gtGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`GTEx: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
