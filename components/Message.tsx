import { PostMessage } from "@/utils/types";

export default function Message({ children, avatar, username, description }: {children?: any} & PostMessage) {


  return (
    <div className="bg-white p-8 border-b-2">
      <div className="flex items-center gap-2">
        <img src={avatar} alt="Poster's avatar" className="w-10 rounded-full" />
        <h2>{username}</h2>
      </div>
      <div className="py-4">
        <p style={{ wordWrap: 'break-word'}}>{description}</p>
      </div>
      {children}
    </div>
  );
}
