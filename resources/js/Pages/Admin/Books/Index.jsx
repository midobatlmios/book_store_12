import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
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
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ books }) {
    const [selectedBook, setSelectedBook] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        stock: '',
        description: '',
        image: null,
    });

    const resetForm = () => {
        setFormData({
            title: '',
            author: '',
            price: '',
            stock: '',
            description: '',
            image: null,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                formDataToSend.append(key, formData[key]);
            }
        });

        router.post('/admin/books', formDataToSend, {
            onSuccess: () => {
        setIsAddModalOpen(false);
                resetForm();
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                formDataToSend.append(key, formData[key]);
            }
        });
        formDataToSend.append('_method', 'PUT');

        router.post(`/admin/books/${selectedBook.id}`, formDataToSend, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                resetForm();
            },
            onError: (errors) => {
                console.error(errors);
            }
        });
    };

    const handleView = (book) => {
        setSelectedBook(book);
        setIsViewModalOpen(true);
    };

    const handleEdit = (book) => {
        setSelectedBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            price: book.price,
            stock: book.stock,
            description: book.description || '',
            image: null,
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (book) => {
        if (confirm('Are you sure you want to delete this book?')) {
            router.delete(`/admin/books/${book.id}`, {
                onSuccess: () => {
                    // The page will refresh automatically
                },
            });
        }
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    return (
        <>
            <Head>
                <title>Books Management — Admin Panel</title>
            </Head>

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Books</h2>
                                <Button onClick={() => setIsAddModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Book
                                </Button>
                            </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {books.map((book) => (
                                    <TableRow key={book.id}>
                                        <TableCell>{book.id}</TableCell>
                                        <TableCell>{book.title}</TableCell>
                                        <TableCell>{book.author}</TableCell>
                                        <TableCell>{book.price}</TableCell>
                                        <TableCell>{book.stock}</TableCell>
                                        <TableCell>{new Date(book.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleView(book)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(book)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(book)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                        </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Add Book Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={() => setIsAddModalOpen(false)}>
                <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Add New Book</DialogTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details below to add a new book to the store.</p>
                        </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter book title"
                                    className="w-full"
                                        required
                                    />
                                </div>
                            <div className="space-y-2">
                                <Label htmlFor="author" className="text-sm font-medium">Author</Label>
                                    <Input
                                        id="author"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    placeholder="Enter author name"
                                    className="w-full"
                                        required
                                    />
                                </div>
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm font-medium">Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="Enter price"
                                    className="w-full"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock" className="text-sm font-medium">Stock</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    placeholder="Enter stock quantity"
                                    className="w-full"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                            <Input
                                id="description"
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter book description"
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="image" className="text-sm font-medium">Book Cover Image</Label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <label
                                            htmlFor="image"
                                            className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        >
                                            <span>Upload a file</span>
                                            <Input
                                                id="image"
                                                type="file"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsAddModalOpen(false)}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
                            >
                                Add Book
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Book Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={() => setIsEditModalOpen(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Book</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                    id="edit-title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-author">Author</Label>
                                <Input
                                    id="edit-author"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-price">Price</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                <Label htmlFor="edit-stock">Stock</Label>
                                    <Input
                                    id="edit-stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                <Label htmlFor="edit-description">Description</Label>
                                    <Input
                                    id="edit-description"
                                    type="text"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-image">Image</Label>
                                <Input
                                    id="edit-image"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                    Cancel
                                </Button>
                            <Button type="submit">Update Book</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

            {/* View Book Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={() => setIsViewModalOpen(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Book Details</DialogTitle>
                    </DialogHeader>
                    {selectedBook && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Title</Label>
                                <p>{selectedBook.title}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label>Author</Label>
                                <p>{selectedBook.author}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label>Price</Label>
                                <p>${selectedBook.price}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label>Stock</Label>
                                <p>{selectedBook.stock}</p>
                            </div>
                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <p>{selectedBook.description || 'No description available'}</p>
                            </div>
                            {selectedBook.image && (
                                <div className="grid gap-2">
                                    <Label>Image</Label>
                                    <img 
                                        src={selectedBook.image} 
                                        alt={selectedBook.title}
                                        className="max-w-full h-auto rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Index.layout = page => <AdminLayout>{page}</AdminLayout>; 