"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Pencil } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import RichTextEditor from "@/components/RichTextEditor";
import Link from "next/link";

type Portfolio = {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  link: string;
  images: { id: string; image_url: string }[];
};

export default function PortfolioManager() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  // form states
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [images, setImages] = useState<File[]>([]);

  // error states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // dialog states
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [editPortfolio, setEditPortfolio] = useState<Portfolio | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const imageUrls = editPortfolio?.images ?? [];

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolios")
      .select(
        `
        id,
        title,
        excerpt,
        description,
        link,
        portfolio_images(id, image_url)
      `
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      const mapped = data.map((p: any) => ({
        ...p,
        images: p.portfolio_images || [],
      }));
      setPortfolios(mapped);
    }
    setLoading(false);
  };

  const uploadImages = async (portfolioId: string, files: File[]) => {
    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${portfolioId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("portfolio-images").upload(filePath, file);

      if (uploadError) {
        toast.error("Failed to upload an image");
        continue;
      }

      const { data: publicUrlData } = supabase.storage.from("portfolio-images").getPublicUrl(filePath);

      await supabase.from("portfolio_images").insert([{ portfolio_id: portfolioId, image_url: publicUrlData.publicUrl }]);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!excerpt.trim()) newErrors.excerpt = "Excerpt is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!link.trim()) newErrors.link = "Link is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    const { data, error } = await supabase.from("portfolios").insert([{ title, excerpt, description, link }]).select().single();

    if (error || !data) {
      toast.error("Failed to add portfolio");
      return;
    }

    if (images.length > 0) {
      await uploadImages(data.id, images);
    }

    toast.success("Portfolio added!");
    resetForm();
    setOpenAdd(false);
    fetchPortfolios();
  };

  const handleUpdate = async () => {
    if (!editPortfolio) return;
    if (!validateForm()) return;

    // 🔹 1. Update data utama portfolio
    const { error: updateError } = await supabase
      .from("portfolios")
      .update({
        title,
        excerpt,
        description,
        link,
      })
      .eq("id", editPortfolio.id);

    if (updateError) {
      toast.error("Failed to update portfolio");
      return;
    }

    // 🔹 2. Jika ada gambar baru, hapus gambar lama terlebih dahulu
    if (images.length > 0) {
      // Ambil data gambar lama
      const { data: oldImages, error: oldImagesError } = await supabase.from("portfolio_images").select("id, image_url").eq("portfolio_id", editPortfolio.id);

      if (oldImagesError) {
        console.error("Error fetching old images:", oldImagesError);
      }

      // 🔹 2a. Hapus file lama dari Supabase Storage
      if (oldImages && oldImages.length > 0) {
        for (const img of oldImages) {
          try {
            const path = img.image_url.split("/").pop(); // ambil nama file
            await supabase.storage.from("portfolio-images").remove([`${editPortfolio.id}/${path}`]);
          } catch (e) {
            console.warn("Failed to delete image:", img.image_url);
          }
        }

        // 🔹 2b. Hapus record lama di tabel `portfolio_images`
        await supabase.from("portfolio_images").delete().eq("portfolio_id", editPortfolio.id);
      }

      // 🔹 3. Upload gambar baru
      await uploadImages(editPortfolio.id, images);
    }

    toast.success("Portfolio updated!");
    resetForm();
    setEditPortfolio(null);
    setOpenEdit(false);
    fetchPortfolios();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("portfolios").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete portfolio");
      return;
    }
    toast.success("Portfolio deleted");
    fetchPortfolios();
  };

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setDescription("");
    setLink("");
    setImages([]);
  };

  return (
    <section className="bg-gray-900 p-6 rounded-xl shadow-lg text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Portfolios</h2>

        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">+ Add Portfolio</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Add Portfolio</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 overflow-y-auto pr-2">
              <div>
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>
              <div>
                <Input placeholder="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                {errors.excerpt && <p className="text-red-500 text-sm">{errors.excerpt}</p>}
              </div>
              <div>
                <RichTextEditor value={description} onChange={(val) => setDescription(val)} />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>
              <div>
                <Input placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} />
                {errors.link && <p className="text-red-500 text-sm">{errors.link}</p>}
              </div>
              <Input type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files ? Array.from(e.target.files) : [])} />
              {images.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, idx) => (
                    <img key={idx} src={URL.createObjectURL(img)} alt="preview" className="h-20 w-20 object-cover rounded" />
                  ))}
                </div>
              )}
              <Button onClick={handleAdd}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id} className="relative group overflow-hidden rounded-xl shadow-lg bg-gray-800 border border-gray-700 hover:shadow-xl transition">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">{portfolio.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.images[0] && <img src={portfolio.images[0].image_url} alt={portfolio.title} className="w-full h-40 object-cover rounded mb-3" />}
              <p className="text-gray-300 mb-2">{portfolio.excerpt}</p>
              <Link key={portfolio.id} href={`/portfolio/${portfolio.id}`} className="text-blue-400 hover:text-blue-600">
                Visit Portfolio
              </Link>
            </CardContent>

            {/* Delete button */}
            <button onClick={() => setDeleteId(portfolio.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-600">
              <X size={18} />
            </button>

            {/* Edit button */}
            <Dialog open={openEdit && editPortfolio?.id === portfolio.id} onOpenChange={setOpenEdit}>
              <DialogTrigger asChild>
                <button
                  onClick={() => {
                    setEditPortfolio(portfolio);
                    setTitle(portfolio.title);
                    setExcerpt(portfolio.excerpt);
                    setDescription(portfolio.description);
                    setLink(portfolio.link);
                    setImages([]); // reset file baru
                  }}
                  className="absolute bottom-3 right-3 bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow"
                >
                  <Pencil size={16} />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">Edit Portfolio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 overflow-y-auto pr-2">
                  <div>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                  </div>
                  <div>
                    <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                    {errors.excerpt && <p className="text-red-500 text-sm">{errors.excerpt}</p>}
                  </div>
                  <div>
                    <RichTextEditor value={description} onChange={(val) => setDescription(val)} />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                  </div>
                  <div>
                    <Input value={link} onChange={(e) => setLink(e.target.value)} />
                    {errors.link && <p className="text-red-500 text-sm">{errors.link}</p>}
                  </div>

                  {/* Gambar lama */}
                  {imageUrls.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Current Images:</p>
                      <div className="flex gap-2 flex-wrap">
                        {imageUrls.map((img) => (
                          <img key={img.id} src={img.image_url} alt="existing" className="h-20 w-20 object-cover rounded border border-gray-600" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload gambar baru */}
                  <Input type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files ? Array.from(e.target.files) : [])} />
                  {images.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">New Images Preview:</p>
                      <div className="flex gap-2 flex-wrap">
                        {images.map((img, idx) => (
                          <img key={idx} src={URL.createObjectURL(img)} alt="preview" className="h-20 w-20 object-cover rounded border border-gray-600" />
                        ))}
                      </div>
                    </div>
                  )}

                  <Button onClick={handleUpdate}>Update</Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        ))}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Portfolio?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-gray-700">This action cannot be undone.</p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
