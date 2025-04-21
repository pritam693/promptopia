'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Profile from "@components/Profile";

const MyProfile = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [myPosts, setMyPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`/api/users/${session?.user.id}/posts`);
            const data = await response.json();
            setMyPosts(data);
        };

        if (session?.user.id) fetchPosts();
    }, [session?.user.id]);

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`);
    };

    const handleDelete = (post) => {
        setPostToDelete(post);
        setIsModalOpen(true); // Open the modal
    };

    const confirmDelete = async () => {
        try {
            await fetch(`/api/prompt/${postToDelete._id.toString()}`, {
                method: "DELETE",
            });

            const filteredPosts = myPosts.filter((item) => item._id !== postToDelete._id);
            setMyPosts(filteredPosts);
            setIsModalOpen(false); // Close the modal
        } catch (error) {
            console.log(error);
            setIsModalOpen(false); // Close the modal if error occurs
        }
    };

    const cancelDelete = () => {
        setIsModalOpen(false); // Close the modal without deleting
    };

    return (
        <div>
            <Profile
                name="My"
                desc="Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination"
                data={myPosts}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />

            {/* Modal for confirmation */}
            {isModalOpen && (
                <div className="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg text-center max-w-md w-full shadow-xl">
                        <p className="mb-4 font-satoshi font-semibold text-gray-900">Are you sure you want to delete this prompt?</p>
                        <button
                            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 mr-2 text-gray-800"
                            onClick={cancelDelete}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            onClick={confirmDelete}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProfile;
