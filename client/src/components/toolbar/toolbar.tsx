
import { Files, Search, Play, Terminal, Users, Settings, Grid } from "lucide-react";
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
    { id: 'files', icon: Files, label: 'Files' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'run', icon: Play, label: 'Run' },
    { id: 'logs', icon: Terminal, label: 'Console' },
    { id: 'users', icon: Users, label: 'Multiplayer' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'tools', icon: Grid, label: 'Tools' }
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
                  size="sm"
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
