"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const handleSubmit = async (formData: FormData) => {
 const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("businessId");
  const loginEndpoint = "https://expo-api-staging.arobid.site";
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  // server side login request
  const response = await fetch(`${loginEndpoint}/api/user/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: username, password: password }),
  });
  const data = await response.json();
  if (data?.data?.accessToken) {
    cookieStore.set("token", data.data.accessToken);
    const businessResponse = await fetch(
      `${loginEndpoint}/api/business/business-by-user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.data.accessToken}`,
        },
      }
    );
    const businessData = await businessResponse.json();
    if (businessData?.data?.length > 0) {
      cookieStore.set("businessId", businessData.data[0].id);
    }
    redirect("/3d");
  }
  return data;
};

export const handleAddKey = async (formData: FormData) => {
  const cookieStore = await cookies();
  cookieStore.delete('key')
  const key = formData.get('key') as string;
  cookieStore.set('key', key)
  const key2 = formData.get('key2') as string;
  cookieStore.set('key2', key2)
  redirect("/login");
}
