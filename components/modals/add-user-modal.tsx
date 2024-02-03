"use client";

import { useState } from "react";

import { createUser, getUsers } from "@/actions/users-actions";
import { formatDate } from "@/lib/date-format";
import { UserInterface } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import LoadingButton from "@/components/buttons/loading-button";

import { useUsersStore } from "@/stores/useUsersStore";

const AddUserModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setPending] = useState(false);

  const currentUsers = useUsersStore((state) => state.users);
  const updateUsers = useUsersStore((state) => state.updateUsers);

  const { toast } = useToast();

  const handleCreateUser = async (formData: FormData) => {
    setPending(true);
    try {
      const res = await createUser(formData);

      if (res.error) {
        throw new Error(res.message);
      }

      const users = await getUsers();

      if (!users.data) {
        throw new Error("Failed to fetch users");
      }

      const newUsers = users.data.map((user) => ({
        ...user,
        displayName: `${user.firstname} ${user.lastname}`,
        created_at: formatDate(user.created_at),
      }));

      updateUsers(newUsers);
      toast({
        description: "Create new user successful",
      });
    } catch (error) {
      toast({
        description: "Failed to create new user",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isPending ? (
          <LoadingButton />
        ) : (
          <Button size={"sm"}>ເພິ່ມຂໍ້ມູນ</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ເພິ່ມຂໍ້ມູນ</DialogTitle>
        </DialogHeader>
        <form action={handleCreateUser} className="grid gap-4 py-4">
          <div className="grid items-center gap-4">
            <Input
              id="firstname"
              name="firstname"
              className="col-span-3"
              type="text"
              required
              placeholder="name"
            />
          </div>
          <div className="grid items-center gap-4">
            <Input
              id="lastname"
              name="lastname"
              className="col-span-3"
              type="text"
              required
              placeholder="lastname"
            />
          </div>
          <div className="grid items-center gap-4">
            <Input
              id="email"
              name="email"
              className="col-span-3"
              type="email"
              required
              placeholder="email"
            />
          </div>
          <div className="grid items-center gap-4">
            <Input
              id="password"
              name="password"
              type="password"
              className="col-span-3"
              required
              placeholder="password"
            />
          </div>
          <Button type="submit" size={"sm"} onClick={() => setIsOpen(false)}>
            Create user
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
