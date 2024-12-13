"use client";

import * as React from "react";
import {
  AudioWaveform,
  GalleryVerticalEnd,
  Command,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AppContext } from "@/context/AppContext";

export function AppSidebar({ ...props }) {
  const { user, existingSessions } = React.useContext(AppContext);

  const llm = [
    {
      name: "OpenAI",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Gemini",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Custom",
      logo: Command,
      plan: "Free",
    },
  ];

  // Dynamically create the history items based on existing sessions
  const menu = [
    {
      title: "History",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        ...existingSessions.map((session) => {
          // Log the entire session object to see its structure
          console.log("Session:", session);

          // Find the last user message from the session
          const lastUserMessage = session.messages
            .slice()
            .reverse()
            .find((msg) => msg.role === "user");

          // If no user message is found, set a default
          const messageContent =
            lastUserMessage?.content || "No recent message";

          console.log("Last User Message:", messageContent); // Log the last user message to check if it's correct

          return {
            title: messageContent.slice(0, 30) + "...", // Show the first few words of the last user message
            url: `?session=${session.sessionId}`, // URL can be adjusted to navigate to the session
            key: session.sessionId, // Use sessionId as the key to avoid duplicates
          };
        }),
      ],
    },
  ];

  const projects = [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={llm} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menu} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.displayName,
            email: user?.email,
            avatar: user?.photoURL,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
