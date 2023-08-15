import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { toast } from "react-toastify";

import { db } from "@/utils/firebase";
import Message from "@/components/Message";

import type { PostMessage } from "@/utils/types";
import Link from "next/link";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState<PostMessage[]>([]);

  // See if user is already logged in
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");

    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshots) => {
      setPosts(
        snapshots.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as PostMessage)
        )
      );
    });

    return unsubscribe;
  };

  // Delete a post
  const deletePost = async (id: string) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
    toast.success("Post deleted successfully", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1500,
    });
  };

  // get user data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>Your Posts</h1>
      <div>
        {posts.map((post) => {
          return (
            <Message key={post.id} {...post}>
              <div className="flex gap-4">
                <button
                  onClick={() => deletePost(post.id!)}
                  className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm"
                >
                  <BsTrash2Fill className="text-2xl" />
                  Delete
                </button>
                <Link
                  href={{
                    pathname: "/post",
                    query: { post: JSON.stringify(post) },
                  }}
                >
                  <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                    <AiFillEdit className="text-2xl" />
                    Edit
                  </button>
                </Link>
              </div>
            </Message>
          );
        })}
      </div>
      <button
        onClick={() => auth.signOut()}
        className="text-white font-medium bg-gray-800 py-2 px-4 my-6 rounded-lg"
      >
        Sign out
      </button>
    </div>
  );
}
