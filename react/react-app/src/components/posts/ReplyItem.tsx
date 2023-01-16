import React, { useState, useContext } from "react";
import Modal from "react-modal";

import { AuthContext } from "../../App";

import { Reply } from '../../interfaces/reply_interface';
import { deleteReply } from '../../api/replies';

import ReplyUpdate from './ReplyUpdate';
{/*import ReplyDetail from './ReplyDetail';*/}

interface ReplyItemProps {
  sreply: Reply[]
}

  export const ReplyItem = ({ sreply }: ReplyItemProps) => {
    const [reply, setReply] = useState<Post[]>([]);
    const [replyupdate, setreplyUpdate] = useState(false);
    const [modalid, setModalid] = useState("");
    const [title, setTitle] = useState("");
    const [contents, setContents] = useState("");

    const { isSignedIn, currentUser }= useContext(AuthContext);

    {/*const [replydetail, setreplyDetail] = useState(false);
    const detailstart = (id: number) =>{
      setreplyDetail(true);
      setModalid(id);
    }*/}

    const updatestart = (id: number, title:string, contents:string) =>{
      setreplyUpdate(true);
      setModalid(id);
      setTitle(title);
      setContents(contents);
    }

    const handleDeleteReply = async (id: number) => {
      try {
        const res = await deleteReply(id)
        if (res?.status === 200) {
          setReply((prev: Reply[]) => prev.filter((reply: Reply) => reply.id !== id))
        }
      } catch (err) {
        console.log(err)
      }
    }

    return (
      <div className="wrapper">
        <div className="card w-96 bg-base-100 shadow-xl">
          <p>投稿者：</p>
          {/*<figure className="px-10 pt-10">
            <img src="https://placeimg.com/400/225/arch" alt="Shoes" className="rounded-xl" />
          </figure>*/}

          <div className="card-body items-center text-center">
            <h2 className="card-title">{sreply.title}</h2>
              <p>{sreply.contents}</p>

                {
                  isSignedIn && currentUser.id == sreply.user_id &&

                  <div className="card-actions">
                    <button className="btn btn-secondary" onClick={() => updatestart(reply.id,reply.title,reply.contents)}>更新</button>
                    <Modal isOpen={replyupdate} className="Modal">
                      <Update replyupdate={replyupdate} setreplyUpdate={setreplyUpdate} modalid={modalid} idtitle={title} idcontents={contents} reply={reply} setReply={setReply}/>
                    </Modal>

                    <button className="btn btn-secondary" onClick={() => handleDeleteReply(reply.id)}>削除</button>
                  </div>

                }

                  {/*<div className="card-actions">
                    <button className="btn btn-secondary" onClick={() => detailstart(reply.id)}>詳細</button>
                    <Modal isOpen={detail} className="Modal">
                      <Detail detail={detail} setDetail={setDetail} modalid={modalid}/>
                    </Modal>
                  </div>*/}
          </div>
        </div>
      </div>
    )
  }

export default ReplyItem