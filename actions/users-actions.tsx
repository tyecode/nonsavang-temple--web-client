"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!
);

export const getUsers = async () => {
  try {
    const { data: users, error } = await supabase.from("users").select("*");

    return {
      data: users,
      message: `Retrieved user`,
    };
  } catch (error) {
    return {
      error,
      data: [],
      message: "Could not retrieve users",
    };
  }
};

// export const getUserOne = async (id: string) => {
//   try {
//     const data = await prisma.users.findUnique({
//       where: {
//         id,
//       },
//     })

//     return {
//       data: data,
//       message: `Retrieved user`,
//     }
//   } catch (error) {
//     return {
//       error,
//       data: [],
//       message: 'Could not retrieve users',
//     }
//   }
// }

export const createUser = async (formData: FormData) => {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const firstname = String(formData.get("firstname"));
  const lastname = String(formData.get("lastname"));

  try {
    const {
      data: { user },
    } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (user) {
      await updateUserOne(user.id, { firstname, lastname });
    }

    return {
      data: user,
      message: `Create new user successful`,
    };
  } catch (error) {
    return {
      error,
      data: [],
      message: `Failed to create a new user`,
    };
  }
};

export const updateUserOne = async (where: string, data: any) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .update(data)
      .eq("id", where)
      .select();

    return {
      data: user,
      message: `Updated user`,
    };
  } catch (error) {
    return {
      error,
      data: [],
      message: "Could not update user",
    };
  }
};

// export const deleteUsers = async (id: string) => {
//   try {
//     const { data } = await supabase.auth.admin.deleteUser(id)

//     return {
//       data,
//       message: 'Delete user successful',
//     }
//   } catch (error) {
//     return {
//       error,
//       data: [],
//       message: 'Failed to delete the selected user',
//     }
//   }
// }
