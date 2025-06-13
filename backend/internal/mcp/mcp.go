package mcp

import (
	"context"
	"fmt"
	"log"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)
 
func StartMCPServer(port string) {
    s := server.NewMCPServer("StackON-MCP", "1.0.0",
        server.WithToolCapabilities(true),
    )
	
	s.AddTool(mcp.NewTool("hello_mcp", mcp.WithDescription("Get greetings from the MCP server")), func(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		return mcp.NewToolResultText("Hello MCP"), nil
	})


    fmt.Println("[INFO] Starting MCP server on " + port)
    httpServer := server.NewStreamableHTTPServer(s)
    if err := httpServer.Start(":"+port); err != nil {
        log.Fatal(err)
    }
}
