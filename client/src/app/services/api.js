export const getUserSession = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/session`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("User not authenticated");
  }
  return response.json();
};
