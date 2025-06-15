import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { AlertCircle } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";

export default function UserList({ users, auth, flash }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
        setError(null);
    };

    const confirmDelete = () => {
        router.delete(`/admin/users/${selectedUser.id}`, {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
            },
            onError: (errors) => {
                console.log('Error:', errors);
                if (errors.error) {
                    setError(errors.error);
                }
            },
            preserveScroll: true,
        });
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        user.is_admin 
                                            ? 'bg-purple-100 text-purple-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.is_admin ? 'Admin' : 'User'}
                                    </span>
                                </TableCell>
                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(user)}
                                            disabled={user.id === auth.user.id}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="py-4">
                            <p>Are you sure you want to delete the user <strong>{selectedUser.name}</strong>?</p>
                            <p className="text-sm text-gray-500 mt-2">
                                This action cannot be undone. If the user has any orders, they cannot be deleted.
                            </p>
                            {error && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-medium text-red-800 mb-1">
                                                Cannot Delete User
                                            </h4>
                                            <p className="text-sm text-red-700">
                                                {error}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setError(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}