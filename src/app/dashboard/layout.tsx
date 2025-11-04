import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";
import { Home, Building2, PlusCircle, User, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                 <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link href="/dashboard/tenant"><LayoutDashboard /><span>Dashboard</span></Link>
                 </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem className="font-semibold text-sm text-muted-foreground px-2 pt-4">Tenant</SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="My Bookings">
                  <Link href="/dashboard/tenant"><Home /><span>My Bookings</span></Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem className="font-semibold text-sm text-muted-foreground px-2 pt-4">Landlord</SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="My Properties">
                    <Link href="/dashboard/landlord"><Building2 /><span>My Properties</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Add New Property">
                    <Link href="/dashboard/landlord/new"><PlusCircle /><span>Add New Property</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="My Profile">
                    <Link href="#"><User /><span>My Profile</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Logout">
                    <Link href="/"><LogOut /><span>Logout</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 bg-muted/40">
           <header className="p-4 flex justify-between items-center lg:justify-end">
             <div className="lg:hidden">
                <SidebarTrigger />
             </div>
             <Button variant="outline" asChild>
                <Link href="/">Back to Site</Link>
             </Button>
           </header>
          <main className="p-4 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
