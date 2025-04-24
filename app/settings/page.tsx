"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Building, CreditCard, BellRing, Lock, User, Globe, HelpCircle } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Settings" />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Account Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your account preferences and company information</p>
        </div>
        
        <Tabs defaultValue="general" className="w-full">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full md:w-64">
              <TabsList className="flex h-auto flex-row justify-start bg-transparent md:flex-col md:gap-1">
                <TabsTrigger 
                  value="general" 
                  className="flex w-full justify-start gap-2 data-[state=active]:bg-accent/50 data-[state=active]:shadow-none"
                >
                  <Building className="h-4 w-4" />
                  Company Info
                </TabsTrigger>
                <TabsTrigger 
                  value="billing" 
                  className="flex w-full justify-start gap-2 data-[state=active]:bg-accent/50 data-[state=active]:shadow-none"
                >
                  <CreditCard className="h-4 w-4" />
                  Billing
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="flex w-full justify-start gap-2 data-[state=active]:bg-accent/50 data-[state=active]:shadow-none"
                >
                  <BellRing className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="flex w-full justify-start gap-2 data-[state=active]:bg-accent/50 data-[state=active]:shadow-none"
                >
                  <Lock className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="flex w-full justify-start gap-2 data-[state=active]:bg-accent/50 data-[state=active]:shadow-none"
                >
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 hidden rounded-lg border border-[#1e293b] p-4 md:block">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                  <p className="font-medium">Need Help?</p>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Our support team is ready to assist you with any questions.
                </p>
                <Button className="mt-3 w-full bg-blue-600 text-xs hover:bg-blue-700">
                  Contact Support
                </Button>
              </div>
            </div>
            
            <div className="flex-1">
              <TabsContent value="general" className="mt-0">
                <Card className="border-[#1e293b] bg-[#0f172a]">
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>
                      Update your company details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Company Name</Label>
                          <Input id="company-name" defaultValue="INCO Technologies" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tax-id">Tax ID</Label>
                          <Input id="tax-id" defaultValue="XX-XXXXXXX" />
                        </div>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" defaultValue="(555) 123-4567" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" defaultValue="contact@inco-tech.com" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue="123 Business Ave, Suite 100" />
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" defaultValue="San Francisco" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input id="state" defaultValue="CA" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">Zip/Postal Code</Label>
                          <Input id="zip" defaultValue="94107" />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="billing" className="mt-0">
                <Card className="border-[#1e293b] bg-[#0f172a]">
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>
                      Manage your subscription and payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="rounded-lg border border-[#1e293b] p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Enterprise Plan</p>
                            <p className="text-sm text-muted-foreground">$499/month</p>
                          </div>
                          <Button variant="outline" className="border-[#1e293b] hover:bg-[#1e293b]">
                            Change Plan
                          </Button>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                          <p className="text-sm">Next billing date</p>
                          <p className="text-sm font-medium">May 15, 2025</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="mb-4 text-lg font-medium">Payment Methods</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-lg border border-[#1e293b] p-4">
                            <div className="flex items-center gap-3">
                              <div className="rounded-md border border-[#1e293b] bg-[#121a29] p-2">
                                <CreditCard className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">Visa ending in 4242</p>
                                <p className="text-sm text-muted-foreground">Expires 01/2026</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </div>
                          
                          <Button variant="outline" className="w-full border-[#1e293b] hover:bg-[#1e293b]">
                            Add Payment Method
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <Card className="border-[#1e293b] bg-[#0f172a]">
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Configure how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
                        <div className="space-y-4">
                          {[
                            { id: "payroll-processing", label: "Payroll Processing" },
                            { id: "account-activity", label: "Account Activity" },
                            { id: "employee-updates", label: "Employee Updates" },
                            { id: "vault-transactions", label: "Vault Transactions" },
                            { id: "system-updates", label: "System Updates" },
                          ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <Label htmlFor={item.id} className="cursor-pointer">
                                {item.label}
                              </Label>
                              <Switch id={item.id} defaultChecked={true} />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="mb-4 text-lg font-medium">In-App Notifications</h3>
                        <div className="space-y-4">
                          {[
                            { id: "app-payroll-alerts", label: "Payroll Alerts", defaultChecked: true },
                            { id: "app-login-activity", label: "Login Activity", defaultChecked: true },
                            { id: "app-employee-requests", label: "Employee Requests", defaultChecked: true },
                            { id: "app-system-notifications", label: "System Notifications", defaultChecked: false },
                          ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <Label htmlFor={item.id} className="cursor-pointer">
                                {item.label}
                              </Label>
                              <Switch id={item.id} defaultChecked={item.defaultChecked} />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Save Preferences
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <Card className="border-[#1e293b] bg-[#0f172a]">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and authentication settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-4 text-lg font-medium">Password</h3>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" />
                          </div>
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" />
                          </div>
                        </div>
                        <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                          Change Password
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch id="2fa" defaultChecked={true} />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="mb-2 text-lg font-medium">Session Management</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          Manage your active sessions across devices
                        </p>
                        
                        <div className="space-y-3">
                          {[
                            { device: "Current Browser", location: "San Francisco, CA", lastActive: "Now" },
                            { device: "iPhone 15", location: "San Francisco, CA", lastActive: "2 hours ago" },
                            { device: "MacBook Pro", location: "New York, NY", lastActive: "Yesterday" },
                          ].map((session, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg border border-[#1e293b] p-4">
                              <div>
                                <p className="font-medium">{session.device}</p>
                                <p className="text-sm text-muted-foreground">
                                  {session.location} • {session.lastActive}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className={i === 0 ? "opacity-50" : ""}
                                disabled={i === 0}
                              >
                                {i === 0 ? "Current" : "Revoke"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="profile" className="mt-0">
                <Card className="border-[#1e293b] bg-[#0f172a]">
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Manage your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start sm:justify-start">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-xl font-bold">
                          JS
                        </div>
                        <div className="flex flex-col items-center gap-3 sm:items-start">
                          <div className="space-y-1 text-center sm:text-left">
                            <h3 className="text-xl font-medium">John Smith</h3>
                            <p className="text-sm text-muted-foreground">Administrator</p>
                          </div>
                          <Button variant="outline" className="border-[#1e293b] hover:bg-[#1e293b]">
                            Change Avatar
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="profile-name">Full Name</Label>
                            <Input id="profile-name" defaultValue="John Smith" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="profile-email">Email</Label>
                            <Input id="profile-email" defaultValue="john.smith@inco-tech.com" />
                          </div>
                        </div>
                        
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="profile-role">Role</Label>
                            <Input id="profile-role" defaultValue="Administrator" disabled />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="profile-phone">Phone</Label>
                            <Input id="profile-phone" defaultValue="(555) 987-6543" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="profile-timezone">Timezone</Label>
                          <select 
                            id="profile-timezone"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="America/Los_Angeles"
                          >
                            <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                            <option value="America/Denver">Mountain Time (US & Canada)</option>
                            <option value="America/Chicago">Central Time (US & Canada)</option>
                            <option value="America/New_York">Eastern Time (US & Canada)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
}