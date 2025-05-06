"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";

const UserProfile = ({ params }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  // Unwrap params if it's a Promise
  const resolvedParams = use(params);

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${resolvedParams?.id}/posts`);
      const data = await response.json();

      setUserPosts(data);
    };

    if (resolvedParams?.id) fetchPosts();
  }, [resolvedParams?.id]);

  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
      data={userPosts}
    />
  );
};

export default UserProfile;
