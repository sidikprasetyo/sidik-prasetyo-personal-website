"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Pencil } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type Experience = {
  id: string;
  title: string;
  project_start: string;
  project_end?: string | null;
  description: string;
  techs: string[];
};

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [techInput, setTechInput] = useState(""); // input manual (koma)

  // form states
  const [title, setTitle] = useState("");
  const [projectStart, setProjectStart] = useState("");
  const [projectEnd, setProjectEnd] = useState("");
  const [description, setDescription] = useState("");

  const [editExp, setEditExp] = useState<Experience | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // error states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // state untuk dialog
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("experiences").select(`id, title, project_start, project_end, description, experience_tech(tech_stacks(name))`).order("project_start", { ascending: false });

    if (!error && data) {
      const mapped = data.map((exp: any) => ({
        id: exp.id,
        title: exp.title,
        project_start: exp.project_start,
        project_end: exp.project_end,
        description: exp.description,
        techs: exp.experience_tech.map((et: any) => et.tech_stacks.name),
      }));
      setExperiences(mapped);
    }
    setLoading(false);
  };

  // helper → pastikan tech ada di tech_stacks
  const ensureTechStacks = async (techNames: string[]) => {
    const ids: string[] = [];
    for (const name of techNames) {
      const { data: existing } = await supabase.from("tech_stacks").select("id").eq("name", name).maybeSingle();

      if (existing) {
        ids.push(existing.id);
      } else {
        const { data: inserted, error } = await supabase.from("tech_stacks").insert([{ name }]).select("id").single();
        if (!error && inserted) ids.push(inserted.id);
      }
    }
    return ids;
  };

  // validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!projectStart.trim()) newErrors.projectStart = "Project start is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!techInput.trim()) newErrors.techInput = "Tech stack is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    const { data: exp, error } = await supabase
      .from("experiences")
      .insert([
        {
          title,
          project_start: projectStart,
          project_end: projectEnd || null,
          description,
        },
      ])
      .select("id")
      .single();

    if (error || !exp) {
      toast.error("Failed to add experience");
      return;
    }

    // proses tech input
    const techNames = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (techNames.length > 0) {
      const ids = await ensureTechStacks(techNames);
      const rows = ids.map((tid) => ({
        experience_id: exp.id,
        tech_id: tid,
      }));
      await supabase.from("experience_tech").insert(rows);
    }

    toast.success("Experience added!");
    resetForm();
    fetchExperiences();
    setOpenAdd(false);
  };

  const handleUpdate = async () => {
    if (!editExp) return;

    // 🔴 tambahkan validasi
    if (!validateForm()) return;

    const { error } = await supabase
      .from("experiences")
      .update({
        title,
        project_start: projectStart,
        project_end: projectEnd || null,
        description,
      })
      .eq("id", editExp.id);

    if (error) {
      toast.error("Failed to update experience");
      return;
    }

    // hapus tech lama
    await supabase.from("experience_tech").delete().eq("experience_id", editExp.id);

    // insert tech baru
    const techNames = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (techNames.length > 0) {
      const ids = await ensureTechStacks(techNames);
      const rows = ids.map((tid) => ({
        experience_id: editExp.id,
        tech_id: tid,
      }));
      await supabase.from("experience_tech").insert(rows);
    }

    toast.success("Experience updated!");
    resetForm();
    setEditExp(null);
    fetchExperiences();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete experience");
      return;
    }
    toast.success("Experience deleted");
    fetchExperiences();
  };

  const resetForm = () => {
    setTitle("");
    setProjectStart("");
    setProjectEnd("");
    setDescription("");
    setTechInput("");
  };

  return (
    <section className="bg-gray-900 p-6 rounded-xl shadow-lg text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Experiences</h2>

        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setOpenAdd(true)}>
              + Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Add Experience</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              <div>
                <Input type="date" value={projectStart} onChange={(e) => setProjectStart(e.target.value)} />
                {errors.projectStart && <p className="text-red-500 text-xs mt-1">{errors.projectStart}</p>}
              </div>
              <Input type="date" value={projectEnd} onChange={(e) => setProjectEnd(e.target.value)} />
              <div>
                <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              <div>
                <Input placeholder="Tech stack (pisahkan dengan koma, contoh: React, Node.js, MySQL)" value={techInput} onChange={(e) => setTechInput(e.target.value)} />
                {errors.techInput && <p className="text-red-500 text-xs mt-1">{errors.techInput}</p>}
              </div>

              <Button onClick={handleAdd}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="grid grid-cols-12 gap-6 border-b border-gray-200 pb-6 items-start">
            {/* Judul & tanggal */}
            <div className="col-span-3 flex flex-col">
              <h3 className="text-lg font-semibold text-[#f9f9f9]">{exp.title}</h3>
              <span className="text-sm text-gray-500">
                {exp.project_start} - {exp.project_end || "Present"}
              </span>
            </div>

            {/* Deskripsi */}
            <p className="col-span-4 text-sm text-[#f9f9f9] leading-relaxed">{exp.description}</p>

            {/* Tech stack */}
            <div className="col-span-3 flex flex-wrap gap-2">
              {exp.techs.map((t) => (
                <span key={t} className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-700">
                  {t}
                </span>
              ))}
            </div>

            {/* Tombol aksi */}
            <div className="col-span-2 flex justify-end gap-2">
              {/* Edit button + dialog */}
              <Dialog
                open={editExp?.id === exp.id}
                onOpenChange={(open) => {
                  if (!open) setEditExp(null);
                }}
              >
                <DialogTrigger asChild>
                  <button
                    onClick={() => {
                      setEditExp(exp);
                      setTitle(exp.title);
                      setProjectStart(exp.project_start);
                      setProjectEnd(exp.project_end || "");
                      setDescription(exp.description);
                      setTechInput(exp.techs.join(", "));
                    }}
                    className="w-9 h-9 flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow"
                  >
                    <Pencil size={16} />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Edit Experience</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                      {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>
                    <div>
                      <Input type="date" value={projectStart} onChange={(e) => setProjectStart(e.target.value)} />
                      {errors.projectStart && <p className="text-red-500 text-xs mt-1">{errors.projectStart}</p>}
                    </div>
                    <Input type="date" value={projectEnd} onChange={(e) => setProjectEnd(e.target.value)} />
                    <div>
                      <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                      {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>
                    <div>
                      <Input placeholder="Tech stack (pisahkan dengan koma)" value={techInput} onChange={(e) => setTechInput(e.target.value)} />
                      {errors.techInput && <p className="text-red-500 text-xs mt-1">{errors.techInput}</p>}
                    </div>
                    <Button onClick={handleUpdate}>Update</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Delete button */}
              <button onClick={() => setDeleteId(exp.id)} className="w-9 h-9 flex items-center justify-center text-red-500 hover:text-red-700">
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Experience?</AlertDialogTitle>
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
