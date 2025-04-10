import { Terminal, Search, Settings, Info } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface ToolbarProps {
  onToolSelect: (tool: string) => void;
  activeTool: string | null;
}

export function Toolbar({ onToolSelect, activeTool }: ToolbarProps) {
  const tools = [
    { id: 'logs', icon: Terminal, label: 'System Logs' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'info', icon: Info, label: 'Info' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <SidebarProvider>
      <Sidebar variant="floating" collapsible="icon">
        <SidebarContent>
          <SidebarMenu>
            {tools.map(tool => (
              <SidebarMenuItem key={tool.id}>
                <SidebarMenuButton
                  isActive={activeTool === tool.id}
                  onClick={() => onToolSelect(tool.id === activeTool ? '' : tool.id)}
                  tooltip={tool.label}
                >
                  <tool.icon className="h-4 w-4" />
                  <span>{tool.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}