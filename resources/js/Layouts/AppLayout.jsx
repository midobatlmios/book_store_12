import { Toaster } from "@/Components/ui/toaster"

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <MainNavbar />
            <main>{children}</main>
            <Toaster />
        </div>
    )
} 