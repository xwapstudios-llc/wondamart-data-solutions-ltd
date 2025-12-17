import React, { useCallback, useEffect, useState } from "react";
import {FrownIcon, Loader2Icon, SearchIcon} from "lucide-react";
import { Button } from "@/cn/components/ui/button.tsx";
import Page from "@/ui/components/page/Page.tsx";
import PageHeader from "@/ui/components/page/PageHeader.tsx";
import PageContent from "@/ui/components/page/PageContent.tsx";
import FilterButton from "@/ui/components/FilterButton.tsx";
import { AdminUser } from "@common/admin-api/user.ts";
import { type UserInfoDocument } from "@common/types/user.ts";
import UserViewCard from "@/ui/components/UserViewCard.tsx";
import {Input} from "@/cn/components/ui/input.tsx";

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<UserInfoDocument[]>([]);
    const [allUsers, setAllUsers] = useState<UserInfoDocument[]>([]);
    const [loading, setLoading] = useState(false);

    const [activeFilter, setActiveFilter] = useState({
        // status: "all",
        role: "all",
        search: "",
    });

    // ------------------------
    // Filter Values
    // ------------------------
    // const statusValues = [
    //     { label: "All", value: "all" },
    //     { label: "Active", value: "active" },
    //     { label: "Inactive", value: "inactive" },
    // ];

    const roleValues = [
        { label: "All", value: "all" },
        { label: "Admin", value: "admin" },
        { label: "Manager", value: "manager" },
        { label: "User", value: "user" },
        // { label: "Customer", value: "customer" },
    ];

    // ------------------------
    // Fetch Users
    // ------------------------
    const fetchUsers = useCallback(() => {
        setLoading(true);
        AdminUser.readAll()
            .then((res) => {
                setUsers(res);
                setAllUsers(res);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // ------------------------
    // Apply Filters
    // ------------------------
    useEffect(() => {
        const filterUsers = () => {
            setUsers(
                allUsers.filter((user) => {
                    // let statusMatch = true;
                    let roleMatch = true;
                    let searchMatch = true;

                    // // status filter
                    // if (activeFilter.status !== "all") {
                    //     statusMatch = user.status === activeFilter.status;
                    // }

                    // role filter
                    if (activeFilter.role !== "all") {
                        roleMatch = user.role === activeFilter.role;
                    }

                    // search filter
                    if (activeFilter.search.trim() !== "") {
                        const q = activeFilter.search.toLowerCase();
                        searchMatch =
                            user.firstName.toLowerCase().includes(q) ||
                            user.lastName?.toLowerCase().includes(q) ||
                            user.email.toLowerCase().includes(q);
                    }

                    // return statusMatch && roleMatch && searchMatch;
                    return roleMatch && searchMatch;
                    // return searchMatch;
                })
            );
        };

        filterUsers();
    }, [activeFilter, allUsers]);

    // ------------------------
    // Page Render
    // ------------------------
    return (
        <Page className="space-y-4">
            <PageHeader title={"Users"} className="border-b p-2 space-y-1">
                <div className="bg-muted flex flex-wrap gap-3 p-2 items-center">

                    {/*/!* Status Filter *!/*/}
                    {/*<div className="flex gap-1 items-center">*/}
                    {/*    <span>Status</span>*/}
                    {/*    <FilterButton*/}
                    {/*        values={statusValues}*/}
                    {/*        defaultIndex={0}*/}
                    {/*        onValueChange={(value) =>*/}
                    {/*            setActiveFilter((prev) => ({ ...prev, status: value }))*/}
                    {/*        }*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/* Role Filter */}
                    <div className="flex gap-1 items-center">
                        <span>Role</span>
                        <FilterButton
                            values={roleValues}
                            defaultIndex={0}
                            onValueChange={(value) =>
                                setActiveFilter((prev) => ({ ...prev, role: value }))
                            }
                        />
                    </div>
                </div>

                {/* Search Filter */}
                <div className={"flex items-center gap-2"}>
                    <SearchIcon />
                    <Input
                        type="text"
                        placeholder="Search by name or email…"
                        className="px-2 py-1 border rounded max-w-2xl"
                        onChange={(e) =>
                            setActiveFilter((prev) => ({...prev, search: e.target.value}))
                        }
                    />
                </div>
            </PageHeader>

            <PageContent className="pb-12">
                {loading ? (
                    <div className="w-full h-24 flex items-center justify-center">
                        <Loader2Icon className="animate-spin" size={44} />
                    </div>
                ) : null}

                {/* List */}
                <div>
                    {users.length === 0 ? (
                        <div className="flex items-center justify-center gap-4 flex-col w-full h-[75vh] opacity-50">
                            <FrownIcon size={200} />
                            <p>No users found</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {users.map((user) => (
                                <UserViewCard key={user.id} user={user} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Refresh */}
                <div className="fixed right-2 bottom-2 p-2 flex justify-center items-center gap-2">
                    <Button size="lg" onClick={fetchUsers}>
                        <Loader2Icon
                            className={`${loading && "animate-spin"}`}
                            size={44}
                        />
                    </Button>
                </div>
            </PageContent>
        </Page>
    );
};

export default UsersPage;
