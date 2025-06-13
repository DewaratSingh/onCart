"use client";
import { useRouter } from "next/navigation";

const router = useRouter();

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    name: formData.get("name"),
    contact: formData.get("contact"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  const response = await axios.post("/api/auth/signUp", data);

  if (response.status === 201) {
    e.target.reset();
    router.push("/pages/signIn");
  } else {
    toast(response.data.message);
  }
};