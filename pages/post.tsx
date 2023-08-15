import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { PostMessage } from "@/utils/types";
import { toastError, toastSuccess } from "@/components/toast";

const MAX_POST_LENGTH = 300;

export default function Post() {
  // User state
  const route = useRouter();
  const routeData = route.query;
  const [user, loading] = useAuthState(auth);

  // See if user is already logged in
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    if (routeData.post) {
      let queryPostData = JSON.parse(routeData.post as string);
      setPost({ ...queryPostData });
    }
  };

  // get user data
  useEffect(() => {
    getData();
  }, [user, loading]);

  // Form state
  const [post, setPost] = useState<PostMessage>({
    description: "",
  });

  // Submit Post
  const submitPost = (event: FormEvent): void => {
    event.preventDefault();

    // Verify we have a post
    if (!post) return;

    // Verify we have a user
    if (!user) return;

    // Run checks for description
    if (!post.description) {
      toastError("Description Field empty 😅");
      return;
    }

    if (post.description.length > MAX_POST_LENGTH) {
      toastError("Description too long");
      return;
    }

    // Update existing post
    if (post!.id) {
      const docRef = doc(db, "posts", post!.id);

      updateDoc(docRef, { ...post, timestamp: serverTimestamp() })
        .then(() => toastSuccess("Post updated successfully 🚀"))
        .catch(() => toastError("Failed to update post 🥹"));

      route.push("/");
      return;
    }

    // Make new post
    const collectionRef = collection(db, "posts");

    addDoc(collectionRef, {
      ...post,
      timestamp: serverTimestamp(),
      user: user.uid,
      avatar: user.photoURL,
      username: user.displayName,
    })
      .then(() => toastSuccess("Post made successfully 🚀"))
      .catch(() => toastError("Failed to make post 🥹"));

    route.push("/");
    return;
  };

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">
          {post.id ? "Edit your post" : "Create a new post"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
          ></textarea>
          <p
            className={`text-cyan-600 font-medium text-sm ${
              post.description.length > MAX_POST_LENGTH ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/{MAX_POST_LENGTH}
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
