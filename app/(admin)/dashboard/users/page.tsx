"use client";

import { useEffect } from "react";

import { formatDate } from "@/lib/date-format";
import { getUsers } from "@/actions/users-actions";

import { columns } from "./column";
import { DataTable } from "@/components/tables/data-table";

import { usePendingStore } from "@/stores/usePendingStore";
import { useUsersStore } from "@/stores/useUsersStore";

import { toast } from "@/components/ui/use-toast";

const UsersPage = () => {
  const users = useUsersStore((state) => state.users);
  const updateUsers = useUsersStore((state) => state.updateUsers);
  const setPending = usePendingStore((state) => state.setPending);

  useEffect(() => {
    const fetchData = async () => {
      setPending(true);

      try {
        const res = await getUsers();

        if (!res.data) {
          throw new Error(res.message);
        }

        const newUsers = res.data.map((user) => ({
          ...user,
          displayName: `${user.firstname} ${user.lastname}`,
          created_at: formatDate(user.created_at),
        }));

        updateUsers(newUsers);
      } catch (error) {
        console.error(error);
        toast({ description: "An error occurred while fetching users." });
      } finally {
        setPending(false);
      }
    };

    fetchData();
  }, [updateUsers, setPending]);

  return (
    <section className="container">
      <DataTable columns={columns} data={users} />
    </section>
  );
};

export default UsersPage;
