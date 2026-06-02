# mcp-gtex

GTEx MCP.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `gene` | Gene metadata by Gencode id or symbol. |
| `median_expression` | Median expression across tissues for a gene (TPM). |
| `top_expressed_genes` | Top expressed genes for a tissue. |
| `single_tissue_eqtls` | Significant single-tissue eQTLs for a gene. |
| `tissues` | List of tissues. |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
