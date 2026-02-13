import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star as StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const categories = [
  { key: "signups_rewards", label: "Signups & Rewards" },
  { key: "online_surveys", label: "Online Surveys" },
  { key: "learn_and_earn", label: "Learn & Earn" },
  { key: "crypto_nft_gaming", label: "Crypto & NFT Gaming" },
  { key: "cashback_coupons", label: "Cashback & Coupons" },
  { key: "referral_programs", label: "Referral Programs" },
  { key: "passive_income", label: "Passive Income" },
];

const emptyForm = {
  title: "", category: "signups_rewards", description: "", earning_potential: "",
  time_investment: "", difficulty: "easy", recommendation: "recommended",
  rating: 4, tips: "", referral_link: "", coupon_code: "", platform_url: "",
  image_url: "", is_featured: false, is_active: true, evidence_images: [],
};

export default function Admin() {
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const queryClient = useQueryClient();

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["admin-opportunities"],
    queryFn: () => base44.entities.Opportunity.list("-created_date", 200),
    initialData: [],
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const cleaned = { ...data, rating: Number(data.rating) || 0 };
      if (editingId) return base44.entities.Opportunity.update(editingId, cleaned);
      return base44.entities.Opportunity.create(cleaned);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-opportunities"] });
      setOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Opportunity.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-opportunities"] });
      setDeleteId(null);
    },
  });

  const openEdit = (opp) => {
    setForm({ ...emptyForm, ...opp });
    setEditingId(opp.id);
    setOpen(true);
  };

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(true);
  };

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Opportunities</h1>
            <p className="text-gray-400 mt-1">{opportunities.length} total opportunities</p>
          </div>
          <Button onClick={openNew} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl">
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-4 text-sm font-medium text-gray-400">Title</th>
                  <th className="text-left px-5 py-4 text-sm font-medium text-gray-400">Category</th>
                  <th className="text-left px-5 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left px-5 py-4 text-sm font-medium text-gray-400">Featured</th>
                  <th className="text-right px-5 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-white font-medium">{opp.title}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="text-gray-400 border-white/10 text-xs">
                        {categories.find((c) => c.key === opp.category)?.label || opp.category}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      {opp.is_active ? (
                        <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/30 text-xs">Inactive</Badge>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {opp.is_featured && <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(opp)} className="text-gray-400 hover:text-white">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(opp.id)} className="text-gray-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {opportunities.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500">No opportunities yet. Add your first one!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-gray-900 border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Opportunity" : "New Opportunity"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Title *</Label>
                  <Input value={form.title} onChange={(e) => update("title", e.target.value)} className="bg-white/5 border-white/10 text-white mt-1" />
                </div>
                <div>
                  <Label className="text-gray-300">Category *</Label>
                  <Select value={form.category} onValueChange={(v) => update("category", v)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Description *</Label>
                <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="bg-white/5 border-white/10 text-white mt-1 min-h-[100px]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Earning Potential</Label>
                  <Input value={form.earning_potential} onChange={(e) => update("earning_potential", e.target.value)} placeholder="e.g. $5-$20/month" className="bg-white/5 border-white/10 text-white mt-1" />
                </div>
                <div>
                  <Label className="text-gray-300">Time Investment</Label>
                  <Input value={form.time_investment} onChange={(e) => update("time_investment", e.target.value)} placeholder="e.g. 10 min/day" className="bg-white/5 border-white/10 text-white mt-1" />
                </div>
                <div>
                  <Label className="text-gray-300">Rating (1-5)</Label>
                  <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => update("rating", e.target.value)} className="bg-white/5 border-white/10 text-white mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Difficulty</Label>
                  <Select value={form.difficulty} onValueChange={(v) => update("difficulty", v)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Recommendation</Label>
                  <Select value={form.recommendation} onValueChange={(v) => update("recommendation", v)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highly_recommended">Highly Recommended</SelectItem>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="decent">Decent</SelectItem>
                      <SelectItem value="not_recommended">Not Recommended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Tips & Tricks</Label>
                <Textarea value={form.tips} onChange={(e) => update("tips", e.target.value)} className="bg-white/5 border-white/10 text-white mt-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Referral Link</Label>
                  <Input value={form.referral_link} onChange={(e) => update("referral_link", e.target.value)} className="bg-white/5 border-white/10 text-white mt-1" />
                </div>
                <div>
                  <Label className="text-gray-300">Platform URL</Label>
                  <Input value={form.platform_url} onChange={(e) => update("platform_url", e.target.value)} className="bg-white/5 border-white/10 text-white mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Coupon Code</Label>
                  <Input value={form.coupon_code} onChange={(e) => update("coupon_code", e.target.value)} className="bg-white/5 border-white/10 text-white mt-1" />
                </div>
                <div>
                  <Label className="text-gray-300">Cover Image URL</Label>
                  <Input value={form.image_url} onChange={(e) => update("image_url", e.target.value)} className="bg-white/5 border-white/10 text-white mt-1" />
                </div>
              </div>

              <div className="flex items-center gap-8 pt-2">
                <div className="flex items-center gap-3">
                  <Switch checked={form.is_active} onCheckedChange={(v) => update("is_active", v)} />
                  <Label className="text-gray-300">Active</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.is_featured} onCheckedChange={(v) => update("is_featured", v)} />
                  <Label className="text-gray-300">Featured</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)} className="border-white/10 text-gray-300 hover:text-white hover:bg-white/10">
                  Cancel
                </Button>
                <Button
                  onClick={() => saveMutation.mutate(form)}
                  disabled={!form.title || !form.description || saveMutation.isPending}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className="bg-gray-900 border border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Opportunity?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/10 text-gray-300 hover:text-white hover:bg-white/10">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteMutation.mutate(deleteId)} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}