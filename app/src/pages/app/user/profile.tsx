import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/cn/components/ui/button';
import { Input } from '@/cn/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/cn/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/cn/components/ui/avatar';
import Page from "@/ui/page/Page.tsx";
import PageContent from "@/ui/page/PageContent.tsx";
import {useAppStore} from "@/lib/useAppStore.ts";
import {UserIcon, InfoIcon} from "lucide-react";
import PageHeader from "@/ui/page/PageHeader";

interface UserProfileData {
    firstName: string;
    lastName?: string;
    email: string;
    phoneNumber: string;
}

const UserProfile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const {profile, user} = useAppStore()

    const form = useForm<UserProfileData>({
        defaultValues: {
            firstName: profile?.firstName,
            lastName: profile?.firstName,
            email: profile?.email,
            phoneNumber: profile?.phoneNumber
        }
    });

    const onSubmit = (data: UserProfileData) => {
        console.log('Profile updated:', data);
        setIsEditing(false);
    };

    const initials = profile?.firstName
        ? `${profile.firstName[0]}${profile.lastName?.[0] ?? ""}`.toUpperCase()
        : "?";

    return (
        <Page className="pb-8">
            <PageHeader title={"Profile"} />

            <PageContent className="max-w-xl mx-auto space-y-4 pt-4">
                <div className="rounded-xl border bg-card p-4 flex flex-col items-center">
                    <Avatar className="size-20 mb-4 rounded-xl">
                        <AvatarImage src={user?.photoURL ?? ""} alt="Profile" />
                        <AvatarFallback className="rounded-xl text-lg font-semibold bg-primary/10 text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">Change Photo</Button>
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-9 items-center justify-center rounded-md bg-violet-500 text-white">
                            <InfoIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Account Information</p>
                            <p className="text-xs text-muted-foreground">Your account details</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">User ID:</span>
                            <p className="font-mono">{profile?.id}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Member Since:</span>
                            <p>{profile?.createdAt?.toDate().toLocaleDateString()}</p>
                        </div>
                        {profile?.referredBy && (
                            <div>
                                <span className="text-muted-foreground">Referred By:</span>
                                <p>{profile.referredBy}</p>
                            </div>
                        )}
                        <div>
                            <span className="text-muted-foreground">Names Last Updated:</span>
                            <p>{profile?.namesUpdatedAt?.toDate().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-9 items-center justify-center rounded-md bg-sky-500 text-white">
                            <UserIcon className="size-4" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Personal Details</p>
                            <p className="text-xs text-muted-foreground">Edit your personal information</p>
                        </div>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={!isEditing} />
                                        </FormControl>
                                        <FormDescription>Your legal first name can only be modified after 90 days.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={!isEditing} />
                                        </FormControl>
                                        <FormDescription>Your legal last name (optional)</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" disabled={!isEditing} />
                                        </FormControl>
                                        <FormDescription>Your primary email for account access</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="tel" disabled={!isEditing} />
                                        </FormControl>
                                        <FormDescription>Your mobile number for notifications</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-2 pt-4">
                                {isEditing ? (
                                    <>
                                        <Button type="submit">Save Changes</Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </div>
            </PageContent>
        </Page>
    );
};

export default UserProfile;
