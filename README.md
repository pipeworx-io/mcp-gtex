# @pipeworx/gtex

[GTEx Portal](https://gtexportal.org) MCP — Genotype-Tissue Expression: human gene expression across ~54 tissues. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `gene(gencode_id_or_symbol)` — gene metadata
- `median_expression(gene)` — median expression across tissues
- `top_expressed_genes(tissue, filter_mt_gene?, num?, datasetId?)` — top-expressed genes per tissue
- `single_tissue_eqtls(gencode_id, tissue?)` — significant single-tissue eQTLs
- `tissues()` — list of tissues

## Data source

`https://gtexportal.org/api/v2/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "gtex": {
      "url": "https://gateway.pipeworx.io/gtex/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Gtex data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
