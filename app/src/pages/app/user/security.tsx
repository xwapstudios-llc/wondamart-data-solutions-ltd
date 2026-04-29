import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import Page from "@/ui/page/Page.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import { Button } from '@/cn/components/ui/button';
import { Input } from '@/cn/components/ui/input';
import { Switch } from '@/cn/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/cn/components/ui/form';
import {LockIcon, ShieldIcon, MonitorIcon} from "lucide-react";
import PageHeader from "@/ui/page/PageHeader.tsx";

interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const UserSettingsSecurity: React.FC = () => {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const passwordForm = useForm<PasswordChangeData>({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const onPasswordSubmit = (data: PasswordChangeData) => {
        console.log('Password change:', data);
    };

    const handleLogoutAllDevices = () => {
        console.log('Logging out all devices');
    };

    return (
        <Page>
            <PageHeader title={"Security"} />

            <PageContent className="max-w-xl mx-auto space-y-4">
                <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-9 items-center justify-center rounded-md bg-amber-500 text-white">
                            <LockIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Change Password</p>
                            <p className="text-xs text-muted-foreground">Update your account password</p>
                        </div>
                    </div>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormDescription>Enter your current password</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormDescription>Must be at least 8 characters long</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormDescription>Re-enter your new password</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Update Password</Button>
                        </form>
                    </Form>
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-md bg-emerald-500 text-white">
                                <ShieldIcon className="size-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Enable 2FA</p>
                                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                            </div>
                        </div>
                        <Switch
                            checked={twoFactorEnabled}
                            onCheckedChange={setTwoFactorEnabled}
                        />
                    </div>
                    {
                        twoFactorEnabled && (
                            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                                <p className="text-sm">2FA is enabled. Use your authenticator app to generate codes.</p>
                                <Button variant="outline" size="sm" className="mt-2">View Recovery Codes</Button>
                            </div>
                        )
                    }
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-9 items-center justify-center rounded-md bg-indigo-500 text-white">
                            <MonitorIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Active Sessions</p>
                            <p className="text-xs text-muted-foreground">Manage your logged-in devices</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Current Device</p>
                                <p className="text-sm text-muted-foreground">Last active: Now</p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleLogoutAllDevices}
                        >
                            Log Out All Other Devices
                        </Button>
                    </div>
                </div>
            </PageContent>
        </Page>
    )
}

export default UserSettingsSecurity;