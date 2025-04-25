"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  UserPlus, 
  Filter, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Download 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getInitials } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Employee, getEmployees, isUsingRealSupabase } from "@/lib/supabase";
import { getLocalEmployees } from "@/lib/local-storage";
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog";
import { toast } from "sonner";

const EMPLOYEES_PER_PAGE = 10;

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddEmployeeDialog, setShowAddEmployeeDialog] = useState(false);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    console.log("Fetching employees...");
    
    try {
      let data: Employee[] = [];
      
      // Check if we can use Supabase
      if (isUsingRealSupabase()) {
        try {
          data = await getEmployees();
          console.log("Employees data received from Supabase:", data);
          setUseLocalStorage(false);
        } catch (supabaseError) {
          console.error("Supabase error, falling back to localStorage:", supabaseError);
          // If Supabase fails, fall back to localStorage
          data = getLocalEmployees();
          console.log("Employees data retrieved from localStorage:", data);
          setUseLocalStorage(true);
          toast.error("Could not connect to database. Using local storage instead.");
        }
      } else {
        // No Supabase credentials, use localStorage directly
        data = getLocalEmployees();
        console.log("Using localStorage directly due to missing Supabase credentials:", data);
        setUseLocalStorage(true);
      }
      
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      toast.error("Failed to fetch employees from any source.");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter employees based on search term and active tab
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "active" && employee.status === "active") ||
      (activeTab === "onleave" && employee.status === "onleave") ||
      (activeTab === "terminated" && employee.status === "terminated");
    
    return matchesSearch && matchesTab;
  });

  // Calculate pagination values
  const totalPages = Math.ceil(filteredEmployees.length / EMPLOYEES_PER_PAGE);
  const startIndex = (currentPage - 1) * EMPLOYEES_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + EMPLOYEES_PER_PAGE);

  const statusColors = {
    active: "bg-emerald-500/10 text-emerald-500",
    onleave: "bg-amber-500/10 text-amber-500",
    terminated: "bg-rose-500/10 text-rose-500",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Employees" />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">All Employees</h2>
            <p className="text-sm text-muted-foreground">
              Manage your company employees
              {useLocalStorage && (
                <span className="ml-2 text-amber-500">(Using local storage)</span>
              )}
            </p>
          </div>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => setShowAddEmployeeDialog(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
        
        <Card className="border-[#1e293b] bg-[#0f172a]">
          <CardHeader className="pb-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full items-center gap-2 md:w-auto md:max-w-xs">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search employees..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="border-[#1e293b] hover:bg-[#1e293b]">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="onleave">On Leave</TabsTrigger>
                    <TabsTrigger value="terminated">Terminated</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Button variant="outline" size="icon" className="border-[#1e293b] hover:bg-[#1e293b]">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="mt-4 overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">Loading employees...</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-[#121a29]">
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Salary</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((employee) => (
                      <TableRow key={employee.id} className="hover:bg-[#121a29]/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-blue-600/20 text-blue-500">
                                {getInitials(employee.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-xs text-muted-foreground">{employee.position}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[employee.status]}>
                            {employee.status === "active" ? "Active" : 
                             employee.status === "onleave" ? "On Leave" : "Terminated"}
                          </Badge>
                        </TableCell>
                        <TableCell className="tabular-nums text-right">
                          {formatCurrency(employee.salary)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Employee</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                {employee.status === "terminated" ? "Reactivate" : "Terminate"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <p className="text-muted-foreground">No employees found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
            
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-[#1e293b] hover:bg-[#1e293b]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-[#1e293b] hover:bg-[#1e293b]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <AddEmployeeDialog 
        open={showAddEmployeeDialog} 
        onOpenChange={setShowAddEmployeeDialog} 
        onEmployeeAdded={fetchEmployees}
        useLocalStorage={useLocalStorage}
      />
    </div>
  );
}