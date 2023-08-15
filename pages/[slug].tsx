import Message from "../components/Message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { Comment, PostMessage } from "@/utils/types";
import { toastError, toastSuccess } from "@/components/toast";
import {
  Timestamp,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routeData: PostMessage = router.query.post
    ? (JSON.parse(router.query.post as string) as PostMessage)
    : { description: "" };

  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState<Comment[]>([]);

  // Submit a comment
  const submitComment = () => {
    const user = auth.currentUser;

    if (!routeData.id) return;

    // Check if user is logged in
    if (!user) return router.push("/auth/login");

    // Check if we have a comment
    if (!comment) return toastError("Don't leave an empty message.");

    const docRef = doc(db, "posts", routeData.id);
    updateDoc(docRef, {
      comments: arrayUnion({
        comment,
        avatar: user.photoURL,
        username: user.displayName,
        timestamp: Timestamp.now(),
      }),
    })
      .then(() => toastSuccess("Comment posted! 🚀"))
      .catch(() => toastError("Failed to post comment! 🥹"));

    setComment("");
  };

  // Get comments
  const getComments = async () => {
    if (!routeData.id) return;

    const docRef = doc(db, "posts", routeData.id);

    // * this gets once
    // const docSnap = await getDoc(docRef);
    // setAllComments(docSnap.data()?.comments);

    // * this does live updates
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllComments(snapshot.data()?.comments);
    });

    return unsubscribe;
  };

  useEffect(() => {
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            type="text"
            value={comment}
            placeholder="Send a message 😄"
            onChange={(e) => setComment(e.target.value)}
            className="bg-gray-800 text-white text-sm w-full p-2"
          />
          <button
            onClick={submitComment}
            className="bg-cyan-500 text-white py-2 px-4 text-sm"
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {allComments?.map((comment) => (
            <div className="bg-white p-4 border-2" key={comment.id}>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={comment.avatar}
                  alt="Commenter's Avatar"
                  className="w-10 rounded-full"
                />
                <h2>{comment.username}</h2>
              </div>
              <h2>{comment.comment}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
