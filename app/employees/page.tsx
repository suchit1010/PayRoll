"use client";

import { useState } from "react";
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

const EMPLOYEES_PER_PAGE = 10;

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  salary: number;
  status: "active" | "onleave" | "terminated";
  email: string;
  hireDate: string;
}

const employeesData: Employee[] = [
  { id: 1, name: "John Smith", position: "Software Engineer", department: "Engineering", salary: 85000, status: "active", email: "john.smith@inco.com", hireDate: "2022-05-12" },
  { id: 2, name: "Sarah Johnson", position: "Marketing Manager", department: "Marketing", salary: 92000, status: "active", email: "sarah.johnson@inco.com", hireDate: "2021-11-03" },
  { id: 3, name: "Michael Brown", position: "Product Designer", department: "Design", salary: 78000, status: "active", email: "michael.brown@inco.com", hireDate: "2023-01-15" },
  { id: 4, name: "Emily Davis", position: "HR Specialist", department: "Human Resources", salary: 65000, status: "active", email: "emily.davis@inco.com", hireDate: "2021-08-22" },
  { id: 5, name: "David Wilson", position: "Financial Analyst", department: "Finance", salary: 72000, status: "active", email: "david.wilson@inco.com", hireDate: "2022-03-17" },
  { id: 6, name: "Jennifer Martinez", position: "Customer Support Lead", department: "Support", salary: 62000, status: "onleave", email: "jennifer.martinez@inco.com", hireDate: "2023-02-05" },
  { id: 7, name: "Robert Taylor", position: "DevOps Engineer", department: "Engineering", salary: 90000, status: "active", email: "robert.taylor@inco.com", hireDate: "2022-09-30" },
  { id: 8, name: "Jessica Anderson", position: "Content Writer", department: "Marketing", salary: 58000, status: "active", email: "jessica.anderson@inco.com", hireDate: "2023-04-11" },
  { id: 9, name: "Thomas Jackson", position: "Sales Representative", department: "Sales", salary: 68000, status: "terminated", email: "thomas.jackson@inco.com", hireDate: "2021-12-07" },
  { id: 10, name: "Lisa White", position: "UI Designer", department: "Design", salary: 75000, status: "active", email: "lisa.white@inco.com", hireDate: "2022-07-19" },
  { id: 11, name: "Daniel Brown", position: "Backend Developer", department: "Engineering", salary: 82000, status: "active", email: "daniel.brown@inco.com", hireDate: "2021-10-25" },
  { id: 12, name: "Michelle Lee", position: "Marketing Coordinator", department: "Marketing", salary: 60000, status: "active", email: "michelle.lee@inco.com", hireDate: "2023-03-08" },
];

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  // Filter employees based on search term and active tab
  const filteredEmployees = employeesData.filter(employee => {
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
            <p className="text-sm text-muted-foreground">Manage your company employees</p>
          </div>
          
          <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 active:scale-95">
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
            
            {filteredEmployees.length > EMPLOYEES_PER_PAGE && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(startIndex + EMPLOYEES_PER_PAGE, filteredEmployees.length)} of {filteredEmployees.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-[#1e293b] hover:bg-[#1e293b]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                      className={
                        currentPage === i + 1 
                          ? "bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 active:scale-95" 
                          : "border-[#1e293b] hover:bg-[#1e293b]"
                      }
                    >
                      {i + 1}
                    </Button>
                  ))}
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
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}