import supabase, { supabaseUrl } from "./supabase";

export async function login({ email, password }) {
    const {data,error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if(error) throw new Error(error.message);

    return data;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  if (!data?.user) return null;

  return data.user;
}


export async function signup({name, email, password, profile_pic}) {
    const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;

  const {error: storageError} = await supabase.storage
    .from("profile_pic")
    .upload(fileName, profile_pic);

  if (storageError) throw new Error(storageError.message);

  const {data, error} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
      },
    },
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);

}