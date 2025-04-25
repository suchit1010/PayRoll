"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { addEmployee } from "@/lib/supabase";
import { addLocalEmployee } from "@/lib/local-storage";
import { toast } from "sonner";

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeAdded?: () => void;
  useLocalStorage?: boolean;
}

export function AddEmployeeDialog({ 
  open, 
  onOpenChange, 
  onEmployeeAdded,
  useLocalStorage = false
}: AddEmployeeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    salary: "",
    company_id: "1" // Default company ID or could be from context/props
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log("Submitting employee data:", formData);
    
    try {
      const employeeData = {
        ...formData,
        salary: Number(formData.salary),
        status: 'active' as const
      };
      
      let result;
      
      if (useLocalStorage) {
        console.log("Using localStorage to add employee");
        result = addLocalEmployee(employeeData);
        console.log("LocalStorage result:", result);
      } else {
        console.log("Using Supabase to add employee");
        result = await addEmployee(employeeData);
        console.log("Supabase response:", result);
      }
      
      toast.success("Employee added successfully");
      if (onEmployeeAdded) {
        console.log("Calling onEmployeeAdded callback");
        onEmployeeAdded();
      }
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add employee:", error);
      toast.error("Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      position: "",
      department: "",
      salary: "",
      company_id: "1"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#0f172a] border-[#1e293b]">
        <DialogHeader>
          <DialogTitle>
            Add New Employee
            {useLocalStorage && (
              <span className="ml-2 text-xs text-amber-500">(Using local storage)</span>
            )}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input 
                id="position" 
                value={formData.position}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                value={formData.department}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salary">Annual Salary</Label>
              <Input 
                id="salary" 
                type="number" 
                min="0" 
                step="1000" 
                value={formData.salary}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="border-[#1e293b] hover:bg-[#1e293b]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}