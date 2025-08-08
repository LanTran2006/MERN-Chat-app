import React from "react";
import { UploadedFile } from "../ChatContainer";
import Image from "next/image";
import FileCard from "./FileCard";
import AudioCard from "./AudioCard";

function FileMessage({
  item,
  senderIsUser,
}: {
  item: UploadedFile;
  senderIsUser: boolean;
}) {
  let ext = item.path.slice(item.path.lastIndexOf(".") + 1).toLocaleLowerCase();
   
    if (ext=='webm') {
    return <AudioCard file={item} senderIsUser={senderIsUser}/>
  }
  if (ext.includes('raw')) {
    return <FileCard file={item} ext={item.name.slice(item.name.lastIndexOf(".") + 1).toLocaleLowerCase()} senderIsUser={senderIsUser} />;
  }
 
 
  return (
   
    <div
        key={item._id}
        className={`${
          senderIsUser ? "bg-green-600 self-end" : "bg-[#3b4a54] w-fit"
        } text-white text-sm pr-3 pl-2 py-1 rounded-lg `}
      >
        <Image
          alt="image from user"
          className=" w-25"
          width={50}
          height={50}
          src={item.path}
        />
      </div>
  );
}

export default FileMessage;
