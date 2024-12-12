import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const metadata = {
  title: "Build Websites | AI-Driven Website Creation & Management",
  description:
    "Kreate Websites empowers you to build, configure, and manage responsive, SEO-friendly websites effortlessly. Explore AI-driven tools for web creation, content management, and more.",
  keywords:
    "Kreate Websites, AI web creation, website configuration, responsive websites, SEO-friendly, website builder, content management, web development, AI-driven tools, web design, create websites online",
};

export default function Layout({ children }) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        {children}
      </SidebarProvider>
    </div>
  );
}
