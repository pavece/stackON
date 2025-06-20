package mcpserver

import (
	"fmt"
	"log"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)
 
func StartMCPServer(port string) {
    s := server.NewMCPServer("StackON-MCP", "1.0.0",
        server.WithToolCapabilities(true),
    )
	
	tools := NewTools()

	//Webhook tools
	s.AddTool(mcp.NewTool("get-webhooks", 
		mcp.WithDescription("Get a list of all the available webhooks in the system with reduced information")), 
	tools.getWebhooks)
	
	s.AddTool(mcp.NewTool("get-webhook", 
		mcp.WithDescription("Get detailed information from a webhook by specifying the id"), 
		mcp.WithString("webhookId", mcp.Required(), mcp.Description("ID from the webhook you want to retrieve"))),
	tools.getWebhookById)

	s.AddTool(mcp.NewTool("delete-webhook", 
		mcp.WithDescription("Remove a webhook by specifying the id"), 
		mcp.WithString("webhookId", mcp.Required(), mcp.Description("ID from the webhook you want to remove"))),
	tools.deleteWebhook)

	//Event tools
	s.AddTool(mcp.NewTool("get-events", 
		mcp.WithDescription("Get the history of fired events registered in the system")), 
	tools.getEvents)

	s.AddTool(mcp.NewTool("get-events-by-webhook", 
		mcp.WithDescription("Get all the events created by firing a webhook"), 
		mcp.WithString("webhookId", mcp.Required(), mcp.Description("ID from the webhook you want to retrieve events from"))),
	tools.getEventsByWebhook)


    fmt.Println("[INFO] Starting MCP server on " + port)
    httpServer := server.NewStreamableHTTPServer(s)
    if err := httpServer.Start(":"+port); err != nil {
        log.Fatal(err)
    }
}
