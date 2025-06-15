import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import AdminLayout from "@/Layouts/AdminLayout";
import UserList from "./UserList";

export default function Index({ users, flash, auth }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        is_admin: false,
    });
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        router.post('/admin/users', formData, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    is_admin: false,
                });
            },
            onError: (errors) => {
                setError(Object.values(errors)[0]);
            }
        });
    };

    return (
        <AdminLayout>
            <Head>
                <title>Users Management — Admin Panel</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">User Management</h2>
                                <Button onClick={() => setIsAddModalOpen(true)}>
                                    Add New User
                                </Button>
                            </div>

                            {flash.success && (
                                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                                    {flash.success}
                                </div>
                            )}

                            {flash.error && (
                                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                                    {flash.error}
                                </div>
                            )}

                            <UserList users={users} auth={auth} flash={flash} />
                        </div>
                    </div>
                </div>
            </div>

            {isAddModalOpen && (
                <Dialog 
                    open={isAddModalOpen} 
                    onOpenChange={setIsAddModalOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_admin"
                                        checked={formData.is_admin}
                                        onCheckedChange={(checked) => 
                                            setFormData({ ...formData, is_admin: checked })
                                        }
                                    />
                                    <Label htmlFor="is_admin">Make Admin</Label>
                                </div>
                                {error && (
                                    <div className="text-sm text-red-500">
                                        {error}
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Add User</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </AdminLayout>
    );
}
