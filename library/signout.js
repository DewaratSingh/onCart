const signOut = async () => {
    try {
      const response = await axios.post("/api/auth/signOut");
      router.push("/pages/signIn");
      console.log(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

export default signOut